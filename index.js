'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * XMLHttpRequest class
 *
 * @class
 */
function XHR() {
  this._limit = 0;
  this._uri = '';
  this._method = '';
  this._headers = {};
}

/**
 * set method and uri
 *
 * @param {String} uri
 * @return {XHR}
 */
XHR.prototype.get = function(uri) {
  this._uri = uri;
  this._method = 'GET';

  return this;
};

/**
 * set method and uri
 *
 * @param {String} uri
 * @return {XHR}
 */
XHR.prototype.post = function(uri) {
  this._uri = uri;
  this._method = 'POST';

  return this;
};

/**
 * set timeout second
 *
 * @param {Number} ms
 * @return {XHR}
 */
XHR.prototype.timeout = function(ms) {
  this._limit = ms;

  return this;
};

/**
 * set request header
 *
 * @param {Number} ms
 * @return {XHR}
 */
XHR.prototype.set = function(name, value) {
  this._headers[name] = value;

  return this;
};

/**
 * send request
 *
 * @param {Object|Null} data
 * @param {Function} [callback]
 * @return {Promise}
 */
XHR.prototype.end = function(data, callback) {
  var that = this,
      xhr, headerName, timeoutId;

  if (typeof callback === 'undefined') {
    if (typeof Promise === 'undefined') {
      throw new TypeError('callback must be a Function');
    } else {
      return new Promise(function(resolve, reject) {
        that.end(data, function(err, xhr) {
          (err) ? reject({
            err: err,
            statusText: xhr.statusText,
            xhr: xhr
          }) : resolve({
            responseText: xhr.responseText,
            xhr: xhr
          });
        });
      });
    }
  }

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      clearTimeout(timeoutId);

      if (isSuccess(xhr.status)) {
        callback(null, xhr.responseText, xhr);
      } else {
        callback(new Error('request failed'), xhr.statusText, xhr);
      }
    }
  };
  xhr.open(that._method, that._uri);

  for (headerName in that._headers) {
    if (hasOwnProperty.call(that._headers, headerName)) {
      xhr.setRequestHeader(headerName, that._headers[headerName]);
    }
  }

  xhr.send(
    (data !== null && typeof data === 'object') ? encode(data) : data
  );

  if (isFinite(that._limit) && that._limit > 0) {
    timeoutId = setTimeout(function() {
      callback(new Error('timeout'), xhr.statusText, xhr);
      xhr.abort();
    }, that._limit);
  }
};

/**
 * was success?
 *
 * @param {Number} status
 * @return {Boolean}
 */
function isSuccess(status) {
  return (status >= 200 && status < 300) ||
    status === 304 || status === 1223 || status === 0;
}

/**
 * encode data
 *
 * @param {Object} data
 * @return {String}
 */
function encode(data) {
  var params = [],
      name, value;

  for (name in data) {
    if (hasOwnProperty.call(data, name)) {
      value = data[name];

      params.push(
        encodeURIComponent(name) + '=' + encodeURIComponent(value)
      );
    }
  }

  return params.join('&').replace(/%20/g, '+');
}

/**
 * create XHR instance
 *
 * @return {XHR}
 */
function request() {
  return new XHR();
}

module.exports = {
  request: request
};
