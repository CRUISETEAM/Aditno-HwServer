import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { Sensor, SensorSchema } from './schemas/sensor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sensor.name, schema: SensorSchema }]),
  ],
  controllers: [SensorController],
  providers: [SensorService],
})
export class SensorModule {}