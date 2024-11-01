import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServoController } from './servo.controller';
import { ServoService } from './servo.service';
import { Servo, ServoSchema } from './schemas/servo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Servo.name, schema: ServoSchema }
    ])
  ],
  controllers: [ServoController],
  providers: [ServoService]
})
export class ServoModule {}