import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SensorService {
  private mqttClient: mqtt.MqttClient;
  private currentStatus: string | null = null;  // null로 초기화

  constructor(
    private configService: ConfigService,
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

    this.mqttClient.on('message', (topic, message) => {
      const receivedValue = message.toString().trim();
      
      console.log('----------------------------------------');
      console.log(`토픽: ${topic}`);
      console.log(`수신된 값: ${receivedValue}`);
      console.log('----------------------------------------')

      if (receivedValue === '0' || receivedValue === '1') {
        this.currentStatus = receivedValue;
        console.log('상태 업데이트 성공:', this.currentStatus);
      } else {
        this.currentStatus = null;  // 유효하지 않은 값이 오면 null로 설정
        console.log('유효하지 않은 값 수신');
      }
    });

    this.mqttClient.on('error', (error) => {
      console.error('MQTT 에러 발생:', error);
    });
  }

  async getCurrentStatus() {
    if (this.currentStatus === null || !['0', '1'].includes(this.currentStatus)) {
      return null;
    }
    return {
      thereis: this.currentStatus
    };
  }
}