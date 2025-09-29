import { ClientProxyFactory, Transport, ClientProxy } from "@nestjs/microservices";

export function createRmqClient(url: string, queue: string): ClientProxy {
    return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
            urls: [url],
            queue,
            queueOptions: { durable: true }
        }
    })
}