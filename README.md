# NestJS - Apache Pulsar

A minimal NestJS service demonstrating message production and consumption with Apache Pulsar, including a full local Pulsar cluster (ZooKeeper, BookKeeper, broker) via Docker Compose.

## What's inside

- Reusable Pulsar client module (`src/pulsar`) with a generic `PulsarConsumer` base class and a request-scoped `PulsarProducerService` that caches producers per topic
- Example producer/consumer wiring (`AppConsumer`) subscribed to a test topic
- `POST /` publishes a message to Pulsar; a consumer logs messages as they arrive

## Tech stack

- NestJS (Express adapter), TypeScript
- Apache Pulsar (`pulsar-client`)
- Docker Compose (single-node Pulsar cluster: ZooKeeper, BookKeeper, broker)

## Quickstart

```bash
# start a local Pulsar cluster
docker compose -f docker/docker-compose.yml up

# in server/
cd server
yarn install
yarn start:dev
```

Pulsar broker: `pulsar://localhost:6650`, admin/web service: `http://localhost:8080`.

## Structure

```
docker/     Pulsar cluster docker-compose (zookeeper, bookie, broker)
server/
  src/
    pulsar/   Pulsar module: client provider, consumer base class, producer service
    app.*     example controller/service/consumer wiring
```

## Endpoints

- `GET /` - health check
- `POST /` - publishes the request body to the `test` Pulsar topic
