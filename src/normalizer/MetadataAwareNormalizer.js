// @flow
import { NormalizerInterface } from './NormalizerInterface';
import { DenormalizerInterface } from './DenormalizerInterface';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';
import AbstractNormalizer from './AbstractNormalizer';

/**
 * MetadataAwareNormalizer Class
 *
 * @class MetadataAwareNormalizer
 */
class MetadataAwareNormalizer extends AbstractNormalizer implements NormalizerInterface, DenormalizerInterface {

    /** @inheritDoc */
    normalize(data: any, format: string, context: SerializationContext) {
        const classMetadata = this.metadataFactory.getClassMetadata(data.constructor);

        return Object.keys(data).reduce((result, key) => {
            const propertyMetadata = classMetadata[key];
            const decorated = this.decoratorRegistry.applyDecorators(propertyMetadata);

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
        const classMetadata = this.metadataFactory.getClassMetadata(data);

        return Object.keys(data).reduce((result, key) => {
            const propertyMetadata = classMetadata[key];
            const decorated = this.decoratorRegistry.applyDecorators(propertyMetadata);

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
