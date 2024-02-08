import {
   Column,
   DeleteDateColumn,
   Entity,
   ManyToMany,
   OneToMany,
   OneToOne,
   PrimaryGeneratedColumn
} from 'typeorm';
import {Auth} from "../../auth/entities/auth.entity";
import {Company} from "../../company/entities/company.entity";
import {PassedTest} from "../../test/entities/passedTest.entity";
import {AvgRating} from "../../test/entities/averageRating.entity";

@Entity()
export class User {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({type: "varchar", width: 255})
   firstName: string;

   @Column({type: "varchar", width: 255, unique: true})
   email: string;

   @Column({type: "varchar", width: 20, select: false})
   password: string;

   @DeleteDateColumn()
   deleteAt: Date;

   /*@AfterInsert()
   logInsert() {
      console.log('Inserted user with-', this, this.id);
   }*/
   @OneToOne(() => Auth, auth => auth.user)
   auth: Auth;

   @ManyToMany(() => Company, company => company.members)
   companyMember: Company[]

   @OneToMany(() => PassedTest, passedTest => passedTest.user)
   passedTest: PassedTest[];

   @OneToMany(() => AvgRating, avgRating => avgRating.user)
   averageRating: AvgRating[];

}
