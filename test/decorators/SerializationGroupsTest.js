import assert from 'assert';
import { SerializationGroups as SerializationGroupsDecorator } from '../../src/decorators';
import { SerializationGroups } from '../../src/decorators/SerializationGroups';
import AbstractDecorator from '../../src/decorators/AbstractDecorator';
import SerializationContext from '../../src/SerializationContext';
import DeserializationContext from '../../src/DeserializationContext';
import 'reflect-metadata';

describe('SerializationGroupsDecorator', () => {
    const decorator = SerializationGroupsDecorator('foo', 'bar');
    const serializationGroups = new SerializationGroups();

    it('should be an instance of Function', () => {
        assert(SerializationGroupsDecorator instanceof Function);
    });
    it('should return an instance of Function when declared', () => {
        assert(decorator instanceof Function);
    });
    it('should decorate class with property type metadata when invoked', () => {
        const property = 'property';
        const cls = class { [property] = true; };

        decorator(cls, property);

        const metadata = Reflect.getMetadata(serializationGroups.getKey(), cls, property);

        assert(metadata instanceof SerializationGroups);
        assert.deepStrictEqual(metadata.groups, ['foo', 'bar']);
    });
});

describe('SerializationGroups', () => {
    const serializationGroups = new SerializationGroups('foo', 'bar');

    it('should be an instance of Type', () => {
        assert(serializationGroups instanceof SerializationGroups);
    });

    describe('#getKey()', () => {
        it('should not throw an error when invoked', () => {
            assert.doesNotThrow(() => serializationGroups.getKey());
        });
        it('should return a unique symbol tied to its class', () => {
            assert(typeof serializationGroups.getKey() === 'symbol');
            assert.strictEqual(serializationGroups.getKey(), new SerializationGroups().getKey());
            assert.notStrictEqual(serializationGroups.getKey(), (new class extends AbstractDecorator {}).getKey());
        });
    });

    describe('#apply()', () => {
        it('should do nothing if no context groups value on serialization', () => {
            const context = new SerializationContext();
            const result = serializationGroups.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, 'true'); // no change
        });
        it('should do nothing if no context groups on deserialization', () => {
            const context = new DeserializationContext();
            const result = serializationGroups.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, 'true'); // no change
        });
        it('should do nothing even with context group on deserialization', () => {
            const options = { groups: ['foo', 'bar'] };
            const context = new DeserializationContext({}, 'json', options);
            const result = serializationGroups.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, 'true'); // no change
        });
        it('should do nothing if context groups not set', () => {
            const options = {  };
            const context = new SerializationContext({}, 'json', options);
            const result = serializationGroups.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, 'true'); // no change
        });
        it('should set result.value to undefined if no context groups matched', () => {
            const options = { groups: ['baz'] };
            const context = new SerializationContext({}, 'json', options);
            const result = serializationGroups.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, undefined); // changed
        });
        it('should set result.value to undefined if no context groups provided', () => {
            const options = { groups: [] };
            const context = new SerializationContext({}, 'json', options);
            const result = serializationGroups.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, undefined); // changed
        });
        it('should set result.value to undefined if empty groups regardless of context.groups', () => {
            const options = { groups: ['foo', 'bar', 'baz'] };
            const context = new SerializationContext({}, 'json', options);
            const result = new SerializationGroups(/* empty */).apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, undefined); // changed
        });
        it('should do nothing if one context group matched', () => {
            const options = { groups: ['foo'] };
            const context = new SerializationContext({}, 'json', options);
            const result = serializationGroups.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, 'true'); // no change
        });
        it('should do nothing if multiple context group matched', () => {
            const options = { groups: ['foo', 'bar'] };
            const context = new SerializationContext({}, 'json', options);
            const result = serializationGroups.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, 'true'); // no change
        });
    });
});