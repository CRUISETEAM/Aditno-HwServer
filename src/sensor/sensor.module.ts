import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { Thereis, ThereisSchema } from './schemas/sensor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Thereis.name, schema: ThereisSchema }
    ])
  ],
  controllers: [SensorController],
  providers: [SensorService]
})
export class SensorModule {}