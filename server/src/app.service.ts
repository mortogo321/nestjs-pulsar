import { Injectable } from '@nestjs/common';
import { TEST_TOPIC } from './app.constants';
import { PulsarProducerService } from './pulsar/pulsar-producer.service';

@Injectable()
export class AppService {
  constructor(private readonly pulsarProducerService: PulsarProducerService) {}

  async sendMessage(request: any) {
    for (let i = 0; i <= 100; i++) {
      await this.pulsarProducerService.produce(TEST_TOPIC, request);
    }
  }
}
