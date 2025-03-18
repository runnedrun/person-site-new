// Create a base class that can be extended
class ExtendableBase {
  constructor(...args) {
    // Store any properties set during construction
    this._props = {}

    // Handle any props passed to constructor
    if (args.length > 0 && typeof args[0] === "object") {
      Object.assign(this._props, args[0])
    }
  }
}

// Create a function that returns the base class
function createBaseClass() {
  return ExtendableBase
}

// Pre-declare moduleStub to avoid reference errors
let moduleStub

// Create a handler that properly handles the prototype chain
const handler = {
  get(target, prop) {
    if (prop === "_isStub") {
      return true
    }
    // Critical: Return the actual prototype for inheritance
    if (prop === "prototype") {
      return ExtendableBase.prototype
    }

    // Handle special Next.js/Turbopack properties
    if (
      prop === "__esModule" ||
      prop === "default" ||
      prop === "__turbopack_resolve_module_id__" ||
      prop === "__turbopack_import__" ||
      prop === "__webpack_require__" ||
      prop === "__webpack_exports__" ||
      prop === "__webpack_module__" ||
      prop === "__next_init__" ||
      prop === "__next_handled__" ||
      prop === "__next_register__" ||
      prop === "__next_scope__"
    ) {
      if (prop === "default") {
        return moduleStub
      }

      if (prop === "__esModule") {
        return true
      }

      // Return a no-op function for Next.js internals
      return function () {
        return moduleStub
      }
    }

    // For most properties, return a function that can be both called and constructed
    const propValue = function (...args) {
      return new ExtendableBase(...args)
    }

    // Make the function constructable
    Object.setPrototypeOf(propValue, ExtendableBase)

    // Add prototype property to the function
    propValue.prototype = ExtendableBase.prototype

    // Make it extensible
    return new Proxy(propValue, handler)
  },

  // Handle function calls
  apply(target, thisArg, args) {
    return new ExtendableBase(...args)
  },

  // Handle 'new' operator
  construct(target, args) {
    return new ExtendableBase(...args)
  },
}

// Create the base function that will be proxied
const baseFunction = createBaseClass()

// Create the module stub
moduleStub = new Proxy(baseFunction, handler)

// Export necessary items for module compatibility
export const __esModule = true
export default moduleStub
export const toBeQueryBuilder = moduleStub
export const default_export = moduleStub
export const createQueryBuilder = moduleStub
export const QueryBuilder = moduleStub
export const _isStub = true
