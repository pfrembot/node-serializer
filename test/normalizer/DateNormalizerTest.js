import assert from 'assert';
import DefaultNormalizer from '../../src/normalizer/DefaultNormalizer';
import DateNormalizer from '../../src/normalizer/DateNormalizer';
import NormalizerRegistry from '../../src/normalizer/NormalizerRegistry';
import MetadataFactory from '../../src/metadata/MetadataFactory';
import DecoratorRegistry from '../../src/decorators/DecoratorRegistry';
import NormalizationException from '../../src/exception/NormalizationException';
import DenormalizationException from '../../src/exception/DenormalizationException';

describe('DateNormalizer', () => {
    const normalizer = new DateNormalizer();
    const decoratorRegistry = new DecoratorRegistry();
    const metadataFactory = new MetadataFactory(decoratorRegistry);
    const normalizerRegistry = new NormalizerRegistry(metadataFactory);

    normalizerRegistry.addNormalizer(new DefaultNormalizer());
    normalizerRegistry.addNormalizer(normalizer);

    it('should be an instance of DateNormalizer', () => {
        assert(normalizer instanceof DateNormalizer);
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
        it('should throw an exception when attempting to normalize data that is not an instance of Date', () => {
            assert.throws(() => normalizer.normalize(), NormalizationException);
            assert.throws(() => normalizer.normalize(null), NormalizationException);
            assert.throws(() => normalizer.normalize(undefined), NormalizationException);
            assert.throws(() => normalizer.normalize(true), NormalizationException);
            assert.throws(() => normalizer.normalize(123), NormalizationException);
            assert.throws(() => normalizer.normalize('foo'), NormalizationException);
            assert.throws(() => normalizer.normalize({}), NormalizationException);
            assert.throws(() => normalizer.normalize([]), NormalizationException);
        });
        it('should return a date string when normalizing an instance of Date', () => {
            const date = new Date();

            assert.strictEqual(normalizer.normalize(date), date.toString());
        });
    });

    describe('#denormalize()', () => {
        it('should throw an exception when attempting to denormalize invalid types of data', () => {
            assert.throws(() => normalizer.denormalize(), DenormalizationException);
            assert.throws(() => normalizer.denormalize(null, 'json', Date), DenormalizationException);
            assert.throws(() => normalizer.denormalize(undefined, 'json', Date), DenormalizationException);
            assert.throws(() => normalizer.denormalize(true, 'json', Date), DenormalizationException);
            assert.throws(() => normalizer.denormalize([], 'json', Date), DenormalizationException);
            assert.throws(() => normalizer.denormalize({}, 'json', Date), DenormalizationException);
        });
        it('should not throw an exception when attempting to denormalize valid types of data', () => {
            assert.doesNotThrow(() => normalizer.denormalize('Wed Jan 10 2018 19:51:15 GMT-0600 (CST)', 'json', Date), DenormalizationException);
            assert.doesNotThrow(() => normalizer.denormalize(123, 'json', Date), DenormalizationException);
            assert.doesNotThrow(() => normalizer.denormalize(NaN, 'json', Date), DenormalizationException);
        });
        it('should throw an exception when attempting to denormalize invalid constructor types', () => {
            assert.throws(() => normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json'), DenormalizationException);
            assert.throws(() => normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', null), DenormalizationException);
            assert.throws(() => normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', undefined), DenormalizationException);
            assert.throws(() => normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Number), DenormalizationException);
            assert.throws(() => normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Boolean), DenormalizationException);
            assert.throws(() => normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', String), DenormalizationException);
            assert.throws(() => normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Array), DenormalizationException);
            assert.throws(() => normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Object), DenormalizationException);
        });
        it('should return an instance of Date when deserializing a datetime string', () => {
            assert(normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Date) instanceof Date);
        });
        it('should return an instance of Date when deserializing a epoch timestamp', () => {
            assert(normalizer.denormalize(1523822960410, 'json', Date) instanceof Date);
        });
        it('should return a correct Date when attempting to deserialize datetime strings', () => {
            assert.deepEqual(normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Date), new Date("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)"));
            assert.deepEqual(normalizer.denormalize("Wed Jan 10 2018 19:51:15 GMT-0600", 'json', Date), new Date("Wed Jan 10 2018 19:51:15 GMT-0600"));
            assert.deepEqual(normalizer.denormalize("Wed Jan 10 2018 19:51:15", 'json', Date), new Date("Wed Jan 10 2018 19:51:15"));
            assert.deepEqual(normalizer.denormalize("Wed Jan 10 2018", 'json', Date), new Date("Wed Jan 10 2018"));
        });
        it('should return a correct Date when attempting to deserialize epoch timestamps', () => {
            assert.deepEqual(normalizer.denormalize(1523822960410, 'json', Date), new Date(1523822960410));
            assert.deepEqual(normalizer.denormalize(0, 'json', Date), new Date(0));
        });
        it('should return null when attempting to deserialize invalid date values', () => {
            assert.strictEqual(normalizer.denormalize(NaN, 'json', Date), null);
            assert.strictEqual(normalizer.denormalize('', 'json', Date), null);
        });
    });

    describe('#supportsNormalization()', () => {
        it('should return false when normalizing unsupported data types', () => {
            assert.strictEqual(normalizer.supportsNormalization(), false);
            assert.strictEqual(normalizer.supportsNormalization(null), false);
            assert.strictEqual(normalizer.supportsNormalization(undefined), false);
            assert.strictEqual(normalizer.supportsNormalization(true), false);
            assert.strictEqual(normalizer.supportsNormalization(123), false);
            assert.strictEqual(normalizer.supportsNormalization('foo'), false);
            assert.strictEqual(normalizer.supportsNormalization({}), false);
            assert.strictEqual(normalizer.supportsNormalization([]), false);
        });
        it('should return true when normalizing supported data types', () => {
            assert.strictEqual(normalizer.supportsNormalization(new Date()), true);
        });
    });

    describe('#supportsDenormalization()', () => {
        it('should return false when denormalizing unsupported data types', () => {
            assert.strictEqual(normalizer.supportsDenormalization(), false);
            assert.strictEqual(normalizer.supportsDenormalization(null, 'json', Date), false);
            assert.strictEqual(normalizer.supportsDenormalization(undefined, 'json', Date), false);
            assert.strictEqual(normalizer.supportsDenormalization(true, 'json', Date), false);
            assert.strictEqual(normalizer.supportsDenormalization([], 'json', Date), false);
            assert.strictEqual(normalizer.supportsDenormalization({}, 'json', Date), false);
        });
        it('should return false when denormalizing unsupported constructor types', () => {
            assert.strictEqual(normalizer.supportsDenormalization("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json'), false);
            assert.strictEqual(normalizer.supportsDenormalization("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', null), false);
            assert.strictEqual(normalizer.supportsDenormalization("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', undefined), false);
            assert.strictEqual(normalizer.supportsDenormalization("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Number), false);
            assert.strictEqual(normalizer.supportsDenormalization("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Boolean), false);
            assert.strictEqual(normalizer.supportsDenormalization("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', String), false);
            assert.strictEqual(normalizer.supportsDenormalization("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Array), false);
            assert.strictEqual(normalizer.supportsDenormalization("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Object), false);
        });
        it('should return true when denormalizing supported types and data', () => {
            assert.strictEqual(normalizer.supportsDenormalization("Wed Jan 10 2018 19:51:15 GMT-0600 (CST)", 'json', Date), true);
            assert.strictEqual(normalizer.supportsDenormalization(1523822960410, 'json', Date), true);
            assert.strictEqual(normalizer.supportsDenormalization(NaN, 'json', Date), true);
        });
    });
});
