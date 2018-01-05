var MetadataFactory = require('./lib/metadata/MetadataFactory').default;
var NormalizerRegistry = require('./lib/normalizer/NormalizerRegistry').default;
var EncoderRegistry = require('./lib/encoder/EncoderRegistry').default;
var DecoderRegistry = require('./lib/decoder/DecoderRegistry').default;
var Serializer = require('./lib/Serializer').default;
var FormatTypes = require('./lib/Serializer');

var normalizerRegistry = new NormalizerRegistry(new MetadataFactory());
var encoderRegistry = new EncoderRegistry();
var decoderRegistry = new DecoderRegistry();

var DefaultNormalizer = require('./lib/normalizer/DefaultNormalizer').default;
var JsonEncoder = require('./lib/encoder/JsonEncoder').default;
var JsonDecoder = require('./lib/decoder/JsonDecoder').default;

normalizerRegistry.addNormalizer(new DefaultNormalizer());
encoderRegistry.addEncoder(new JsonEncoder());
decoderRegistry.addDecoder(new JsonDecoder());

exports.defalt = new Serializer(normalizerRegistry, encoderRegistry, decoderRegistry);
exports.decorators = require('./lib/decorators');
exports.FormatTypes = FormatTypes;

exports.normalizerRegistry = normalizerRegistry;
exports.encoderRegistry = encoderRegistry;
exports.decoderRegistry = encoderRegistry;
