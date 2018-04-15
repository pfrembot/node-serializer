// @flow
import PropertyMetadata from '../metadata/PropertyMetadata';
import type { DecoratorInterface, Context } from './DecoratorInterface';
import AbstractDecorator from './AbstractDecorator';
import DecoratorInvalidException from '../exception/DecoratorInvalidException';

export type DecoratorKey = string|Symbol;
export type DecoratorResult = { name: string, value: any, type?: Function }

type DecoratorStorage = { [DecoratorKey]: DecoratorInterface }

/**
 * DecoratorRegistry Class
 *
 * @class DecoratorRegistry
 */
class DecoratorRegistry {
    /**
     * Decorator Storage
     * @type {DecoratorStorage}
     */
    decorators: DecoratorStorage = {};

    /**
     * Add a new decorator to the registry
     *
     * Decorators are registered against their decorator key (which should be unique). As such best practice is
     * to use a Symbol for the decorator key to ensure that no key conflicts can occur.
     *
     * @param {DecoratorInterface} decorator
     *
     * @return void
     *
     * @throws DecoratorInvalidException
     */
    addDecorator(decorator: DecoratorInterface) {
        if (!(decorator instanceof AbstractDecorator)) {
            throw new DecoratorInvalidException(decorator);
        }

        this.decorators[decorator.getKey()] = decorator;
    }

    /**
     * Iterates over property metadata decorators and applies decorator to the DecoratorResult
     *
     * This is really only a convenience method since we are applying the decorator instance taken
     * directly from class metadata and not from the registry. In this way the registry only really acts
     * as a guard against calling apply on an unregistered/unknown decorator accidentally
     *
     * @param {PropertyMetadata} property
     * @param {*} value
     * @param {Context} context
     *
     * @returns {DecoratorResult|{name: string, value: *}}
     */
    applyDecorators(property: PropertyMetadata, value: any, context: Context): DecoratorResult {
        const name = property.name;
        const decorators = property.getDecorators();

        return decorators.reduce((result, decorator) => {
            // $FlowFixMe: ignore left-hand symbol in
            if (!(decorator.getKey() in this.decorators)) {
                return result;
            }

            return decorator.apply(result, context) || result;
        }, { name, value });
    }
}

export default DecoratorRegistry;
