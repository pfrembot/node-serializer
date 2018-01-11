Node Serializer
===============
Serialization library for node inspired by [Symfony's Serializer Component](https://symfony.com/doc/current/components/serializer.html)

Library for controlling the way that application data is serialized/deserialized from a formatted string.

# Installation

```bash
npm install --save @pfrembot/node-serializer
```

# Basic Usage

## Serialization

__Serialize Custom Classes (plain)__

```javascript
import serializer from '@pfrembot/node-serializer';

class Foo {
    id = 3;
    name = 'My Name';
}

const foo = new Foo();

serializer.serialize(foo, 'json'); // {"id":3,"name":"My Name"}
```

__Specify Data Types__

```javascript
import serializer from '@pfrembot/node-serializer';
import { decorators as Serializer } from '@pfrembot/node-serializer';

class Foo {
    @Serializer.Type(Number)
    id = '3';
    @Serializer.Type(String)
    name = 'My Name';
    @Serializer.Type(Boolean)
    alive = 1;
}

const foo = new Foo();

serializer.serialize(foo, 'json'); // {"id":3,"name":"My Name","alive":true}
```

__Change Property Names__

```javascript
import serializer from '@pfrembot/node-serializer';
import { decorators as Serializer } from '@pfrembot/node-serializer';

class Foo {
    @Serializer.SerializedName('ID')
    id = 3;
    @Serializer.SerializedName('Name')
    name = 'My Name';
}

const foo = new Foo();

serializer.serialize(foo, 'json'); // {"ID":3,"Name":"My Name"}
```

__Expose/Exclude Properties__

```javascript
import serializer from '@pfrembot/node-serializer';
import { decorators as Serializer } from '@pfrembot/node-serializer';

class Foo {
    @Serializer.Expose(true)
    id = 3;
    @Serializer.Expose(true)
    name = 'My Name';
    @Serializer.Expose(false)
    alive = true;
}

const foo = new Foo();

serializer.serialize(foo, 'json'); // {"id":3,"name":"My Name"}
```

__Expose/Exclude Properties by Group__

```javascript
import serializer from '@pfrembot/node-serializer';
import { decorators as Serializer } from '@pfrembot/node-serializer';

class Foo {
    @Serializer.SerializationGroups('foo')
    id = 3;
    @Serializer.SerializationGroups('foo', 'bar')
    name = 'My Name';
    @Serializer.SerializationGroups('baz')
    alive = true;
}

const foo = new Foo();

serializer.serialize(foo, 'json', { groups: ['foo'] }); // {"id":3,"name":"My Name"}
serializer.serialize(foo, 'json', { groups: ['bar', 'baz'] }); // {"name":"My Name","alive":true}
serializer.serialize(foo, 'json', { groups: ['baz'] }); // {"alive":true}
```

## Deserialization

__Deserialize Directly to Model__

```javascript
import serializer from '@pfrembot/node-serializer';

class Foo {
    id = 3;
    name = 'My Name';
}

serializer.deserialize('{"id":4,"name":"John Doe"}', 'json', Foo);

/*
  Results: Foo { id: 4, name: 'John Doe' }
 */
```

__Deserialize and Fix Data Type__

```javascript
import serializer from '@pfrembot/node-serializer';
import { decorators as Serializer } from '@pfrembot/node-serializer';

class Foo {
    @Serializer.Type(Number)
    id = 3;
    @Serializer.Type(String)
    name = 'My Name';
    @Serializer.Type(Boolean)
    alive = false;
}

serializer.deserialize('{"id":"4","name":"John Doe","alive":1}', 'json', Foo); 

/*
  Results: Foo { id: 4, name: 'John Doe', alive: true }
 */
```

__Deserialize and Restore Property Name__

```javascript
import serializer from '@pfrembot/node-serializer';
import { decorators as Serializer } from '@pfrembot/node-serializer';

class Foo {
    @Serializer.SerializedName('ID')
    id = 3;
    @Serializer.SerializedName('Name')
    name = 'My Name';
}

serializer.deserialize('{"ID":"4","Name":"John Doe"}', 'json', Foo); 

/*
  Results: Foo { id: 4, name: 'John Doe' }
 */
```

__Deserialize Nested Models__

```javascript
import serializer from '@pfrembot/node-serializer';
import { decorators as Serializer } from '@pfrembot/node-serializer';

class Foo {
    id = 3;
    name = 'My Name';
}

class Bar {
    @Serializer.Type(Number)
    id = 3;
    @Serializer.Type(String)
    name = null;
    @Serializer.Type(Foo)
    foo = null;
}

serializer.deserialize('{"id":4,"name":"John Doe","foo":{"id":5,"name":"foo"}}', 'json', Bar); 

/*
  Results: Bar { id: 4, name: 'John Doe', foo: Foo { id: 5, name: 'foo' }}
 */
```

## Lists, Maps, and Polymorphic Types

Sometimes you have encoded data that represents a collection of items. Sometimes these can be a collection of all the same
type of item (homogeneous), and other times one containing various data types (heterogeneous). These can be tricky to 
deserialize because it is not always clear what type of data we are going to be converting into, and more so, impossible 
since we don't have a clear idea what the collection keys/indices will be ahead of time.

Enter ListOf, MapOf, and Polymorphic serializer types. These intermediate data types allow us to define collections of
data abstractly so we can avoid the unpleasantness of trying create decorated classes that describe collections of known
data types we already have defined.

__Deserialize Lists of Single Type (homogeneous)__

```javascript
import serializer from '@pfrembot/node-serializer';
import { types as Types } from '@pfrembot/node-serializer';

class Foo {
    id = null;
    name = null;
}

const json = '[{"id":1,"name":"John D"},{"id":2,"name":"Jane D"},{"id":3,"name":"Frank"}]';

serializer.deserialize(json, 'json', Types.ListOf(Foo));

/*
  Results: [ Foo { id: 1, name: 'John D' }, Foo { id: 2, name: 'Jane D' }, Foo { id: 3, name: 'Frank' } ]
 */
```

__Deserialize Lists of Polymorphic Type (heterogeneous)__

```javascript
import serializer from '@pfrembot/node-serializer';
import { types as Types } from '@pfrembot/node-serializer';

// mapper function *must* return a type constructor
const mapper = value => {
    if (value.type === 'foo') return Foo;
    if (value.type === 'bar') return Bar;
    
    return Object; // default fallback type
};

class Foo {
    type = 'foo';
    id = null;
    name = null;
}

class Bar {
    type = 'bar';
    id = null;
    name = null;
    age = null;
}

const json = '[{"type":"foo","id":1,"name":"John D"},{"type":"bar","id":2,"name":"Jane D","age":27},{"id":3,"name":"Frank"}]';

// A discriminator is passed to ListOf instead of a single type. The discriminator will
// be called by the serializer for each value in the list invoking your mapper function above
// to determine what type each value should be deserialized into
serializer.deserialize(json, 'json', Types.ListOf(Types.Discriminator(mapper)));

/*
  Results: [ Foo { type: 'foo', id: 1, name: 'John D' }, Bar { type: 'bar', id: 2, name: 'Jane D', age: 27 }, { id: 3, name: 'Frank' } ]
 */
```

__Deserialize Maps of Single Type (homogeneous)__

```javascript
import serializer from '@pfrembot/node-serializer';
import { types as Types } from '@pfrembot/node-serializer';

class Foo {
    id = null;
    name = null;
}

const json = '{"one":{"id":1,"name":"John D"},"two":{"id":2,"name":"Jane D"},"three":{"id":3,"name":"Frank"}]';

serializer.deserialize(json, 'json', Types.MapOf(Foo));

/*
  Results: { one: Foo { id: 1, name: 'John D' }, two: Foo { id: 2, name: 'Jane D' }, three: Foo { id: 3, name: 'Frank' } }
 */
```

__Deserialize Maps of Polymorphic Type (heterogeneous)__

```javascript
import serializer from '@pfrembot/node-serializer';
import { types as Types } from '@pfrembot/node-serializer';

// mapper function *must* return a type constructor
const mapper = value => {
    if (value.type === 'foo') return Foo;
    if (value.type === 'bar') return Bar;
    
    return Object; // default fallback type
};

class Foo {
    type = 'foo';
    id = null;
    name = null;
}

class Bar {
    type = 'bar';
    id = null;
    name = null;
    age = null;
}

const json = '{"one":{"type":"foo","id":1,"name":"John D"},"two":{"type":"bar","id":2,"name":"Jane D","age":27},"three":{"id":3,"name":"Frank"}}';

// A discriminator is passed to MapOf instead of a single type. The discriminator will
// be called by the serializer for each value in the list invoking your mapper function above
// to determine what type each value should be deserialized into
serializer.deserialize(json, 'json', Types.MapOf(Types.Discriminator(mapper)));

/*
  Results: { one: Foo { type: 'foo', id: 1, name: 'John D' }, two: Bar { type: 'bar', id: 2, name: 'Jane D', age: 27 }, three: { id: 3, name: 'Frank' } }
 */
```

__Deserialize Polymorphic Properties__

```javascript
import serializer from '@pfrembot/node-serializer';
import { decorators as Serializer } from '@pfrembot/node-serializer';

// mapper function *must* return a type constructor
const mapper = value => {
    if (value.type === 'bar') return Bar;
    if (value.type === 'baz') return Baz;
    
    return Object; // default fallback type
};

class Foo {
    @Serializer.Discriminator(mapper)
    child = null;
}

class Bar {
    type = 'bar';
}

class Baz {
    type = 'baz';
}

// has Bar child type
serializer.deserialize('{"child":{"type":"bar","id":1}}', 'json', Foo);

/*
  Results: Foo { sibling: Bar { type: 'bar', id: 2 } }
 */

// has Bar child type
serializer.deserialize('{"child":{"type":"baz","id":2}}', 'json', Foo);

/*
  Results: Foo { child: Baz { type: 'baz', id: 2 } }
 */

// has unknown child type
serializer.deserialize('{"child":{"id":3}}', 'json', Foo);

/*
  Results: Foo { child: { type: null, id: 3 } }
 */
```

# Serialization Components

## Encoders/Decoders

This are classes that are solely responsible for converting standard JavaScript data structures (i.e. String, Number, Array, Object)
into and from a formatted string like JSON or XML.

By default a couple of encoders/decoders are provided:

* __JsonEncoder/JsonDecoder__: handles converting to and from JSON formatted strings
* __XmlEncoder/XmlDecoder__: handles converting to and from XML formatted strings (uses: [xml2js](https://www.npmjs.com/package/xml2js) lib)

_note: user-defined encoders/decoders can be added (see: [Advanced Usage](#advanced-usage))_

## Normalizers

These classes are responsible for hydrating and simplifying normalized data structures like you might be using for application 
domain models. The addition of decorators to class properties tells the normalizer(s) how to convert standard JS data types
to and from what your application is expecting to use.

By default a couple of normalizers are provided:

* __DefaultNormalizer__: this is the last result if no other normalizer can be selected for the current value being normalized
* __MetadataAwareNormalizer__: applies decorator logic to values as they are being normalized based on class metadata
* __CollectionNormalizer__: handles de-normalization of ListOf and MapOf data types (see: [Lists, Maps, and Polymorphic Types](#lists-maps-and-polymorphic-types))
* __DateNormalizer__: handles normalizing/denormalizing Date objects and typed class properties

Normalizers are applied recursively so as each property/value is visited it will be passed back through the normalizer
registry chain to determine the correct normalizer to be used for that specific data structure

The application of decorators to data properties/values takes place inside of the normalizer, and is specific to the 
target normalizer implementation. By default this is included with the MetadataAwareNormalizer, but if additional user-defined
normalizers have been added they are responsible for managing decorators and metadata if they choose to do so.

_note: user-defined normalizers can be added (see: [Advanced Usage](#advanced-usage))_

## Decorators

These are responsible for defining metadata to be used during object normalization. Each decorator consists of essentially 
2 different pieces. The first is a decorator function responsible for defining metadata for class properties. The second is 
a decorator model class that is responsible for applying its specific logic to property keys and values during 
serialization/deserialization.

When data is being normalized the normalizer can invoke the decorators and pass information about the property and value
being normalized. Then each decorator that has been defined on that property will have an opportunity to apply its logic

By default there a few decorators included:

* __Type__: Ensures that the property value is serialized/deserialized as the property data type or class
* __Expose__: Determines if a property should be exposed during serialization (only applies to serialization)
* __Discriminator__: Used for polymorphic property types to determine the correct type to deserialize data to (only applies to deserialization)
* __SerializationGroups__: Determines if a property should be exposed during serialization by group (only applies to serialization)
* __SerializedName__: Converts property names to and from their serialized counterpart (e.g. my_serialized_prop <-> myDeserializedProp)

_note: user-defined normalizers can be added (see: [Advanced Usage](#advanced-usage))_

# Advanced Usage

## Adding Custom Encoders

All encoders are expected to satisfy the EncoderInterface: [src/encoder/EncoderInterface.js](src/encoder/EncoderInterface.js)

__Example:__

```javascript
import serializer from '@pfrembot/node-serializer';
import { encoderRegistry } from '@pfrembot/node-serializer';

class MyCustomEncoder {
    encode(object: any, format: string, context: SerializationContext) {
        
        /* implement your encoding logic here */
        
        return 'Encoded result string';
    }

    supportsEncoding(format: string, context: SerializationContext) {
        return format === 'my_custom_format';
    }
}

encoderRegistry.addEncoder(new MyCustomEncoder());

serializer.serialize({ data: '' }, 'my_custom_format'); // 'Encoded result string'
```

## Adding Custom Decoders

All decoders are expected to satisfy the DecoderInterface: [src/decoder/DecoderInterface.js](src/decoder/DecoderInterface.js)

__Example:__

```javascript
import serializer from '@pfrembot/node-serializer';
import { decoderRegistry } from '@pfrembot/node-serializer';

class Foo {
    data = null;
}

class MyCustomDecoder {
    decode(string: string, format: string, context: Object) {
        
        /* implement your decoding logic here */
        
        return { data: 'decoded' };
    }

    supportsDecoding(format: string, context: Object) {
        return format === 'my_custom_format';
    }
}

encoderRegistry.addDecoder(new MyCustomDecoder());

serializer.deserialize('Encoded result restring', 'my_custom_format', Foo);

/*
  Results: Foo { data: 'decoded' }
 */
```

## Adding Custom Noramlizers

```javascript
// coming soon
```

## Adding Custom Decorators

```javascript
// coming soon
```

# Tests 

__Flow Linting__

```bash
npm run flow
```

__Mocha Unit Tests__

```bash
npm run tests
```

# Build

```bash
npm run build
```
