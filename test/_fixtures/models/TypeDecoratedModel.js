import { Type } from '../../../src/decorators';

class TypeDecoratedModel {

    @Type(Boolean)
    propA = 'true';

    @Type(Number)
    propB = '123';

    @Type(String)
    propC = 'propC';
}

export default TypeDecoratedModel;