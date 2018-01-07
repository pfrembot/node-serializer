// @flow
import type { EncoderInterface } from './EncoderInterface';
import SerializationContext from '../SerializationContext';
import * as FormatType from '../FormatTypes';
import XML from 'xml2js';

const builder = new XML.Builder({
    renderOpts: { pretty: false }
});

/**
 * XmlEncoder Class
 *
 * @class XmlEncoder
 */
class XmlEncoder implements EncoderInterface {

    /** @inheritDoc */
    encode(object: any, format: string, context: SerializationContext) {
        // wrap object in root node to avoid builder issues on shallow objects
        return builder.buildObject({ root: object });
    }

    /** @inheritDoc */
    supportsEncoding(format: string, context: SerializationContext) {
        return format === FormatType.XML;
    }
}

export default XmlEncoder;