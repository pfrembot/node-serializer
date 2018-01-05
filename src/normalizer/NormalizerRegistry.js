// @flow
import AbstractNormalizer from './AbstractNormalizer';
import MetadataFactory from '../metadata/MetadataFactory';
import NormalizerNotFoundException from '../exception/NormalizerNotFoundException';
import NormalizerInvalidException from '../exception/NormalizerInvalidException';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';

/**
 * Normalizer interface storage
 *
 * This class is used to register new normalizers to be used during serialization
 *
 * @see {Serializer.serialize()} for implementation
 * @class NormalizerRegistry
 */
class NormalizerRegistry {
    /**
     * Normalizer Storage
     * @type {NormalizerInterface[]}
     */
    normalizers = [];

    /**
     * Metadata Storage
     * @type {MetadataFactory}
     */
    metadataFactory: MetadataFactory;

    /**
     * Constructor
     *
     * @param {MetadataFactory} metadataFactory
     */
    constructor(metadataFactory: MetadataFactory) {
        this.metadataFactory = metadataFactory;
    }

    /**
     * Push a new normalizer to the top of the stack
     *
     * This is to ensure that new or custom normalizers added will override any default ones
     * that have been added by this library when {@see NormalizerRegistry.getNormalizer()} is called.
     *
     * @param {AbstractNormalizer} normalizer
     * @return void
     *
     * @throws NormalizerInvalidException
     */
    addNormalizer(normalizer: AbstractNormalizer) {
        if (!(normalizer instanceof AbstractNormalizer)) {
            throw new NormalizerInvalidException(normalizer);
        }

        normalizer.metadataFactory = this.metadataFactory;
        normalizer.normalizerRegistry = this;

        this.normalizers.unshift(normalizer);
    }

    /**
     * Search the registry for a compatible normalizer to use with
     * the provided data and format
     *
     * @param {*} data
     * @param {String} format
     * @param {SerializationContext} context
     *
     * @returns {NormalizerInterface}
     *
     * @throws NormalizerNotFoundException
     */
    getNormalizer(data: any, format: string, context: SerializationContext) {
        for (const normalizer of this.normalizers) {
            if (normalizer.supportsNormalization(data, format, context)) {
                return normalizer;
            }
        }

        throw new NormalizerNotFoundException(format);
    }

    /**
     * Search the registry for a compatible denormalizer to use with
     * the provided data, format, and target class
     *
     * @param {*} data
     * @param {String} format
     * @param {Function} cls
     * @param {DeserializationContext} context
     *
     * @returns {NormalizerInterface}
     *
     * @throws NormalizerNotFoundException
     */
    getDenormalizer(data: any, format: string, cls: Function, context: DeserializationContext) {
        for (const normalizer of this.normalizers) {
            if (normalizer.supportsDenormalization(data, format, cls, context)) {
                return normalizer;
            }
        }

        throw new NormalizerNotFoundException(format, cls);
    }
}

export default NormalizerRegistry;
