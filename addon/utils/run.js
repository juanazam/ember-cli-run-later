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
  later: function(...args) {
    let firstArg = args.shift(),
      delay = args.pop(),
      resFunction;

    if (typeof firstArg === "function") {
      resFunction = () => firstArg.call(null, ...args);
    } else {
      let providedFunction = args.shift();

      if (typeof providedFunction === "string") {
        providedFunction = firstArg[providedFunction];
      }

      resFunction = () => providedFunction.call(firstArg, ...args);
    }

    return new RSVP.Promise(resolve => run.later(() => resolve(resFunction()), delay));
  }
});

export function later(...args) {
  return Run.create().later(...args);
}
