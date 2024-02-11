import { Skilled } from "../enum/talent.enum";

export class BecomeTalentDTO{
   
    firstName: string;

   
    lastName: string;
    
  
    workEmail: string;

 
    workPhone:string;

   
    twitterLink:string;

   
    city:string;

  
    zipCode:number;


    skills: string[];

 
    experienedLevel: Skilled 


    workPattern?:string;


    image:object;
}