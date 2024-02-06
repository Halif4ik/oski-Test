import {
   Column,
   CreateDateColumn,
   Entity,
   JoinColumn, JoinTable,
   ManyToMany,
   ManyToOne,
   PrimaryGeneratedColumn,
   UpdateDateColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Test} from "./test.entity";
import {Answers} from "./answers.entity";

@Entity()
export class PassedTest {

   @PrimaryGeneratedColumn()
   id: number;

   @CreateDateColumn()
   createDate: Date;

   @UpdateDateColumn()
   updateAt: Date;

   @Column({type: 'boolean', default: false})
   isStarted: boolean;

   @ManyToOne(() => User, user => user.passedTest, {onDelete: 'CASCADE',})
   @JoinColumn()
   user: User;

   @ManyToOne(() => Test, test => test.passedTest, {onDelete: 'CASCADE'})
   @JoinColumn()
   targetTest: Test;

   @ManyToMany(() => Answers)
   @JoinTable()
   rightAnswers: Answers[];

}
