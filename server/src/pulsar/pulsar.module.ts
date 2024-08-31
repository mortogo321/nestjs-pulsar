import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'pulsar-client';
import { PulsarProducerService } from './pulsar-producer.service';
import { PULSAR_CLIENT } from './pulsar.constants';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PULSAR_CLIENT,
      useFactory: (configService: ConfigService) =>
        new Client({
          serviceUrl: configService.getOrThrow('PULSAR_SERVICE_URL'),
        }),
      inject: [ConfigService],
    },
    PulsarProducerService,
  ],
  exports: [PulsarProducerService, PULSAR_CLIENT],
})
export class PulsarModule {}
