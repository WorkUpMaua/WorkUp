import type { ConsumeMessage } from 'amqplib';
import { Environments } from '../../../environments';
import { connectRabbitMQ, EXCHANGE_NAME } from './rabbitmq';

const DOOR_CODE_RPC_QUEUE = 'catalogo.verify-door-code.rpc';
const DOOR_CODE_REQUEST_RK = 'catalogo.verify-door-code.request';
const DOOR_CODE_FETCH_QUEUE = 'catalogo.door-code.rpc';
const DOOR_CODE_FETCH_RK = 'catalogo.door-code.request';

export const startDoorCodeVerificationConsumer = async (): Promise<void> => {
  const channel = await connectRabbitMQ();

  await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

  const { queue } = await channel.assertQueue(DOOR_CODE_RPC_QUEUE, {
    durable: false,
    exclusive: false,
    autoDelete: false,
  });

  await channel.bindQueue(queue, EXCHANGE_NAME, DOOR_CODE_REQUEST_RK);

  await channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) {
      return;
    }

    try {
      const { replyTo, correlationId } = msg.properties;

      if (!replyTo || !correlationId) {
        console.warn(
          '[DoorCodeVerification] Missing replyTo or correlationId. Ignoring message.',
        );
        channel.ack(msg);
        return;
      }

      let parsedPayload: any;
      try {
        parsedPayload = JSON.parse(msg.content.toString());
      } catch (error) {
        console.error(
          '[DoorCodeVerification] Failed to parse message payload:',
          error,
        );
        parsedPayload = {};
      }

      const payload = parsedPayload?.payload ?? parsedPayload;
      const workspaceId = payload?.workspaceId;
      const doorCode: string | undefined = payload?.doorCode;

      let valid = false;

      if (workspaceId && typeof doorCode === 'string') {
        try {
          const repo = Environments.getCatalogoRepo();
          const catalogo = repo.getCatalogo(workspaceId);
          const storedHash = catalogo?.doorCodeHash;

          if (storedHash) {
            valid = storedHash.trim() === doorCode.trim();
          }
        } catch (error) {
          console.error(
            '[DoorCodeVerification] Error while validating door code:',
            error,
          );
        }
      }

      channel.sendToQueue(
        replyTo,
        Buffer.from(JSON.stringify({ valid })),
        {
          correlationId,
          contentType: 'application/json',
        },
      );
    } catch (error) {
      console.error(
        '[DoorCodeVerification] Unexpected error handling request:',
        error,
      );
      const { replyTo, correlationId } = msg.properties;
      if (replyTo && correlationId) {
        channel.sendToQueue(
          replyTo,
          Buffer.from(JSON.stringify({ valid: false, error: 'internal_error' })),
          {
            correlationId,
            contentType: 'application/json',
          },
        );
      }
    } finally {
      channel.ack(msg);
    }
  });
};

export const startDoorCodeFetchConsumer = async (): Promise<void> => {
  const channel = await connectRabbitMQ();

  await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

  const { queue } = await channel.assertQueue(DOOR_CODE_FETCH_QUEUE, {
    durable: false,
    exclusive: false,
    autoDelete: false,
  });

  await channel.bindQueue(queue, EXCHANGE_NAME, DOOR_CODE_FETCH_RK);

  await channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) {
      return;
    }

    try {
      const { replyTo, correlationId } = msg.properties;

      if (!replyTo || !correlationId) {
        console.warn(
          '[DoorCodeFetch] Missing replyTo or correlationId. Ignoring message.',
        );
        channel.ack(msg);
        return;
      }

      let parsedPayload: any;
      try {
        parsedPayload = JSON.parse(msg.content.toString());
      } catch (error) {
        console.error(
          '[DoorCodeFetch] Failed to parse message payload:',
          error,
        );
        parsedPayload = {};
      }

      const payload = parsedPayload?.payload ?? parsedPayload;
      const workspaceId = payload?.workspaceId;

      let doorCodeHash: string | null = null;

      if (workspaceId) {
        try {
          const repo = Environments.getCatalogoRepo();
          const catalogo = repo.getCatalogo(workspaceId);
          doorCodeHash = catalogo?.doorCodeHash ?? null;
        } catch (error) {
          console.error(
            '[DoorCodeFetch] Error while retrieving door code:',
            error,
          );
        }
      }

      channel.sendToQueue(
        replyTo,
        Buffer.from(JSON.stringify({ doorCodeHash })),
        {
          correlationId,
          contentType: 'application/json',
        },
      );
    } catch (error) {
      console.error(
        '[DoorCodeFetch] Unexpected error handling request:',
        error,
      );
      const { replyTo, correlationId } = msg.properties;
      if (replyTo && correlationId) {
        channel.sendToQueue(
          replyTo,
          Buffer.from(
            JSON.stringify({ doorCodeHash: null, error: 'internal_error' }),
          ),
          {
            correlationId,
            contentType: 'application/json',
          },
        );
      }
    } finally {
      channel.ack(msg);
    }
  });
};
