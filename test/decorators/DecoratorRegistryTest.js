import assert from 'assert';
import DecoratorRegistry from '../../src/decorators/DecoratorRegistry';
import PropertyMetadata from '../../src/metadata/PropertyMetadata';
import AbstractDecorator from '../../src/decorators/AbstractDecorator';
import DecoratorInvalidException from '../../src/exception/DecoratorInvalidException';
import { Type } from "../../src/decorators/Type";

describe('DecoratorRegistry', () => {
    const decoratorRegistry = new DecoratorRegistry();

    it('should be an instance of DecoratorRegistry', () => {
        assert.equal(decoratorRegistry instanceof DecoratorRegistry, true);
    });

    describe('#addDecorator', () => {
        const decoratorRegistry = new DecoratorRegistry();

        it('should throw an exception when attempting to add invalid decorator', () => {
            assert.throws(() => decoratorRegistry.addDecorator(null), DecoratorInvalidException);
            assert.throws(() => decoratorRegistry.addDecorator({}), DecoratorInvalidException);
        });
        it('should add a decorator object at target key on the internal storage', () => {
            const decorator = new class extends AbstractDecorator {};

            decoratorRegistry.addDecorator(decorator);

            assert.equal(decorator.getKey() in decoratorRegistry.decorators, true);
            assert.equal(decoratorRegistry.decorators[decorator.getKey()] instanceof AbstractDecorator, true);
        });
    });

    describe('#applyDecorators', () => {
        it('should not apply any decorators for property metadata of non-decorated properties', () => {
            const decoratorRegistry = new DecoratorRegistry();
            const propertyMetadata = new PropertyMetadata('prop', new Type(Object));
            const decorator = new class extends AbstractDecorator {
                apply() { assert.fail(); }
            };

            decoratorRegistry.addDecorator(decorator);
            decoratorRegistry.applyDecorators(propertyMetadata, {});
        });
        it('should return a decorator result object event if no decorators applied', () => {
            const decoratorRegistry = new DecoratorRegistry();
            const propertyMetadata = new PropertyMetadata('prop');
            const decorator = new class extends AbstractDecorator {
                apply() { assert.fail(); }
            };

            const expectedValue = {};

            decoratorRegistry.addDecorator(decorator);

            const result = decoratorRegistry.applyDecorators(propertyMetadata, expectedValue);

            assert.equal(result.name, 'prop');
            assert.strictEqual(result.value, expectedValue);
        });
        it('should only apply decorators that exist in property metadata', () => {
            let applied = false;

            const decoratorA = new class extends AbstractDecorator {
                apply() { applied = true; }
            };
            const decoratorB = new class extends AbstractDecorator {
                apply() { assert.fail(); }
            };

            const decoratorRegistry = new DecoratorRegistry();
            const propertyMetadata = new PropertyMetadata('prop', decoratorA);

            decoratorRegistry.addDecorator(decoratorA);
            decoratorRegistry.addDecorator(decoratorB);
            decoratorRegistry.applyDecorators(propertyMetadata, {});

            assert.equal(applied, true);
        });
        it('should return a decorator result object if decorators were applied', () => {
            const decoratorA = new class extends AbstractDecorator {
                apply() { return { name: 'new_name', value: true }; }
            };
            const decoratorB = new class extends AbstractDecorator {
                apply() { assert.fail(); }
            };

            const decoratorRegistry = new DecoratorRegistry();
            const propertyMetadata = new PropertyMetadata('prop', decoratorA);

            decoratorRegistry.addDecorator(decoratorA);
            decoratorRegistry.addDecorator(decoratorB);

            const result = decoratorRegistry.applyDecorators(propertyMetadata, false);

            assert.equal(result.name, 'new_name');
            assert.equal(result.value, true);
        });
        it('should call the applied decorator\'s invoker function with result and decorator arguments', (done) => {
            const decoratorA = new class extends AbstractDecorator {
                apply(result) {
                    assert.equal(result.name, 'prop');
                    assert.equal(result.value, false);
                    done();
                }
            };
            const decoratorB = new class extends AbstractDecorator {
                apply() { assert.fail(); }
            };

            const decoratorRegistry = new DecoratorRegistry();
            const propertyMetadata = new PropertyMetadata('prop', decoratorA);

            decoratorRegistry.addDecorator(decoratorA);
            decoratorRegistry.addDecorator(decoratorB);
            decoratorRegistry.applyDecorators(propertyMetadata, false);
        });
        it('should allow decorator invoker function to mutate result key and value', () => {
            const decoratorA = new class extends AbstractDecorator {
                apply(result) {
                    result.name = 'newProp';
                    result.value = true;

                    return result;
                }
            };
            const decoratorB = new class extends AbstractDecorator {
                apply() { assert.fail(); }
            };


            const decoratorRegistry = new DecoratorRegistry();
            const propertyMetadata = new PropertyMetadata('prop', decoratorA);

            decoratorRegistry.addDecorator(decoratorA);
            decoratorRegistry.addDecorator(decoratorB);

            const result = decoratorRegistry.applyDecorators(propertyMetadata, false);

            assert.equal(result.name, 'newProp');
            assert.equal(result.value, true);
        });
        it('should return a decorator result object event if invoker failed to return result object', () => {
            const decoratorA = new class extends AbstractDecorator { /* oops! implementation apply!!! */ };
            const decoratorB = new class extends AbstractDecorator {
                apply() { assert.fail(); }
            };

            const decoratorRegistry = new DecoratorRegistry();
            const propertyMetadata = new PropertyMetadata('prop', decoratorA);

            decoratorRegistry.addDecorator(decoratorA);
            decoratorRegistry.addDecorator(decoratorB);

            const result = decoratorRegistry.applyDecorators(propertyMetadata, false);

            assert.equal(result.name, 'prop');
            assert.equal(result.value, false);
        });
        it('should return a decorator result object if invoker mutates result without returning', () => {
            const decoratorA = new class extends AbstractDecorator {
                apply(result) {
                    result.name = 'newProp';
                    result.value = true;

                    // oops! didn't return the updated result object!!!
                }
            };
            const decoratorB = new class extends AbstractDecorator {
                apply() { assert.fail(); }
            };

            const decoratorRegistry = new DecoratorRegistry();
            const propertyMetadata = new PropertyMetadata('prop', decoratorA);

            decoratorRegistry.addDecorator(decoratorA);
            decoratorRegistry.addDecorator(decoratorB);

            const result = decoratorRegistry.applyDecorators(propertyMetadata, false);

            assert.equal(result.name, 'newProp');
            assert.equal(result.value, true);
        });
    });
});