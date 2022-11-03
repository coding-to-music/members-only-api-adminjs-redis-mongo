import { logger } from '@utils/logger'


export const Controller = (name?: string): ClassDecorator => {

    return (constructor: Function) => {
        logger.info(`${name
            ? `[Controllers] ${name} Contoller instantaited`
            : `[Controllers] ${constructor.name} instantiated}`}`
        )
    }
}

export const Route = (routes: string[]): PropertyDecorator => {

    return (target: Object, propertyKey: string | symbol) => {
        for (const route of routes) {
            logger.info(`${route} Mapped`)
        }
    }
}