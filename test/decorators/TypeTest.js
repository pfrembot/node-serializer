import assert from 'assert';
import { Type as TypeDecorator } from '../../src/decorators';
import { Type } from '../../src/decorators/Type';
import 'reflect-metadata';
import PropertyMetadata from "../../src/metadata/PropertyMetadata";

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
        const cls = class { property = true; };
        const property = 'property';

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
        it('should return a unique symbol tied to its class', () => {
            assert.equal(typeof type.getKey() === 'symbol', true);
            assert.strictEqual(type.getKey(), new Type().getKey());
        });
    });

    describe('#apply()', () => {
        it('should implement an appply method', () => {
            const result = type.apply({ name: 'prop', value: 'true' });

            assert.strictEqual(result.name, 'prop');
            assert.strictEqual(result.value, true);
        });
    });
});