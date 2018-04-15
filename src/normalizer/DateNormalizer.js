// @flow
import AbstractNormalizer from './AbstractNormalizer';
import SerializationContext from '../SerializationContext';
import DeserializationContext from '../DeserializationContext';
import NormalizationException from '../exception/NormalizationException';
import DenormalizationException from '../exception/DenormalizationException';

/**
 * DateNormalizer Class
 *
 * @class DateNormalizer
 */
class DateNormalizer extends AbstractNormalizer {

    /** @inheritDoc */
    normalize(data: any, format: string, context: SerializationContext) {
        if (!(data instanceof Date)) {
            throw new NormalizationException(`Normalizer expected instanceof Date, got type ${typeof data}`);
        }

        return data.toString();
    }

    /** @inheritDoc */
    denormalize(data: any, format: string, cls: ?Function, context: DeserializationContext) {
        if (typeof data !== 'string' && typeof data !== 'number') {
            throw new DenormalizationException(`Normalizer expected data as String or Number, got ${typeof data}`);
        }

        if (cls !== Date) {
            throw new DenormalizationException(
                `Normalizer expected type Date, got ${cls instanceof Function ? cls.name : typeof cls}`
            );
        }

        // Prevents invalid values like NaN and empty string from being constructed
        return data || data === 0 ? new Date(data) : null;
    }

    /** @inheritDoc */
    supportsNormalization(data: any, format: string, context: SerializationContext) {
        return data instanceof Date;
    }

    /** @inheritDoc */
    supportsDenormalization(data: any, format: string, cls: ?Function, context: DeserializationContext) {
        return cls === Date && (typeof data === 'string' || typeof data === 'number');
    }
}
export default DateNormalizer;
