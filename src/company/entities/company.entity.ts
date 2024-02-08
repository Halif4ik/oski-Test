import {
   Column,
   DeleteDateColumn,
   Entity,
   JoinTable,
   ManyToMany,
   OneToMany,
   PrimaryGeneratedColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Test} from "../../test/entities/test.entity";
import {AvgRating} from "../../test/entities/averageRating.entity";
import {PassedTest} from "../../test/entities/passedTest.entity";

@Entity()
export class Company {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({type: "varchar", width: 255, unique: true})
   name: string;

   @Column({type: "varchar", width: 255})
   description: string;

   @DeleteDateColumn()
   deleteAt: Date;

   @ManyToMany(() => User, user=> user.companyMember)
   @JoinTable()
   members: User[];

   @OneToMany(() => Test, test => test.company)
   test: Test[];

   @OneToMany(() => AvgRating, avgRating => avgRating.passedCompany)
   averageRating: PassedTest[];
}
