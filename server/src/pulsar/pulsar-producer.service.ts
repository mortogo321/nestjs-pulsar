import { Inject, Injectable, OnModuleDestroy, Scope } from '@nestjs/common';
import { Client, Producer } from 'pulsar-client';
import { PULSAR_CLIENT } from './pulsar.constants';

@Injectable({ scope: Scope.REQUEST })
export class PulsarProducerService implements OnModuleDestroy {
  private readonly producers = new Map<string, Producer>();

  constructor(@Inject(PULSAR_CLIENT) private readonly pulsarClient: Client) {}

  async onModuleDestroy() {
    for (const producer of this.producers.values()) {
      await producer.close();
    }
  }

  async produce(topic: string, message: any) {
    let producer = this.producers.get(topic);

    if (!producer) {
      producer = await this.pulsarClient.createProducer({ topic });
      this.producers.set(topic, producer);
    }

    await producer.send({ data: Buffer.from(JSON.stringify(message)) });
  }
}
