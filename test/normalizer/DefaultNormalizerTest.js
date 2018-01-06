import assert from 'assert';
import DefaultNormalizer from '../../src/normalizer/DefaultNormalizer';
import NormalizerRegistry from '../../src/normalizer/NormalizerRegistry';
import MetadataFactory from '../../src/metadata/MetadataFactory';
import DecoratorRegistry from '../../src/decorators/DecoratorRegistry';

describe('DefaultNormalizer', () => {
    const normalizer = new DefaultNormalizer();
    const decoratorRegistry = new DecoratorRegistry();
    const metadataFactory = new MetadataFactory(decoratorRegistry);
    const normalizerRegistry = new NormalizerRegistry(metadataFactory);

    normalizerRegistry.addNormalizer(normalizer);

    it('should be an instance of DefaultNormalizer', () => {
        assert.equal(normalizer instanceof DefaultNormalizer, true);
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
        it('should should return properly normalized void', () => {
            assert.equal(normalizer.normalize(void 0, 'json'), void 0);
        });
        it('should should return properly normalized null', () => {
            assert.equal(normalizer.normalize(null, 'json'), null);
        });
        it('should should return properly normalized boolean', () => {
            assert.equal(normalizer.normalize(true, 'json'), true);
        });
        it('should should return properly normalized integer', () => {
            assert.equal(normalizer.normalize(123, 'json'), 123);
        });
        it('should should return properly normalized float', () => {
            assert.equal(normalizer.normalize(123.45, 'json'), 123.45);
        });
        it('should should return properly normalized string', () => {
            assert.equal(normalizer.normalize("foo", 'json'), "foo");
        });
        it('should should return properly normalized empty array', () => {
            assert.deepEqual(normalizer.normalize([], 'json'), []);
        });
        it('should should return properly normalized empty object', () => {
            assert.deepEqual(normalizer.normalize({}, 'json'), {});
        });
        it('should should return properly normalized not empty array', () => {
            assert.deepEqual(normalizer.normalize([{ foo: 1 }, { foo: 2 }], 'json'), [{ foo: 1 }, { foo: 2 }]);
        });
        it('should should return properly normalized not empty object', () => {
            assert.deepEqual(normalizer.normalize({ foo: 1, bar: 2, baz: [1, 2, 3]}, 'json'), { foo: 1, bar: 2, baz: [1, 2, 3]});
        });
        it('should throw an exception when encountering an unknown type', () => {
            assert.throws(() => normalizer.normalize(function() {}));
            assert.throws(() => normalizer.normalize(Symbol()));
        });
    });

    describe('#denormalize', () => {
        it('should should return properly denormalized void', () => {
            assert.equal(normalizer.denormalize(void 0, 'json'), void 0);
        });
        it('should should return properly denormalized null', () => {
            assert.equal(normalizer.denormalize(null, 'json', null), null);
        });
        it('should should return properly denormalized boolean', () => {
            assert.equal(normalizer.denormalize(true, 'json', Boolean), true);
        });
        it('should should return properly denormalized integer', () => {
            assert.equal(normalizer.denormalize(123, 'json', Number), 123);
        });
        it('should should return properly denormalized float', () => {
            assert.equal(normalizer.denormalize(123.45, 'json', Number), 123.45);
        });
        it('should should return properly denormalized string', () => {
            assert.equal(normalizer.denormalize("foo", 'json', String), "foo");
        });
        it('should should return properly denormalized empty array', () => {
            assert.deepEqual(normalizer.denormalize([], 'json', Array), []);
        });
        it('should should return properly denormalized empty object', () => {
            assert.deepEqual(normalizer.denormalize({}, 'json', Object), {});
        });
        it('should should return properly denormalized not empty array', () => {
            assert.deepEqual(normalizer.denormalize([{ foo: 1 }, { foo: 2 }], 'json', Array), [{ foo: 1 }, { foo: 2 }]);
        });
        it('should should return properly denormalized not empty object', () => {
            assert.deepEqual(normalizer.denormalize({ foo: 1, bar: 2, baz: [1, 2, 3]}, 'json', Object), { foo: 1, bar: 2, baz: [1, 2, 3]});
        });
        it('should throw an exception when encountering an unknown type', () => {
            assert.throws(() => normalizer.denormalize(function() {}));
            assert.throws(() => normalizer.denormalize(Symbol()));
        });
    });

    describe('#supportsNormalization', () => {
        it('should always return true as the final fallback normalizer', () => {
            assert.equal(normalizer.supportsNormalization(), true);
            assert.equal(normalizer.supportsNormalization(null, 'json'), true);
            assert.equal(normalizer.supportsNormalization(true, 'json'), true);
            assert.equal(normalizer.supportsNormalization("foo", 'json'), true);
            assert.equal(normalizer.supportsNormalization(123, 'json'), true);
            assert.equal(normalizer.supportsNormalization(123.45, 'json'), true);
            assert.equal(normalizer.supportsNormalization([], 'json'), true);
            assert.equal(normalizer.supportsNormalization({}, 'json'), true);
        });
    });

    describe('#supportsDenormalization', () => {
        it('should always return true as the final fallback normalizer', () => {
            assert.equal(normalizer.supportsDenormalization(), true);
            assert.equal(normalizer.supportsDenormalization(null, 'json'), true);
            assert.equal(normalizer.supportsDenormalization(true, 'json', Boolean), true);
            assert.equal(normalizer.supportsDenormalization("foo", 'json', String), true);
            assert.equal(normalizer.supportsDenormalization(123, 'json', Number), true);
            assert.equal(normalizer.supportsDenormalization(123.45, 'json', Number), true);
            assert.equal(normalizer.supportsDenormalization([], 'json', Array), true);
            assert.equal(normalizer.supportsDenormalization({}, 'json', Object), true);
        });
    });
});