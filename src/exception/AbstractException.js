/**
 * AbstractException Class
 *
 * @class AbstractException
 */
class AbstractException extends Error {
    /**
     * AbstractException Constructor
     *
     * Extends and initializes custom error classes from default built-in Error class
     *
     * @notes
     *  1. `this.name` is set to the concrete class's constructor name for convenience
     *  2. `Error.captureStackTrace(this, this.constructor)` captures the stacktrace excluding
     *      its own constructor call
     *  3.  Application must be built with "babel-plugin-transform-builtin-extend" enabled to
     *      correct issues with instanceof and constructor access when extending Error
     *
     * @example .babelrc babel-plugin-transform-builtin-extend configuration
     *
     * ```
     * "plugins": [
     *   ["babel-plugin-transform-builtin-extend",
     *     { "globals": ["Error", "Array"] }
     *   ]
     * ]
     * ```
     *
     * @see https://gist.github.com/slavafomin/b164e3e710a6fc9352c934b9073e7216 (original solution)
     * @see https://github.com/loganfsmyth/babel-plugin-transform-builtin-extend
     * @see https://github.com/babel/babel/issues/4158
     *
     * @param message
     */
    constructor(message) {
        super(message);

        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /** @inheritDoc */
    toString() {
        return this.stack;
    }
}

export default AbstractException;