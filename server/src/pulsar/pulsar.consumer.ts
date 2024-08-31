import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { nextTick } from 'process';
import { Client, Consumer, ConsumerConfig, Message } from 'pulsar-client';

export abstract class PulsarConsumer<T>
  implements OnModuleInit, OnModuleDestroy
{
  private consumer: Consumer;
  protected readonly logger = new Logger(this.config.topic);
  protected running = true;

  constructor(
    private readonly pulsarClient: Client,
    private readonly config: ConsumerConfig,
  ) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    this.running = false;

    await this.consumer.close();
  }

  protected async connect() {
    this.consumer = await this.pulsarClient.subscribe(this.config);

    nextTick(this.consume.bind(this));
    await this.consume();
  }

  private async consume() {
    while (this.running) {
      try {
        const messages = await this.consumer.batchReceive();

        await Promise.allSettled(
          messages.map((message) => this.receive(message)),
        );
      } catch (error) {
        this.logger.error('Error receiving batch.', error);
      }
    }
  }

  private async receive(message: Message) {
    try {
      const data = JSON.parse(message.getData().toString());

      console.log(data, message.getMessageId().toString());
      this.handleMessage(data);
    } catch (error) {
      this.logger.error('Error consuming.', error);
    }

    try {
      await this.consumer.acknowledge(message);
    } catch (error) {
      this.logger.error('Error acknowledge.', error);
    }
  }

  protected abstract handleMessage(data: T): void;
}
