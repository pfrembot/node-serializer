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
        const type = NormalizerInvalidException.getObjectType(object);
        super(`Normalizer must be instance of AbstractNormalizer, got "${type}"`);
    }

    /**
     * Return human friendly type as string
     *
     * @param {*} object
     * @returns {string}
     */
    static getObjectType(object) {
        if (object === null || object === undefined) {
            return typeof object;
        }

        return object.constructor.name;
    }
}

export default NormalizerInvalidException;
