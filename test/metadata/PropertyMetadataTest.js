import assert from 'assert';
import PropertyMetadata from '../../src/metadata/PropertyMetadata';

describe('PropertyMetadata', () => {
    const decorators = [{ key: 'key', value: Boolean }];
    const metadata = new PropertyMetadata('property', ...decorators);

    it('should be instance of ClassMetadata', () => {
        assert.equal(metadata instanceof PropertyMetadata, true);
    });
    it('should contain the property name it is used for', () => {
        assert.equal(metadata.name, 'property');
    });
    it('should contain the property decorators', () => {
        assert.deepEqual(metadata.decorators, decorators);
    });

    describe('#getDecorators()', () => {
        it('should return an array of decorators', () => {
            const metadata = new PropertyMetadata('property', ...decorators);

            assert.deepStrictEqual(metadata.getDecorators(), decorators);
        });
        it('should return an empty array if no decorators provided', () => {
            const metadata = new PropertyMetadata('property');

            assert.equal(metadata.getDecorators() instanceof Array, true);
            assert.deepEqual(metadata.getDecorators(), []);
        });
    });
});