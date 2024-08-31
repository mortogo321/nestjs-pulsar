import { Inject, Injectable, OnModuleDestroy, Scope } from '@nestjs/common';
import { Client } from 'pulsar-client';
import { PULSAR_CLIENT } from './pulsar.constants';

@Injectable({ scope: Scope.REQUEST })
export class PulsarClientService implements OnModuleDestroy {
  constructor(@Inject(PULSAR_CLIENT) private readonly pulsarClient: Client) {}

  async onModuleDestroy() {
    await this.pulsarClient.close();
  }
}
