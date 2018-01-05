// @flow

import type { Decorator } from '../decorators/DecoratorRegistry';

/**
 * PropertyMetadata Class
 *
 * @class PropertyMetadata
 */
class PropertyMetadata {
    name: string;
    descriptor: Object;
    decorators: Decorator[] = [];

    /**
     * PropertyMetadata Constructor
     *
     * @param {string} property
     * @param {Object} descriptor
     * @param {Decorator[]} decorators
     *
     * @constructor
     */
    constructor(property: string, descriptor: Object, ...decorators: Decorator[]) {
        this.name = property;
        this.descriptor = descriptor;
        this.decorators = decorators;
    }

    /**
     * Return property decorators
     *
     * @returns {Decorator[]}
     */
    getDecorators() {
        return this.decorators;
    }
}

export default PropertyMetadata;