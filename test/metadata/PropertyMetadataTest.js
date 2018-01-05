import assert from 'assert';
import PropertyMetadata from '../../src/metadata/PropertyMetadata';

describe('PropertyMetadata', () => {
    const descriptor = { writable: true, configurable: false, enumerable: true, value: true };
    const metadata = new PropertyMetadata('property', Boolean, descriptor);

    it('should be instance of ClassMetadata', () => {
        assert.equal(metadata instanceof PropertyMetadata, true);
    });
    it('should contain the property name it is used for', () => {
        assert.equal(metadata.name, 'property');
    });
    it('should contain the property type if any', () => {
        assert.equal(metadata.type, Boolean);
    });
    it('should contain the property descriptor', () => {
        assert.strictEqual(metadata.descriptor, descriptor);
    });
});