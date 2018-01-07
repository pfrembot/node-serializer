import { Expose } from "../../../src/decorators";

class ExposeDecoratedModel {

    @Expose(false)
    propA = true;

    @Expose(true)
    propB = 123;

    @Expose()
    propC = 'propC';
}

export default ExposeDecoratedModel;