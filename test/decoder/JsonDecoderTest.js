import assert from 'assert';
import JsonDecoder from '../../src/decoder/JsonDecoder';

describe('JsonDecoder', () => {
    const decoder = new JsonDecoder();

    it('should be instance of JsonDecoder', () => {
        assert(decoder instanceof JsonDecoder);
    });

    describe('#decode()', () => {
        const data = decoder.decode('{"propA": true, "propB": 3, "propC": "test"}');

        it('should be an Object with decoded data', () => {
            assert(data instanceof Object);
            assert.strictEqual(data.propA, true);
            assert.strictEqual(data.propB, 3);
            assert.strictEqual(data.propC, "test");
        });
    });

    describe('#supportsDecoding', () => {
        it('should return true to json format', () => {
            assert.strictEqual(decoder.supportsDecoding('json'), true);
        });
        it('should return true to non json format', () => {
            assert.strictEqual(decoder.supportsDecoding('xml'), false);
        });
    });
});
