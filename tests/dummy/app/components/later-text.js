import Ember from 'ember';
import { later } from 'ember-cli-run-later/utils/run';

export default Ember.Component.extend({
  classNames: ['later-text'],

  text: Ember.computed(function() {
    return "Still waiting...";
  }),

  promiseResolvedText: Ember.computed(function() {
    return "unresolved";
  }),

  initLater: Ember.on('init', function() {
    later(() => {
      this.set("text", "Initialized");
    }, 200).then(() => {
      this.set('promiseResolvedText', "resolved");
    });
  })
});
