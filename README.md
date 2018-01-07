Node Serializer
===============
Serialization library for node inspired by [Symfony's Serializer Component(https://symfony.com/doc/current/components/serializer.html)](https://symfony.com/doc/current/components/serializer.html)

Library for controlling the way that application data is serialized/deserialized from a formatted string.

# Installation

```bash
npm install --save node-serializer
```

# Basic Usage

__Serialize Custom Classes (plain)__

```javascript
import serializer from 'node-serializer';

class Foo {
    id = 3;
    name = 'My Name';
}

const foo = new Foo();

serializer.serialize(foo, 'json'); // {"id":3,"name":"My Name"}
```

__Specify Data Types__

```javascript
import serializer from 'node-serializer';
import { decorators as Serializer } from 'node-serializer';

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
import serializer from 'node-serializer';
import { decorators as Serializer } from 'node-serializer';

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
import serializer from 'node-serializer';
import { decorators as Serializer } from 'node-serializer';

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
import serializer from 'node-serializer';
import { decorators as Serializer } from 'node-serializer';

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

__Deserialize Directly to Model__

```javascript
import serializer from 'node-serializer';

class Foo {
    id = 3;
    name = 'My Name';
}

serializer.deserialize('{"id":4,"name":"John Doe"}', 'json', Foo);

/*
    Foo { id: 4, name: 'John Doe' }
 */
```

__Deserialize and Fix Type__

```javascript
import serializer from 'node-serializer';
import { decorators as Serializer } from 'node-serializer';

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
    Foo { id: 4, name: 'John Doe', alive: true }
 */
```

__Deserialize and Restore Property Name__

```javascript
import serializer from 'node-serializer';
import { decorators as Serializer } from 'node-serializer';

class Foo {
    @Serializer.SerializedName('ID')
    id = 3;
    @Serializer.SerializedName('Name')
    name = 'My Name';
}

serializer.deserialize('{"ID":"4","Name":"John Doe"}', 'json', Foo); 

/*
    Foo { id: 4, name: 'John Doe' }
 */
```

__Deserialize Nested Models__

```javascript
import serializer from 'node-serializer';
import { decorators as Serializer } from 'node-serializer';

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
    Bar { id: 4, name: 'John Doe', foo: Foo { id: 5, name: 'foo' }}
 */
```

# Serialization Components

## Encoders/Decoders

This are classes that are solely responsible for converting standard JavaScript data structures (i.e. String, Number, Array, Object)
into and from a formatted string like JSON or XML.

By default a couple of encoders/decoders are provided:

* __JsonEncoder/JsonDecoder__: handles converting to and from JSON formatted strings
* __XmlEncoder/XmlDecoder__: handles converting to and from XML formatted strings (uses: [xml2js](https://www.npmjs.com/package/xml2js) lib)

_note: user-defined encoders/decoders can be added (see: [Advanced Usage](#Advanced Usage))_

## Normalizers

These classes are responsible for hydrating and simplifying normalized data structures like you might be using for application 
domain models. The addition of decorators to class properties tells the normalizer(s) how to convert standard JS data types
to and from what your application is expecting to use.

By default a couple of normalizers are provided:

* __DefaultNormalizer__: this is the last result if no other normalizer can be selected for the current value being normalized
* __MetadataAwareNormalizer__: applies decorator logic to values as they are being normalized based on class metadata

Normalizers are applied recursively so as each property/value is visited it will be passed back through the normalizer
registry chain to determine the correct normalizer to be used for that specific data structure

The application of decorators to data properties/values takes place inside of the normalizer, and is specific to the 
target normalizer implementation. By default this is included with the MetadataAwareNormalizer, but if additional user-defined
normalizers have been added they are responsible for managing decorators and metadata if they choose to do so.

_note: user-defined normalizers can be added (see: [Advanced Usage](#Advanced Usage))_

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
* __SerializationGroups__: Determines if a property should be exposed during serialization by group (only applies to serialization)
* __SerializedName__: Converts property names to and from their serialized counterpart (e.g. my_serialized_prop <-> myDeserializedProp)

_note: user-defined normalizers can be added (see: [Advanced Usage](#Advanced Usage))_

# Advanced Usage

_coming soon..._

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