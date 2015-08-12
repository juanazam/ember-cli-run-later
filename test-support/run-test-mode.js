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
  push(fn) {
    let deferred = RSVP.defer();

    deferred.__state = fn;

    this.queue.push(deferred);

    return deferred.promise;
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
      firstDeferred.resolve(firstDeferred.__state());
    }
  },

  /**
    Resolves all promises in the queue with the return value
    of executing the stored closures.

    @method execAll
    @return {undefined}
   **/
  execAll() {
    this.queue.forEach(function(deferred) {
      run(() => deferred.resolve(deferred.__state()));
    });
  }
});

Run.reopen({
  later(fn, delay) {
    return laterQueue.push(fn);
  }
});

export default laterQueue;

