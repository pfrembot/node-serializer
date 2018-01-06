import AbstractException from './AbstractException';

/**
 * DecoderNotFoundException Class
 *
 * @class DecoderNotFoundException
 */
class DecoderNotFoundException extends AbstractException {
    /**
     * DecoderNotFoundException Constructor
     *
     * @param {string} format
     * @constructor
     */
    constructor(format) {
        super(`No decoder found for format "${format}"`);
    }
}

export default DecoderNotFoundException;