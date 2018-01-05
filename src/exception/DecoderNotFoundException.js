import AbstractException from './AbstractException';

/**
 * DecoderNotFoundException Class
 *
 * @class DecoderNotFoundException
 */
class DecoderNotFoundException extends AbstractException {
    constructor(format) {
        super(`No decoder found for format "${format}"`);
    }
}

export default DecoderNotFoundException;