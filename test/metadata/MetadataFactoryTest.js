import assert from 'assert';
import MetadataFactory from '../../src/metadata/MetadataFactory';
import ClassMetadata from '../../src/metadata/ClassMetadata';
import PropertyMetadata from '../../src/metadata/PropertyMetadata';
import FooModel from '../_fixtures/models/FooModel';

describe('MetadataFactory', () => {
    const metadataFactory = new MetadataFactory();

    it('should be instance of MetadataFactory', () => {
        assert.equal(metadataFactory instanceof MetadataFactory, true);
    });

    describe('#getClassMetadata()', () => {
        const metadata = metadataFactory.getClassMetadata(FooModel);

        it('should be an instance of ClassMetadata', () => {
            assert.equal(metadata instanceof ClassMetadata, true);
        });
        it('should be cached inside the metadata factory', () => {
            const cacheKeys = Object.getOwnPropertySymbols(metadataFactory.metadatas);

            assert.equal(cacheKeys.length === 1, true);
            assert.equal(typeof cacheKeys[0] === 'symbol', true);
            assert.equal(metadataFactory.metadatas[cacheKeys[0]] instanceof ClassMetadata, true);
        });
        it('should return the same instance of ClassMetadata', () => {
            assert.strictEqual(metadataFactory.getClassMetadata(FooModel), metadata);
        });
        it('should contain 3 keys (propA, propB, propC)', () => {
            assert.equal(Object.keys(metadata).length, 3);
            assert.deepEqual(Object.keys(metadata), ['propA', 'propB', 'propC'])
        });
        it('should contain property metadata for propA, propB, propC', () => {
            assert.equal(metadata.propA instanceof PropertyMetadata, true);
            assert.equal(metadata.propB instanceof PropertyMetadata, true);
            assert.equal(metadata.propC instanceof PropertyMetadata, true);
        });
    });

    describe('#getPropertyMetadata()', () => {
        const metadata = metadataFactory.getPropertyMetadata(FooModel, 'propA');
        const missing = metadataFactory.getPropertyMetadata(FooModel, 'missingProp');

        it('should be an instance of PropertyMetadata', () => {
            assert.equal(metadata instanceof PropertyMetadata, true);
        });
        it('should be undefined for missing properties', () => {
            assert.equal(missing, undefined);
        });
        it('should contain expected property metadata for propA', () => {
            const metadata = metadataFactory.getPropertyMetadata(FooModel, 'propA');

            assert.equal(metadata.name, 'propA');
            assert.equal(metadata.type, Boolean);
            assert.equal(metadata.descriptor.configurable, false);
            assert.equal(metadata.descriptor.enumerable, true);
            assert.equal(metadata.descriptor.value, true);
            assert.equal(metadata.descriptor.writable, true);
        });
        it('should contain expected property metadata for propB', () => {
            const metadata = metadataFactory.getPropertyMetadata(FooModel, 'propB');

            assert.equal(metadata.name, 'propB');
            assert.equal(metadata.type, Number);
            assert.equal(metadata.descriptor.configurable, false);
            assert.equal(metadata.descriptor.enumerable, true);
            assert.equal(metadata.descriptor.value, 3);
            assert.equal(metadata.descriptor.writable, true);
        });
        it('should contain expected property metadata for propC', () => {
            const metadata = metadataFactory.getPropertyMetadata(FooModel, 'propC');

            assert.equal(metadata.name, 'propC');
            assert.equal(metadata.type, String);
            assert.equal(metadata.descriptor.configurable, false);
            assert.equal(metadata.descriptor.enumerable, true);
            assert.equal(metadata.descriptor.value, 'test');
            assert.equal(metadata.descriptor.writable, true);
        });
    });
});
