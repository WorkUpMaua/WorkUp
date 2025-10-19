import amqp from 'amqplib';
import type { Connection, Channel } from 'amqplib';
import { Environments } from '../../environments'

const RABBITMQ_URL = Environments.getEnvs().rabbitmqURL;

if (!RABBITMQ_URL) {
    console.error('Environment variable RABBITMQ_URL is not defined.');
    process.exit(1);
}

const EXCHANGE_NAME = 'global_events'; 

let connection: Connection | null = null;
let channel: Channel | null = null;

const connectRabbitMQ = async (): Promise<Channel> => {
    
    if (channel) {
        return channel;
    }

    try {
        connection = await amqp.connect(RABBITMQ_URL);
        console.log('[RabbitMQ] Connected to RabbitMQ.');

        channel = await connection.createChannel();
        console.log('[RabbitMQ] Channel created.');
        return channel;
    } catch (error) {
        console.error('[RabbitMQ] Failed to connect or create channel:', error);
        throw error;
    }
};

/**
 * Publica um evento no Exchange Global do tipo 'topic'.
 * @param routingKey A chave de roteamento (ex: 'user.created', 'product.updated').
 * @param eventData O objeto de evento.
 */
export const publishEvent = async <T extends object>(
    routingKey: string, 
    eventData: T
): Promise<boolean> => {
    try {
        const currentChannel = await connectRabbitMQ();
        await currentChannel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

        const published = currentChannel.publish(
            EXCHANGE_NAME, 
            routingKey,
            Buffer.from(JSON.stringify(eventData)),
            { persistent: true }
        );

        if (published) {
            console.log(`[PUBLISHER] Topic Event '${routingKey}' published to '${EXCHANGE_NAME}':`, eventData);
        } else {
            console.warn(`[PUBLISHER] Failed to publish Topic Event '${routingKey}'. Channel buffer full.`);
        }
        return published;
    } catch (error) {
        console.error(`[PUBLISHER] Error publishing Topic Event '${routingKey}' to '${EXCHANGE_NAME}':`, error);
        return false;
    }
};

/**
 * Escuta eventos de uma fila específica
 * @param queueName O nome da fila.
 * @param bindingKey A chave de ligação, que pode ser um padrão (ex: 'user.#', 'product.*', 'user.created').
 * @param callback A função assíncrona para processar a mensagem.
 */
export const consumeEvents = async <T extends object>(
  queueName: string,
  bindingKey: string,
  callback: (event: T) => Promise<void>
): Promise<void> => {
  try {

    const channel: Channel = await connectRabbitMQ();


    await channel.assertExchange(EXCHANGE_NAME, 'topic', {
      durable: true,
    });


    await channel.assertQueue(queueName, {
      durable: true,
      exclusive: false,
      autoDelete: false,
    });

    await channel.prefetch(1);

    await channel.bindQueue(queueName, EXCHANGE_NAME, bindingKey);

    console.log(
      `[CONSUMER] Listening on queue '${queueName}' with binding '${bindingKey}'`
    );


    await channel.consume(
      queueName,
      async (msg) => {
        if (!msg) return;

        try {
          const payload: T = JSON.parse(msg.content.toString());
          console.log(`[CONSUMER] Received:`, payload);


          await callback(payload);


          channel.ack(msg);
        } catch (err) {
          console.error(`[CONSUMER] Error processing message:`, err);

  
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error('[CONSUMER] Error setting up consumer:', err);
    throw err;
  }
};
export const closeRabbitMQConnection = async (): Promise<void> => {
    if (channel) {
        try {
            await channel.close();
            console.log('[RabbitMQ] Channel closed.');
        } catch (error) {
            console.error('Error closing channel:', error);
        } finally {
            channel = null;
        }
    }
    if (connection) {
        try {
            await connection.close();
            console.log('[RabbitMQ] Connection closed.');
        } catch (error) {
            console.error('Error closing connection:', error);
        } finally {
            connection = null;
        }
    }
};
