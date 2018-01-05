// @flow
import type { Decorator } from "./DecoratorRegistry";
import type { DecoratorResult } from "./DecoratorRegistry";

/**
 * Type metadata property symbol to be used on the class
 * for storing property type metadata
 *
 * @constant {symbol}
 * @private
 */
export const TypeKey = Symbol('gson:annotation:types');

/**
 * Invoked when processing a properties Type annotation
 *
 * Attempts to cast the current `result.value` into a value of the target type
 * defined in the properties decorator
 *
 * @param {DecoratorResult} result
 * @param {Decorator} decorator
 *
 * @returns {DecoratorResult}
 */
export const TypeInvoker = (result: DecoratorResult, decorator: Decorator) => {
    if (decorator.value instanceof Function) {
        result.value = new decorator.value(result.value).valueOf();
    }

    return result;
};

/**
 * Type Decorator
 *
 * This decorator is used to specify which type a class property is/should be. Metadata will
 * be added to the class when the decorator is applied during class initialization.
 *
 * @target({"PROPERTY"})
 *
 * @param {Function} type
 * @returns {function(Function, String, Object)}
 */
export function Type<T>(type: T) {
    return (target: Function, property: String, descriptor: Object) => {
        target.constructor[TypeKey] = target.constructor[TypeKey] || {};
        target.constructor[TypeKey][property] = type;

        return descriptor;
    };
}