import Ember from 'ember';

let {
  run,
  RSVP,
} = Ember;

export let Run = Ember.Object.extend({
    /**
    Returns a promise that resolves the result of executing the function
    passed as parameter after X number milliseconds.

    @method later
    @param {Function} fn the function to execute
    @param {Number} delay the time to wait to execute the function
    @return {Promise} a new promise to be fulfilled after the delay
   **/
  later: function(fn, delay) {
    return new RSVP.Promise(resolve => run.later(() => resolve(fn()), delay));
  }
});

export function later(fn, delay) {
  return Run.create().later(fn, delay);
}
