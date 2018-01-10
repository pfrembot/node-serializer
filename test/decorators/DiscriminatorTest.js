import assert from 'assert';
import { Discriminator as DiscriminatorDecorator } from '../../src/decorators';
import { Discriminator } from '../../src/decorators/Discriminator';
import DiscriminatorType from '../../src/types/Discriminator';
import AbstractDecorator from '../../src/decorators/AbstractDecorator';
import SerializationContext from '../../src/SerializationContext';
import DeserializationContext from '../../src/DeserializationContext';
import UndecoratedModel from '../_fixtures/models/UndecoratedModel';
import 'reflect-metadata';

describe('DiscriminatorDecorator', () => {
    const mapper = function () {};
    const decorator = DiscriminatorDecorator(mapper);
    const discriminator = new Discriminator();

    it('should be an instance of Function', () => {
        assert(DiscriminatorDecorator instanceof Function);
    });
    it('should return an instance of Function when declared', () => {
        assert(decorator instanceof Function);
    });
    it('should decorate class with property discriminator metadata when invoked', () => {
        const property = 'property';
        const cls = class { [property] = true; };

        decorator(cls, property);

        const metadata = Reflect.getMetadata(discriminator.getKey(), cls, property);

        assert(metadata instanceof Discriminator);
    });
    it('should contain a reference to a DiscriminatorType that is using the provided mapper', () => {
        const property = 'property';
        const cls = class { [property] = true; };

        decorator(cls, property);

        const metadata = Reflect.getMetadata(discriminator.getKey(), cls, property);

        assert(metadata.discriminator instanceof DiscriminatorType);
        assert(metadata.discriminator.mapper instanceof Function);
        assert.strictEqual(metadata.discriminator.mapper, mapper);
    });
});

describe('Discriminator', () => {
    const discriminator = new Discriminator(function() {});

    it('should be an instance of Discriminator', () => {
        assert(discriminator instanceof Discriminator);
    });

    describe('#constructor()', () => {
        it('should contain a DiscriminatorType with a reference to provided mapper', () => {
            const mapper = function() {};
            const discriminator = new Discriminator(mapper);

            assert(discriminator.discriminator instanceof DiscriminatorType);
            assert(discriminator.discriminator.mapper instanceof Function);
            assert.strictEqual(discriminator.discriminator.mapper, mapper);
        });
        it('should use a provided DiscriminatorType object if passed instead of mapper function', () => {
            const mapper = function() {};
            const discriminatorType = new DiscriminatorType(mapper);
            const discriminator = new Discriminator(discriminatorType);

            assert(discriminator.discriminator instanceof DiscriminatorType);
            assert(discriminator.discriminator.mapper instanceof Function);
            assert.strictEqual(discriminator.discriminator.mapper, mapper);
        });
    });

    describe('#getKey()', () => {
        it('should not throw an error when invoked', () => {
            assert.doesNotThrow(() => discriminator.getKey());
        });
        it('should return a unique symbol tied to its class', () => {
            assert(typeof discriminator.getKey() === 'symbol');
            assert.strictEqual(discriminator.getKey(), new Discriminator().getKey());
            assert.notStrictEqual(discriminator.getKey(), (new class extends AbstractDecorator {}).getKey());
        });
    });

    describe('#apply()', () => {
        it('should override normalized result.value prototype with type returned from mapper on deserialization', () => {
            const mapper = value => value.type === 'a' ? UndecoratedModel : Object;
            const discriminator = new Discriminator(mapper);
            const context = new DeserializationContext();

            let result = discriminator.apply({ name: 'prop', value: { type: 'b', propA: 'true' } }, context);

            assert(result.value instanceof Object);
            assert(!(result.value instanceof UndecoratedModel));
            assert.strictEqual(result.value.constructor, Object);
            assert.deepEqual(result.value, { type: 'b', propA: 'true' });

            result = discriminator.apply({ name: 'prop', value: { type: 'a', propA: 'true' } }, context);

            assert(result.value instanceof Object);
            assert(result.value instanceof UndecoratedModel);
            assert.strictEqual(result.value.constructor, UndecoratedModel);
            assert.deepEqual(result.value, { type: 'a', propA: 'true' });
        });
        it('should return an un-modified result object on serialization', () => {
            const context = new SerializationContext();
            const result = { name: 'prop', value: 'true' };

            assert.strictEqual(new Discriminator().apply(result, context), result);
            assert.strictEqual(new Discriminator(null).apply(result, context), result);
            assert.strictEqual(new Discriminator({}).apply(result, context), result);
            assert.strictEqual(new Discriminator([]).apply(result, context), result);
        });
    });
});