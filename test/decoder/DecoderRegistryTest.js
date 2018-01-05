import assert from 'assert';
import DecoderRegistry from '../../src/decoder/DecoderRegistry';
import JsonDecoder from '../../src/decoder/JsonDecoder';
import DecoderNotFoundException from '../../src/exception/DecoderNotFoundException';

describe('DecoderRegistry', () => {
    const decoderRegistry = new DecoderRegistry();

    it('should be instance of DecoderRegistry', () => {
        assert.equal(decoderRegistry instanceof DecoderRegistry, true);
    });

    describe('#addDecoder', () => {
        const decoder = new JsonDecoder();
        const decoderRegistry = new DecoderRegistry();

        it('should return void', () => {
            assert.equal(decoderRegistry.addDecoder(decoder), void 0);
        });
        it('should have added the decoder to its internal storage', () => {
            assert.equal(decoderRegistry.decoders.length, 1);
            assert.strictEqual(decoderRegistry.decoders[0], decoder);
        });
    });

    describe('#getDecoder', () => {
        const decoder = new JsonDecoder();
        const decoderRegistry = new DecoderRegistry();

        decoderRegistry.addDecoder(decoder);

        it('should return a decoder object', () => {
            assert.ok(decoderRegistry.getDecoder('json'));
            assert.equal(typeof decoderRegistry.getDecoder('json'), 'object');
        });
        it('should return an instance of JsonDecoder', () => {
            assert.equal(decoderRegistry.getDecoder('json') instanceof JsonDecoder, true);
        });
        it('should return the same decoder instance', () => {
            assert.strictEqual(decoderRegistry.getDecoder('json'), decoder);
        });
        it('should throw an exception if compatible decoder not found', () => {
            assert.throws(() => decoderRegistry.getDecoder('xml'), DecoderNotFoundException);
        });
    });
});