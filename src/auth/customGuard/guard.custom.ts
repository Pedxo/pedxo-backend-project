import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, InternalServerErrorException, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private  jwtService: JwtService,
        private config: ConfigService
        ){}

     

   async canActivate(context: ExecutionContext): Promise<boolean> {
   try {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

   if (!token) {
    throw new HttpException('not unathorized, log in', HttpStatus.UNAUTHORIZED)
   }

   const payload = await this.jwtService.verifyAsync(token, {
    secret: this.config.get<string>('JWT_SECRET')
   })

   request.user = payload
   

   return true
   } catch (error) {
    if (error instanceof HttpException) {
        throw error
    }
    throw new InternalServerErrorException('server error')
   }

    }

    //please note the space in between the splite is very import.. without the space code won't work
    private extractTokenFromHeader(req: Request): string | undefined {
        const [type, token] = req.headers.authorization?.split(' ') ?? [];
        return type === "Bearer"? token: undefined
       }
}