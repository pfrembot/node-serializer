import assert from 'assert';
import Serializer from '../src/Serializer';
import FooModel from './_fixtures/models/FooModel';
import JsonEncoder from '../src/encoder/JsonEncoder';
import DefaultNormalizer from '../src/normalizer/DefaultNormalizer';

describe('Serializer', () => {
    const serializer = new Serializer();

    it('should be instance of Serializer', () => {
        assert.equal(serializer instanceof Serializer, true);
    });

    describe('#serialize()', () => {
        const model = new FooModel();

        it('should throw an exception if no type argument provided', () => {
            assert.throws(() => serializer.serialize(model), Error);
        });
        it('should throw an exception until encoders have been registered for the target format', () => {
            assert.throws(() => serializer.serialize(model, 'json'));
            serializer.encoderRegistry.addEncoder(new JsonEncoder());
            /** need to have typed exceptions to pass to this otherwie we get normalizer not found exception*/
            // assert.doesNotThrow(() => serializer.serialize(model, 'json'));
        });
        it('should throw an exception until normalizers have been registered for the target format', () => {
            assert.throws(() => serializer.serialize(model, 'json'));
            serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
            assert.doesNotThrow(() => serializer.serialize(model, 'json'));
        });
        it('should be a serialized as json', () => {
            const json = serializer.serialize(model, 'json');

            assert.equal(typeof json, 'string');
            assert.equal(json, '{"propA":true,"propB":3,"propC":"test"}');
        });

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

    describe('#deserialize()', () => {

    });
});
