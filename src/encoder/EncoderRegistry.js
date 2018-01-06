// @flow
import EncoderNotFoundException from '../exception/EncoderNotFoundException';
import type { EncoderInterface } from './EncoderInterface';
import SerializationContext from '../SerializationContext';

/**
 * EncoderRegistry Class
 *
 * Used to register new encoders to be used for serialization
 *
 * @example
 *
 * ```
 * import { encoderRegistry } from 'node-serializer';
 *
 * class MyEncoder implements EncoderInterface {
 *    ... encoder methods ...
 * }
 *
 * encoderRegistry.addEncoder(new MyEncoder());
 * ```
 *
 * @see {Serializer.serialize} for implementation
 * @class EncoderRegistry
 */
class EncoderRegistry {
    /**
     * Encoder Storage
     * @type {Array|EncoderInterface[]}
     */
    encoders = [];

    /**
     * Add a new encoder to the top of the stack
     *
     * Encoders added to the beginning to ensure that when we are iterating over them
     * in FILO order {@see getEncoders()} to prioritize new/custom encoders
     *
     * @param {EncoderInterface} encoder
     * @returns {void}
     */
    addEncoder(encoder: EncoderInterface) {
        this.encoders.unshift(encoder);
    }

    /**
     * Search the registry for encoder that is compatible with the provided format
     *
     * @param {string} format
     * @param {SerializationContext} context
     *
     * @returns {EncoderInterface}
     *
     * @throws EncoderNotFoundException
     */
    getEncoder(format: string, context: SerializationContext) {
        for (const encoder of this.encoders) {
            if (encoder.supportsEncoding(format, context)) {
                return encoder;
            }
        }

        throw new EncoderNotFoundException(format);
    }
}

export default EncoderRegistry;