import assert from 'assert';
import { MapOf, Discriminator } from '../../src/types';
import DiscriminatorType from '../../src/types/Discriminator';
import MapOfType from '../../src/types/MapOf'

describe('MapOf', () => {
    it('should be a function', () => {
        assert(MapOf instanceof Function);
    });
    it('should return an instance of MapOf type when invoked', () => {
        assert(MapOf() instanceof MapOfType);
    });
    it('should return an instance of MapOf type when instantiated with new', () => {
        assert(new MapOf() instanceof MapOfType);
    });

    describe('#constructor()', () => {
        it('should store a reference to the passed Discriminator instance', () => {
            const discriminator = new Discriminator();

            assert.strictEqual(MapOf(discriminator).discriminator, discriminator);
            assert.strictEqual(new MapOf(discriminator).discriminator, discriminator);
            assert.strictEqual(new MapOfType(discriminator).discriminator, discriminator);
        });
        it('should instantiate a new discriminator if constructor type is provided', () => {
            assert(MapOf(Object).discriminator instanceof DiscriminatorType);
            assert(new MapOf(Object).discriminator instanceof DiscriminatorType);
            assert(new MapOfType(Object).discriminator instanceof DiscriminatorType);
        });
    });

    describe('.discriminator#getType()', () => {
        it('should return only the provided type constructor when discriminating', () => {
            assert.strictEqual(MapOf(Object).discriminator.getType(), Object);
            assert.strictEqual(MapOf(Object).discriminator.getType(null), Object);
            assert.strictEqual(MapOf(Object).discriminator.getType({ type: 'foo' }), Object);
        });
    });
});