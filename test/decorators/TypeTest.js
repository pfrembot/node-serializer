import assert from 'assert';
import { Type as TypeDecorator } from '../../src/decorators';
import { Type } from '../../src/decorators/Type';
import 'reflect-metadata';
import AbstractDecorator from "../../src/decorators/AbstractDecorator";

describe('TypeDecorator', () => {
    const decorator = TypeDecorator(Boolean);
    const type = new Type();

    it('should be an instance of Function', () => {
        assert.equal(TypeDecorator instanceof Function, true);
    });
    it('should return an instance of Function when declared', () => {
        assert.equal(decorator instanceof Function, true);
    });
    it('should decorate class with property type metadata when invoked', () => {
        const property = 'property';
        const cls = class { [property] = true; };

        decorator(cls, property);

        const metadata = Reflect.getMetadata(type.getKey(), cls, property);

        assert.equal(metadata instanceof Type, true);
        assert.strictEqual(metadata.type, Boolean);
    });
});

describe('Type', () => {
    const type = new Type(Boolean);

    it('should be an instance of Type', () => {
        assert.equal(type instanceof Type, true);
    });

    describe('#getKey()', () => {
        it('should not throw an error when invoked', () => {
            assert.doesNotThrow(() => type.getKey());
        });
        it('should return a unique symbol tied to its class', () => {
            assert.equal(typeof type.getKey() === 'symbol', true);
            assert.strictEqual(type.getKey(), new Type().getKey());
            assert.notStrictEqual(type.getKey(), (new class extends AbstractDecorator {}).getKey());
        });
    });

    describe('#apply()', () => {
        it('should implement an apply method', () => {
            const result = type.apply({ name: 'prop', value: 'true' });

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, true); // type cast during apply
        });
    });
});