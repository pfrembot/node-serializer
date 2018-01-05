// @flow
import DeserializationContext from '../DeserializationContext';

/**
 * Defines interface for denormailzers
 *
 * @interface DenormalizerInterface
 */
export interface DenormalizerInterface {
    /**
     * Denormalizes data back into an object of the given class.
     *
     * @param {*}                      data    Data to restore
     * @param {String}                 format  The encoding format that was used
     * @param {Function}               cls     The expected class to instantiate
     * @param {DeserializationContext} context The context of this serialization
     *
     * @return {*}
     *
     * @throws MethodNotImplementedException
     * @throws DenormalizationException
     */
    denormalize(data: any, format: string, cls: ?Function, context: DeserializationContext): any;

    /**
     * Checks whether the given class is supported for denormalization by this normalizer.
     *
     * @param {*}                      data    Data to denormalize from
     * @param {String}                 format  The encoding format that was used
     * @param {String}                 cls     The class to which the data should be denormalized into
     * @param {DeserializationContext} context The context of this serialization
     *
     * @return {boolean}
     */
    supportsDenormalization(data: any, format: string, cls: ?Function, context: DeserializationContext): boolean;
}