import assert from 'assert';
import NormalizerRegistry from '../../src/normalizer/NormalizerRegistry';
import MetadataFactory from '../../src/metadata/MetadataFactory';
import DefaultNormalizer from "../../src/normalizer/DefaultNormalizer";
import NormalizerInvalidException from '../../src/exception/NormalizerInvalidException';
import NormalizerNotFoundException from '../../src/exception/NormalizerNotFoundException';

describe('NormalizerRegistry', () => {
    const normalizerRegistry = new NormalizerRegistry();

    it('should be an instance of DefaultNormalizer', () => {
        assert.equal(normalizerRegistry instanceof NormalizerRegistry, true);
    });

    describe('#constructor', () => {
        const metadataFactory = new MetadataFactory();
        const normalizerRegistry = new NormalizerRegistry(metadataFactory);

        it('should contain a reference to the metadataFactory', () => {
            assert.strictEqual(normalizerRegistry.metadataFactory, metadataFactory);
        });
    });

    describe('#addNormalizer', () => {
        const metadataFactory = new MetadataFactory();
        const normalizerRegistry = new NormalizerRegistry(metadataFactory);

        it('should throw an error when adding something which doesn\'t extend AbstractNormalizer', () => {
            assert.throws(() => normalizerRegistry.addNormalizer(), NormalizerInvalidException);
            assert.throws(() => normalizerRegistry.addNormalizer({}), NormalizerInvalidException);
        });
        it('should add the normalizer to the normalizerRegistry', () => {
            const normalizer = new DefaultNormalizer();

            normalizerRegistry.addNormalizer(normalizer);

            assert.equal(normalizerRegistry.normalizers.length, 1);
            assert.strictEqual(normalizerRegistry.normalizers[0], normalizer);
        });
    });

    describe('#getNormalizer', () => {
        const normalizer = new DefaultNormalizer();
        const metadataFactory = new MetadataFactory();
        const normalizerRegistry = new NormalizerRegistry(metadataFactory);

        it('should throw an exception if no normalizer can be matched', () => {
            assert.throws(() => normalizerRegistry.getNormalizer({}, 'json'), NormalizerNotFoundException);
        });

        it('should return the default normalizer since no others have been added', () => {
            normalizerRegistry.addNormalizer(normalizer);
            assert.strictEqual(normalizerRegistry.getNormalizer({}, 'json'), normalizer);
        });

        // @TODO: add more normalizers
        it('should allow me to add additional normalizers to the registry');
        it('should return the INSERT_NAME normalizer matching the required data/format type');
        it('should return the default normalizer since required data/format type couldn\'t be matched');
    });

    describe('#getDenormalizer', () => {
        const normalizer = new DefaultNormalizer();
        const metadataFactory = new MetadataFactory();
        const normalizerRegistry = new NormalizerRegistry(metadataFactory);

        it('should throw an exception if no normalizer can be matched', () => {
            assert.throws(() => normalizerRegistry.getDenormalizer({}, 'json', Object), NormalizerNotFoundException);
        });

        it('should return the default normalizer since no others have been added', () => {
            normalizerRegistry.addNormalizer(normalizer);
            assert.strictEqual(normalizerRegistry.getDenormalizer({}, 'json', Object), normalizer);
        });

        // @TODO: add more normalizers
        it('should allow me to add additional normalizers to the registry');
        it('should return the INSERT_NAME normalizer matching the required data/format type');
        it('should return the default normalizer since required data/format type couldn\'t be matched');
    });
});