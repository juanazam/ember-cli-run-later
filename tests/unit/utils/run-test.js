import { later } from 'ember-cli-run-later/utils/run';
import laterQueue from '../../run-test-mode';
import { module, test } from 'qunit';

module('Unit | Utility | run-test-mode');

test('supports run call with target object', function(assert) {
  laterQueue.empty();
  let target = {
    result: null,
    myFunction() {
      this.result = 'resolved';
    }
  };

  later(target, target.myFunction, 200);

  laterQueue.execNext();

  assert.equal(target.result, 'resolved');
});

test('supports run call with target object and function name', function(assert) {
  laterQueue.empty();
  let target = {
    result: null,
    myFunction() {
      this.result = 'resolved';
    }
  };

  later(target, "myFunction", 200);

  laterQueue.execNext();

  assert.equal(target.result, 'resolved');
});

test('later method returns promise with code to be executed and stores in queue', function(assert) {
  laterQueue.empty();
  let myTestingFunction = () => 'value';

  later(myTestingFunction, 200);

  assert.equal(laterQueue.queue.length, 1);
  assert.equal(laterQueue.queue[0].__state[0], myTestingFunction);
});

test('can execute queued calls one by one', function(assert) {
  laterQueue.empty();
  let promiseRes1 = 'unresolved',
      promiseRes2 = 'unresolved',
      myTestingFunction1 = () => {
        promiseRes1 =  'resolved';
      },
      myTestingFunction2 = () => {
        promiseRes2 =  'resolved';
      };

  later(myTestingFunction1, 200);
  later(myTestingFunction2, 200);

  assert.equal(laterQueue.queue.length, 2);

  laterQueue.execNext();

  assert.equal(promiseRes1, 'resolved');
  assert.equal(promiseRes2, 'unresolved');
});

test('can execute queued calls all queued functions in one call', function(assert) {
  laterQueue.empty();
  let promiseRes1 = 'unresolved',
      promiseRes2 = 'unresolved',
      myTestingFunction1 = () => {
        promiseRes1 =  'resolved';
      },
      myTestingFunction2 = () => {
        promiseRes2 =  'resolved';
      };

  later(myTestingFunction1, 200);
  later(myTestingFunction2, 200);

  assert.equal(laterQueue.queue.length, 2);

  laterQueue.execAll();

  assert.equal(promiseRes1, 'resolved');
  assert.equal(promiseRes2, 'resolved');
});
