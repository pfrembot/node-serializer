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
}

export default ClassMetadata;