import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pulsar-client';
import { TEST_TOPIC } from './app.constants';
import { PULSAR_CLIENT } from './pulsar/pulsar.constants';
import { PulsarConsumer } from './pulsar/pulsar.consumer';

@Injectable()
export class AppConsumer extends PulsarConsumer<any> {
  constructor(@Inject(PULSAR_CLIENT) pulsarClient: Client) {
    super(pulsarClient, {
      topic: TEST_TOPIC,
      subscription: 'nestjs',
    });
  }

  handleMessage(data: any) {
    this.logger.log('New message in AppConsumer.', data);
  }
}
