import assert from 'assert';
import MetadataAwareNormalizer from '../../src/normalizer/MetadataAwareNormalizer';
import NormalizerRegistry from '../../src/normalizer/NormalizerRegistry';
import MetadataFactory from '../../src/metadata/MetadataFactory';
import DecoratorRegistry from '../../src/decorators/DecoratorRegistry';

describe('MetadataAwareNormalizer', () => {
    const normalizer = new MetadataAwareNormalizer();
    const decoratorRegistry = new DecoratorRegistry();
    const metadataFactory = new MetadataFactory(decoratorRegistry);
    const normalizerRegistry = new NormalizerRegistry(metadataFactory);

    normalizerRegistry.addNormalizer(normalizer);

    it('should be an instance of MetadataAwareNormalizer', () => {
        assert.equal(normalizer instanceof MetadataAwareNormalizer, true);
    });
    it('should contain a reference to the metadataFactory', () => {
        assert.strictEqual(normalizer.metadataFactory, metadataFactory);
    });
    it('should contain a reference to the normalizerRegistry', () => {
        assert.strictEqual(normalizer.normalizerRegistry, normalizerRegistry);
    });
    it('should contain a reference to the normalizerRegistry', () => {
        assert.strictEqual(normalizer.decoratorRegistry, decoratorRegistry);
    });

    describe('#normalize', () => {
        it('should have some tests');
    });

    describe('#denormalize', () => {
        it('should have some tests');
    });

    describe('#supportsNormalization', () => {
        it('should have some tests');
    });

    describe('#supportsDenormalization', () => {
        it('should have some tests');
    });
});