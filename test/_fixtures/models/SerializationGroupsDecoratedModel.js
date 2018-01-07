import { SerializationGroups } from "../../../src/decorators";

class SerializationGroupsDecoratedModel {

    @SerializationGroups('foo')
    propA = true;

    @SerializationGroups('foo', 'bar')
    propB = 123;

    @SerializationGroups('baz')
    propC = 'propC';

    propD = 'propD';
}

export default SerializationGroupsDecoratedModel;