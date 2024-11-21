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

    const options = {
      clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
      clean: true,
      connectTimeout: 4000,
    };

    this.mqttClient = mqtt.connect(mqttUrl, options);

    this.mqttClient.on('connect', () => {
      console.log('MQTT 연결 성공!');
      this.mqttClient.subscribe(topic, (err) => {
        if (!err) {
          console.log(`구독 중인 토픽: ${topic}`);
        }
      });
    });

    this.mqttClient.on('message', async (topic, message) => {
      try {
        const messageStr = message.toString().trim();
        const [sensorId, status] = messageStr.split(' ');
        
        console.log('----------------------------------------');
        console.log(`토픽: ${topic}`);
        console.log(`수신된 값: ${messageStr}`);
        console.log(`센서 ID: ${sensorId}`);
        console.log(`상태값: ${status}`);

        const sensorIdNum = parseInt(sensorId);

        if (sensorIdNum === 1 || sensorIdNum === 2) {
          const newSensor = new this.thereisModel({
            sensorId: sensorIdNum,
            status: status
          });

          await newSensor.save();
          console.log('데이터베이스 저장 성공:', newSensor);
        } else {
          console.log('유효하지 않은 센서 ID:', sensorIdNum);
        }
        console.log('----------------------------------------');

      } catch (error) {
        console.error('에러 발생:', error);
        if (error.errors) {
          console.error('검증 에러:', error.errors);
        }
      }
    });

    this.mqttClient.on('error', (error) => {
      console.error('MQTT 에러 발생:', error);
    });
  }

  async getCurrentStatus() {
    try {
      const latestStatuses = [1, 2].map(sensorId => {
        return {
          sensorId,
          status: '0'  
        }
      });

      for (let i = 0; i < latestStatuses.length; i++) {
        const status = await this.thereisModel
          .findOne({ sensorId: latestStatuses[i].sensorId })
          .sort({ _id: -1 })
          .exec();
        
        if (status) {
          latestStatuses[i].status = status.status;
        }
      }

      return latestStatuses;
    } catch (error) {
      console.error('Error fetching status from database:', error);
      return null;
    }
  }
}