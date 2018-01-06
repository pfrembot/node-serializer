// @flow
import type { DecoratorInterface } from "./DecoratorInterface";
import type { DecoratorResult } from "./DecoratorRegistry";
import 'reflect-metadata';
import SerializationContext from "../SerializationContext";
import DeserializationContext from "../DeserializationContext";

/**
 * AbstractDecorator Class
 *
 * @class AbstractDecorator
 */
class AbstractDecorator implements DecoratorInterface {
    static KEY: Symbol|string;

    /** @inheritDoc */
    getKey(): Symbol|string {
        if (this.constructor === AbstractDecorator) {
            throw new Error(`Invalid method call: getKey called directly on abstract not child`);
        }

        if (!this.constructor.KEY) {
            Object.defineProperty(this.constructor, 'KEY', {
                value: Symbol(this.constructor.name),
                writeable: false,
            });
        }

        return this.constructor.KEY;
    }

    /** @inheritDoc */
    apply(result: DecoratorResult, context: SerializationContext|DeserializationContext) {
        return result;
    }
}

export default AbstractDecorator;