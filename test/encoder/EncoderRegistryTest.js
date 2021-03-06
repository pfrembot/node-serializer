import assert from 'assert';
import EncoderRegistry from '../../src/encoder/EncoderRegistry';
import JsonEncoder from '../../src/encoder/JsonEncoder';
import EncoderNotFoundException from '../../src/exception/EncoderNotFoundException';

describe('EncoderRegistry', () => {
    const encoderRegistry = new EncoderRegistry();

    it('should be instance of EncoderRegistry', () => {
        assert(encoderRegistry instanceof EncoderRegistry);
    });

    describe('#addEncoder', () => {
        const encoder = new JsonEncoder();
        const encoderRegistry = new EncoderRegistry();

        it('should return void', () => {
            assert.strictEqual(encoderRegistry.addEncoder(encoder), void 0);
        });
        it('should have added the encoder to its internal storage', () => {
            assert.strictEqual(encoderRegistry.encoders.length, 1);
            assert.strictEqual(encoderRegistry.encoders[0], encoder);
        });
    });

    describe('#getEncoder', () => {
        const encoder = new JsonEncoder();
        const encoderRegistry = new EncoderRegistry();

        encoderRegistry.addEncoder(encoder);

        it('should return a encoder object', () => {
            assert.ok(encoderRegistry.getEncoder('json'));
            assert.strictEqual(typeof encoderRegistry.getEncoder('json'), 'object');
        });
        it('should return an instance of JsonEncoder', () => {
            assert(encoderRegistry.getEncoder('json') instanceof JsonEncoder);
        });
        it('should return the same encoder instance', () => {
            assert.strictEqual(encoderRegistry.getEncoder('json'), encoder);
        });
        it('should throw an exception if compatible encoder not found', () => {
            assert.throws(() => encoderRegistry.getEncoder('xml'), EncoderNotFoundException);
        });
    });
});