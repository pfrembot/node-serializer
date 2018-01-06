import AbstractException from './AbstractException';

/**
 * EncoderNotFoundException Class
 *
 * @class EncoderNotFoundException
 */
class EncoderNotFoundException extends AbstractException {
    /**
     * EncoderNotFoundException Constructor
     *
     * @param {string} format
     * @constructor
     */
    constructor(format) {
        super(`No encoder found for format "${format}"`);
    }
}

export default EncoderNotFoundException;