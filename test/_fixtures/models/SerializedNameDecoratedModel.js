import { SerializedName } from '../../../src/decorators';

class SerializedNameDecoratedModel {
    @SerializedName('prop_a')
    propA = true;
    @SerializedName('prop_b')
    propB = 123;
    @SerializedName('prop_c')
    propC = 'propC';
}

export default SerializedNameDecoratedModel;