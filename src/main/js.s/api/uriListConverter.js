/**
 * uri list 轉換器
 *
 * 將單一資源物件或資源物件陣列，轉換 ContentType 成「text/text-urilist」的 request body。
 *
 * 取出一個或多個資源裡的「_links.self.href」的 URI，並以換行符號（\n）連接成一個字串，
 * 再讓 REST Client 送出。
 *
 * http://amundsen.com/hypermedia/urilist/
 * http://stackoverflow.com/questions/22499819/spring-data-rest-update-a-resource%C2%B4s-association-using-proper-http-method
 * http://blog.codeleak.pl/2014/10/exposing-spring-data-repositories-over-rest.html
 */

define(function() {

  'use strict';

  /* Convert a single or array of resources into "URI1\nURI2\nURI3..." */
  return {
    read: function(str /*, opts */) {
      return str.split('\n');
    },

    write: function(obj /*, opts */) {
      // If this is an Array, extract the self URI and then join using a newline
      if (obj instanceof Array) {
        return obj.map(function(resource) {
          return resource._links.self.href;
        }).join('\n');
      } else { // otherwise, just return the self URI
        return obj._links.self.href;
      }
    }
  };

});