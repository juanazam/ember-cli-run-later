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

Here is an example (acually par of the projects tests suite):

```js
import Ember from 'ember';
import { later } from 'ember-cli-run-later/utils/run';

export default Ember.Component.extend({
  classNames: ['later-text'],

  text: Ember.computed(function() {
    return "Still waiting...";
  }),

  initLater: Ember.on('init', function() {
    later(() => {
      this.set("text", "Initialized");
    }, 200);
  })
});
```

Test example:

```js
test('can execute code which was scheduled for later', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('.later-text').text().trim(), "Still
      waiting...");
  });

  andThen(function() {
    laterQueue.execAll();
  });

  andThen(function() {
    assert.equal(find('.later-text').text().trim(),
      "Initialized");
    });
  });
```

## Setup

`ember install ember-cli-run-later`

Make sure to include `import laterQueue from "run-test-mode"` when your
acceptance suite is run and dont forget to clear the `laterQueue` on each run.

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
