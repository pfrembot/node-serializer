// @flow
import PropertyMetadata from './PropertyMetadata';

/**
 * ClassMetadata Class
 *
 * @class ClassMetadata
 */
class ClassMetadata {
    $key: string;
    $value: PropertyMetadata;

    /**
     * ClassMetadata Constructor
     *
     * @param {PropertyMetadata[]} properties
     *
     * @constructor
     */
    constructor(properties: PropertyMetadata[] = []) {
        properties.forEach(property => this[property.name] = property);
    }

    /**
     * Test if any of the class properties have been decorated
     *
     * @returns {boolean}
     */
    hasDecoratedProperties(): boolean {
        const decoratedProperties = Object.keys(this).filter(key => this[key].decorators.length);

        return Boolean(decoratedProperties.length);
    }
}

export default ClassMetadata;