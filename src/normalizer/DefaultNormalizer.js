import AbstractNormalizer from './AbstractNormalizer';
import NormalizationException from '../exception/NormalizationException';
import DenormalizationException from '../exception/DenormalizationException';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';

/**
 * DefaultNormalizer Class
 *
 * This should be the first normalizer that is registered with the
 * NormalizerRegistry {@see NormalizerRegistry.addNormalizer()} to be used as
 * a finally normalization attempt.
 *
 * Used primarily as a fallback when a build-in js type is passed to the serializer as either the primary
 * serialization context or possibly as an intermediate somewhere in the data structure
 *
 * It will respond true to all supports calls
 *
 * @see {NormalizerInterface.supportsNormalization()}
 * @see {DenormalizerInterface.supportsDenormalization()}
 *
 * @class DefaultNormalizer
 */
class DefaultNormalizer extends AbstractNormalizer {

    /** @inheritDoc */
    normalize(data: any, format: string, context: SerializationContext) {
        const type = data !== null ? typeof data : 'null';

        switch (type) {
            case 'null':
            case 'string':
            case 'number':
            case 'boolean':
            case 'undefined':
                return data;
            case 'object':
                const keys = Object.keys(data);
                const result = Array.isArray(data) ? [] : {};

                return keys.reduce((result, key) => {
                    const value = data[key];
                    const normalizer = this.normalizerRegistry.getNormalizer(value, format, context);

                    result[key] = normalizer.normalize(value, format, context);
                    return result;
                }, result);
        }

        throw NormalizationException(`Unable to normalize type "${type}"`);
    }

    /** @inheritDoc */
    denormalize(data: any, format: string, cls: ?Function, context: DeserializationContext) {
        const type = data !== null ? typeof data : 'null';

        switch (type) {
            case 'null':
            case 'string':
            case 'number':
            case 'boolean':
            case 'undefined':
                return data;
            case 'object':
                const keys = Object.keys(data);
                const result = Array.isArray(data) ? [] : {};

                return keys.reduce((result, key) => {
                    const value = data[key];
                    const denormalizer = this.normalizerRegistry.getDenormalizer(value, format, cls, context);

                    // @todo: need a way to determine the correct class to use (e.x. { foo: FooClass } or FooClass[])
                    result[key] = denormalizer.denormalize(value, format, cls, context);
                    return result;
                }, result);
        }

        throw DenormalizationException(`Unable to normalize type "${type}"`);
    }

    /** @inheritDoc */
    supportsNormalization(data: any, format: string, context: SerializationContext) {
        return true; // attempts to normalize all data types
    }

    /** @inheritDoc */
    supportsDenormalization(data: any, format: string, cls: ?Function, context: DeserializationContext) {
        return true; // attempt to denormalize all data types
    }
}

export default DefaultNormalizer;
