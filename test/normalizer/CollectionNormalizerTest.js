import assert from 'assert';
import DefaultNormalizer from '../../src/normalizer/DefaultNormalizer';
import CollectionNormalizer from '../../src/normalizer/CollectionNormalizer';
import NormalizerRegistry from '../../src/normalizer/NormalizerRegistry';
import MetadataFactory from '../../src/metadata/MetadataFactory';
import DecoratorRegistry from '../../src/decorators/DecoratorRegistry';
import MethodNotImplementedException from '../../src/exception/MethodNotImplementedException';
import DenormalizationException from '../../src/exception/DenormalizationException';
import UndecoratedModel from '../_fixtures/models/UndecoratedModel';
import { ListOf, MapOf } from '../../src/types';

describe('CollectionNormalizer', () => {
    const normalizer = new CollectionNormalizer();
    const decoratorRegistry = new DecoratorRegistry();
    const metadataFactory = new MetadataFactory(decoratorRegistry);
    const normalizerRegistry = new NormalizerRegistry(metadataFactory);

    normalizerRegistry.addNormalizer(new DefaultNormalizer());
    normalizerRegistry.addNormalizer(normalizer);

    it('should be an instance of CollectionNormalizer', () => {
        assert(normalizer instanceof CollectionNormalizer);
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
        it('should throw an exception since it does not support normalization', () => {
            assert.throws(() => normalizer.normalize(), MethodNotImplementedException);
        });
    });

    describe('#denormalize()', () => {
        it('should throw an exception when attempting to denormalize invalid types of data', () => {
            assert.throws(() => normalizer.denormalize(), DenormalizationException);
            assert.throws(() => normalizer.denormalize(null, 'json', ListOf()), DenormalizationException);
            assert.throws(() => normalizer.denormalize(123, 'json', ListOf()), DenormalizationException);
            assert.throws(() => normalizer.denormalize("test", 'json', ListOf()), DenormalizationException);
            assert.throws(() => normalizer.denormalize(null, 'json', MapOf()), DenormalizationException);
            assert.throws(() => normalizer.denormalize(123, 'json', MapOf()), DenormalizationException);
            assert.throws(() => normalizer.denormalize("test", 'json', MapOf()), DenormalizationException);
        });
        it('should throw an exception when attempting to denormalize invalid constructor types', () => {
            assert.throws(() => normalizer.denormalize([]), DenormalizationException);
            assert.throws(() => normalizer.denormalize({}), DenormalizationException);
            assert.throws(() => normalizer.denormalize([], 'json'), DenormalizationException);
            assert.throws(() => normalizer.denormalize({}, 'json'), DenormalizationException);
            assert.throws(() => normalizer.denormalize([], 'json', Array), DenormalizationException);
            assert.throws(() => normalizer.denormalize({}, 'json', Object), DenormalizationException);
        });
        it('should return normalized values as an array when denormalizing an array using ListOf type', () => {
            const data = [{ propA: false, propB: 321, propC: 'foo' }, { propA: false, propB: 567, propC: 'bar' }];
            const result = normalizer.denormalize(data, 'json', ListOf(UndecoratedModel));

            assert(result instanceof Array);
            assert.strictEqual(result.length, 2);
            assert(result[0] instanceof UndecoratedModel);
            assert(result[1] instanceof UndecoratedModel);
            assert.deepEqual(result[0], { propA: false, propB: 321, propC: 'foo' });
            assert.deepEqual(result[1], { propA: false, propB: 567, propC: 'bar' });
        });
        it('should return normalized values as an array when denormalizing an object using ListOf type', () => {
            const data = { one: { propA: false, propB: 321, propC: 'foo' }, two: { propA: false, propB: 567, propC: 'bar' }};
            const result = normalizer.denormalize(data, 'json', ListOf(UndecoratedModel));

            assert(result instanceof Array);
            assert.strictEqual(result.length, 2);
            assert(result[0] instanceof UndecoratedModel);
            assert(result[1] instanceof UndecoratedModel);
            assert.deepEqual(result[0], { propA: false, propB: 321, propC: 'foo' });
            assert.deepEqual(result[1], { propA: false, propB: 567, propC: 'bar' });
        });
        it('should return normalized values as an object when denormalizing an array using MapOf type', () => {
            const data = [{ propA: false, propB: 321, propC: 'foo' }, { propA: false, propB: 567, propC: 'bar' }];
            const result = normalizer.denormalize(data, 'json', MapOf(UndecoratedModel));

            assert(result instanceof Object);
            assert.ok(result['0']);
            assert.ok(result['1']);
            assert(result['0'] instanceof UndecoratedModel);
            assert(result['1'] instanceof UndecoratedModel);
            assert.deepEqual(result['0'], { propA: false, propB: 321, propC: 'foo' });
            assert.deepEqual(result['1'], { propA: false, propB: 567, propC: 'bar' });
        });
        it('should return normalized values as an object when denormalizing an object using MapOf type', () => {
            const data = { one: { propA: false, propB: 321, propC: 'foo' }, two: { propA: false, propB: 567, propC: 'bar' }};
            const result = normalizer.denormalize(data, 'json', MapOf(UndecoratedModel));

            assert(result instanceof Object);
            assert.ok(result.one);
            assert.ok(result.two);
            assert(result.one instanceof UndecoratedModel);
            assert(result.two instanceof UndecoratedModel);
            assert.deepEqual(result.one, { propA: false, propB: 321, propC: 'foo' });
            assert.deepEqual(result.two, { propA: false, propB: 567, propC: 'bar' });
        });
    });

    describe('#supportsNormalization()', () => {
        it('should always return false (does not support normalization)', () => {
            assert.strictEqual(normalizer.supportsNormalization(), false);
            assert.strictEqual(normalizer.supportsNormalization(null, 'json'), false);
            assert.strictEqual(normalizer.supportsNormalization(true, 'json', Boolean), false);
            assert.strictEqual(normalizer.supportsNormalization("foo", 'json', String), false);
            assert.strictEqual(normalizer.supportsNormalization(123, 'json', Number), false);
            assert.strictEqual(normalizer.supportsNormalization(123.45, 'json', Number), false);
            assert.strictEqual(normalizer.supportsNormalization([], 'json', Array), false);
            assert.strictEqual(normalizer.supportsNormalization({}, 'json', Object), false);
        });
    });

    describe('#supportsDenormalization()', () => {
        it('should return true when denormalizing supported types and data', () => {
            assert.strictEqual(normalizer.supportsDenormalization([], 'json', ListOf()), true);
            assert.strictEqual(normalizer.supportsDenormalization({}, 'json', ListOf()), true);
            assert.strictEqual(normalizer.supportsDenormalization([], 'json', MapOf()), true);
            assert.strictEqual(normalizer.supportsDenormalization({}, 'json', MapOf()), true);
        });
        it('should return false on all other types', () => {
            assert.strictEqual(normalizer.supportsDenormalization(), false);
            assert.strictEqual(normalizer.supportsDenormalization(null, 'json'), false);
            assert.strictEqual(normalizer.supportsDenormalization(true, 'json', Boolean), false);
            assert.strictEqual(normalizer.supportsDenormalization("foo", 'json', String), false);
            assert.strictEqual(normalizer.supportsDenormalization(123, 'json', Number), false);
            assert.strictEqual(normalizer.supportsDenormalization(123.45, 'json', Number), false);
            assert.strictEqual(normalizer.supportsDenormalization([], 'json', Array), false);
            assert.strictEqual(normalizer.supportsDenormalization({}, 'json', Object), false);
        });
    });
});