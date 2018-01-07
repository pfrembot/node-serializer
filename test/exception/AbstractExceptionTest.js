import assert from 'assert';
import AbstractException from '../../src/exception/AbstractException';

describe('AbstractException', () => {
    const exception = new AbstractException('oops!');

    it('should be an instance of AbstractException', () => {
        assert(exception instanceof AbstractException);
    });
    it('should contain a message describing the error', () => {
        assert('message' in exception);
        assert.strictEqual(exception.message, 'oops!');
    });
    it('should contain a name for reference', () => {
        assert('name' in exception);
    });
    it('should contain a stack trace', () => {
        assert('stack' in exception);
    });

    describe('extends AbstractException', () => {
        it('should have property name equal to the exception class', () => {
            const exception = new class CustomException extends AbstractException {};

            assert.strictEqual(exception.name, 'CustomException');
        });
        it('should begin stack trace with the name of the exception thrown', () => {
            const exception = new class CustomException extends AbstractException {};

            assert.strictEqual(exception.stack.substring(0, 15), 'CustomException');
        });
        it('should contain a stacktrace beginning with the custom exception name and message', () => {
            const CustomException2 = class CustomException extends AbstractException {};
            const exception = new CustomException2('oops! error occurred');

            assert.strictEqual(exception.stack.substring(0, 38), 'CustomException: oops! error occurred\n')
        });
    });

    describe('#toString()', () => {
        it('should return a stacktrace as string', () => {
            const exception = new AbstractException();

            assert.strictEqual(typeof exception.toString(), 'string');
            assert.strictEqual(exception.toString(), exception.stack)
        });
    });
});