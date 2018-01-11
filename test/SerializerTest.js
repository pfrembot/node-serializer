import assert from 'assert';
import Serializer from '../src/Serializer';
import JsonEncoder from '../src/encoder/JsonEncoder';
import JsonDecoder from '../src/decoder/JsonDecoder';
import NormalizerRegistry from '../src/normalizer/NormalizerRegistry';
import EncoderRegistry from '../src/encoder/EncoderRegistry';
import DecoderRegistry from '../src/decoder/DecoderRegistry';
import DefaultNormalizer from '../src/normalizer/DefaultNormalizer';
import MetadataAwareNormalizer from '../src/normalizer/MetadataAwareNormalizer';
import DateNormalizer from '../src/normalizer/DateNormalizer';
import UndecoratedModel from './_fixtures/models/UndecoratedModel';
import TypeDecoratedModel from './_fixtures/models/TypeDecoratedModel';
import ExposeDecoratedModel from './_fixtures/models/ExposeDecoratedModel';
import DiscriminatorDecoratedModel from './_fixtures/models/DiscriminatorDecoratedModel';
import SerializedNameDecoratedModel from './_fixtures/models/SerializedNameDecoratedModel';
import SerializationGroupsDecoratedModel from './_fixtures/models/SerializationGroupsDecoratedModel';
import NestedModel from './_fixtures/models/NestedModel';
import { SerializedName } from '../src/decorators/SerializedName';
import { SerializationGroups } from '../src/decorators/SerializationGroups';
import { Discriminator } from '../src/decorators/Discriminator';
import { Expose } from '../src/decorators/Expose';
import { Type } from '../src/decorators/Type';

describe('Serializer', () => {
    const serializer = new Serializer();

    it('should be instance of Serializer', () => {
        assert(serializer instanceof Serializer);
    });
    it('should contain a reference to the normalizerRegistry', () => {
        assert(serializer.normalizerRegistry instanceof NormalizerRegistry);
    });
    it('should contain a reference to the encoderRegistry', () => {
        assert(serializer.encoderRegistry instanceof EncoderRegistry);
    });
    it('should contain a reference to the decoderRegistry', () => {
        assert(serializer.decoderRegistry instanceof DecoderRegistry);
        assert.strictEqual(serializer.decoratorRegistry, serializer.normalizerRegistry.metadataFactory.decoratorRegistry);
    });

    describe('#serialize()', () => {
        const serializer = new Serializer();

        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should return void if no data is provided', () => {
            assert.strictEqual(serializer.serialize(void 0, 'json'), undefined);
        });
        it('should return serialized null if null is provided', () => {
            assert.strictEqual(serializer.serialize(null, 'json'), "null");
        });
        it('should return serialized string if string is provided', () => {
            assert.strictEqual(serializer.serialize('string', 'json'), "\"string\"");
        });
        it('should return serialized integer if integer is provided', () => {
            assert.strictEqual(serializer.serialize(123, 'json'), "123");
        });
        it('should return serialized float if float is provided', () => {
            assert.strictEqual(serializer.serialize(123.45, 'json'), "123.45");
        });
        it('should return serialized boolean if boolean is provided', () => {
            assert.strictEqual(serializer.serialize(true, 'json'), "true");
        });
        it('should return serialized empty array if empty array is provided', () => {
            assert.strictEqual(serializer.serialize([], 'json'), "[]");
        });
        it('should return serialized empty array if empty object is provided', () => {
            assert.strictEqual(serializer.serialize({}, 'json'), "{}");
        });
    });

    describe('#serialize(UndecoratedModel)', () => {
        const serializer = new Serializer();
        const model = new UndecoratedModel();

        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should be serialized as json', () => {
            const json = serializer.serialize(model, 'json');

            assert.strictEqual(typeof json, 'string');
            assert.strictEqual(json, '{"propA":true,"propB":123,"propC":"propC"}');
        });
    });

    describe('#serialize(TypeDecoratedModel)', () => {
        const serializer = new Serializer();
        const model = new TypeDecoratedModel();

        serializer.decoratorRegistry.addDecorator(new Type());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.normalizerRegistry.addNormalizer(new DateNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should be serialized as json', () => {
            const json = serializer.serialize(model, 'json');

            assert.strictEqual(typeof json, 'string');
            assert.strictEqual(json, '{"propA":true,"propB":123,"propC":"propC","propD":"Wed Jan 10 2018 19:51:15 GMT-0600 (CST)"}');
        });
    });

    describe('#serialize(ExposeDecoratedModel)', () => {
        const serializer = new Serializer();
        const model = new ExposeDecoratedModel();

        serializer.decoratorRegistry.addDecorator(new Expose());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should be serialized as json', () => {
            const json = serializer.serialize(model, 'json');

            assert.strictEqual(typeof json, 'string');
            assert.strictEqual(json, '{"propB":123,"propC":"propC"}'); // propA removed
        });
    });

    describe('#serialize(DiscriminatorDecoratedModel)', () => {
        const serializer = new Serializer();
        const model = new DiscriminatorDecoratedModel();

        serializer.decoratorRegistry.addDecorator(new Discriminator());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should serialize without discrimination (discriminator only applied on deserialization)', () => {
            const json = serializer.serialize(model, 'json');

            assert.strictEqual(typeof json, 'string');
            assert.strictEqual(json, '{"propA":{"propA":true,"propB":123,"propC":"propC"}}');
        })
    });

    describe('#serialize(SerializationGroupsDecoratedModel)', () => {
        const serializer = new Serializer();
        const model = new SerializationGroupsDecoratedModel();

        serializer.decoratorRegistry.addDecorator(new SerializationGroups());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should be serialized as json normally with no context groups', () => {
            const json = serializer.serialize(model, 'json');

            assert.strictEqual(typeof json, 'string');
            assert.strictEqual(json, '{"propA":true,"propB":123,"propC":"propC","propD":"propD"}');
        });
        it('should be serialized as json with only foo group data', () => {
            const json = serializer.serialize(model, 'json', { groups: ['foo'] });

            assert.strictEqual(typeof json, 'string');
            assert.strictEqual(json, '{"propA":true,"propB":123,"propD":"propD"}'); // propC excluded
        });
        it('should be serialized as json with foo and baz group data', () => {
            const json = serializer.serialize(model, 'json', { groups: ['bar', 'baz'] });

            assert.strictEqual(typeof json, 'string');
            assert.strictEqual(json, '{"propB":123,"propC":"propC","propD":"propD"}'); // propA excluded
        });
    });

    describe('#serialize(SerializedNameDecoratedModel)', () => {
        const serializer = new Serializer();
        const model = new SerializedNameDecoratedModel();

        serializer.decoratorRegistry.addDecorator(new SerializedName());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should be serialized as json', () => {
            const json = serializer.serialize(model, 'json');

            assert.strictEqual(typeof json, 'string');
            assert.strictEqual(json, '{"prop_a":true,"prop_b":123,"prop_c":"propC"}');
        });
    });

    describe('#serialize(NestedModel)', () => {
        const serializer = new Serializer();
        const model = new NestedModel();

        serializer.decoratorRegistry.addDecorator(new Type());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.normalizerRegistry.addNormalizer(new DateNormalizer());
        serializer.encoderRegistry.addEncoder(new JsonEncoder());

        it('should be serialized as json', () => {
            const json = serializer.serialize(model, 'json');

            assert.strictEqual(typeof json, 'string');
            assert.strictEqual(json, '{"propA":"propA","propB":{"propA":true,"propB":123,"propC":"propC"},"propC":{"propA":true,"propB":123,"propC":"propC","propD":"Wed Jan 10 2018 19:51:15 GMT-0600 (CST)"}}');
        });
    });

    describe('#deserialize()', () => {
        const serializer = new Serializer();

        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.decoderRegistry.addDecoder(new JsonDecoder());

        it('should return null if serialized null is provided', () => {
            assert.strictEqual(serializer.deserialize("null", 'json'), null);
        });
        it('should return empty string if serialized empty string is provided', () => {
            assert.strictEqual(serializer.deserialize('""', 'json'), '');
        });
        it('should return string if serialized string is provided', () => {
            assert.strictEqual(serializer.deserialize("\"string\"", 'json'), 'string');
        });
        it('should return integer if serialized integer is provided', () => {
            assert.strictEqual(serializer.deserialize("123", 'json'), 123);
        });
        it('should return float if serialized float is provided', () => {
            assert.strictEqual(serializer.deserialize("123.45", 'json'), 123.45);
        });
        it('should return boolean if serialized boolean is provided', () => {
            assert.strictEqual(serializer.deserialize("true", 'json'), true);
            assert.strictEqual(serializer.deserialize("false", 'json'), false);
        });
        it('should return empty array if serialized empty array is provided', () => {
            assert.deepEqual(serializer.deserialize("[]", 'json'), []);
        });
        it('should return empty object if serialized empty object is provided', () => {
            assert.deepEqual(serializer.deserialize("[]", 'json'), []);
        });
    });

    describe('#deserialize(UndecoratedModel)', () => {
        const serializer = new Serializer();
        const data = '{"propA":false,"propB":321,"propC":"foo"}';

        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.decoderRegistry.addDecoder(new JsonDecoder());

        it('should be deserialized to UndecoratedModel', () => {
            const model = serializer.deserialize(data, 'json', UndecoratedModel);

            assert(model instanceof UndecoratedModel);
            assert.strictEqual(model.propA, false);
            assert.strictEqual(model.propB, 321);
            assert.strictEqual(model.propC, 'foo');
        });
    });

    describe('#deserialize(TypeDecoratedModel)', () => {
        const serializer = new Serializer();
        const data = '{"propA":"","propB":"321","propC":"bar"}';

        serializer.decoratorRegistry.addDecorator(new Type());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.decoderRegistry.addDecoder(new JsonDecoder());

        it('should be deserialized to TypeDecoratedModel', () => {
            const model = serializer.deserialize(data, 'json', TypeDecoratedModel);

            assert(model instanceof TypeDecoratedModel);
            assert.strictEqual(model.propA, false);
            assert.strictEqual(model.propB, 321);
            assert.strictEqual(model.propC, 'bar');
        });
    });

    describe('#deserialize(ExposeDecoratedModel)', () => {
        const serializer = new Serializer();
        const data = '{"propA":false,"propB":321,"propC":"bar"}';

        serializer.decoratorRegistry.addDecorator(new Expose());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.decoderRegistry.addDecoder(new JsonDecoder());

        it('should be deserialized to ExposeDecoratedModel with all data intact', () => {
            const model = serializer.deserialize(data, 'json', ExposeDecoratedModel);

            assert(model instanceof ExposeDecoratedModel);
            assert.strictEqual(model.propA, false); // propA still intact
            assert.strictEqual(model.propB, 321);
            assert.strictEqual(model.propC, 'bar');
        });
    });

    describe('#deserialize(DiscriminatorDecoratedModel)', () => {
        const serializer = new Serializer();

        serializer.decoratorRegistry.addDecorator(new Discriminator());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.decoderRegistry.addDecoder(new JsonDecoder());

        it('should be deserialized into a plain object model when json type equals "null"', () => {
            const data = '{"propA":{"type":null,"propA":false,"propB":321,"propC":"foo"}}';
            const model = serializer.deserialize(data, 'json', DiscriminatorDecoratedModel);

            assert(model instanceof DiscriminatorDecoratedModel);

            assert(model.propA instanceof Object);
            assert(!(model.propA instanceof UndecoratedModel));
            assert(!(model.propA instanceof TypeDecoratedModel));
            assert.strictEqual(model.propA.propA, false);
            assert.strictEqual(model.propA.propB, 321);
            assert.strictEqual(model.propA.propC, 'foo');
        });
        it('should be deserialized into an undecorated model when json type equals "UndecoratedModel"', () => {
            const data = '{"propA":{"type":"UndecoratedModel","propA":false,"propB":321,"propC":"bar"}}';
            const model = serializer.deserialize(data, 'json', DiscriminatorDecoratedModel);

            assert(model instanceof DiscriminatorDecoratedModel);

            assert(model.propA instanceof UndecoratedModel);
            assert.strictEqual(model.propA.propA, false);
            assert.strictEqual(model.propA.propB, 321);
            assert.strictEqual(model.propA.propC, 'bar');
        });
        it('should be deserialized into a type decorated model when json type equals "TypeDecoratedModel"', () => {
            const data = '{"propA":{"type":"TypeDecoratedModel","propA":false,"propB":321,"propC":"baz"}}';
            const model = serializer.deserialize(data, 'json', DiscriminatorDecoratedModel);

            assert(model instanceof DiscriminatorDecoratedModel);

            assert(model.propA instanceof TypeDecoratedModel);
            assert.strictEqual(model.propA.propA, false);
            assert.strictEqual(model.propA.propB, 321);
            assert.strictEqual(model.propA.propC, 'baz');
        });
    });

    describe('#deserialize(SerializationGroupsDecoratedModel)', () => {
        const serializer = new Serializer();
        const data = '{"propA":false,"propB":321,"propC":"foo","propD":"bar"}';

        serializer.decoratorRegistry.addDecorator(new SerializationGroups());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.decoderRegistry.addDecoder(new JsonDecoder());

        it('should be deserialized to SerializationGroupsDecoratedModel', () => {
            const model = serializer.deserialize(data, 'json', SerializationGroupsDecoratedModel);

            // all data intact
            assert(model instanceof SerializationGroupsDecoratedModel);
            assert.strictEqual(model.propA, false);
            assert.strictEqual(model.propB, 321);
            assert.strictEqual(model.propC, 'foo');
            assert.strictEqual(model.propD, 'bar');
        });
        it('should still be deserialized to SerializationGroupsDecoratedModel with context groups', () => {
            const model = serializer.deserialize(data, 'json', SerializationGroupsDecoratedModel, { groups: ['foo'] });

            // all data intact
            assert(model instanceof SerializationGroupsDecoratedModel);
            assert.strictEqual(model.propA, false);
            assert.strictEqual(model.propB, 321);
            assert.strictEqual(model.propC, 'foo');
            assert.strictEqual(model.propD, 'bar');
        });
    });

    describe('#deserialize(SerializedNameDecoratedModel)', () => {
        const serializer = new Serializer();
        const data = '{"prop_a":false,"prop_b":321,"prop_c":"baz"}';

        serializer.decoratorRegistry.addDecorator(new SerializedName());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.decoderRegistry.addDecoder(new JsonDecoder());

        it('should be deserialized to SerializedNameDecoratedModel', () => {
            const model = serializer.deserialize(data, 'json', SerializedNameDecoratedModel);

            assert(model instanceof SerializedNameDecoratedModel);
            assert.strictEqual(model.propA, false);
            assert.strictEqual(model.propB, 321);
            assert.strictEqual(model.propC, 'baz');
        });
    });

    describe('#serialize(NestedModel)', () => {
        const serializer = new Serializer();
        const data = '{"propA":"foo","propB":{"propA":false,"propB":321,"propC":"bar"},"propC":{"propA":0,"propB":"321","propC":"baz"}}';

        serializer.decoratorRegistry.addDecorator(new Type());
        serializer.normalizerRegistry.addNormalizer(new DefaultNormalizer());
        serializer.normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
        serializer.decoderRegistry.addDecoder(new JsonDecoder());

        it('should be deserialized to NestedModel', () => {
            const model = serializer.deserialize(data, 'json', NestedModel);

            assert(model instanceof NestedModel);
            assert.strictEqual(model.propA, 'foo');

            assert(model.propB instanceof Object);
            assert(!(model.propB instanceof UndecoratedModel)); // propB has to Type decoration
            assert.strictEqual(model.propB.propA, false);
            assert.strictEqual(model.propB.propB, 321);
            assert.strictEqual(model.propB.propC, 'bar');

            assert(model.propC instanceof TypeDecoratedModel);
            assert.strictEqual(model.propC.propA, false);
            assert.strictEqual(model.propC.propB, 321);
            assert.strictEqual(model.propC.propC, 'baz');
        });
    });
});
