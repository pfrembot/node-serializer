// @flow
import { NormalizerInterface } from "./NormalizerInterface";
import { DenormalizerInterface } from "./DenormalizerInterface";
import MetadataFactory from '../metadata/MetadataFactory';
import NormalizerRegistry from './NormalizerRegistry';
import MethodNotImplementedException from '../exception/MethodNotImplementedException';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';

/**
 * Class AbstractNormalizer
 *
 * @class AbstractNormalizer
 */
class AbstractNormalizer implements NormalizerInterface, DenormalizerInterface {
    /**
     * @type {MetadataFactory}
     */
    _metadataFactory: MetadataFactory;

    /**
     * @type {NormalizerRegistry}
     */
    _normalizerRegistry: NormalizerRegistry;

    /**
     * Return metadata factory
     *
     * This is expected to have been set when the normalizer was added to the
     * normalizer registry {@see NormalizerRegistry.addNormalizer()} and will throw an exception when
     * attempting to read propert on un-registered normalizers
     *
     * @returns {MetadataFactory}
     *
     * @throws Error
     */
    get metadataFactory(): MetadataFactory {
        if (!this._metadataFactory) {
            throw Error(`Metadata factory was not set. Are you trying to use this outside the NormalizerRegistry?`);
        }

        return this._metadataFactory;
    }

    /**
     * Set metadata factory
     *
     * @param {MetadataFactory} metadataFactory
     */
    set metadataFactory(metadataFactory: MetadataFactory) {
        this._metadataFactory = metadataFactory;
    }

    /**
     * Return parent normalizer registry
     *
     * This is expected to have been set when the normalizer was added to the
     * normalizer registry {@see NormalizerRegistry.addNormalizer()} and will throw an exception when
     * attempting to read property on un-registered normalizers
     *
     * @returns {NormalizerRegistry}
     *
     * @throws Error
     */
    get normalizerRegistry(): NormalizerRegistry {
        if (!this._normalizerRegistry) {
            throw Error(`Normalizer registry was not set. Are you trying to use this outside the NormalizerRegistry?`);
        }

        return this._normalizerRegistry;
    }

    /**
     * Set parent normalizer registry
     *
     * @param {NormalizerRegistry} normalizerRegistry
     */
    set normalizerRegistry(normalizerRegistry: NormalizerRegistry) {
        this._normalizerRegistry = normalizerRegistry;
    }

    /** @inheritDoc */
    normalize(data: any, format: string, context: SerializationContext) {
        throw new MethodNotImplementedException(this.constructor.name);
    }

    /** @inheritDoc */
    denormalize(data: any, format: string, cls: Function, context: DeserializationContext) {
        throw new MethodNotImplementedException(this.constructor.name);
    }

    /** @inheritDoc */
    supportsNormalization(data: any, format: string, context: SerializationContext) {
        return false;
    }

    /** @inheritDoc */
    supportsDenormalization(data: any, format: string, cls: Function, context: DeserializationContext) {
        return false;
    }
}

export default AbstractNormalizer;
