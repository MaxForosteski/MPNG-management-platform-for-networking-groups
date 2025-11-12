import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateIntentionDto{
    @IsString()
    @MinLength(3)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(11)
    phone: string;

    @IsString()
    @MinLength(10)
    message: string;
}
