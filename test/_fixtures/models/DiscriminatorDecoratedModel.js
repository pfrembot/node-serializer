import { Discriminator } from '../../../src/decorators';
import TypeDecoratedModel from './TypeDecoratedModel';
import UndecoratedModel from './UndecoratedModel';

const mapper = value => {
    if (value.type === 'UndecoratedModel') return UndecoratedModel;
    if (value.type === 'TypeDecoratedModel') return TypeDecoratedModel;

    return Object;
};

class DiscriminatorDecoratedModel {

    @Discriminator(mapper)
    propA = new UndecoratedModel();
}

export default DiscriminatorDecoratedModel;