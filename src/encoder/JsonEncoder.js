// @flow
import type { EncoderInterface } from './EncoderInterface';
import SerializationContext from '../SerializationContext';
import * as FormatType from '../FormatTypes';

/**
 * JsonEncoder Class
 *
 * @class JsonEncoder
 */
class JsonEncoder implements EncoderInterface {

    /** @inheritDoc */
    encode(object: any, format: string, context: SerializationContext) {
        return JSON.stringify(object);
    }

    /** @inheritDoc */
    supportsEncoding(format: string, context: SerializationContext) {
        return format === FormatType.JSON;
    }
}

export default JsonEncoder;