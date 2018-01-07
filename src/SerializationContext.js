// @flow

/**
 * SerializationContext Class
 *
 * @class SerializationContext
 */
class SerializationContext {
    $key: string;
    $value: any;

    data: any;
    format: string;

    /**
     * SerializationContext Constructor
     *
     * @param {*} data
     * @param {string} format
     * @param {Object} options
     *
     * @constructor
     */
    constructor(data: any, format: string, options: ?Object = {}) {
        Object.defineProperty(this, 'data', { value: data, writable: false });
        Object.defineProperty(this, 'format', { value: format, writable: false });

        Object.assign(this, options);
    }
}

export default SerializationContext;