// @flow
import { EncoderInterface } from './EncoderInterface';
import * as FormatType from '../FormatTypes';

/**
 * JsonEncoder Class
 *
 * @class JsonEncoder
 */
class JsonEncoder implements EncoderInterface {

    /** @inheritDoc */
    encode(object: any, format: string, /** context */) {
        return JSON.stringify(object);
    }

    /** @inheritDoc */
    supportsEncoding(format: string) {
        return format === FormatType.JSON;
    }
}

export default JsonEncoder;