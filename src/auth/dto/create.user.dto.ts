import { Exclude } from "class-transformer";

export class CreateUserDTO{
    firstName: string;

    lastName: string;

    userName: string;

    email: string;

    password: string;
}