import { Logger, OnModuleInit } from '@nestjs/common';
import { nextTick } from 'process';
import { Client, Consumer, ConsumerConfig, Message } from 'pulsar-client';

export abstract class PulsarConsumer<T> implements OnModuleInit {
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

  protected async connect() {
    this.consumer = await this.pulsarClient.subscribe(this.config);

    nextTick(this.consume.bind(this));
    await this.consume();
  }

  private async consume() {
    while (this.running) {
      let message: Message;

      try {
        message = await this.consumer.receive();
        const data = JSON.parse(message.getData().toString());

        console.log(data, message.getMessageId().toString());
        this.handleMessage(data);
      } catch (error) {
        this.logger.error('Error consuming.', error);
      }

      try {
        if (message) {
          await this.consumer.acknowledge(message);
        }
      } catch (error) {
        this.logger.error('Error acknowledge.', error);
      }
    }
  }

  protected abstract handleMessage(data: T): void;
}
