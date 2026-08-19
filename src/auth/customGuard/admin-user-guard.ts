import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from './guard.custom';
import { AdminAuthGuard } from './admin-auth.guard';

@Injectable()
export class AdminOrUserGuard implements CanActivate {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly adminGuard: AdminAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Try normal user authentication first
    try {
      const authenticated = await this.authGuard.canActivate(context);

      if (authenticated) {
        request.userType = 'user';
        return true;
      }
    } catch {
      // Continue and try admin authentication
    }

    // Try admin authentication
    try {
      const authenticated = await this.adminGuard.canActivate(context);

      if (authenticated) {
        request.userType = 'admin';
        return true;
      }
    } catch {
      // Both authentication methods failed
    }

    return false;
  }
}
