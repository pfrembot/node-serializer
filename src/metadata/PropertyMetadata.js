// @flow

type PropType = Function|typeof undefined;

/**
 * PropertyMetadata Class
 *
 * @class PropertyMetadata
 */
class PropertyMetadata {
    name: string;
    type: PropType;
    descriptor: Object;

    /**
     * PropertyMetadata Constructor
     *
     * @param {string} property
     * @param {Function|undefined} type
     * @param {Object} descriptor
     *
     * @constructor
     */
    constructor(property: string, type: PropType, descriptor: Object) {
        this.name = property;
        this.type = type;
        this.descriptor = descriptor;
    }
}

export default PropertyMetadata;