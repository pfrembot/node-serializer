import assert from 'assert';
import AbstractNormalizer from '../../src/normalizer/AbstractNormalizer';
import NormalizerRegistry from '../../src/normalizer/NormalizerRegistry';
import MetadataFactory from '../../src/metadata/MetadataFactory';
import DecoratorRegistry from '../../src/decorators/DecoratorRegistry';
import MethodNotImplementedException from '../../src/exception/MethodNotImplementedException';

describe('AbstractNormalizer', () => {
    const normalizer = new AbstractNormalizer();

    it('should be an instance of AbstractNormalizer', () => {
        assert.equal(normalizer instanceof AbstractNormalizer, true);
    });

    describe('#get metadataFactory', () => {
        const normalizer = new AbstractNormalizer();
        const metadataFactory = new MetadataFactory(new DecoratorRegistry());

        it('should throw exception if metadataFactory not set', () => {
            assert.throws(() => { normalizer.metadataFactory }, Error);
        });
        it('should return an instance of MetadataFactory', () => {
            normalizer.metadataFactory = metadataFactory;

            assert.equal(normalizer.metadataFactory instanceof MetadataFactory, true);
            assert.strictEqual(normalizer.metadataFactory, metadataFactory)
        });
    });

    describe('#set metadataFactory', () => {
        const normalizer = new AbstractNormalizer();
        const metadataFactory = new MetadataFactory(new DecoratorRegistry());

        it('should set metadataFactory without error', () => {
            assert.doesNotThrow(() => normalizer.metadataFactory = metadataFactory);
            assert.strictEqual(normalizer._metadataFactory, metadataFactory);
        });
    });

    describe('#get normalizerRegistry', () => {
        const normalizer = new AbstractNormalizer();
        const normalizerRegistry = new NormalizerRegistry();

        it('should throw exception if normalizerRegistry not set', () => {
            assert.throws(() => { normalizer.normalizerRegistry }, Error);
        });
        it('should return an instance of NormalizerRegistry', () => {
            normalizer.normalizerRegistry = normalizerRegistry;

            assert.equal(normalizer.normalizerRegistry instanceof NormalizerRegistry, true);
            assert.strictEqual(normalizer.normalizerRegistry, normalizerRegistry)
        });
    });

    describe('#set normalizerRegistry', () => {
        const normalizer = new AbstractNormalizer();
        const normalizerRegistry = new NormalizerRegistry();

        it('should set normalizerRegistry without error', () => {
            assert.doesNotThrow(() => normalizer.normalizerRegistry = normalizerRegistry);
            assert.strictEqual(normalizer._normalizerRegistry, normalizerRegistry);
        });
    });

    describe('#normalize', () => {
        const normalizer = new AbstractNormalizer();

        it('should throw an error since this method should be overridden by concrete class', () => {
            assert.throws(() => normalizer.normalize(), MethodNotImplementedException);
        });
    });

    describe('#denormalize', () => {
        const normalizer = new AbstractNormalizer();

        it('should throw an error since this method should be overridden by concrete class', () => {
            assert.throws(() => normalizer.denormalize(), MethodNotImplementedException);
        });
    });

    describe('#supportsNormalization', () => {
        const normalizer = new AbstractNormalizer();

        it('should always return false since this method should be overridden by concrete class', () => {
            assert.equal(normalizer.supportsNormalization(), false);
        });
    });

    describe('#supportsDenormalization', () => {
        const normalizer = new AbstractNormalizer();

        it('should always return false since this method should be overridden by concrete class', () => {
            assert.equal(normalizer.supportsDenormalization(), false);
        });
    });
});