// @flow
import Discriminator from './Discriminator';

/**
 * ListOf Class
 *
 * @class ListOf
 */
class ListOf {
    discriminator: Discriminator;

    /**
     * ListOf Constructor
     *
     * @param {Function|Discriminator} type
     */
    constructor(type: Function|Discriminator) {
        this.discriminator = type instanceof Discriminator ?
            type : new Discriminator(() => type);
    }
}

export default ListOf;