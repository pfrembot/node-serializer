import assert from 'assert';
import { Type as TypeDecorator } from '../../src/decorators';
import { Type } from '../../src/decorators/Type';
import AbstractDecorator from '../../src/decorators/AbstractDecorator';
import SerializationContext from '../../src/SerializationContext';
import DeserializationContext from '../../src/DeserializationContext';
import UndecoratedModel from '../_fixtures/models/UndecoratedModel';
import 'reflect-metadata';

describe('TypeDecorator', () => {
    const decorator = TypeDecorator(Boolean);
    const type = new Type();

    it('should be an instance of Function', () => {
        assert(TypeDecorator instanceof Function);
    });
    it('should return an instance of Function when declared', () => {
        assert(decorator instanceof Function);
    });
    it('should decorate class with property type metadata when invoked', () => {
        const property = 'property';
        const cls = class { [property] = true; };

        decorator(cls, property);

        const metadata = Reflect.getMetadata(type.getKey(), cls, property);

        assert(metadata instanceof Type);
        assert.strictEqual(metadata.type, Boolean);
    });
});

describe('Type', () => {
    const type = new Type(Boolean);

    it('should be an instance of Type', () => {
        assert(type instanceof Type);
    });

    describe('#getKey()', () => {
        it('should not throw an error when invoked', () => {
            assert.doesNotThrow(() => type.getKey());
        });
        it('should return a unique symbol tied to its class', () => {
            assert(typeof type.getKey() === 'symbol');
            assert.strictEqual(type.getKey(), new Type().getKey());
            assert.notStrictEqual(type.getKey(), (new class extends AbstractDecorator {}).getKey());
        });
    });

    describe('#apply()', () => {
        it('should implement an apply method on serialization', () => {
            const context = new SerializationContext();
            const result = type.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, true); // type cast during apply
        });
        it('should implement an apply method on deserialization', () => {
            const context = new DeserializationContext();
            const result = type.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, true); // type cast during apply
        });
        it('should override normalized result.value constructor on deserialization of non-scalars', () => {
            const type = new Type(UndecoratedModel);
            const context = new DeserializationContext();
            const result = type.apply({ name: 'prop', value: { propA: 'true' } }, context);

            assert(result.value instanceof UndecoratedModel);
            assert.strictEqual(result.value.constructor, UndecoratedModel);
            assert.deepEqual(result.value, { propA: 'true' });
        });
        it('should return an un-modified result object when type.type not a function', () => {
            const context = new SerializationContext();
            const result = { name: 'prop', value: 'true' };

            assert.strictEqual(new Type().apply(result, context), result);
            assert.strictEqual(new Type(null).apply(result, context), result);
            assert.strictEqual(new Type({}).apply(result, context), result);
            assert.strictEqual(new Type([]).apply(result, context), result);
        });
    });
});