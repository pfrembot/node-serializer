import assert from 'assert';
import StringStream from 'string-to-stream';
import JsonDecoder from '../../src/decoder/JsonDecoder';

describe('JsonDecoder', () => {
    const decoder = new JsonDecoder();

    it('should be instance of JsonDecoder', () => {
        assert.equal(decoder instanceof JsonDecoder, true);
    });

    describe('#decode()', () => {
        const data = decoder.decode('{"propA": true, "propB": 3, "propC": "test"}');

        it('should be an Object with decoded data', () => {
            assert.equal(data instanceof Object, true);
            assert.equal(data.propA, true);
            assert.equal(data.propB, 3);
            assert.equal(data.propC, "test");
        });
    });

    describe('#supportsDecoding', () => {
        it('should return true to json format', () => {
            assert.equal(decoder.supportsDecoding('json'), true);
        });
        it('should return true to non json format', () => {
            assert.equal(decoder.supportsDecoding('xml'), false);
        });
    });
});
