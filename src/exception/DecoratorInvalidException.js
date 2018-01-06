import AbstractException from './AbstractException';

/**
 * DecoratorInvalidException Class
 *
 * @class DecoratorInvalidException
 */
class DecoratorInvalidException extends AbstractException {
    /**
     * DecoratorInvalidException Constructor
     *
     * @param {*} object
     * @constructor
     */
    constructor(object) {
        const type = AbstractException.getObjectType(object);
        super(`Decorator must be instance of AbstractNormalizer, got "${type}"`);
    }
}

export default DecoratorInvalidException;
