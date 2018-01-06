// @flow
import type { DecoratorResult } from "./DecoratorRegistry";

/**
 * DecoratorInterface Interface
 *
 * @interface DecoratorInterface
 */
export interface DecoratorInterface {
    /**
     * Returns the unique identifier for this decorator class
     *
     * This key should be unique to the decorator class implementing this interface such that
     * all instances of that class will return the same Symbol when getKey is called. Ensure if
     * you override this method that the KEY used is consistent for that class and does not
     * conflict with any other reflected metadata key names.
     *
     * Symbols are recommended to be used here since they will avoid causing any conflict
     * in the underlying reflect-metadata storage location
     *
     * @retuns {string|Symbol}
     */
    getKey(): Symbol|string;

    /**
     * Applies this decorator's logic to the provided decorator result
     *
     * This method will be called from the serializer when reconciling property metadata. For each decorator
     * on a classes property a DecoratorResult will be will be passed to this method. Once here the
     * decorator can apply custom modification to and return the resulting DecoratorResult.
     *
     * Once returned *if* there are any more decorators the newest DecoratorResult object will
     * then be passed on to the next decorator's apply method and so on... until all decorator logic
     * has been applied.
     *
     * @param {DecoratorResult} result
     *
     * @returns {DecoratorResult}
     */
    apply(result: DecoratorResult): DecoratorResult;
}