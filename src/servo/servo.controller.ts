import { Controller, Get, Logger } from '@nestjs/common';
import { ServoService } from './servo.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('문 열림/닫힘 상태 확인')
@Controller('servo')
export class ServoController {
  private readonly logger = new Logger(ServoController.name);

  constructor(private readonly servoService: ServoService) {}

  @Get('status')
  @ApiResponse({ status: 200, description: '서보모터 상태 조회 성공' })
  @ApiResponse({ status: 404, description: '서보모터 상태를 아직 받지 못함' })
  async getStatus() {
    try {
      const status = await this.servoService.getCurrentStatus();
      if (!status) {
        return { status: '서보모터 상태를 아직 받지 못했습니다' };
      }
      this.logger.log(`Returning servo status: ${JSON.stringify(status)}`);
      return status;
    } catch (error) {
      this.logger.error('Error in getStatus:', error);
      throw error;
    }
  }
}