import { Type } from '../../../src/decorators';

export default class FooModel {
    @Type(Boolean)
    propA = true;

    @Type(Number)
    propB = 3;

    @Type(String)
    propC = "test";
}