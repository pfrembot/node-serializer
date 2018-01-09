import assert from 'assert';
import { ListOf, Discriminator } from '../../src/types';
import DiscriminatorType from '../../src/types/Discriminator';
import ListOfType from '../../src/types/ListOf';

describe('ListOf', () => {
    it('should be a function', () => {
        assert(ListOf instanceof Function);
    });
    it('should return an instance of ListOf type when invoked', () => {
        assert(ListOf() instanceof ListOfType);
    });
    it('should return an instance of ListOf type when instantiated with new', () => {
        assert(new ListOf() instanceof ListOfType);
    });

    describe('#constructor()', () => {
        it('should store a reference to the passed Discriminator instance', () => {
            const discriminator = new Discriminator();

            assert.strictEqual(ListOf(discriminator).discriminator, discriminator);
            assert.strictEqual(new ListOf(discriminator).discriminator, discriminator);
            assert.strictEqual(new ListOfType(discriminator).discriminator, discriminator);
        });
        it('should instantiate a new discriminator if constructor type is provided', () => {
            assert(ListOf(Object).discriminator instanceof DiscriminatorType);
            assert(new ListOf(Object).discriminator instanceof DiscriminatorType);
            assert(new ListOfType(Object).discriminator instanceof DiscriminatorType);
        });
    });

    describe('.discriminator#getType()', () => {
        it('should return only the provided type constructor when discriminating', () => {
            assert.strictEqual(ListOf(Object).discriminator.getType(), Object);
            assert.strictEqual(ListOf(Object).discriminator.getType(null), Object);
            assert.strictEqual(ListOf(Object).discriminator.getType({ type: 'foo' }), Object);
        });
    });
});