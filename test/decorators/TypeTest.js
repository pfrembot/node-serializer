import assert from 'assert';
import { Type } from '../../src/decorators';
import { TypeKey } from '../../src/decorators/Type';

describe('Type', () => {
    const decorator = Type(Boolean);

    it('should be an instance of Function', () => {
        assert.equal(Type instanceof Function, true);
    });
    it('should return an instance of Function when declared', () => {
        assert.equal(decorator instanceof Function, true);
    });
    it('should decorate class with property type metadata when invoked', () => {
        const cls = class { property = true; };
        const property = 'property';
        const descriptor = { writable: true, configurable: false, enumerable: true, value: true };

        assert.strictEqual(decorator(cls, property, descriptor), descriptor);
        assert.equal(cls.constructor[TypeKey] instanceof Object, true);
        assert.equal(property in cls.constructor[TypeKey], true);
        assert.strictEqual(cls.constructor[TypeKey][property], Boolean);
    });
});