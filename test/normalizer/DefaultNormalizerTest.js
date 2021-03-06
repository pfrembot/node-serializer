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
        assert(normalizer instanceof DefaultNormalizer);
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

    describe('#normalize()', () => {
        it('should should return properly normalized void', () => {
            assert.strictEqual(normalizer.normalize(void 0, 'json'), void 0);
        });
        it('should should return properly normalized null', () => {
            assert.strictEqual(normalizer.normalize(null, 'json'), null);
        });
        it('should should return properly normalized boolean', () => {
            assert.strictEqual(normalizer.normalize(true, 'json'), true);
        });
        it('should should return properly normalized integer', () => {
            assert.strictEqual(normalizer.normalize(123, 'json'), 123);
        });
        it('should should return properly normalized float', () => {
            assert.strictEqual(normalizer.normalize(123.45, 'json'), 123.45);
        });
        it('should should return properly normalized string', () => {
            assert.strictEqual(normalizer.normalize("foo", 'json'), "foo");
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

    describe('#denormalize()', () => {
        it('should should return properly denormalized void', () => {
            assert.strictEqual(normalizer.denormalize(void 0, 'json'), void 0);
        });
        it('should should return properly denormalized null', () => {
            assert.strictEqual(normalizer.denormalize(null, 'json', null), null);
        });
        it('should should return properly denormalized boolean', () => {
            assert.strictEqual(normalizer.denormalize(true, 'json', Boolean), true);
        });
        it('should should return properly denormalized integer', () => {
            assert.strictEqual(normalizer.denormalize(123, 'json', Number), 123);
        });
        it('should should return properly denormalized float', () => {
            assert.strictEqual(normalizer.denormalize(123.45, 'json', Number), 123.45);
        });
        it('should should return properly denormalized string', () => {
            assert.strictEqual(normalizer.denormalize("foo", 'json', String), "foo");
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

    describe('#supportsNormalization()', () => {
        it('should always return true as the final fallback normalizer', () => {
            assert.strictEqual(normalizer.supportsNormalization(), true);
            assert.strictEqual(normalizer.supportsNormalization(null, 'json'), true);
            assert.strictEqual(normalizer.supportsNormalization(true, 'json'), true);
            assert.strictEqual(normalizer.supportsNormalization("foo", 'json'), true);
            assert.strictEqual(normalizer.supportsNormalization(123, 'json'), true);
            assert.strictEqual(normalizer.supportsNormalization(123.45, 'json'), true);
            assert.strictEqual(normalizer.supportsNormalization([], 'json'), true);
            assert.strictEqual(normalizer.supportsNormalization({}, 'json'), true);
        });
    });

    describe('#supportsDenormalization()', () => {
        it('should always return true as the final fallback normalizer', () => {
            assert.strictEqual(normalizer.supportsDenormalization(), true);
            assert.strictEqual(normalizer.supportsDenormalization(null, 'json'), true);
            assert.strictEqual(normalizer.supportsDenormalization(true, 'json', Boolean), true);
            assert.strictEqual(normalizer.supportsDenormalization("foo", 'json', String), true);
            assert.strictEqual(normalizer.supportsDenormalization(123, 'json', Number), true);
            assert.strictEqual(normalizer.supportsDenormalization(123.45, 'json', Number), true);
            assert.strictEqual(normalizer.supportsDenormalization([], 'json', Array), true);
            assert.strictEqual(normalizer.supportsDenormalization({}, 'json', Object), true);
        });
    });
});