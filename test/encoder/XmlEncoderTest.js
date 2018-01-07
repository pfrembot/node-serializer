import assert from 'assert';
import { Readable } from 'stream';
import XmlEncoder from '../../src/encoder/XmlEncoder';

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

describe('XmlEncoder', () => {
    const encoder = new XmlEncoder();

    it('should be instance of JsonEncoder', () => {
        assert(encoder instanceof XmlEncoder);
    });

    describe('#encode', () => {
        const string = encoder.encode({ propA: true, propB: 3, propC: 'test' });

        it('should be a json string containing the encoded object', () => {
            assert.strictEqual(string, `${XML_HEADER}<root><propA>true</propA><propB>3</propB><propC>test</propC></root>`);
        });
    });

    describe('#supportsEncoding', () => {
        it('should return true to json format', () => {
            assert.strictEqual(encoder.supportsEncoding('xml'), true);
        });
        it('should return true to non json format', () => {
            assert.strictEqual(encoder.supportsEncoding('json'), false);
        });
    });
});