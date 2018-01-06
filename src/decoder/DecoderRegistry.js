// @flow
import DecoderNotFoundException from '../exception/DecoderNotFoundException';
import type { DecoderInterface } from "./DecoderInterface";

/**
 * DecoderRegistry Class
 *
 * Used to register new decoders to be used for deserialization
 *
 * @example
 *
 * ```
 * import { decoderRegistry } from 'node-serializer';
 *
 * class MyDecoder implements DecoderInterface {
 *    ... encoder methods ...
 * }
 *
 * decoderRegistry.addDecoder(new MyDecoder());
 * ```
 *
 * @see {Serializer.deserialize} for implementation
 *
 * @class DecoderRegistry
 */
class DecoderRegistry {
    /**
     * Decoder Storage
     * @type {DecoderInterface[]}
     */
    decoders = [];

    /**
     * Add a new decoder to the top of the stack
     *
     * Decoders added to the beginning to ensure that when we are iterating over them
     * in {@see getDecoders()} we are trying to use any custom added decoders first
     *
     * @param {DecoderInterface} decoder
     * @returns {void}
     */
    addDecoder(decoder: DecoderInterface) {
        this.decoders.unshift(decoder);
    }

    /**
     * Search the registry for encoder that is compatible with the provided format
     *
     * @param {string} format
     * @param {Object} context
     *
     * @returns {EncoderInterface}
     *
     * @throws DecoderNotFoundException
     */
    getDecoder(format: string, context: Object) {
        for (const decoder of this.decoders) {
            if (decoder.supportsDecoding(format, context)) {
                return decoder;
            }
        }

        throw new DecoderNotFoundException(format);
    }
}

export default DecoderRegistry;