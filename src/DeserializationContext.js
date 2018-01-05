// @flow

/**
 * DeserializationContext Class
 *
 * @class DeserializationContext
 */
class DeserializationContext {
    data: any;
    format: string;
    cls: Function;

    /**
     * DeserializationContext Constructor
     *
     * @param {*} data
     * @param {string} format
     * @param {Function} cls
     * @param {Object} options
     *
     * @constructor
     */
    constructor(data: any, format: string, cls: Function, options: ?Object = {}) {
        Object.defineProperty(this, 'data', { value: data, writable: false });
        Object.defineProperty(this, 'format', { value: format, writable: false });
        Object.defineProperty(this, 'cls', { value: cls, writable: false });

        Object.assign(this, options);
    }
}

export default DeserializationContext;