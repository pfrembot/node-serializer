// @flow

import SerializationContext from "../SerializationContext";

/**
 * Decoder Interface
 *
 * @interface DecoderInterface
 */
export interface EncoderInterface {
    /**
     * Encodes data into the given format
     *
     * Given either scalar or a data structure composed of standard JavaScript data types
     * this method should encode the data into a string of the specified format
     *
     * @param {*}                    object  Data to be encoded
     * @param {string}               format  Encoding format to be used
     * @param {SerializationContext} context The context of this serialization
     *
     * @return {string}
     *
     * @throws Error
     */
    encode(object: any, format: string, context: SerializationContext): string;

    /**
     * Checks whether the serializer can encode to given format
     *
     * @param {string}               format  Encoding format to be used
     * @param {SerializationContext} context The context of this serialization
     *
     * @return {boolean}
     */
    supportsEncoding(format: string, context: SerializationContext): boolean;
}
