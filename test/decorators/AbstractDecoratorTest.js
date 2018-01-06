import assert from 'assert';
import AbstractDecorator from "../../src/decorators/AbstractDecorator";

describe('AbstractDecorator', () => {
    const decorator = new AbstractDecorator();

    it('should be an instance of AbstractDecorator', () => {
        assert(decorator instanceof AbstractDecorator);
    });

    describe('#getKey()', () => {

        it('should throw an error when getKey called directly on abstract', () => {
            assert.throws(() => decorator.getKey());
        });

        // const key = decorator.getKey();
        //
        // it('should return a unique symbol as key', () => {
        //     assert(typeof key === 'symbol');
        // });
        // it('should return the same key from all instances', () => {
        //     assert.strictEqual(key, new AbstractDecorator().getKey());
        // });
    });

    describe('#apply', () => {
        it('should return the same result object it received', () => {
            const expected = { foo: true };

            assert.strictEqual(decorator.apply(expected), expected);
        });
        it('should not modify the result object passed', () => {
            const expected = { foo: true };

            assert('foo' in decorator.apply(expected));
            assert.equal(decorator.apply(expected).foo, true)
        });
    });
});