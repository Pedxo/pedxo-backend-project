import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from './guard.custom';
import { AdminAuthGuard } from './admin-auth.guard';

@Injectable()
export class AdminOrUserGuard implements CanActivate {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly adminGuard: AdminAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext) {
    return (
      (await this.tryGuard(this.authGuard, context)) ||
      (await this.tryGuard(this.adminGuard, context))
    );
  }

  private async tryGuard(
    guard: CanActivate,
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      return !!(await guard.canActivate(context));
    } catch {
      return false;
    }
  }
}
