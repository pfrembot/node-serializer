import _ListOf from "./ListOf";
import _MapOf from "./MapOf";
import _Discriminator from './Discriminator';

/**
 * ListOf Factory Function
 *
 * @param {Function|Discriminator} typeOrDiscriminator
 * @returns {ListOf}
 * @constructor
 */
export const ListOf = typeOrDiscriminator => new _ListOf(typeOrDiscriminator);

/**
 * MapOf Factory Function
 *
 * @param {Function|Discriminator} typeOrDiscriminator
 * @returns {ListOf}
 * @constructor
 */
export const MapOf = typeOrDiscriminator => new _MapOf(typeOrDiscriminator);

/**
 * Discriminator Factory Function
 *
 * @param {Function} mapper
 * @returns {ListOf}
 * @constructor
 */
export const Discriminator = mapper => new _Discriminator(mapper);