// @flow
import ClassMetadata from './ClassMetadata';
import PropertyMetadata from './PropertyMetadata';
import DecoratorRegistry from '../decorators/DecoratorRegistry';
import 'reflect-metadata';

/**
 * ClassMetadata CacheKey
 *
 * Stores existing CacheMetadata for the target class
 * in reflect-metadata storage
 *
 * @constant {symbol}
 */
const CacheKey = Symbol('gson:metadata:key');

/**
 * MetadataFactory Class
 *
 * @class MetadataFactory
 */
class MetadataFactory {
    /**
     * Decorator Registry
     * @type {DecoratorRegistry}
     */
    decoratorRegistry: DecoratorRegistry;

    /**
     * MetadataFactory Constructor
     *
     * @param {DecoratorRegistry} decoratorRegistry
     */
    constructor(decoratorRegistry: DecoratorRegistry) {
        this.decoratorRegistry = decoratorRegistry;
    }

    /**
     * Compile and return metadata for the target class
     *
     * This metadata is used during serialization to determine how the
     * serializer should handle class properties and data
     *
     * @param {Function} cls
     * @returns {ClassMetadata|null}
     */
    getClassMetadata(cls: ?Function) : ?ClassMetadata {
        if (!(cls instanceof Function)) {
            return null
        }

        // $FlowFixMe: reflect-metadata package not recognized
        if (Reflect.hasMetadata(CacheKey, cls)) {
            // $FlowFixMe: reflect-metadata package not recognized
            return Reflect.getMetadata(CacheKey, cls);
        }

        const instance = new cls(); // @todo: find a way to not call constructor here to avoid user-defined errors
        const instanceProps = Object.getOwnPropertyNames(instance);
        const decoratorKeys = Reflect.ownKeys(this.decoratorRegistry.decorators);

        const properties = instanceProps.map(prop => {
            // $FlowFixMe: reflect-metadata package not recognized
            const decorators = decoratorKeys.map(key => Reflect.getMetadata(key, cls.prototype, prop));
            return new PropertyMetadata(prop, ...decorators.filter(Boolean));
        });

        const classMetadata = new ClassMetadata(properties);

        // $FlowFixMe: reflect-metadata package not recognized
        Reflect.defineMetadata(CacheKey, classMetadata, cls);

        return classMetadata;
    }

    /**
     * Return class metadata for a single property
     *
     * Property metadata used curing serialization to define how
     * the property should be serialized
     *
     * @param {Function} cls
     * @param {string} prop
     * @returns {PropertyMetadata}
     */
    getPropertyMetadata(cls: Function, prop: string) : PropertyMetadata {
        const classMetadata = this.getClassMetadata(cls);

        return classMetadata ? classMetadata[prop] : new PropertyMetadata(prop);
    }

    /**
     * Test if the target class has metadata associated with it
     *
     * Currently this *only* includes classes that have registered decorators applied to them to
     * avoid using a metadata-aware normalizer on generic or un-decorated data structures
     *
     * @param {Function} cls
     * @returns {boolean}
     */
    hasClassMetadata(cls: Function): boolean {
        const metadata = this.getClassMetadata(cls);

        return Boolean(metadata && metadata.hasDecoratedProperties());
    }
}

export default MetadataFactory;