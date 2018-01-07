import assert from 'assert';
import MetadataFactory from '../../src/metadata/MetadataFactory';
import DecoratorRegistry from '../../src/decorators/DecoratorRegistry';
import ClassMetadata from '../../src/metadata/ClassMetadata';
import PropertyMetadata from '../../src/metadata/PropertyMetadata';
import TypeDecoratedModel from '../_fixtures/models/TypeDecoratedModel';
import UndecoratedModel from "../_fixtures/models/UndecoratedModel";
import { Type } from '../../src/decorators/Type';
import 'reflect-metadata';

describe('MetadataFactory', () => {
    const decoratorRegistry = new DecoratorRegistry();
    const metadataFactory = new MetadataFactory(decoratorRegistry);

    metadataFactory.decoratorRegistry.addDecorator(new Type());

    it('should be instance of MetadataFactory', () => {
        assert(metadataFactory instanceof MetadataFactory);
    });
    it('should contain a reference to the decorator registry', () => {
        assert.strictEqual(decoratorRegistry, metadataFactory.decoratorRegistry);
    });

    describe('#getClassMetadata()', () => {
        const metadata = metadataFactory.getClassMetadata(TypeDecoratedModel);

        it('should be an instance of ClassMetadata', () => {
            assert(metadata instanceof ClassMetadata);
        });
        it('should return empty ClassMetadata instance for invalid classes', () => {
            assert(metadataFactory.getClassMetadata(null) instanceof ClassMetadata);
        });
        it('should be cached inside reflect-metadata storage', () => {
            const keys = Reflect.getMetadataKeys(TypeDecoratedModel);

            assert.strictEqual(keys.length, 1);
            assert.strictEqual(typeof keys[0], 'symbol');
            assert.strictEqual(keys[0].toString(), 'Symbol(gson:metadata:key)');
            assert.strictEqual(Reflect.getMetadata(keys[0], TypeDecoratedModel), metadata);
        });
        it('should return the same instance of ClassMetadata', () => {
            assert.strictEqual(metadataFactory.getClassMetadata(TypeDecoratedModel), metadata);
        });
        it('should contain 3 keys (propA, propB, propC)', () => {
            assert.strictEqual(Object.keys(metadata).length, 3);
            assert.deepEqual(Object.keys(metadata), ['propA', 'propB', 'propC'])
        });
        it('should contain property metadata for propA, propB, propC', () => {
            assert(metadata.propA instanceof PropertyMetadata);
            assert(metadata.propB instanceof PropertyMetadata);
            assert(metadata.propC instanceof PropertyMetadata);
        });
    });

    describe('#getPropertyMetadata()', () => {
        const metadata = metadataFactory.getPropertyMetadata(TypeDecoratedModel, 'propA');
        const missing = metadataFactory.getPropertyMetadata(TypeDecoratedModel, 'missingProp');

        it('should be an instance of PropertyMetadata', () => {
            assert(metadata instanceof PropertyMetadata);
        });
        it('should be undefined for missing properties', () => {
            assert.strictEqual(missing, undefined);
        });
        it('should contain expected property metadata for propA', () => {
            const metadata = metadataFactory.getPropertyMetadata(TypeDecoratedModel, 'propA');

            assert.strictEqual(metadata.name, 'propA');
            assert.strictEqual(metadata.decorators.length, 1);
            assert.strictEqual(metadata.decorators[0] instanceof Type, true);
            assert.strictEqual(metadata.decorators[0].type, Boolean);
        });
        it('should contain expected property metadata for propB', () => {
            const metadata = metadataFactory.getPropertyMetadata(TypeDecoratedModel, 'propB');

            assert.strictEqual(metadata.name, 'propB');
            assert.strictEqual(metadata.decorators.length, 1);
            assert.strictEqual(metadata.decorators[0] instanceof Type, true);
            assert.strictEqual(metadata.decorators[0].type, Number);
        });
        it('should contain expected property metadata for propC', () => {
            const metadata = metadataFactory.getPropertyMetadata(TypeDecoratedModel, 'propC');

            assert.strictEqual(metadata.name, 'propC');
            assert.strictEqual(metadata.decorators.length, 1);
            assert.strictEqual(metadata.decorators[0] instanceof Type, true);
            assert.strictEqual(metadata.decorators[0].type, String);
        });
    });

    describe('#hasMetadata()', () => {
        const decoratorRegistry = new DecoratorRegistry();
        const metadataFactory = new MetadataFactory(decoratorRegistry);

        metadataFactory.decoratorRegistry.addDecorator(new Type());

        it('should return false for null', () => {
            assert.strictEqual(metadataFactory.hasClassMetadata(null), false);
        });
        it('should return false for undefined', () => {
            assert.strictEqual(metadataFactory.hasClassMetadata(undefined), false);
        });
        it('should return false for boolean', () => {
            assert.strictEqual(metadataFactory.hasClassMetadata(Boolean), false);
        });
        it('should return false for number', () => {
            assert.strictEqual(metadataFactory.hasClassMetadata(Number), false);
        });
        it('should return false for string', () => {
            assert.strictEqual(metadataFactory.hasClassMetadata(String), false);
        });
        it('should return false for Object', () => {
            assert.strictEqual(metadataFactory.hasClassMetadata(Object), false);
        });
        it('should return false for Array', () => {
            assert.strictEqual(metadataFactory.hasClassMetadata(Array), false);
        });
        it('should return false for decorated class', () => {
            assert.strictEqual(metadataFactory.hasClassMetadata(UndecoratedModel), false);
        });
        it('should return true for decorated class', () => {
            assert.strictEqual(metadataFactory.hasClassMetadata(TypeDecoratedModel), true); // cold cache
            assert.strictEqual(metadataFactory.hasClassMetadata(TypeDecoratedModel), true); // warm cache
        });
    });
});
