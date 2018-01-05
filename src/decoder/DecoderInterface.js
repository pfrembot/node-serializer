// @flow

/**
 * Decoder Interface
 *
 * @interface DecoderInterface
 */
export interface DecoderInterface {
    /**
     * Decode Encoded String
     *
     * Given an encoded string this method should decode into a data structure
     * composed of *only* standard JavaScript data types
     *
     * @param {string} string  Encoded data string
     * @param {string} format  Format name being decoded
     * @param {Object} context Initial context options passed to deserialize
     *
     * @note Since deserialization context depends on access to the decoded data we work with the raw options
     *       passed to deserialize here instead of an instance of DeserializationContext
     *
     * @return {*}
     *
     * @throws Error
     */
    decode(string: string, format: string, context: Object): any;

    /**
     * Checks whether the deserializer can decode from given format
     *
     * @param {string} format Format name being decoded
     * @param {Object} context Initial context options passed to deserialize
     *
     * @return {boolean}
     */
    supportsDecoding(format: string, context: Object): boolean;
}