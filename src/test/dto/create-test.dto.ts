import {QuestionDto} from "./question.dto";
import {IsNotEmpty, IsNumber, IsString, Length, Min, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";

export class CreateTestDto {
   @IsString({message: 'description should be string'})
   @IsNotEmpty()
   @Length(4, 500,{ message:'description Min length 4 max length 500'})
   readonly description: string;


   @IsNotEmpty()
   @ValidateNested({ each: true })
   @Type(() => QuestionDto)
   readonly questions: QuestionDto[];


   @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
   @IsNotEmpty()
   @IsNumber({}, {message: 'companyId for Assign CreateTestDto should be number'})
   @Min(1)
   readonly companyId: number;
}
