// @flow
import type { DecoratorInterface } from "../decorators/DecoratorInterface";

/**
 * PropertyMetadata Class
 *
 * @class PropertyMetadata
 */
class PropertyMetadata {
    name: string;
    decorators: DecoratorInterface[] = [];

    /**
     * PropertyMetadata Constructor
     *
     * @param {string} property
     * @param {Decorator[]} decorators
     *
     * @constructor
     */
    constructor(property: string, ...decorators: DecoratorInterface[]) {
        this.name = property;
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