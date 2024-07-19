import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class GoogleAuthCreateGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ) : boolean{
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    const PRIVATE_DB_GOOGLE_AUTH_KEY = process.env.PRIVATE_DB_GOOGLE_AUTH_KEY;
    return token === PRIVATE_DB_GOOGLE_AUTH_KEY;
    
  }
}
