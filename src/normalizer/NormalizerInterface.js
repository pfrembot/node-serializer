// @flow
import SerializationContext from '../SerializationContext';

/**
 * Defines interface for normailzers
 *
 * @interface NormalizerInterface
 */
export interface NormalizerInterface {
    /**
     * Normalizes data back into a generic object|scalar type.
     *
     * @param {*}                    data    Data to normalize
     * @param {String}               format  The encoding format that will be used
     * @param {SerializationContext} context The context of this serialization
     *
     * @return {*}
     *
     * @throws MethodNotImplementedException
     * @throws NormalizationException
     */
    normalize(data: any, format: string, context: SerializationContext): any;

    /**
     * Checks whether the given class is supported for normalization by this normalizer.
     *
     * @param {*}                    data    Data to normalize
     * @param {String}               format  The encoding format that will be used
     * @param {SerializationContext} context The context of this serialization
     *
     * @return {boolean}
     */
    supportsNormalization(data: any, format: string, context: SerializationContext): boolean;
}