import AbstractException from './AbstractException';

/**
 * MethodNotImplementedException Class
 *
 * @class MethodNotImplementedException
 */
class MethodNotImplementedException extends AbstractException {
    /**
     * MethodNotImplementedException Constructor
     *
     * @param className
     * @constructor
     */
    constructor(className) {
        super(`Method not implemented by "${className}"`);
    }
}

export default MethodNotImplementedException;