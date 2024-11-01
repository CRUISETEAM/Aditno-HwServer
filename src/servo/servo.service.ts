import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Servo, ServoDocument } from './schemas/servo.schema';

@Injectable()
export class ServoService {
  private mqttClient: mqtt.MqttClient;

  constructor(
    private configService: ConfigService,
    @InjectModel(Servo.name) private servoModel: Model<ServoDocument>
  ) {
    this.initializeMqtt();
  }

  private initializeMqtt() {
    const mqttUrl = this.configService.get<string>('MQTT_URL');
    const topic = this.configService.get<string>('MQTT_SERVO_TOPIC');

    this.mqttClient = mqtt.connect(mqttUrl);

    this.mqttClient.on('connect', () => {
      console.log('서보모터 MQTT 연결 성공!');
      this.mqttClient.subscribe(topic, (err) => {
        if (!err) {
          console.log(`구독 중인 토픽: ${topic}`);
        }
      });
    });

    this.mqttClient.on('message', async (topic, message) => {
      const receivedValue = message.toString().trim();
      
      console.log('----------------------------------------');
      console.log(`토픽: ${topic}`);
      console.log(`서보모터 상태: ${receivedValue}`);
      console.log('----------------------------------------')

      if (receivedValue === '0' || receivedValue === '1') {
        console.log('서보모터 상태 업데이트 성공:', receivedValue);
        await this.servoModel.create({ status: receivedValue });
      } else {
        console.log('유효하지 않은 값 수신');
      }
    });

    this.mqttClient.on('error', (error) => {
      console.error('MQTT 에러 발생:', error);
    });
  }

  async getCurrentStatus() {
    try {
      const latestStatus = await this.servoModel
        .findOne()
        .sort({ _id: -1 })
        .exec();

      if (!latestStatus) {
        return null;
      }

      return {
        status: latestStatus.status
      };
    } catch (error) {
      console.error('Error fetching servo status from database:', error);
      return null;
    }
  }
}