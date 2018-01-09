// @flow

/**
 * Discriminator Class
 *
 * @class Discriminator
 */
class Discriminator {
    mapper: Function;

    /**
     * Discriminator Constructor
     *
     * @param {Function} mapper
     */
    constructor(mapper: Function) {
        this.mapper = mapper;
    }

    /**
     * Calls mapper function to return the appropriate class
     * constructor to use for the provided data
     *
     * @param {*} value
     * @returns {Function}
     */
    getType(value: any) {
        return this.mapper(value);
    }
}

export default Discriminator;