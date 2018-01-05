import assert from 'assert';
import MetadataFactory from '../../src/metadata/MetadataFactory';
import DecoratorRegistry from '../../src/decorators/DecoratorRegistry';
import ClassMetadata from '../../src/metadata/ClassMetadata';
import PropertyMetadata from '../../src/metadata/PropertyMetadata';
import TypeDecoratedModel from '../_fixtures/models/TypeDecoratedModel';
import { Type, TypeKey } from '../../src/decorators/Type';

describe('MetadataFactory', () => {
    const decoratorRegistry = new DecoratorRegistry();
    const metadataFactory = new MetadataFactory(decoratorRegistry);

    metadataFactory.decoratorRegistry.addDecorator(Type, TypeKey);

    it('should be instance of MetadataFactory', () => {
        assert.equal(metadataFactory instanceof MetadataFactory, true);
    });
    it('should contain a reference to the decorator registry', () => {
        assert.strictEqual(decoratorRegistry, metadataFactory.decoratorRegistry);
    });

    describe('#getClassMetadata()', () => {
        const metadata = metadataFactory.getClassMetadata(TypeDecoratedModel);

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
            assert.strictEqual(metadataFactory.getClassMetadata(TypeDecoratedModel), metadata);
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
        const metadata = metadataFactory.getPropertyMetadata(TypeDecoratedModel, 'propA');
        const missing = metadataFactory.getPropertyMetadata(TypeDecoratedModel, 'missingProp');

        it('should be an instance of PropertyMetadata', () => {
            assert.equal(metadata instanceof PropertyMetadata, true);
        });
        it('should be undefined for missing properties', () => {
            assert.equal(missing, undefined);
        });
        it('should contain expected property metadata for propA', () => {
            const metadata = metadataFactory.getPropertyMetadata(TypeDecoratedModel, 'propA');

            assert.equal(metadata.name, 'propA');
            assert.equal(metadata.descriptor.configurable, false);
            assert.equal(metadata.descriptor.enumerable, true);
            assert.equal(metadata.descriptor.value, 'true');
            assert.equal(metadata.descriptor.writable, true);
            assert.equal(metadata.decorators.length, 1);
            assert.equal(metadata.decorators[0].key, TypeKey);
            assert.equal(metadata.decorators[0].value, Boolean);
        });
        it('should contain expected property metadata for propB', () => {
            const metadata = metadataFactory.getPropertyMetadata(TypeDecoratedModel, 'propB');

            assert.equal(metadata.name, 'propB');
            assert.equal(metadata.descriptor.configurable, false);
            assert.equal(metadata.descriptor.enumerable, true);
            assert.equal(metadata.descriptor.value, '123');
            assert.equal(metadata.descriptor.writable, true);
            assert.equal(metadata.decorators.length, 1);
            assert.equal(metadata.decorators[0].key, TypeKey);
            assert.equal(metadata.decorators[0].value, Number);
        });
        it('should contain expected property metadata for propC', () => {
            const metadata = metadataFactory.getPropertyMetadata(TypeDecoratedModel, 'propC');

            assert.equal(metadata.name, 'propC');
            assert.equal(metadata.descriptor.configurable, false);
            assert.equal(metadata.descriptor.enumerable, true);
            assert.equal(metadata.descriptor.value, 'propC');
            assert.equal(metadata.descriptor.writable, true);
            assert.equal(metadata.decorators.length, 1);
            assert.equal(metadata.decorators[0].key, TypeKey);
            assert.equal(metadata.decorators[0].value, String);
        });
    });
});
