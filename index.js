var MetadataFactory = require('./lib/metadata/MetadataFactory').default;
var NormalizerRegistry = require('./lib/normalizer/NormalizerRegistry').default;
var EncoderRegistry = require('./lib/encoder/EncoderRegistry').default;
var DecoderRegistry = require('./lib/decoder/DecoderRegistry').default;
var DecoratorRegistry = require('./lib/decorators/DecoratorRegistry').default;
var Serializer = require('./lib/Serializer').default;

// normalizers / encoders
var DefaultNormalizer = require('./lib/normalizer/DefaultNormalizer').default;
var MetadataAwareNormalizer = require('./lib/normalizer/MetadataAwareNormalizer').default;
var CollectionNormalizer = require('./lib/normalizer/CollectionNormalizer').default;
var DateNormalizer = require('./lib/normalizer/DateNormalizer').default;
var JsonEncoder = require('./lib/encoder/JsonEncoder').default;
var JsonDecoder = require('./lib/decoder/JsonDecoder').default;
var XmlEncoder = require('./lib/encoder/XmlEncoder').default;
var XmlDecoder = require('./lib/decoder/XmlDecoder').default;

// decorator classes
var Type = require('./lib/decorators/Type').Type;
var Expose = require('./lib/decorators/Expose').Expose;
var Discriminator = require('./lib/decorators/Discriminator').Discriminator;
var SerializationGroups = require('./lib/decorators/SerializationGroups').SerializationGroups;
var SerializedName = require('./lib/decorators/SerializedName').SerializedName;

var decoratorRegistry = new DecoratorRegistry();
var normalizerRegistry = new NormalizerRegistry(new MetadataFactory(decoratorRegistry));
var encoderRegistry = new EncoderRegistry();
var decoderRegistry = new DecoderRegistry();

normalizerRegistry.addNormalizer(new DefaultNormalizer());
normalizerRegistry.addNormalizer(new MetadataAwareNormalizer());
normalizerRegistry.addNormalizer(new CollectionNormalizer());
normalizerRegistry.addNormalizer(new DateNormalizer());
encoderRegistry.addEncoder(new JsonEncoder());
decoderRegistry.addDecoder(new JsonDecoder());
encoderRegistry.addEncoder(new XmlEncoder());
decoderRegistry.addDecoder(new XmlDecoder());

decoratorRegistry.addDecorator(new Type());
decoratorRegistry.addDecorator(new Expose());
decoratorRegistry.addDecorator(new Discriminator());
decoratorRegistry.addDecorator(new SerializationGroups());
decoratorRegistry.addDecorator(new SerializedName());

exports.default = new Serializer(normalizerRegistry, encoderRegistry, decoderRegistry);
exports.FormatTypes = require('./lib/FormatTypes');
exports.decorators = require('./lib/decorators');
exports.types = require('./lib/types');

exports.decoratorRegistry = decoratorRegistry;
exports.normalizerRegistry = normalizerRegistry;
exports.encoderRegistry = encoderRegistry;
exports.decoderRegistry = decoderRegistry;
