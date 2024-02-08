import { MigrationInterface, QueryRunner } from "typeorm";

export class Auth1706805595811 implements MigrationInterface {
    name = 'Auth1706805595811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth" ("id" SERIAL NOT NULL, "action_token" character varying NOT NULL, "refreshToken" character varying NOT NULL, "accessToken" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "upadateAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" integer, CONSTRAINT "UQ_9f94b1b80904d8ba606b15bbf51" UNIQUE ("action_token"), CONSTRAINT "REL_373ead146f110f04dad6084815" UNIQUE ("userId"), CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`DROP TABLE "auth"`);
    }

}
