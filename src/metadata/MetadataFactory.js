// @flow
import ClassMetadata from './ClassMetadata';
import PropertyMetadata from './PropertyMetadata';
import DecoratorRegistry from '../decorators/DecoratorRegistry';

/**
 * Metadata CacheKey Property
 *
 * This is used to store a symbol that is unique to the target class with which we use as
 * the hash key in `MetadataFactory.metadatas` internal storage object.
 *
 * The reason is to ensure that we are using a unique hash key to cache class metadata to avoid the
 * possible edge case introduced by applications with multiple classes with the same name
 *
 * I had considered simply storing the metadata directly on the class constructor using this key,
 * but decided against in favor of internal storage to make testing simpler and avoid having
 * to export/expose the symbol
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
     * Cached Class Metadata Storage
     * @type {Object}
     */
    metadatas: { [Symbol]: ClassMetadata } = {};

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
     * @returns {ClassMetadata}
     */
    getClassMetadata(cls: Function) : ClassMetadata {
        const key:any = cls[CacheKey] || Symbol(cls.name);

        if (key in this.metadatas) {
            return this.metadatas[key];
        }

        cls[CacheKey] = cls[CacheKey] || key;

        const instance = new cls(); // @todo: find a way to not call constructor here to avoid user-defined errors
        const instanceProps = Object.getOwnPropertyNames(instance);
        const decoratorKeys = Reflect.ownKeys(this.decoratorRegistry.decorators);
        const properties = instanceProps.map(prop => {
            const descriptor = Object.getOwnPropertyDescriptor(instance, prop);
            const decorators = decoratorKeys.map(key => ({ key, value: cls[key][prop] } || undefined)).filter(Boolean);

            return new PropertyMetadata(prop, descriptor, ...decorators);
        });

        return this.metadatas[key] = new ClassMetadata(properties);
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

        return classMetadata[prop];
    }

    /**
     * Test if the target class has metadata associated with it
     * which should be used during serialization
     *
     * Currently this only includes classes that have registered decorators applied to them to
     * avoid using a metadata-aware normalizer on generic or un-decorated data structures
     *
     * @param {Function} cls
     * @returns {boolean}
     */
    hasClassMetadata(cls: Function): boolean {
        const key:any = cls[CacheKey] || Symbol(cls.name);

        if (key in this.metadatas) {
            return true;
        }

        const decoratorKeys = Reflect.ownKeys(this.decoratorRegistry.decorators);

        return Boolean(decoratorKeys.filter(key => cls[key] instanceof Object).length);
    }
}

export default MetadataFactory;