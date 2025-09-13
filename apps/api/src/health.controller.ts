import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/')
  root() {
    return { ok: true, name: 'reading-journal api', version: 1 };
  }
}

