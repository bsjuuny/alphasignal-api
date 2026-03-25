import { Controller, Get } from '@nestjs/common';
import { SignalService } from './signal.service';

@Controller('signals')
export class SignalController {
  constructor(private readonly signalService: SignalService) {}

  @Get()
  async getLatest() {
    return this.signalService.getLatestSignals();
  }

  @Get('buy')
  async getBuySignals() {
    return this.signalService.getBuySignals();
  }

  @Get('all')
  async getAllSignals() {
    return this.signalService.getAllSignals();
  }
}
