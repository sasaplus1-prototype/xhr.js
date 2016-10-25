# xhr.js

simple XMLHttpRequest

## Installation

```sh
$ npm install sasaplus1-prototype/xhr.js
```

## Usage

via `require()`

```js
var xhr = require('xhr');
```

via `<script>`

```html
<script src="xhr.min.js"></script>
```

### Example

callback style:

```js
xhr
  .request()
  .get('path/to/uri')
  .set('X-Requested-With', 'XMLHttpRequest')
  .set('X-From', location.href)
  .timeout(3000)
  .end(null, function(err, text, xhrInstance) {
    if (err) {
      throw err;
    }

    console.log(text);
  });
```

Promise style:

```js
xhr
  .request()
  .get('path/to/uri')
  .set('X-Requested-With', 'XMLHttpRequest')
  .set('X-From', location.href)
  .timeout(3000)
  .end(null)
  .then(function(result) {
    console.log(result.responseText);
  })
  ['catch'](function(result) {
    console.error(result.statusText);
    throw result.err;
  });
```

## Functions

### request()

- `return`
  - `XHR`

create `XHR` instance.

### XHR#get(uri)

- `uri`
  - `String`
- `return`
  - `XHR`

set to use `GET` method.

### XHR#post(uri)

- `uri`
  - `String`
- `return`
  - `XHR`

set to use `POST` method.

### XHR#timeout(ms)

- `ms`
  - `Number`
- `return`
  - `XHR`

set timeout.

### XHR#set(name, value)

- `name`
  - `String`
- `value`
  - `String`
- `return`
  - `XHR`

add request header.

### XHR#end(data[, callback])

- `data`
  - `Object|Null`
- `[callback]`
  - `Function`
- `return`
  - `Promise`

send request.

## License

The MIT license.
