import {IsNotEmpty, IsNumber,  Min} from "class-validator";
import {Transform} from "class-transformer";



export class AdditionalUpdateTestId {
   @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
   @IsNotEmpty()
   @IsNumber({}, {message: 'testId for Update Test should be number'})
   @Min(1)
   readonly testId: number;
}



