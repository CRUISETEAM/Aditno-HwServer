import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thereis, ThereisDocument } from './schemas/sensor.schema';

@Injectable()
export class SensorService {
  private mqttClient: mqtt.MqttClient;

  constructor(
    private configService: ConfigService,
    @InjectModel(Thereis.name) private thereisModel: Model<ThereisDocument>
  ) {
    this.initializeMqtt();
  }

  private initializeMqtt() {
    const mqttUrl = this.configService.get<string>('MQTT_URL');
    const topic = this.configService.get<string>('MQTT_TOPIC');

    this.mqttClient = mqtt.connect(mqttUrl);

    this.mqttClient.on('connect', () => {
      console.log('MQTT 연결 성공!');
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
      console.log(`수신된 값: ${receivedValue}`);
      console.log('----------------------------------------')

      if (receivedValue === '0' || receivedValue === '1') {
        console.log('상태 업데이트 성공:', receivedValue);
        await this.thereisModel.create({ status: receivedValue });
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
      const latestStatus = await this.thereisModel
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
      console.error('Error fetching status from database:', error);
      return null;
    }
  }
}