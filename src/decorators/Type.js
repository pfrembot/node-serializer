// @flow
import type { DecoratorResult } from './DecoratorRegistry';
import AbstractDecorator from './AbstractDecorator';

/**
 * Type Class
 *
 * @class Type
 */
export class Type extends AbstractDecorator {
    type: Function;

    /**
     * SerializedName Constructor
     *
     * @param {Function} type Serialized name to use
     */
    constructor(type: Function) {
        super();

        this.type = type;
    }

    /** @inheritDoc */
    apply(result: DecoratorResult) {
        if (this.type instanceof Function) {
            result.value = new this.type(result.value).valueOf();
        }

        return result;
    }
}

/**
 * Type Decorator
 *
 * This decorator is used to specify which type a class property is/should be. Metadata will
 * be added to the class when the decorator is applied during class initialization.
 *
 * @target({"PROPERTY"})
 *
 * @param {Function} type
 * @returns {Function}
 */
export default (type: Function) => {
    return (target:Object, propertyKey:string) => {
        const decorator = new Type(type);
        // $FlowFixMe: reflect-metadata package not recognized
        return Reflect.defineMetadata(decorator.getKey(), decorator, target, propertyKey);
    }
}