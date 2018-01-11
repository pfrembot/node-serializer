import { Type } from '../../../src/decorators';

class TypeDecoratedModel {

    @Type(Boolean)
    propA = 'true';

    @Type(Number)
    propB = '123';

    @Type(String)
    propC = 'propC';

    @Type(Date)
    propD = new Date('Wed Jan 10 2018 19:51:15 GMT-0600 (CST)');
}

export default TypeDecoratedModel;