// @flow
import type { DecoratorInterface } from "./DecoratorInterface";
import type { DecoratorResult } from "./DecoratorRegistry";
import 'reflect-metadata';

/**
 * AbstractDecorator Class
 *
 * @class AbstractDecorator
 */
class AbstractDecorator implements DecoratorInterface {
    static KEY: Symbol|string;

    /** @inheritDoc */
    getKey(): Symbol|string {
        if (!this.constructor.KEY) {
            Object.defineProperty(this.constructor, 'KEY', {
                value: Symbol(this.constructor.name),
                writeable: false,
            });
        }

        return this.constructor.KEY;
    }

    /** @inheritDoc */
    apply(result: DecoratorResult) {
        return result;
    }
}

export default AbstractDecorator;