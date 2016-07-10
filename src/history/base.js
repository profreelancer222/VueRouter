import { runQueue } from '../util/async'
import { isSameLocation } from '../util/location'

export class History {
  constructor (router) {
    this.router = router
    this.current = router.match('/')
    this.pending = null
    this.beforeHooks = []
    this.afterHooks = []
  }

  listen (cb) {
    this.cb = cb
  }

  before (fn) {
    this.beforeHooks.push(fn)
  }

  after (fn) {
    this.afterHooks.push(fn)
  }

  push (location, cb) {
    this.transitionTo(location, cb)
  }

  replace (location, cb) {
    this.transitionTo(location, cb, true)
  }

  transitionTo (location, cb, replace) {
    location = this.router.match(location, this.current)
    this.confirmTransition(location, () => {
      cb && cb(location)
      this.updateLocation(location)
    }, replace)
  }

  confirmTransition (location, cb, replace) {
    if (isSameLocation(location, this.current)) {
      return
    }

    const redirect = location => this[replace ? 'replace' : 'push'](location)
    const queue = this.beforeHooks.concat(
      // route config canDeactivate hooks
      this.current.matched.map(m => m.canDeactivate).reverse(),
      // component canDeactivate hooks
      extractComponentHooks(this.current.matched, 'routeCanDeactivate').reverse(),
      // route config canActivate hooks
      location.matched.map(m => m.canActivate),
      // component canActivate hooks
      extractComponentHooks(location.matched, 'routeCanActivate')
    ).filter(_ => _)

    this.pending = location

    runQueue(
      queue,
      (hook, next) => { hook(location, redirect, next) },
      () => {
        if (isSameLocation(location, this.pending)) {
          this.pending = null
          cb(location)
        }
      }
    )
  }

  updateLocation (location) {
    this.current = location
    this.cb && this.cb(location)
    this.afterHooks.forEach(hook => {
      hook(location)
    })
  }
}

function extractComponentHooks (matched, name) {
  return Array.prototype.concat.apply([], matched.map(m => {
    return Object.keys(m.components).map(key => {
      const component = m.components[key]
      const instance = m.instances[key] && m.instances[key].child
      const hook = typeof component === 'function'
        ? component.options[name]
        : component[name]
      if (hook) {
        return function routerHook () {
          return hook.apply(instance, arguments)
        }
      }
    })
  }))
}
