// @flow
import PropertyMetadata from '../metadata/PropertyMetadata';

export type DecoratorKey = string|Symbol;
export type Decorator = { key: DecoratorKey, value: any }
export type InvokerFunction = (result: DecoratorResult, decorator: Decorator ) => DecoratorResult;
export type DecoratorResult = { name: string, value: any }

type DecoratorStorageItem = { decorator: Function, invoker: InvokerFunction }
type DecoratorStorage = { [DecoratorKey]: DecoratorStorageItem }

const EmptyInvoker = result => result;

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
     * @param {Function}      decorator
     * @param {string|Symbol} key
     * @param {Function|EmptyInvoker} invoker
     *
     * @notes The invoker argument is a callback that is used to apply custom user-defined logic to the property being
     *        decorated. The invoker function is expected to take two arguments consisting of the current decorated
     *        result `{name:string, value:any}` and the current decorator being applied.
     *
     *        The invoker function using those 2 pieces arguments *must* return an object of the same format as
     *        the initial result argument provided.
     *
     *        Invoker Arguments:
     *
     *          - {DecoratorResult} result: The current decorator result (format: { name:string, value:any })
     *          - {Decorator} decorator: The decorator being applied (format: { key: Symbol|string, value: any })
     *
     *        Invoker Caveats:
     *
     *          1. If no invoker is provided it will default to an empty invoker function that simply returns the same
     *             result that it received
     *          2. If an invoker returns anything falsie (0, null, void, false) the current result object will be
     *             passed to the next decorators invoker function
     *          3. Invokers are allowed to mutate the decorator result object which will be reflected by the current
     *             result object should the invoker fail to return the result
     *
     * @return void
     */
    addDecorator(decorator: Function, key: DecoratorKey, invoker: InvokerFunction = EmptyInvoker) {
        this.decorators[key] = { decorator, invoker };
    }

    /**
     * Iterates over property metadata decorators and applies each registered decorator's invoker callback
     *
     * Since decorators are stored in a hash there is no guarantee as to what order they will be applied in. As such
     * care should be taken by the invoker's author to ensure that no decorator dependencies are being introduced
     * by attempting to pass context between invoker calls.
     *
     * @param {PropertyMetadata} property
     *
     * @returns {DecoratorResult|{name: string, value: *}}
     */
    applyDecorators(property: PropertyMetadata): DecoratorResult {
        const name = property.name;
        const value = property.descriptor.value;
        const decorators = property.getDecorators();

        return decorators.reduce((result, decorator) => {
            return this.decorators[decorator.key].invoker(result, decorator) || result;
        }, { name, value });
    }
}

export default DecoratorRegistry;