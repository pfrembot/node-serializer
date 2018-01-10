// @flow
import type { DecoratorResult } from './DecoratorRegistry';
import AbstractDecorator from './AbstractDecorator';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';
import DiscriminatorType from '../types/Discriminator';

/**
 * Discriminator Class
 *
 * @class Discriminator
 */
export class Discriminator extends AbstractDecorator {
    discriminator: DiscriminatorType;

    /**
     * Discriminator Constructor
     *
     * @param {Function|DiscriminatorType} mapper Used to determine data type
     */
    constructor(mapper: Function|DiscriminatorType) {
        super();

        this.discriminator = mapper instanceof DiscriminatorType ?
            mapper : new DiscriminatorType(mapper);
    }

    /** @inheritDoc */
    apply(result: DecoratorResult, context: SerializationContext|DeserializationContext) {
        if (context instanceof DeserializationContext) {
            const type = this.discriminator.getType(result.value);

            Object.setPrototypeOf(result.value, type.prototype);
        }

        return result;
    }
}

/**
 * Discriminator Decorator
 *
 * This decorator is used to discriminate between which type a class property is/should be. Metadata will
 * be added to the class when the decorator is applied during class initialization.
 *
 * @target({"PROPERTY"})
 *
 * @param {Function} mapper
 * @returns {Function}
 */
export default (mapper: Function) => {
    return (target:Object, propertyKey:string) => {
        const decorator = new Discriminator(mapper);
        // $FlowFixMe: reflect-metadata package not recognized
        return Reflect.defineMetadata(decorator.getKey(), decorator, target, propertyKey);
    }
}