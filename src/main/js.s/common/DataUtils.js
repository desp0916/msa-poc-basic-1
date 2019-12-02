/**
 * 取得經理的資料
 *
 * [Javascript] ES6 Generator 基礎
 * http://huli.logdown.com/posts/292331-javascript-es6-generator-foundation 
 * 
 * [Javascript] Promise, generator, async 與 ES6
 * http://huli.logdown.com/posts/292655-javascript-promise-generator-async-es6
 *
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Sun Feb 5 12:32:57 CST 2017
 * @flow
 */

import * as Globals from '../common/Globals';
const client = require('../client');

/**
 * 自某 URI 取得資料
 */
function FetchURI(uri, onSuccess, onFailure) {
  client({
    method: 'GET',
    path: uri
  }).done(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 取得 Entity 資料
 */
function FetchEntity(entity, onSuccess, onFailure) {
  client({
    method: 'GET',
    path: entity._links.self.href
  }).done(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 取得某 entity._links 下某個 association node 的 _links.self.href（URI）
 * 然後再將 URI 設為 entity 的某一個屬性。
 * 
 * 例：「FetchEntityAssocLink(group, 'admin') 」，此處的 group 為物件，
 * 'admin' 為其 association。
 * 
 * 1. 抓某 Group entity 的「admin」：http://localhost:8081/api/groups/1/admin
 * 2. 抓 http://localhost:8081/api/groups/1/admin 的 _links.self.href
 * 3. 將抓到的 _links.self.href（例如是 http://localhost:8081/api/users/3）
 *    設為該 entity.admin 的值。
 */
function FetchEntityAssocLink(entity, assocKey, onSuccess, onFailure) {
  client({
    method: 'GET',
    path: `${entity._links.self.href}/${assocKey}`,
    headers: {'Content-Type': 'application/json'}
  }).done(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 修改 Entity 的 association 
 */
function PutEntityAssoc(entity, assocKey, assocEntities, onSuccess, onFailure) {
  client({
    method: 'PUT',
    path: `${entity._links.self.href}/${assocKey}`,
    headers: {'Content-Type': 'text/uri-list'},
    entity: assocEntities,
  }).done(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 對某個 URL 進行 Put 操作（通常是執行 resource 的某個 method）
 * https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 */
function PutUrl(url, onSuccess, onFailure) {
  client({
    method: 'PUT',
    path: url,
    headers: {'Content-Type': 'text/uri-list'},
  }).done(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 取得「經理」的資料
 */
function FetchManagers(managers, onSuccess, onFailure) {
  client({
    method: 'GET',
    path: `${Globals.API_ROOT}/users/search/findManagers?sort=cname`
  }).done(
    response => {
      response.entity._embedded.users.map(item => {
        managers.push({key: item._links.self.href, value: item.cname});
      });
      if (onSuccess) { onSuccess(response); }
    },
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 取得「專案系統」的資料
 */
function FetchProjects(projects, onSuccess, onFailure) {
  client({
    method: 'GET',
    path: `${Globals.API_ROOT}/projects/search/findProjects`
  }).done(
    response => {
      response.entity._embedded.projects.map(item => {
        projects.push({key: item._links.self.href, value: item.cname + ' ('+ item.sysId + ')'});
      });
      if (onSuccess) { onSuccess(response); }
    },
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 新增資料
 */
function PostEntity(inputs, repository, onSuccess, onFailure) {
  let item = {};
  Object.keys(inputs).map(key => {
    if (typeof inputs[key].value !== 'undefined') {
      item[key] = inputs[key].value.trim();
    }
  });
  client({
    method: 'POST',
    path: `${Globals.API_ROOT}/${repository}`,
    entity: item,
    headers: {'Content-Type': 'application/json'}
  }).done(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 修改資料
 */
function PatchEntity(entity, inputs, repository, onSuccess, onFailure) {
  Object.keys(inputs).map(key => {
    if (typeof inputs[key].value !== 'undefined') {
      entity[key] = inputs[key].value.trim();
    }
  });
  let path = entity._links.self.href;
  // let etag = entity.headers.Etag;
  // delete(entity._links);
  // delete(entity.headers);
  client({
    method: 'PATCH',
    path: path,
    entity: entity,
    headers: {
      'Content-Type': 'application/json',
      // 以下程式碼會遞增 1，僅適用於 user 和 buletin 之外的 entities，
      // 如果是 user 或 bulletin，就不用遞增 1。
      // 'If-Match': parseInt(etag.replace('"', '')) + 1
    }}
  ).done(
    response => {
      if (onSuccess) { onSuccess(response); }
    },
    response => {
      if (response.status.code === 403) {
        alert('禁止存取。您並未被授權修改此項目。');
      } else if (response.status.code === 412) {
        alert('禁止：無法修改。此項目可能已經過期（stale），請重新載入。');
      } else {
        if (onFailure) { onFailure(response); }
      }
    }
  );
}

/**
 * 刪除單一筆資料
 *
 * ItemList 內建的「單一項目刪除」功能
 * TODO 暫時先使用 confirm()，之後應改為 Modal。
 */
function DeleteEntity(entity, onSuccess, onFailure) {
  client({
    method: 'DELETE',
    path: entity._links.self.href
  }).done(
    response => {
      if (onSuccess) {  onSuccess(response); }
    },
    response => {
      if (response.status.code === 403) {
        alert('禁止存取。您並未被授權刪除此項目。');
      } else {
        if (onFailure) { onFailure(response); }
      }
    }
  );
}

/**
 * 刪除一個 association 裡的資料（通常是多筆）
 */
function DeleteAssocLink(assocURI, onSuccess, onFailure) {
  client({
    method: 'DELETE',
    path: assocURI
  }).done(
    response => { if (onSuccess) {  onSuccess(response); }},
    response => {
      if (response.status.code === 403) {
        alert('禁止存取。您並未被授權刪除此項目。');
      } else {
        if (onFailure) { onFailure(response); }
      }
    }
  );
}

/**
 * 透過「中文姓名」查詢使用者（使用 Fetch API）
 * 
 * AJAX與Fetch API
 * https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/ajax_fetch.html
 * 
 * FIXME 目前使用的後端程式會「分頁」，最好再另外寫一支不會分頁的。
 */
function FindUsersByCname(cname, onSuccess, onFailure) {
  const API_URI = `${Globals.API_ROOT}/users/search/findByCnameContainsForCurrentUser?cname=${cname}`;
  const headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/hal+json' });
  FetchWrapper(API_URI, headers,  onSuccess, onFailure);
}

/**
 * 透過「中文姓名」查詢使用者（使用 Fetch API）
 * 登入者的角色必須是 SUPUSER 或 MANAGER
 */
function FindGroupUserByCname(cname, onSuccess, onFailure) {
  const API_URI = `${Globals.API_ROOT}/users/search/findByCnameContainsForGroupAdmin?cname=${cname}`;
  const headers = new Headers({ 'Content-Type': 'text/plain', 'Accept': 'application/hal+json' });
  FetchWrapper(API_URI, headers, onSuccess, onFailure);
}

/**
 * Fetch API Wrapper
 */
function FetchWrapper(url, headers, onSuccess, onFailure) {
  fetch(url, {
    credentials: 'include',
    method: 'GET',
    mode: 'cors',
    redirect: 'follow',
    headers: headers
  })
  .then(response => response.json())
  .then(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 依據 act 來顯示操作成功的訊息
 */
function showSuccessMsg(act, msg) {
  if (msg && msg.length > 0) {
    alert(msg);
  } else {
    if (act === Globals.ACT_UPDATE) {
      alert('修改成功');
    } else if (act === Globals.ACT_CREATE) {
      alert('新增成功');
    } else if (act === Globals.ACT_DELETE) {
      alert('刪除成功');
    } else {
      alert('操作成功');
    }
  }
}

/**
 * 依據 act 來顯示操作失敗的訊息
 */
function showFailureMsg(act, msg) {
  if (msg && msg.length > 0) {
    alert(msg);
  } else {
    if (act === Globals.ACT_UPDATE) {
      alert('修改失敗');
    } else if (act === Globals.ACT_CREATE) {
      alert('新增失敗');
    } else if (act === Globals.ACT_DELETE) {
      alert('刪除失敗');
    } else {
      alert('操作失敗');
    }
  }
}

/**
 * 以遞迴 + ES6 Generator 的方式處理多筆 POST requests
 * 
 * 中間只要有一個 request 發生失敗，後續的 requests 就都不會送出
 * 另外，finalCallback 可以用來其他處理。
 */
function PostEntities(entities, repository, finalCallback) {
  if (entities.length == 0) {
    if (finalCallback) { finalCallback(); }
    return; // break the recursion!!!
  }
  function* recursiveReuest(entities, repository, index, finalCallback) {
    if (index <= entities.length) {
      yield PostEntity(entities[index], repository,
        () => {
          index++;
          if (index < entities.length) {
            recursiveReuest(entities, repository, index, finalCallback).next(index);
          } else {
            if (finalCallback) { finalCallback(); }
          }
        },
        () => {
          return; // break the recursion!!!
        }
      );
    }
    return; // break the recursion!!!
  }
  var g = recursiveReuest(entities, repository, 0, finalCallback);
  g.next();
}

function SendRequest(verb, url, onSuccess, onFailure) {
  client({
    method: verb,
    path: url
  }).done(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 根據 Id 來取得 Item
 * 
 * @param {string} itemId 
 * @param {function} onSuccess 
 * @param {function} onFailure 
 */
function FetchItemById(repository, itemId, onSuccess, onFailure) {
  client({
    method: 'GET',
    path: `${Globals.API_ROOT}/${repository}/${itemId}`
  }).done(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 檢查 HTML 輸入元件是否為空？
 * 
 * @param {object} element 
 */
function CheckHTMLInputElementEmpty(element) {
  return (element == null || typeof element.value === 'undefined' || element.value.length == 0);
}

module.exports = {
  FetchURI,
  FetchEntity,
  FetchEntityAssocLink,
  FetchManagers,
  PostEntity,
  PatchEntity,
  DeleteEntity,
  DeleteAssocLink,
  PutEntityAssoc,
  PutUrl,
  FindUsersByCname,
  FindGroupUserByCname,
  FetchWrapper,
  FetchProjects,
  showSuccessMsg,
  showFailureMsg,
  PostEntities,
  SendRequest,
  FetchItemById,
  CheckHTMLInputElementEmpty
};