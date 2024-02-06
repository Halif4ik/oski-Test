import { MigrationInterface, QueryRunner } from "typeorm";

export class CompTestAnswerQuestion1706882980923 implements MigrationInterface {
    name = 'CompTestAnswerQuestion1706882980923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answers" ("id" SERIAL NOT NULL, "varAnswer" character varying(255) NOT NULL, "deleteAt" TIMESTAMP, "questionId" integer, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "questionText" character varying(500) NOT NULL, "rightAnswer" character varying(255) NOT NULL, "deleteAt" TIMESTAMP, "testId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "passed_test" ("id" SERIAL NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "isStarted" boolean NOT NULL DEFAULT false, "userId" integer, "targetTestId" integer, CONSTRAINT "PK_88efd5bfa9b4c23cabb3aac855d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "test" ("id" SERIAL NOT NULL, "description" character varying(500) NOT NULL, "frequencyInDay" integer NOT NULL, "deleteAt" TIMESTAMP, "companyId" integer, CONSTRAINT "PK_5417af0062cf987495b611b59c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "avg_rating" ("id" SERIAL NOT NULL, "averageRating" double precision NOT NULL, "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "passedCompanyId" integer, CONSTRAINT "PK_0c620db43ff4bf44808fe0e55a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "deleteAt" TIMESTAMP, CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "general_rating" ("id" SERIAL NOT NULL, "ratingInSystem" double precision NOT NULL, "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_45103313828dc95f4a44e1d8593" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "passed_test_right_answers_answers" ("passedTestId" integer NOT NULL, "answersId" integer NOT NULL, CONSTRAINT "PK_49547c7e08ffed36a1681d57992" PRIMARY KEY ("passedTestId", "answersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3d3124566370a737e3a05df837" ON "passed_test_right_answers_answers" ("passedTestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e20a813e9f93765165fbeaeee0" ON "passed_test_right_answers_answers" ("answersId") `);
        await queryRunner.query(`CREATE TABLE "avg_rating_passed_quiz_passed_test" ("avgRatingId" integer NOT NULL, "passedTestId" integer NOT NULL, CONSTRAINT "PK_fd7dd1b3a60d9946c09774275eb" PRIMARY KEY ("avgRatingId", "passedTestId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fe1361f00040858ab9dac67f5e" ON "avg_rating_passed_quiz_passed_test" ("avgRatingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f160dfdf275b45710d389210f" ON "avg_rating_passed_quiz_passed_test" ("passedTestId") `);
        await queryRunner.query(`CREATE TABLE "company_members_user" ("companyId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_8749848c8d0e5d6876369f90a1a" PRIMARY KEY ("companyId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bfa47928743d2f9a809fcb5e0e" ON "company_members_user" ("companyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_104295b816e1a1a17d5fbadc71" ON "company_members_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_2c8f911efa2fb5b0fe1abe92020" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passed_test" ADD CONSTRAINT "FK_20c0eb34db11603191fb1644c7c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passed_test" ADD CONSTRAINT "FK_78e125c8450ab98fd29f9b789a8" FOREIGN KEY ("targetTestId") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test" ADD CONSTRAINT "FK_a854dd1bc1cc5b3626054788cc3" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "avg_rating" ADD CONSTRAINT "FK_a75766a06bb5b1d5a90ff3b813d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "avg_rating" ADD CONSTRAINT "FK_746e0b7916e4f5064217a96f4f3" FOREIGN KEY ("passedCompanyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "general_rating" ADD CONSTRAINT "FK_415f7fd6e2e9f697f7c81900bc2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passed_test_right_answers_answers" ADD CONSTRAINT "FK_3d3124566370a737e3a05df837c" FOREIGN KEY ("passedTestId") REFERENCES "passed_test"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "passed_test_right_answers_answers" ADD CONSTRAINT "FK_e20a813e9f93765165fbeaeee00" FOREIGN KEY ("answersId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_quiz_passed_test" ADD CONSTRAINT "FK_fe1361f00040858ab9dac67f5e0" FOREIGN KEY ("avgRatingId") REFERENCES "avg_rating"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_quiz_passed_test" ADD CONSTRAINT "FK_0f160dfdf275b45710d389210fc" FOREIGN KEY ("passedTestId") REFERENCES "passed_test"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "company_members_user" ADD CONSTRAINT "FK_bfa47928743d2f9a809fcb5e0e8" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "company_members_user" ADD CONSTRAINT "FK_104295b816e1a1a17d5fbadc71a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_members_user" DROP CONSTRAINT "FK_104295b816e1a1a17d5fbadc71a"`);
        await queryRunner.query(`ALTER TABLE "company_members_user" DROP CONSTRAINT "FK_bfa47928743d2f9a809fcb5e0e8"`);
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_quiz_passed_test" DROP CONSTRAINT "FK_0f160dfdf275b45710d389210fc"`);
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_quiz_passed_test" DROP CONSTRAINT "FK_fe1361f00040858ab9dac67f5e0"`);
        await queryRunner.query(`ALTER TABLE "passed_test_right_answers_answers" DROP CONSTRAINT "FK_e20a813e9f93765165fbeaeee00"`);
        await queryRunner.query(`ALTER TABLE "passed_test_right_answers_answers" DROP CONSTRAINT "FK_3d3124566370a737e3a05df837c"`);
        await queryRunner.query(`ALTER TABLE "general_rating" DROP CONSTRAINT "FK_415f7fd6e2e9f697f7c81900bc2"`);
        await queryRunner.query(`ALTER TABLE "avg_rating" DROP CONSTRAINT "FK_746e0b7916e4f5064217a96f4f3"`);
        await queryRunner.query(`ALTER TABLE "avg_rating" DROP CONSTRAINT "FK_a75766a06bb5b1d5a90ff3b813d"`);
        await queryRunner.query(`ALTER TABLE "test" DROP CONSTRAINT "FK_a854dd1bc1cc5b3626054788cc3"`);
        await queryRunner.query(`ALTER TABLE "passed_test" DROP CONSTRAINT "FK_78e125c8450ab98fd29f9b789a8"`);
        await queryRunner.query(`ALTER TABLE "passed_test" DROP CONSTRAINT "FK_20c0eb34db11603191fb1644c7c"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_2c8f911efa2fb5b0fe1abe92020"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_104295b816e1a1a17d5fbadc71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bfa47928743d2f9a809fcb5e0e"`);
        await queryRunner.query(`DROP TABLE "company_members_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f160dfdf275b45710d389210f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe1361f00040858ab9dac67f5e"`);
        await queryRunner.query(`DROP TABLE "avg_rating_passed_quiz_passed_test"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e20a813e9f93765165fbeaeee0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d3124566370a737e3a05df837"`);
        await queryRunner.query(`DROP TABLE "passed_test_right_answers_answers"`);
        await queryRunner.query(`DROP TABLE "general_rating"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "avg_rating"`);
        await queryRunner.query(`DROP TABLE "test"`);
        await queryRunner.query(`DROP TABLE "passed_test"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "answers"`);
    }

}
