// @flow
import AbstractDecorator from './AbstractDecorator';
import type { DecoratorResult } from './DecoratorRegistry';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';
import 'reflect-metadata';

/**
 * SerializationGroups Class
 *
 * @class SerializationGroups
 */
export class SerializationGroups extends AbstractDecorator {
    groups: string[];

    /**
     * SerializationGroups Constructor
     *
     * @param {string[]} groups Groups to expose
     */
    constructor(...groups: string[]) {
        super();

        this.groups = groups;
    }

    /** @inheritDoc */
    apply(result: DecoratorResult, context: SerializationContext|DeserializationContext) {
        if (context instanceof SerializationContext && context.groups instanceof Array) {
            const groups = context.groups.filter(group => this.groups.includes(group));

            result.value = groups.length ? result.value : undefined;
        }

        return result;
    }
}

/**
 * SerializationGroups Decorator
 *
 * This decorator is used to expose/exclude a property during serialization *only* based on the
 * current context's serialization groups. Decorator does not apply during deserialization.
 *
 * @notes
 *
 *  1. Decorator is not applied if the provided serialization context has no 'groups' array provided
 *  2. Decorator will only be applied on serialization and ignored during deserialization
 *  3. Properties with this decorator will be excluded if empty groups array provided on context. Assumes that no
 *     group names were provided because the intention was to exclude anything with this decorator
 *  4. This decorator can only be applied to object properties that have applied it. So any properties that
 *     were not decorated with SerializationGroups will be included in the serialization result regardless of
 *     serialization groups provided in context
 *
 * @target({"PROPERTY", "METHOD"})
 *
 * @param {String[]} groups
 * @returns {Function}
 */
export default (...groups: string[]) => {
    return (target:Object, propertyKey:string) => {
        const decorator = new SerializationGroups(...groups);
        // $FlowFixMe: reflect-metadata package not recognized
        return Reflect.defineMetadata(decorator.getKey(), decorator, target, propertyKey);
    }
};