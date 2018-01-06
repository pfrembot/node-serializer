import assert from 'assert';
import DeserializationContext from '../src/DeserializationContext';

describe('DeserializationContext', () => {
    const context = new DeserializationContext();

    it('should be an instance of DeserializationContext', () => {
        assert(context instanceof DeserializationContext);
    });

    describe('#constructor()', () => {
        it('should accept data, format, and class  arguments', () => {
            const data = {};
            const context = new DeserializationContext(data, 'json', Object);

            assert.equal(context.format, 'json');
            assert.strictEqual(context.data, data);
            assert.strictEqual(context.cls, Object);
        });
        it('should optionally accept an additional options argument', () => {
            const options = { foo: true };
            const context = new DeserializationContext({}, 'json', Object, options);

            assert.equal(context.foo, true);
        });
        it('should set data and format properties to be read-only', () => {
            const data = {};
            const context = new DeserializationContext(data, 'json', Object);

            assert.throws(() => context.data = false);
            assert.throws(() => context.format = false);
            assert.throws(() => context.cls = Boolean);

            assert.equal(context.format, 'json');
            assert.strictEqual(context.data, data);
            assert.strictEqual(context.cls, Object);
        });
    });
});