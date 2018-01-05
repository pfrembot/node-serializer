// @flow
import MetadataFactory from './metadata/MetadataFactory';
import NormalizerRegistry from './normalizer/NormalizerRegistry';
import DecoderRegistry from './decoder/DecoderRegistry';
import EncoderRegistry from './encoder/EncoderRegistry';
import SerializationContext from './SerializationContext';
import DeserializationContext from './DeserializationContext';

/**
 * Serializer Class
 *
 * @class Serializer
 */
class Serializer {
    normalizerRegistry: NormalizerRegistry;
    encoderRegistry: EncoderRegistry;
    decoderRegistry: DecoderRegistry;

    /**
     * Serializer Constructor
     *
     * @param {NormalizerRegistry} normalizerRegistry
     * @param {EncoderRegistry} encoderRegistry
     * @param {DecoderRegistry} decoderRegistry
     */
    constructor(normalizerRegistry: NormalizerRegistry, encoderRegistry: EncoderRegistry, decoderRegistry: DecoderRegistry) {
        this.normalizerRegistry = normalizerRegistry || new NormalizerRegistry(new MetadataFactory());
        this.encoderRegistry = encoderRegistry || new EncoderRegistry();
        this.decoderRegistry = decoderRegistry || new DecoderRegistry();
    }

    /**
     * Serialize data into the target format
     *
     * @param {*}      data    Serialization subject
     * @param {string} format  The serialization format to encode into
     * @param {Object} options Additional options passed to the serialization context
     *
     * @returns {string}
     */
    serialize(data: any, format: string, options: Object) {
        const context = new SerializationContext(data, format, options);
        const normalizedData = this.normalizerRegistry.getNormalizer(data, format, context).normalize(data, format, context);

        return this.encoderRegistry.getEncoder(format, context).encode(normalizedData, format, context);
    }

    /**
     * Deserialize string into class from the target format
     *
     * @param {string}   data    Deserialization subject
     * @param {string}   format  The serialization format to decode from
     * @param {Function} cls     The target class to normalize data into
     * @param {Object}   options Additional options passed to the serialization context
     *
     * @returns {*|void}
     */
    deserialize(data: string, format: string, cls: Function, options: Object) {
        const decodedData = this.decoderRegistry.getDecoder(format, options).decode(data, format, options);
        const context = new DeserializationContext(decodedData, format, cls, options);

        return this.normalizerRegistry.getDenormalizer(decodedData, format, cls, context).denormalize(decodedData, format, cls, context);
    }
}

export default Serializer;