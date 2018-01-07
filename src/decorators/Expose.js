// @flow
import AbstractDecorator from './AbstractDecorator';
import type { DecoratorResult } from './DecoratorRegistry';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';
import 'reflect-metadata';

/**
 * Expose Class
 *
 * @class Expose
 */
export class Expose extends AbstractDecorator {
    value: boolean;

    /**
     * Expose Constructor
     *
     * @param {boolean} value Should expose value on serialize
     */
    constructor(value: boolean) {
        super();

        this.value = value;
    }

    /** @inheritDoc */
    apply(result: DecoratorResult, context: SerializationContext|DeserializationContext) {
        if (context instanceof SerializationContext) result.value = this.value === false ? undefined : result.value;

        return result;
    }
}

/**
 * Expose Decorator
 *
 * This decorator is used to expose/exclude a property during serialization *only*. This will
 * have no effect when deserializing data
 *
 * @target({"PROPERTY", "METHOD"})
 *
 * @param {Boolean} value
 * @returns {Function}
 */
export default (value: boolean) => {
    return (target:Object, propertyKey:string) => {
        const decorator = new Expose(value);
        // $FlowFixMe: reflect-metadata package not recognized
        return Reflect.defineMetadata(decorator.getKey(), decorator, target, propertyKey);
    }
};