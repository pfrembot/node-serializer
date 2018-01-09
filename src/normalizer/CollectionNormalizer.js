// @flow
import AbstractNormalizer from './AbstractNormalizer';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';
import DenormalizationException from '../exception/DenormalizationException';
import Discriminator from '../types/Discriminator';
import ListOf from '../types/ListOf';
import MapOf from '../types/MapOf';
import mapValues from 'lodash.mapvalues';

/**
 * CollectionNormalizer Class
 *
 * @class CollectionNormalizer
 */
class CollectionNormalizer extends AbstractNormalizer {

    /** @inheritDoc */
    denormalize(data: any, format: string, type: ?Function, context: DeserializationContext) {
        if (!(data instanceof Object)) {
            throw new DenormalizationException(`Normalizer expected data as Object or Array, got ${typeof data}`);
        }

        if (type instanceof ListOf) {
            return this.denormalizeListOf(data, format, type.discriminator, context);
        }

        if (type instanceof MapOf) {
            return this.denormalizeMapOf(data, format, type.discriminator, context)
        }

        throw new DenormalizationException(`Normalizer expected union ListOf or MapOf, got ${typeof type}`);
    }

    /**
     * Denormalize data that has been specified to contain a ListOf<Type>
     *
     * Ideally it is assumed that when denormalizing a ListOf<Type> we would be providing normalized data
     * in the form of an array. In the event that an object was passed instead this method converts data into its
     * values before performing the denormalization on its values
     *
     * @param {Object|Array} data
     * @param {string} format
     * @param {Discriminator} discriminator
     * @param {DeserializationContext} context
     * @returns {Array}
     */
    denormalizeListOf(data: Object|Array<any>, format: string, discriminator: Discriminator, context: DeserializationContext): Array<any> {
        return Object.values(data).map(value => {
            const constructor = discriminator.getType(value);
            const denormalizer = this.normalizerRegistry.getDenormalizer(value, format, constructor, context);

            return denormalizer.denormalize(value, format, constructor, context);
        });
    }

    /**
     * Denormalize data that has been specified to contain a MapOf<Type>
     *
     * Ideally it is assumed that when denormalizing a MapOf<Type> we would be providing normalized data
     * in the form of an object. In the event that an array was passed instead this method will return an object
     * of denormalized items using the original array indices as properties
     *
     * @param {Object|Array} data
     * @param {string} format
     * @param {Discriminator} discriminator
     * @param {DeserializationContext} context
     * @returns {Object}
     */
    denormalizeMapOf(data: Object|Array<any>, format: string, discriminator: Discriminator, context: DeserializationContext): Object {
        return mapValues(data, value => {
            const constructor = discriminator.getType(value);
            const denormalizer = this.normalizerRegistry.getDenormalizer(value, format, constructor, context);

            return denormalizer.denormalize(value, format, constructor, context);
        });
    }

    /** @inheritDoc */
    supportsNormalization(data: any, format: string, context: SerializationContext) {
        return false;
    }

    /** @inheritDoc */
    supportsDenormalization(data: any, format: string, cls: ?Function, context: DeserializationContext) {
        return data instanceof Object && (cls instanceof ListOf || cls instanceof MapOf);
    }
}
export default CollectionNormalizer;