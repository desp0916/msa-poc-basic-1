/**
 * 使用 REST client 從 API 的根節點（rootPath: /api）下一層開始，
 * 逐一拜訪如下的資源陣列，並返回 Promise 物件：
 * 
 * [
 *  {rel: 'users', params: {size: pageSize}},
 *  {rel: 'groups', params: {size: pageSize}},
 *  {rel: 'projects', params: {size: pageSize}},
 * ]
 * 
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 */ 

module.exports = function follow(api, rootPath, relArray) {
  var root = api({
    method: 'GET',
    path: rootPath
  });

  return relArray.reduce(function(root, arrayItem) {
    var rel = (typeof arrayItem === 'string') ? arrayItem : arrayItem.rel;
    return traverseNext(root, rel, arrayItem);
  }, root);

  function traverseNext(root, rel, arrayItem) {

    return root.then(function (response) {
      if (hasEmbeddedRel(response.entity, rel)) {
        return response.entity._embedded[rel];
      }

      if (!response.entity._links) {
        return [];
      }

      if (typeof arrayItem === 'string') {
        return api({
          method: 'GET',
          path: response.entity._links[rel].href
        });
      } else {
        return api({
          method: 'GET',
          path: response.entity._links[rel].href,
          params: arrayItem.params
        });
      }
    });
  }

  function hasEmbeddedRel (entity, rel) {
    return entity._embedded && entity._embedded.hasOwnProperty(rel);
  }

};
