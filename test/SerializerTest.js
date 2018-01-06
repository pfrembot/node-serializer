import assert from 'assert';
import Serializer from '../src/Serializer';
import JsonEncoder from '../src/encoder/JsonEncoder';
import NormalizerRegistry from '../src/normalizer/NormalizerRegistry';
import EncoderRegistry from '../src/encoder/EncoderRegistry';
import DecoderRegistry from '../src/decoder/DecoderRegistry';
import DefaultNormalizer from '../src/normalizer/DefaultNormalizer';
import MetadataAwareNormalizer from '../src/normalizer/MetadataAwareNormalizer';
import UndecoratedModel from './_fixtures/models/UndecoratedModel';
import TypeDecoratedModel from './_fixtures/models/TypeDecoratedModel';
import NestedModel from './_fixtures/models/NestedModel';
import { Type } from '../src/decorators/Type';

describe('Serializer', () => {
    const serializer = new Serializer();

    it('should be instance of Serializer', () => {
        assert.equal(serializer instanceof Serializer, true);
    });
    it('should contain a reference to the normalizerRegistry', () => {
        assert.equal(serializer.normalizerRegistry instanceof NormalizerRegistry, true);
    });
    it('should contain a reference to the encoderRegistry', () => {
        assert.equal(serializer.encoderRegistry instanceof EncoderRegistry, true);
    });
    it('should contain a reference to the decoderRegistry', () => {
        assert.equal(serializer.decoderRegistry instanceof DecoderRegistry, true);
        assert.strictEqual(serializer.decoratorRegistry, serializer.normalizerRegistry.metadataFactory.decoratorRegistry);
    });

    describe('#serialize()', () => {
        const serializer = new Serializer();

        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should return void if no data is provided', () => {
            assert.equal(serializer.serialize(void 0, 'json'), undefined);
        });
        it('should return serialized null if null is provided', () => {
            assert.equal(serializer.serialize(null, 'json'), "null");
        });
        it('should return serialized string if string is provided', () => {
            assert.equal(serializer.serialize("string", 'json'), "\"string\"");
        });
        it('should return serialized integer if integer is provided', () => {
            assert.equal(serializer.serialize(123, 'json'), "123");
        });
        it('should return serialized float if float is provided', () => {
            assert.equal(serializer.serialize(123.45, 'json'), "123.45");
        });
        it('should return serialized boolean if boolean is provided', () => {
            assert.equal(serializer.serialize(true, 'json'), "true");
        });
        it('should return serialized empty array if empty array is provided', () => {
            assert.equal(serializer.serialize([], 'json'), "[]");
        });
    });

    describe('#serialize(UndecoratedModel)', () => {
        const serializer = new Serializer();
        const model = new UndecoratedModel();

        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should be a serialized as json', () => {
            const json = serializer.serialize(model, 'json');

            assert.equal(typeof json, 'string');
            assert.equal(json, '{"propA":true,"propB":123,"propC":"propC"}');
        });
    });

    describe('#serialize(TypeDecoratedModel)', () => {
        const serializer = new Serializer();
        const model = new TypeDecoratedModel();

        serializer.decoratorRegistry.addDecorator(new Type());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should be a serialized as json', () => {
            const json = serializer.serialize(model, 'json');

            assert.equal(typeof json, 'string');
            assert.equal(json, '{"propA":true,"propB":123,"propC":"propC"}');
        });
    });

    describe('#serialize(NestedModel)', () => {
        const serializer = new Serializer();
        const model = new NestedModel();

        serializer.decoratorRegistry.addDecorator(new Type());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should be a serialized as json', () => {
            const json = serializer.serialize(model, 'json');

            assert.equal(typeof json, 'string');
            assert.equal(json, '{"propA":"propA","propB":{"propA":true,"propB":123,"propC":"propC"},"propC":{"propA":true,"propB":123,"propC":"propC"}}');
        });
    });

    describe('#deserialize()', () => {
        it('should have some tests here');
    });
});
