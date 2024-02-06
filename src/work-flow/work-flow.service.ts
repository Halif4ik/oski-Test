import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateWorkFlowDto} from './dto/create-work-flow.dto';
import {UpdateWorkFlowDto} from './dto/update-work-flow.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Test} from "../test/entities/test.entity";
import {Repository} from "typeorm";
import {Answers} from "../test/entities/answers.entity";
import {Question} from "../test/entities/question.entity";
import {TestService} from "../test/test.service";
import {GeneralRating} from "../test/entities/generalRating.entity";
import {AvgRating} from "../test/entities/averageRating.entity";
import {ConfigService} from "@nestjs/config";
import {PassedTest} from "../test/entities/passedTest.entity";
import {GeneralResponse} from "../gen-responce/interface/generalResponse.interface";
import {User} from "../user/entities/user.entity";
import {TAnswers, TPassedTest, TPassedTestForResponce} from "../gen-responce/interface/customResponces";

@Injectable()
export class WorkFlowService {
   private readonly logger: Logger = new Logger(WorkFlowService.name);

   constructor(
       private testService: TestService,
       @InjectRepository(PassedTest) private passedTestRepository: Repository<PassedTest>,
       @InjectRepository(GeneralRating) private generalRatingRepository: Repository<GeneralRating>,
       @InjectRepository(AvgRating) private avgRatingRepository: Repository<AvgRating>,
       private readonly configService: ConfigService,
   ) {
   }

   async start(userFromGuard: User, testId: number,): Promise<GeneralResponse<TPassedTest>> {
      const testForStartFlow: Test = await this.testService.findTestByIdQuestion(testId);
      if (!testForStartFlow) throw new HttpException("Test not found", HttpStatus.NOT_FOUND);

      const startedTestByUser: PassedTest | null = await this.passedTestRepository.findOne({
         where: {
            user: {id: userFromGuard.id},
            targetTest: {id: testForStartFlow.id},
         },
         relations: ["targetTest.questions"],
      });

      if (startedTestByUser)
         throw new HttpException("You haven't possibility do one test twice", HttpStatus.BAD_REQUEST);

      const newStartedTest: PassedTest = this.passedTestRepository.create({
         user: userFromGuard,
         targetTest: testForStartFlow,
         rightAnswers: [],
         isStarted: true,
      });
      const savedStartedTestByUser: PassedTest = await this.passedTestRepository.save(newStartedTest);
      /*made object for response*/
      const savedStartedTestCuted: TPassedTestForResponce = {
         user: {
            id: savedStartedTestByUser.user.id,
            email: savedStartedTestByUser.user.email,
            firstName: savedStartedTestByUser.user.firstName,
         },
         targetTest: {
            id: savedStartedTestByUser.targetTest.id,
            description: savedStartedTestByUser.targetTest.description,
            questions: savedStartedTestByUser.targetTest.questions.map((question: Question) => ({
                   ...question,
                   rightAnswer: null,
                }),
            ),
         },
         id: savedStartedTestByUser.id,
         createDate: savedStartedTestByUser.createDate,
         isStarted: savedStartedTestByUser.isStarted,
         updateAt: savedStartedTestByUser.updateAt,
      };

      this.logger.log(`User ${userFromGuard.email} started do test ${testForStartFlow.id}`);
      return {
         status_code: HttpStatus.OK,
         detail: {
            test: savedStartedTestCuted,
         },
         result: "started",
      };
   }

   async createAnswers(userFromGuard: User, createWorkFlowDto: CreateWorkFlowDto): Promise<GeneralResponse<TAnswers>> {
      const startedTestByUser: PassedTest = await this.passedTestRepository.findOne({
         where: {
            user: {id: userFromGuard.id},
            targetTest: {id: createWorkFlowDto.testId},
         },
         relations: [
            "targetTest.questions",
            "targetTest.questions.varsAnswers",
            "targetTest.company",
         ],
      });
      if (!startedTestByUser) throw new HttpException("Test not found", HttpStatus.BAD_REQUEST);
      if (!startedTestByUser.isStarted) throw new HttpException("Test not started", HttpStatus.BAD_REQUEST);

      const questionsWithRightAnswer: Question[] = startedTestByUser.targetTest.questions.filter(
          (questionFromBd: Question) => {
             return createWorkFlowDto.questions.find((questUserResponse) => {
                if (questionFromBd.id === questUserResponse.id) {
                   questionFromBd.rightAnswer = questionFromBd.rightAnswer.toLowerCase().trim();
                   questUserResponse.userAnswer = questUserResponse.userAnswer.toLowerCase().trim();
                   return questionFromBd.rightAnswer === questUserResponse.userAnswer;
                }
             });
          },
      );

      const rightAnswers: Answers[] = questionsWithRightAnswer.map((oneQuestion: Question) => {
         return oneQuestion.varsAnswers.find((answer: Answers) =>
             answer.varAnswer.toLowerCase().trim() === oneQuestion.rightAnswer.toLowerCase().trim()
         );
      });

      startedTestByUser.updateAt = new Date();
      startedTestByUser.rightAnswers = rightAnswers;
      startedTestByUser.isStarted = false;

      await this.passedTestRepository.save(startedTestByUser);

      const avgRateUser: AvgRating = await this.calculeteAvgRatingForUserByComp(rightAnswers, startedTestByUser,
          userFromGuard);

      this.logger.log(`User ${userFromGuard.email} finished do test ${createWorkFlowDto.testId} in company
          ${startedTestByUser.targetTest.company.id}  with ${rightAnswers.length} right answers and got 
          ${avgRateUser.averageRating} rating from 1(100%)`);
      return {
         status_code: HttpStatus.OK,
         detail: {
            answers: rightAnswers,
         },
         result: "finished",
      };
   }

   private async calculeteAvgRatingForUserByComp(rightAnswers: Answers[], startedTestByUser: PassedTest,
                                                 userFromGuard: User,): Promise<AvgRating> {
      const listUserAvgRating: AvgRating[] = await this.avgRatingRepository.find({
         where: {
            user: {id: userFromGuard.id},
         },
         relations: [
            "passedTest.targetTest.questions",
            "passedTest.rightAnswers",
            "passedCompany",
         ],
      });

      /*calculate average rating for user in this company*/
      let avgRateUser: AvgRating | undefined = listUserAvgRating.find((avgRating: AvgRating) =>
          avgRating.passedCompany.id === startedTestByUser.targetTest.company.id,
      );

      /*if user fill once test for this company*/
      if (!avgRateUser) {
         const calculateAvgRatingForUserByComp: number =
             rightAnswers.length / startedTestByUser.targetTest.questions.length;
         avgRateUser = this.avgRatingRepository.create({
            user: userFromGuard,
            passedCompany: startedTestByUser.targetTest.company,
            averageRating: calculateAvgRatingForUserByComp,
            passedTest: [startedTestByUser],
         });
      } else {
         //user  already has rating fo current  company and we need to update it
         const oldRightAnswers: number[] = avgRateUser.passedTest.map(
             (passedTest: PassedTest) => passedTest.rightAnswers.length,
         );
         const oldAllQuestions: number[] = avgRateUser.passedTest.map(
             (passedTest: PassedTest) => passedTest.targetTest.questions.length,
         );
         const oldAllRightAnswersCount: number = oldRightAnswers.reduce((a, b) => a + b, 0);
         const oldAllQuestionsCount: number = oldAllQuestions.reduce((a, b) => a + b, 0);
         const newAllRightAnswersCount: number = oldAllRightAnswersCount + rightAnswers.length;
         const newAllQuestionsCount: number =
             oldAllQuestionsCount + startedTestByUser.targetTest.questions.length;
         const newAverageRating: number = newAllRightAnswersCount / newAllQuestionsCount;

         /*fixing bug updating relation many-to many when i used update*/
         avgRateUser.passedTest.push(startedTestByUser);
         avgRateUser.averageRating = newAverageRating;
         avgRateUser.updateAt = new Date();
      }

      /*re-calculating rating in user in all passed company */
      let generalRating: GeneralRating =
          await this.generalRatingRepository.findOne({
             where: {
                user: {id: userFromGuard.id},
             },
          });
      if (!generalRating) {
         generalRating = this.generalRatingRepository.create({
            user: userFromGuard,
            ratingInSystem: avgRateUser.averageRating,
         });
      } else {
         const summUserOldRatings: number = listUserAvgRating.reduce(
             (sum: number, avgRating: AvgRating) => sum + avgRating.averageRating, 0);
         generalRating.ratingInSystem =
             (summUserOldRatings + avgRateUser.averageRating)/(listUserAvgRating.length + 1);
      }

      await this.avgRatingRepository.save(avgRateUser);
      await this.generalRatingRepository.save(generalRating);
      return avgRateUser;
   }


}
