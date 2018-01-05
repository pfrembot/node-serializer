import AbstractException from './AbstractException';

/**
 * NormalizerInvalidException Class
 *
 * @class NormalizerInvalidException
 */
class NormalizerInvalidException extends AbstractException {
    constructor(object) {
        const type = NormalizerInvalidException.getObjectType(object);
        super(`Normalizer must be instance of AbstractNormalizer, got "${type}"`);
    }

    static getObjectType(object) {
        if (object === null || object === undefined) {
            return null;
        }

        if (!(object.constructor instanceof Function)) {
            return typeof object;
        }

        return object.constructor.name;
    }
}

export default NormalizerInvalidException;
