// @flow
import type { NormalizerInterface } from './NormalizerInterface';
import type { DenormalizerInterface } from './DenormalizerInterface';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';
import AbstractNormalizer from './AbstractNormalizer';
import DenormalizationException from '../exception/DenormalizationException';

/**
 * MetadataAwareNormalizer Class
 *
 * @class MetadataAwareNormalizer
 */
class MetadataAwareNormalizer extends AbstractNormalizer implements NormalizerInterface, DenormalizerInterface {

    /** @inheritDoc */
    normalize(data: any, format: string, context: SerializationContext) {
        return Object.keys(data).reduce((result, key) => {
            const propertyMetadata = this.metadataFactory.getPropertyMetadata(data.constructor, key);
            const decorated = this.decoratorRegistry.applyDecorators(propertyMetadata, data[key]);

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
            throw new DenormalizationException(`Normalizer does not support type "${typeof cls}"`);
        }

        return Object.keys(data).reduce((result, key) => {
            const propertyMetadata = this.metadataFactory.getPropertyMetadata(cls || Object, key);
            const decorated = this.decoratorRegistry.applyDecorators(propertyMetadata, data[key]);

            // pass nested objects through to be de-normalized independently
            if (decorated.value instanceof Object) {
                const args = [ decorated.value, format, decorated.value.constructor, context ];
                result[decorated.name] = this.normalizerRegistry.getDenormalizer(...args).denormalize(...args);
            } else {
                result[decorated.name] = decorated.value;
            }

            return result;
        }, {});
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