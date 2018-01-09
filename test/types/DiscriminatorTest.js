import assert from 'assert';
import { Discriminator } from '../../src/types';
import DiscriminatorType from '../../src/types/Discriminator';

describe('Discriminator', () => {
    it('should be a function', () => {
        assert(Discriminator instanceof Function);
    });
    it('should return an instance of Discriminator type when invoked', () => {
        assert(Discriminator() instanceof DiscriminatorType);
    });
    it('should return an instance of Discriminator type when instantiated with new', () => {
        assert(new Discriminator() instanceof DiscriminatorType);
    });

    describe('#constructor()', () => {
        it('should store a reference of a mapper function', () => {
            const mapper = function() {};

            assert.strictEqual(Discriminator(mapper).mapper, mapper);
            assert.strictEqual(new Discriminator(mapper).mapper, mapper);
            assert.strictEqual(new DiscriminatorType(mapper).mapper, mapper);
        });
    });

    describe('#getType()', () => {
        it('should call the stored mapper function', (done) => {
            const discriminator = Discriminator(done);

            discriminator.getType();
        });
        it('should pass the value argument to the mapper for discrimination', (done) => {
            const discriminator = Discriminator(value => {
                assert.ok(value);
                done();
            });

            discriminator.getType({ type: 'foo' });
        });
        it('should return the value returned from the passed mapper', () => {
            const discriminator = Discriminator(value => value.type);

            assert.strictEqual(discriminator.getType({ type: 'foo' }), 'foo');
        });
    });
});