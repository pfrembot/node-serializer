import AbstractException from './AbstractException';

/**
 * MethodNotImplementedException Class
 *
 * @class MethodNotImplementedException
 */
class MethodNotImplementedException extends AbstractException {
    constructor(className) {
        super(`Method not implemented by "${className}"`);
    }
}

export default MethodNotImplementedException;