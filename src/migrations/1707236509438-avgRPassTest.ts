import { MigrationInterface, QueryRunner } from "typeorm";

export class AvgRPassTest1707236509438 implements MigrationInterface {
    name = 'AvgRPassTest1707236509438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "avg_rating_passed_test_passed_test" ("avgRatingId" integer NOT NULL, "passedTestId" integer NOT NULL, CONSTRAINT "PK_2a8885f5a3e651db2c0660b24fd" PRIMARY KEY ("avgRatingId", "passedTestId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6fc922d27b2b3ab94a0bf59911" ON "avg_rating_passed_test_passed_test" ("avgRatingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e06e1fefc516b9026ea3bf0b60" ON "avg_rating_passed_test_passed_test" ("passedTestId") `);
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_test_passed_test" ADD CONSTRAINT "FK_6fc922d27b2b3ab94a0bf599114" FOREIGN KEY ("avgRatingId") REFERENCES "avg_rating"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_test_passed_test" ADD CONSTRAINT "FK_e06e1fefc516b9026ea3bf0b60e" FOREIGN KEY ("passedTestId") REFERENCES "passed_test"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_test_passed_test" DROP CONSTRAINT "FK_e06e1fefc516b9026ea3bf0b60e"`);
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_test_passed_test" DROP CONSTRAINT "FK_6fc922d27b2b3ab94a0bf599114"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e06e1fefc516b9026ea3bf0b60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6fc922d27b2b3ab94a0bf59911"`);
        await queryRunner.query(`DROP TABLE "avg_rating_passed_test_passed_test"`);
    }

}
