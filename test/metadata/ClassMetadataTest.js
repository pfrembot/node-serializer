import assert from 'assert';
import ClassMetadata from '../../src/metadata/ClassMetadata';
import PropertyMetadata from '../../src/metadata/PropertyMetadata';

describe('ClassMetadata', () => {
    const propertyMetadata = new PropertyMetadata('property', Boolean, {});
    const metadata = new ClassMetadata([ propertyMetadata ]);

    it('should be instance of ClassMetadata', () => {
        assert.equal(metadata instanceof ClassMetadata, true);
    });
    it('should contain an keys equal to the length of property metadata added', () => {
        assert.equal(Object.keys(metadata).length, 1);
    });
    it('should contain the same instance of PropertyMetadata accessible at its property name', () => {
        assert.strictEqual(propertyMetadata, metadata['property']);
        assert.strictEqual(propertyMetadata, metadata.property);
    });
});