import {Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "./question.entity";
import {Company} from "../../company/entities/company.entity";
import {PassedTest} from "./passedTest.entity";

@Entity()
export class Test {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 500})
    description: string;

    @Column({type: "int"})
    frequencyInDay: number;

    @DeleteDateColumn()
    deleteAt: Date;

    @OneToMany(() => Question, question => question.test)
    questions: Question[];

    @ManyToOne(() => Company, company => company.test, {
        onDelete: 'CASCADE'/*,
        eager: true*/
    })
    @JoinColumn()
    company: Company;

    @OneToMany(() => PassedTest, passedTest => passedTest.targetTest)
    passedTest: PassedTest[];

}
