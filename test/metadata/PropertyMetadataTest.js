import assert from 'assert';
import PropertyMetadata from '../../src/metadata/PropertyMetadata';

describe('PropertyMetadata', () => {
    const decorators = [{ key: 'key', value: Boolean }];
    const descriptor = { writable: true, configurable: false, enumerable: true, value: true };
    const metadata = new PropertyMetadata('property', descriptor, ...decorators);

    it('should be instance of ClassMetadata', () => {
        assert.equal(metadata instanceof PropertyMetadata, true);
    });
    it('should contain the property name it is used for', () => {
        assert.equal(metadata.name, 'property');
    });
    it('should contain the property descriptor', () => {
        assert.strictEqual(metadata.descriptor, descriptor);
    });
    it('should contain the property decorators', () => {
        assert.deepEqual(metadata.decorators, decorators);
    });
});