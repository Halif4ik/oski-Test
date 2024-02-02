import {
   Column,
   Entity,
   JoinColumn,
   JoinTable,
   ManyToMany,
   ManyToOne,
   PrimaryGeneratedColumn,
   UpdateDateColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Company} from "../../company/entities/company.entity";
import {PassedTest} from "./passedTest.entity";

@Entity()
export class AvgRating {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({type: "float"})
   averageRating: number;

   @UpdateDateColumn()
   updateAt: Date;

   @ManyToOne(() => User, user => user.averageRating, {
      onDelete: 'CASCADE'
   })
   @JoinColumn()
   user: User;

   @ManyToOne(() => Company, company => company.averageRating, {
      onDelete: 'CASCADE'
   })
   @JoinColumn()
   passedCompany: Company;

   @ManyToMany(() => PassedTest)
   @JoinTable()
   passedQuiz: PassedTest[];

}
