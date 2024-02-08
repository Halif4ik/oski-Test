import { MigrationInterface, QueryRunner } from "typeorm";

export class TestCor1707159609858 implements MigrationInterface {
    name = 'TestCor1707159609858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "frequencyInDay"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "frequencyInDay" integer NOT NULL`);
    }

}
