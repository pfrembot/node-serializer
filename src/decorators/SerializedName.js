// @flow
import AbstractDecorator from './AbstractDecorator';
import type { DecoratorResult } from "./DecoratorRegistry";
import 'reflect-metadata';

/**
 * SerializedName Class
 *
 * @class SerializedName
 */
export class SerializedName extends AbstractDecorator {
    name: string;
    property: string;

    /**
     * SerializedName Constructor
     *
     * @param {string} name     Serialized name to use
     * @param {string} property The class property name
     */
    constructor(name: string, property: string) {
        super();

        this.name = name;
        this.property = property
    }

    /** @inheritDoc */
    apply(result: DecoratorResult) {
        if (result.name === this.name) result.name = this.property; // assume deserialize context
        if (result.name === this.property) result.name = this.name; // assume serialize context

        return result;
    }
}

/**
 * SerializedName Decorator
 *
 * This decorator is used to modify the serialized property name to something other
 * than the classes default property name during (d0)serialization
 *
 * @target({"PROPERTY", "METHOD"})
 *
 * @param {String} name
 * @returns {Function}
 */
export default (name: string) => {
    return (target:Object, propertyKey:string) => {
        const decorator = new SerializedName(name, propertyKey);
        // $FlowFixMe: reflect-metadata package not recognized
        return Reflect.defineMetadata(decorator.getKey(), decorator, target, propertyKey);
    }
};