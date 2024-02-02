import {Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Test} from "./test.entity";
import {Answers} from "./answers.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 500})
    questionText: string;

    @Column({type: "varchar", length: 255})
    rightAnswer: string;

    @DeleteDateColumn()
    deleteAt: Date;

    @OneToMany(() => Answers, answers => answers.question)
    varsAnswers: Answers[];

    @ManyToOne(() => Test, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    test: Test;
}
