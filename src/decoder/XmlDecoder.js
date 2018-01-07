// @flow
import type { DecoderInterface } from './DecoderInterface';
import * as FormatType from '../FormatTypes';

// import XML from 'xml-parse';
import XML from 'xml2js';

const parser = new XML.Parser({
    explicitArray: false, // prevent parser from turning scalars into arrays
    explicitRoot: false   // strip out root node added by encoder (@see: XmlEncoder.encode())
});

/**
 * JsonDecoder Class
 *
 * @class XmlDecoder
 */
class XmlDecoder implements DecoderInterface {

    /** @inheritDoc */
    decode(string: string, format: string, context: Object) {
        let result = null;

        parser.parseString(string, (err, object) => {
            if (err) throw new SyntaxError(err);
            result = object
        });

        return result;
    }

    /** @inheritDoc */
    supportsDecoding(format: string, context: Object) {
        return format === FormatType.XML;
    }
}

export default XmlDecoder;