import assert from 'assert';
import DefaultNormalizer from '../../src/normalizer/DefaultNormalizer';
import MetadataAwareNormalizer from '../../src/normalizer/MetadataAwareNormalizer';
import NormalizerRegistry from '../../src/normalizer/NormalizerRegistry';
import MetadataFactory from '../../src/metadata/MetadataFactory';
import DecoratorRegistry from '../../src/decorators/DecoratorRegistry';
import UndecoratedModel from '../_fixtures/models/UndecoratedModel';
import TypeDecoratedModel from '../_fixtures/models/TypeDecoratedModel';
import DeserializationContext from '../../src/DeserializationContext';
import SerializationContext from '../../src/SerializationContext';
import NestedModel from '../_fixtures/models/NestedModel';
import { Type } from '../../src/decorators/Type';

describe('MetadataAwareNormalizer', () => {
    const normalizer = new MetadataAwareNormalizer();
    const decoratorRegistry = new DecoratorRegistry();
    const metadataFactory = new MetadataFactory(decoratorRegistry);
    const normalizerRegistry = new NormalizerRegistry(metadataFactory);

    decoratorRegistry.addDecorator(new Type());
    normalizerRegistry.addNormalizer(new DefaultNormalizer());
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
        it('should throw an exception when attempting to normalize invalid data', () => {
            assert.throws(() => normalizer.normalize(null, 'json'));
            assert.throws(() => normalizer.normalize(undefined, 'json'));
        });
        it('should return properly normalized data for decorated classes', () => {
            const data = new TypeDecoratedModel();
            const context = new SerializationContext(data, 'json');

            const result = normalizer.normalize(data, 'json', context);

            assert(result instanceof Object);
            assert(!(result instanceof TypeDecoratedModel));
            assert.strictEqual(result.propA, true);
            assert.strictEqual(result.propB, 123);
            assert.strictEqual(result.propC, 'propC');
        });
        it('should return properly normalized data for decorated classes if no context provided', () => {
            const data = new TypeDecoratedModel();

            const result = normalizer.normalize(data, 'json');

            assert(result instanceof Object);
            assert(!(result instanceof TypeDecoratedModel));
            assert.strictEqual(result.propA, true);
            assert.strictEqual(result.propB, 123);
            assert.strictEqual(result.propC, 'propC');
        });
        it('should still return properly normalized data for non-decorated classes', () => {
            const data = new UndecoratedModel();
            const context = new SerializationContext(data, 'json');

            // normally this would never happen because model doesn't pass supportsNormalization()
            const result = normalizer.normalize(data, 'json', context);

            assert(result instanceof Object);
            assert(!(result instanceof UndecoratedModel));
            assert.strictEqual(result.propA, true);
            assert.strictEqual(result.propB, 123);
            assert.strictEqual(result.propC, 'propC');
        });
        it('should still return properly normalized data for standard object', () => {
            const data = { propA: false, propB: 4, propC: 'foo' };
            const context = new SerializationContext(data, 'json');

            // normally this would never happen because model doesn't pass supportsNormalization()
            const result = normalizer.normalize(data, 'json', context);

            assert(result instanceof Object);
            assert.strictEqual(result.propA, false);
            assert.strictEqual(result.propB, 4);
            assert.strictEqual(result.propC, 'foo');
        });
        it('should return properly normalized data for nested class object', () => {
            const data = new NestedModel();
            const context = new SerializationContext(data, 'json');

            const result = normalizer.normalize(data, 'json', context);

            assert(result instanceof Object);
            assert(!(result instanceof NestedModel));
            assert.strictEqual(result.propA, 'propA');

            assert(result.propB instanceof Object);
            assert(!(result.propB instanceof UndecoratedModel));
            assert.strictEqual(result.propB.propA, true);
            assert.strictEqual(result.propB.propB, 123);
            assert.strictEqual(result.propB.propC, 'propC');

            assert(result.propC instanceof Object);
            assert(!(result.propC instanceof TypeDecoratedModel));
            assert.strictEqual(result.propC.propA, true);
            assert.strictEqual(result.propC.propB, 123);
            assert.strictEqual(result.propC.propC, 'propC');
        });
    });

    describe('#denormalize', () => {
        it('should throw an error when attempting to denormalize into non-constructable cls', () => {
            assert.throws(() => normalizer.denormalize({}, 'json'));
            assert.throws(() => normalizer.denormalize({}, 'json', null));
            assert.throws(() => normalizer.denormalize({}, 'json', undefined));
            assert.throws(() => normalizer.denormalize({}, 'json', Symbol));
        });
        it('should should return properly denormalized TypeDecoratedModel', () => {
            const data = { propA: false, propB: 4, propC: 'foo' };
            const context = new DeserializationContext(data, 'json');

            const result = normalizer.denormalize(data, 'json', TypeDecoratedModel, context);

            assert(result instanceof TypeDecoratedModel);
            assert.strictEqual(result.propA, false);
            assert.strictEqual(result.propB, 4);
            assert.strictEqual(result.propC, 'foo');
        });
        it('should should return properly denormalized TypeDecoratedModel if no context provided', () => {
            const data = { propA: false, propB: 4, propC: 'foo' };

            const result = normalizer.denormalize(data, 'json', TypeDecoratedModel);

            assert(result instanceof TypeDecoratedModel);
            assert.strictEqual(result.propA, false);
            assert.strictEqual(result.propB, 4);
            assert.strictEqual(result.propC, 'foo');
        });
        it('should still return properly denormalized UndecoratedModel if invoked manually', () => {
            const data = { propA: false, propB: 4, propC: 'foo' };
            const context = new DeserializationContext(data, 'json');

            // normally this would never happen because model doesn't pass supportsDenormalization()
            const result = normalizer.denormalize(data, 'json', UndecoratedModel, context);

            assert(result instanceof UndecoratedModel);
            assert.strictEqual(result.propA, false);
            assert.strictEqual(result.propB, 4);
            assert.strictEqual(result.propC, 'foo');
        });
        it('should return properly denormalized data for nested class object', () => {
            const propB = { propA: false, propB: 321, propC: 'foo' };
            const propC = { propA: 'true', propB: '123', propC: 'bar' };
            const data = { propA: 123, propB, propC};
            const context = new DeserializationContext(data, 'json');

            const result = normalizer.denormalize(data, 'json', NestedModel, context);

            assert(result instanceof NestedModel);
            assert.strictEqual(result.propA, 123);

            // was not decorated
            assert(result.propB instanceof Object);
            assert(!(result.propB instanceof UndecoratedModel));
            assert.strictEqual(result.propB.propA, false);
            assert.strictEqual(result.propB.propB, 321);
            assert.strictEqual(result.propB.propC, 'foo');

            // was decorated with class type
            assert(result.propC instanceof TypeDecoratedModel);
            assert.strictEqual(result.propC.propA, true);
            assert.strictEqual(result.propC.propB, 123);
            assert.strictEqual(result.propC.propC, 'bar');
        });
    });

    describe('#supportsNormalization', () => {
        it('should return false for built-in data types', () => {
            assert.equal(normalizer.supportsNormalization(null), false);
            assert.equal(normalizer.supportsNormalization(undefined), false);
            assert.equal(normalizer.supportsNormalization(true), false);
            assert.equal(normalizer.supportsNormalization("foo"), false);
            assert.equal(normalizer.supportsNormalization(123), false);
            assert.equal(normalizer.supportsNormalization(123.45), false);
            assert.equal(normalizer.supportsNormalization([]), false);
            assert.equal(normalizer.supportsNormalization({}), false);
        });
        it('should return false for data with no class metadata', () => {
            assert.equal(normalizer.supportsNormalization(new class Foo {}), false);
            assert.equal(normalizer.supportsNormalization(new UndecoratedModel()), false);
        });
        it('should return true for data with class metadata', () => {
            assert.equal(normalizer.supportsNormalization(new TypeDecoratedModel()), true);
        });
    });

    describe('#supportsDenormalization', () => {
        it('should return false for built-in data types', () => {
            assert.equal(normalizer.supportsDenormalization(null, 'json'), false);
            assert.equal(normalizer.supportsDenormalization(undefined, 'json'), false);
            assert.equal(normalizer.supportsDenormalization(true, 'json', Boolean), false);
            assert.equal(normalizer.supportsDenormalization('foo', 'json', String), false);
            assert.equal(normalizer.supportsDenormalization(123, 'json', Number), false);
            assert.equal(normalizer.supportsDenormalization(123.45, 'json', Number), false);
            assert.equal(normalizer.supportsDenormalization([], 'json', Array), false);
            assert.equal(normalizer.supportsDenormalization({}, 'json', Object), false);
        });
        it('should return false for classes with no class metadata', () => {
            assert.equal(normalizer.supportsDenormalization({}, 'json', new class Foo {}), false);
            assert.equal(normalizer.supportsDenormalization({}, 'json', UndecoratedModel), false);
        });
        it('should return true for classes with class metadata', () => {
            assert.equal(normalizer.supportsDenormalization({}, 'json', TypeDecoratedModel), true);
        });
    });
});