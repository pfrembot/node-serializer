import AbstractException from './AbstractException';

/**
 * NormalizerInvalidException Class
 *
 * @class NormalizerInvalidException
 */
class NormalizerInvalidException extends AbstractException {
    /**
     * NormalizerInvalidException Constructor
     *
     * @param {*} object
     * @constructor
     */
    constructor(object) {
        const type = AbstractException.getObjectType(object);
        super(`Normalizer must be instance of AbstractNormalizer, got "${type}"`);
    }
}

export default NormalizerInvalidException;
