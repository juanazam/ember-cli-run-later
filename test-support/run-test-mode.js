import Ember from 'ember';
import { Run } from 'ember-cli-run-later/utils/run';

let {
  run,
  RSVP
} = Ember;

let laterQueue = Ember.Object.create({
  queue: [],

  empty() {
    this.queue = [];
  },

  /**
    Creates a promise and associates the given function to it,
    so the promise can be resolved on demand using the result of
    the closure call.

    @method push
    @param {Function} fn the function to executed
    @return {Promise} a new promise to be fulfilled on demand
   **/
  push(...args) {
    let deferred = RSVP.defer();

    deferred.__state = args;

    this.queue.push(deferred);

    return deferred.promise;
  },

  resolveState(deferred) {
    let laterArgs = deferred.__state,
      firstArg = laterArgs.shift();

    laterArgs.pop();

    if (typeof firstArg === "function") {
      run(() => deferred.resolve(firstArg.call(null, laterArgs)));
    } else {
      let providedFunction = laterArgs.shift();

      if (typeof providedFunction === "string") {
        providedFunction = firstArg[providedFunction];
      }

      run(() => deferred.resolve(providedFunction.call(firstArg, ...laterArgs)));
    };
  },

  /**
    Resolves the first promise in the queue with the return value
    of executing the stored closure.

    @method execNext
    @return {undefined}
   **/
  execNext() {
    let firstDeferred = this.queue.shift();

    if (firstDeferred) {
      this.resolveState(firstDeferred);
    }
  },

  /**
    Resolves all promises in the queue with the return value
    of executing the stored closures.

    @method execAll
    @return {undefined}
   **/
  execAll() {
    this.queue.forEach(deferred => {
      this.resolveState(deferred);
    });
  }
});

Run.reopen({
  later(...args) {
    return laterQueue.push(...args);
  }
});

export default laterQueue;

