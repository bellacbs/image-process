// rate-limit.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private limiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      await this.limiter.consume(request.ip);
      return true;
    } catch (rateLimiterResponse) {
      return false;
    }
  }
}
