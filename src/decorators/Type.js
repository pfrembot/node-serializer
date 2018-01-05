// @flow
/**
 * Type metadata property symbol to be used on the class
 * for storing property type metadata
 *
 * @constant {symbol}
 * @private
 */
export const _symbol = Symbol('gson:annotation:types');

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
        target.constructor[_symbol] = target.constructor[_symbol] || {};
        target.constructor[_symbol][property] = type;

        return descriptor;
    };
}