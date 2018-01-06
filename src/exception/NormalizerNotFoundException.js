import AbstractException from './AbstractException';

/**
 * NormalizerNotFoundException Class
 *
 * @class NormalizerNotFoundException
 */
class NormalizerNotFoundException extends AbstractException {
    /**
     * NormalizerNotFoundException Constructor
     *
     * @param {string} format
     * @param {Function|null} cls
     *
     * @constructor
     */
    constructor(format, cls = null) {
        cls instanceof Function
            ? super(`No normalizer found for format "${format}" and class "${cls.name}"`)
            : super(`No normalizer found for format "${format}"`)
        ;
    }
}

export default NormalizerNotFoundException;