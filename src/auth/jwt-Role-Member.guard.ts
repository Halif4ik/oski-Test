import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {User} from "../user/entities/user.entity";
import {Reflector} from "@nestjs/core";
import {ROLE_KEY} from "./role-auth-decor";
import {Company} from "../company/entities/company.entity";
import {TestService} from "../test/test.service";
import {Test} from "../test/entities/test.entity";

@Injectable()
export class JwtRoleMemberGuard implements CanActivate {
   constructor(private reflector: Reflector,
               private readonly testService: TestService) {
   }

   /*decode with Key word for refreshToken*/
   async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();

      try {
         const requiredRoles: string[] = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
         ]);
         /*we made verify in strategy */
         const userFromJwt: User | null =
             req.user && req.user.id && req.user.email && req.user.companyMember ? req.user : null;
         /*if for Post*/  /* ||if for Get*/
         let companyIdFromRequest: number | undefined = +req?.body?.companyId;

         /* if empty body and query for Get case with testId*/
         if (!companyIdFromRequest) {
            const testId: number | null  = parseInt(req.query.testId) || +req?.body?.testId;;
            if (isNaN(testId))
               throw new UnauthorizedException({message: "Test ID is not a number or not present in query"});
            const targetTest: Test | null = await this.testService.findTestById(testId);
            if (!targetTest) throw new UnauthorizedException({message: "Test not found"});
            companyIdFromRequest = targetTest.company.id;

         }

         // Check maybe user is the owner of the current company
         const isCompanyOwner: Company | null = userFromJwt.companyMember.find(
             (company: Company) => company.id === companyIdFromRequest);

         if (!isCompanyOwner)
            throw new UnauthorizedException(
                {message: `User is not related to the company ${companyIdFromRequest} related to the test ${req.query.testId}`});
         req.company = isCompanyOwner;
         return true;
      } catch (e) {
         throw e;
      }

   }
}