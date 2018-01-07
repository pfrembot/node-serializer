import assert from 'assert';
import { Expose as ExposeDecorator } from '../../src/decorators';
import { Expose } from '../../src/decorators/Expose';
import AbstractDecorator from '../../src/decorators/AbstractDecorator';
import SerializationContext from '../../src/SerializationContext';
import DeserializationContext from '../../src/DeserializationContext';
import UndecoratedModel from '../_fixtures/models/UndecoratedModel';
import 'reflect-metadata';

describe('ExposeDecorator', () => {
    const decorator = ExposeDecorator(false);
    const expose = new Expose();

    it('should be an instance of Function', () => {
        assert(ExposeDecorator instanceof Function);
    });
    it('should return an instance of Function when declared', () => {
        assert(decorator instanceof Function);
    });
    it('should decorate class property with expose metadata when invoked', () => {
        const property = 'property';
        const cls = class { [property] = true; };

        decorator(cls, property);

        const metadata = Reflect.getMetadata(expose.getKey(), cls, property);

        assert(metadata instanceof Expose);
        assert.strictEqual(metadata.value, false);
    });
});

describe('Expose', () => {
    const expose = new Expose(false);

    it('should be an instance of Expose', () => {
        assert(expose instanceof Expose);
    });

    describe('#getKey()', () => {
        it('should not throw an error when invoked', () => {
            assert.doesNotThrow(() => expose.getKey());
        });
        it('should return a unique symbol tied to its class', () => {
            assert(typeof expose.getKey() === 'symbol');
            assert.strictEqual(expose.getKey(), new Expose().getKey());
            assert.notStrictEqual(expose.getKey(), (new class extends AbstractDecorator {}).getKey());
        });
    });

    describe('#apply()', () => {
        it('should implement an apply method on serialization', () => {
            const context = new SerializationContext();
            const result = expose.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, undefined); // removed during apply
        });
        it('should implement an apply method on deserialization', () => {
            const context = new DeserializationContext();
            const result = expose.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, 'true'); // no change on deserialize
        });
        it('should return a result object with value undefined when expose.value is false', () => {
            const context = new SerializationContext();
            const result = { name: 'prop', value: 'true' };

            assert.deepStrictEqual(new Expose(false).apply(result, context), { name: 'prop', value: undefined });
        });
        it('should return an un-modified result object when expose.value is not exactly false', () => {
            const context = new SerializationContext();
            const result = { name: 'prop', value: 'true' };

            assert.strictEqual(new Expose().apply(result, context), result);
            assert.strictEqual(new Expose(true).apply(result, context), result);
            assert.strictEqual(new Expose(null).apply(result, context), result);
            assert.strictEqual(new Expose('').apply(result, context), result);
            assert.strictEqual(new Expose('yes').apply(result, context), result);
            assert.strictEqual(new Expose(undefined).apply(result, context), result);
        });
    });
});