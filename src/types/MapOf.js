// @flow
import Discriminator from './Discriminator';

/**
 * MapOf Class
 *
 * @class MapOf
 */
class MapOf {
    discriminator: Discriminator;

    /**
     * MapOf Constructor
     *
     * @param {Function|Discriminator} type
     */
    constructor(type: Function|Discriminator) {
        this.discriminator = type instanceof Discriminator ?
            type : new Discriminator(() => type);
    }
}

export default MapOf;