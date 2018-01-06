import assert from 'assert';
import SerializationContext from '../src/SerializationContext';

describe('SerializationContext', () => {
    const context = new SerializationContext();

    it('should be an instance of SerializationContext', () => {
        assert(context instanceof SerializationContext);
    });

    describe('#constructor()', () => {
        it('should accept data and format arguments', () => {
            const data = {};
            const context = new SerializationContext(data, 'json');

            assert.equal(context.format, 'json');
            assert.strictEqual(context.data, data);
        });
        it('should optionally accept an additional options argument', () => {
            const options = { foo: true };
            const context = new SerializationContext({}, 'json', options);

            assert.equal(context.foo, true);
        });
        it('should set data and format properties to be read-only', () => {
            const data = {};
            const context = new SerializationContext(data, 'json');

            assert.throws(() => context.data = false);
            assert.throws(() => context.format = false);

            assert.equal(context.format, 'json');
            assert.strictEqual(context.data, data);
        });
    });
});