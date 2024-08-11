import Pino from 'pino';
export var logger = Pino.pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});
