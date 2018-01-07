// @flow
import type { NormalizerInterface } from './NormalizerInterface';
import type { DenormalizerInterface } from './DenormalizerInterface';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';
import AbstractNormalizer from './AbstractNormalizer';
import DenormalizationException from '../exception/DenormalizationException';
import NormalizationException from '../exception/NormalizationException';
import PropertyMetadata from '../metadata/PropertyMetadata';

/**
 * MetadataAwareNormalizer Class
 *
 * @class MetadataAwareNormalizer
 */
class MetadataAwareNormalizer extends AbstractNormalizer implements NormalizerInterface, DenormalizerInterface {

    /** @inheritDoc */
    normalize(data: any, format: string, context: SerializationContext) {
        if (data === null || data === undefined) {
            throw new NormalizationException(`MetadataAwareNormalizer does not support type "${typeof data}"`);
        }

        return Object.keys(data).reduce((result, key) => {
            const propertyMetadata = this.metadataFactory.getPropertyMetadata(data.constructor, key);
            const decorated = propertyMetadata instanceof PropertyMetadata
                ? this.decoratorRegistry.applyDecorators(propertyMetadata, data[key], context)
                : { name: key, value: data[key] } // stub in valid result to allow normal flow
            ;

            // pass nested objects through to be normalized independently
            if (decorated.value instanceof Object) {
                const args = [ decorated.value, format, context ];
                result[decorated.name] = this.normalizerRegistry.getNormalizer(...args).normalize(...args);
            } else {
                result[decorated.name] = decorated.value;
            }

            return result;
        }, {});
    }

    /** @inheritDoc */
    denormalize(data: any, format: string, cls: ?Function, context: DeserializationContext) {
        if (!(cls instanceof Function)) {
            throw new DenormalizationException(`MetadataAwareNormalizer does not support type "${typeof cls}"`);
        }

        const classMetadata = this.metadataFactory.getClassMetadata(cls);
        const serializationContext = new SerializationContext(data, format);

        return Object.keys(classMetadata).reduce((result, key) => {
            const propertyMetadata = classMetadata[key];
            const serializedKey = this._getSerializedKey(propertyMetadata, serializationContext);
            const decorated = this.decoratorRegistry.applyDecorators(propertyMetadata, data[serializedKey], context);

            if (decorated.value instanceof Object) {
                const args = [ decorated.value, format, decorated.value.constructor, context ];
                result[decorated.name] = this.normalizerRegistry.getDenormalizer(...args).denormalize(...args);
            } else {
                result[decorated.name] = decorated.value;
            }

            return result;
        }, new cls()); // @todo: need to instantiate class without using constructor
    }

    /**
     * In order to deserialize properties that may have undergone a change in their name
     * we must first serialize the property name to determine what key we should be using in
     * the data to be deserialized
     *
     * @private
     *
     * @param {PropertyMetadata} propertyMetadata
     * @param {SerializationContext} serializationContext
     *
     * @returns {string}
     */
    _getSerializedKey(propertyMetadata: PropertyMetadata, serializationContext: SerializationContext) {
        return this.decoratorRegistry.applyDecorators(propertyMetadata, null, serializationContext).name;
    }

    /** @inheritDoc */
    supportsNormalization(data: any, format: string, context: SerializationContext) {
        return data instanceof Object && this.metadataFactory.hasClassMetadata(data.constructor);
    }

    /** @inheritDoc */
    supportsDenormalization(data: any, format: string, cls: ?Function, context: DeserializationContext) {
        return cls instanceof Function && this.metadataFactory.hasClassMetadata(cls);
    }
}

export default MetadataAwareNormalizer;
