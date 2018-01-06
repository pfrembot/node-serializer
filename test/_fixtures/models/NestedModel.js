import UndecoratedModel from './UndecoratedModel';
import TypeDecoratedModel from './TypeDecoratedModel';
import { Type } from '../../../src/decorators';

class NestedModel {
    propA = 'propA';
    propB = undefined;
    @Type(TypeDecoratedModel)
    propC = undefined;

    constructor() {
        this.propB = new UndecoratedModel();
        this.propC = new TypeDecoratedModel();
    }
}

export default NestedModel;