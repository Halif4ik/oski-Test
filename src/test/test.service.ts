import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateTestDto} from './dto/create-test.dto';
import {User} from "../user/entities/user.entity";
import {Company} from "../company/entities/company.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Answers} from "./entities/answers.entity";
import {Question} from "./entities/question.entity";
import {Repository} from "typeorm";
import {Test} from "./entities/test.entity";
import {GeneralResponse} from "../gen-responce/interface/generalResponse.interface";
import {TTest, TTestForResponse} from "../gen-responce/interface/customResponces";
import {QuestionDto} from "./dto/question.dto";
import {AnswerDto} from "./dto/answer.dto";


@Injectable()
export class TestService {
   private readonly logger: Logger = new Logger(TestService.name);

   constructor(@InjectRepository(Test) private testRepository: Repository<Test>,
               @InjectRepository(Answers) private answersRepository: Repository<Answers>,
               @InjectRepository(Question) private questionRepository: Repository<Question>) {
   }

   async createTest(userFromGuard: User, createTestDto: CreateTestDto, companyFromGuard: Company): Promise<GeneralResponse<TTest>> {
      if (createTestDto.questions.length < 2)
         throw new HttpException("You must add at least 2 questions", HttpStatus.BAD_REQUEST);
      createTestDto.questions.some((question: QuestionDto) => {
         if (question.varsAnswers.length < 2)
            throw new HttpException("You must add at least 2 variants of answers", HttpStatus.BAD_REQUEST);
      });

      const newTest: Test = this.testRepository.create({
         description: createTestDto.description,
         company: companyFromGuard,
      });
      const savedTest: Test = await this.testRepository.save(newTest);

      /*create question with relation Test*/
      const promisesQuestion: Promise<Question>[] = createTestDto.questions.map(async (question) => {
         const newQuestion: Question = this.questionRepository.create({
            questionText: question.questionText,
            rightAnswer: question.rightAnswer,
            varsAnswers: [],
            test: savedTest,
         });

         const promisesAnswers: Promise<Answers>[] = question.varsAnswers.map((oneVariantAnswer: AnswerDto) => {
            const newVar: Answers = this.answersRepository.create({
               varAnswer: oneVariantAnswer.varAnswer
            });
            return this.answersRepository.save(newVar);
         });
         const savedAnswers: Answers[] = await Promise.all(promisesAnswers);
         /*adding relation in Question arr Answers*/
         newQuestion.varsAnswers = savedAnswers;
         return this.questionRepository.save(newQuestion);
      });

      await Promise.all(promisesQuestion);

      this.logger.log(`User ${userFromGuard.email} created test ${createTestDto}`);
      const testResponseCuted: TTestForResponse = {
         description: savedTest.description,
         id: savedTest.id,
      }

      return {
         "status_code": HttpStatus.OK,
         "detail": {
            "test": testResponseCuted,
         },
         "result": "created"
      };
   }

   async findTestByIdQuestion(testId: number): Promise<Test | null> {
      return this.testRepository.findOne({
         where: {id: testId},
         relations: ['questions'],
      });
   }


   async findTestById(testId: number): Promise<Test | null> {
      return this.testRepository.findOne({
         where: {id: testId},
         relations: ['company'],
      });
   }
}
