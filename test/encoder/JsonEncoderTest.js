import assert from 'assert';
import { Readable } from 'stream';
import JsonEncoder from '../../src/encoder/JsonEncoder';

describe('JsonEncoder', () => {
    const encoder = new JsonEncoder();

    it('should be instance of JsonEncoder', () => {
        assert(encoder instanceof JsonEncoder);
    });

    describe('#encode', () => {
        const string = encoder.encode({ propA: true, propB: 3, propC: 'test' });

        it('should be a json string containing the encoded object', () => {
            assert.equal(string, '{"propA":true,"propB":3,"propC":"test"}');
        });
    });

    describe('#supportsEncoding', () => {
        it('should return true to json format', () => {
            assert.equal(encoder.supportsEncoding('json'), true);
        });
        it('should return true to non json format', () => {
            assert.equal(encoder.supportsEncoding('xml'), false);
        });
    });
});