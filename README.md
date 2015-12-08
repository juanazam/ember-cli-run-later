# Ember-cli-run-later

Have you ever wanted to `Ember.run.later` to return a Promise that
resolves when the code executed in the later block gets called?

Have you ever written code which looks like this?

```js
  function toExecuteLater() {
    if (ENV.test) {
      Ember.run.later(myFunction, 2)
    } else {
      myFunction();
    }
  }
```

Not anymore!!

Now you can acutally tests your `later` code.

## Usage

`ember-cli-run-later` provides the same interface as the `Ember.run.later`
function does, so you don't have to your existent `later` calls. You
just need to include the function from the addon and you are reeady to
go.

Here is an example (acually part of the project's test suite):

```js
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
```

Test example:

```js
import laterQueue from '../run-test-mode';

let application;

module('An Integration test', {
  beforeEach: function() {
    application = startApp();
    laterQueue.empty();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('can execute code which was scheduled for later', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(
      find('.later-text .first').text().trim(),
      "Still waiting..."
    );
    assert.equal(
      find('.later-text .second').text().trim(),
      "unresolved"
    );
  });

  andThen(function() {
    laterQueue.execAll();
  });

  andThen(function() {
    assert.equal(
      find('.later-text .first').text().trim(),
      "Initialized"
    );
    assert.equal(
      find('.later-text .second').text().trim(),
      "resolved"
    );
  });
});
```

Make sure to include `import laterQueue from "run-test-mode"` when your
acceptance suite is ran and dont forget to clear the `laterQueue` on each run.

Importing `laterQueue` will override the normal behavior of the addon,
instead of calling Ember's `run.later` method, it will store the
provided parameters in a queue.

As you can see in the test example, the `laterQueue` provides methods to
run the stored calls using the `later` method.

### `laterQueue.execNext`

Will execute the first stored call on the queue.

### `laterQueue.execAll`

Will execute all stored calls in the queue

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
