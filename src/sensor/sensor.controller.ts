import { Controller, Get, Logger } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('사물함 내 물건 존재 여부 확인')
@Controller('sensor')
export class SensorController {
  private readonly logger = new Logger(SensorController.name);

  constructor(private readonly sensorService: SensorService) {}

  @Get('status')
  @ApiResponse({ status: 200, description: '센서 상태 조회 성공' })
  @ApiResponse({ status: 404, description: '센서 상태를 아직 받지 못함' })
  async getStatus() {
    try {
      const status = await this.sensorService.getCurrentStatus();
      if (!status) {
        return { status: '센서 상태를 아직 받지 못했습니다' };
      }
      this.logger.log(`Returning sensor status: ${JSON.stringify(status)}`);
      return status;
    } catch (error) {
      this.logger.error('Error in getStatus:', error);
      throw error;
    }
  }
}