/**
 * 設定 REST client
 * 
 * http://blog.codeleak.pl/2014/10/exposing-spring-data-repositories-over-rest.html
 * https://www.npmjs.com/package/rest
 * https://github.com/cujojs/rest
 */

'use strict';

var rest = require('rest');
var defaultRequest = require('rest/interceptor/defaultRequest');
var mime = require('rest/interceptor/mime');
var uriTemplateInterceptor = require('./api/uriTemplateInterceptor');
// HTTP status code >= 400 會被視為錯誤
var errorCode = require('rest/interceptor/errorCode');
var baseRegistry = require('rest/mime/registry');

var registry = baseRegistry.child();

registry.register('text/uri-list', require('./api/uriListConverter'));
registry.register('application/hal+json', require('rest/mime/type/application/hal'));

module.exports = rest
  .wrap(mime, { registry: registry })
  .wrap(uriTemplateInterceptor)
  .wrap(errorCode)
  .wrap(defaultRequest, { headers: { 'Accept': 'application/hal+json' }});
