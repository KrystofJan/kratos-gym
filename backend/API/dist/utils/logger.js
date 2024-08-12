import Pino from 'pino';
export const logger = Pino.pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});
