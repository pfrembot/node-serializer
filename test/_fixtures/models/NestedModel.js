import UndecoratedModel from './UndecoratedModel';
import TypeDecoratedModel from './TypeDecoratedModel';

class NestedModel {
    propA = 'propA';
    propB = undefined;
    propC = undefined;

    constructor() {
        this.propB = new UndecoratedModel();
        this.propC = new TypeDecoratedModel();
    }
}

export default NestedModel;