import assert from 'assert';
import XmlDecoder from '../../src/decoder/XmlDecoder';

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

describe('XmlDecoder', () => {
    const decoder = new XmlDecoder();

    it('should be instance of XmlDecoder', () => {
        assert(decoder instanceof XmlDecoder);
    });

    describe('#decode()', () => {
        const data = decoder.decode(`${XML_HEADER}<root><propA>true</propA><propB>3</propB><propC>test</propC></root>`);

        it('should be an Object with decoded data', () => {
            assert(data instanceof Object);
            assert.strictEqual(data.propA, 'true');
            assert.strictEqual(data.propB, '3');
            assert.strictEqual(data.propC, 'test');
        });
    });

    describe('#supportsDecoding', () => {
        it('should return true to json format', () => {
            assert.strictEqual(decoder.supportsDecoding('xml'), true);
        });
        it('should return true to non json format', () => {
            assert.strictEqual(decoder.supportsDecoding('json'), false);
        });
    });
});
