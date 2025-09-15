import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const userId = req.headers['x-user-id'] as string | undefined;
    if (!userId) {
      throw new UnauthorizedException('x-user-id header required');
    }
    req.userId = userId;
    return true;
  }
}

declare module 'http' {
  interface IncomingMessage {
    userId?: string;
  }
}

