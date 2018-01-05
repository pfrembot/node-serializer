// @flow
import { DecoderInterface } from './DecoderInterface';
import * as FormatType from '../FormatTypes';

/**
 * JsonDecoder Class
 *
 * @class JsonDecoder
 */
class JsonDecoder implements DecoderInterface {

    /** @inheritDoc */
    decode(string: string, format: string, context: Object) {
        return JSON.parse(string);
    }

    /** @inheritDoc */
    supportsDecoding(format: string, context: Object) {
        return format === FormatType.JSON;
    }
}

export default JsonDecoder;