// @flow
import AbstractDecorator from './AbstractDecorator';
import type { DecoratorResult } from './DecoratorRegistry';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';
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
    apply(result: DecoratorResult, context: SerializationContext|DeserializationContext) {
        if (context instanceof SerializationContext) result.name = this.name;
        if (context instanceof DeserializationContext) result.name = this.property;

        return result;
    }
}

/**
 * SerializedName Decorator
 *
 * This decorator is used to modify the serialized property name to something other
 * than the classes default property name during serialization/deserialization
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