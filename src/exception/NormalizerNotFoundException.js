import AbstractException from './AbstractException';

/**
 * NormalizerNotFoundException Class
 *
 * @class NormalizerNotFoundException
 */
class NormalizerNotFoundException extends AbstractException {
    constructor(format, cls = null) {
        cls instanceof Function
            ? super(`No normalizer found for format "${format}" and class "${cls.name}"`)
            : super(`No normalizer found for format "${format}"`)
        ;
    }
}

export default NormalizerNotFoundException;