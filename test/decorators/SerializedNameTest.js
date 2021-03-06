import assert from 'assert';
import { SerializedName as SerializedNameDecorator } from '../../src/decorators';
import { SerializedName } from '../../src/decorators/SerializedName';
import AbstractDecorator from '../../src/decorators/AbstractDecorator';
import SerializationContext from '../../src/SerializationContext';
import DeserializationContext from '../../src/DeserializationContext';
import 'reflect-metadata';

describe('SerializedNameDecorator', () => {
    const decorator = SerializedNameDecorator('foo');
    const serializedName = new SerializedName();

    it('should be an instance of Function', () => {
        assert(SerializedNameDecorator instanceof Function);
    });
    it('should return an instance of Function when declared', () => {
        assert(decorator instanceof Function);
    });
    it('should decorate class with property name metadata when invoked', () => {
        const property = 'property';
        const cls = class { [property] = true; };

        decorator(cls, property);

        const metadata = Reflect.getMetadata(serializedName.getKey(), cls, property);

        assert(metadata instanceof SerializedName);
        assert.strictEqual(metadata.name, 'foo');
    });
});

describe('SerializedName', () => {
    const serializedName = new SerializedName('foo', 'prop');

    it('should be an instance of SerializedName', () => {
        assert(serializedName instanceof SerializedName);
    });

    describe('#getKey()', () => {
        it('should not throw an error when invoked', () => {
            assert.doesNotThrow(() => serializedName.getKey());
        });
        it('should return a unique symbol tied to its class', () => {
            assert(typeof serializedName.getKey() === 'symbol');
            assert.strictEqual(serializedName.getKey(), new SerializedName().getKey());
            assert.notStrictEqual(serializedName.getKey(), (new class extends AbstractDecorator {}).getKey());
        });
    });

    describe('#apply()', () => {
        it('should modify result name on serialization', () => {
            const context = new SerializationContext();
            const result = serializedName.apply({ name: 'prop', value: 'true' }, context);

            assert.strictEqual(result.name, 'foo'); // prop changed during apply
            assert.strictEqual(result.value, 'true');
        });
        it('should restore result name on deserialization', () => {
            const context = new DeserializationContext();
            const result = serializedName.apply({ name: 'foo', value: 'true' }, context);

            assert.strictEqual(result.name, 'prop'); // prop changed during apply
            assert.strictEqual(result.value, 'true');
        });
    });
});