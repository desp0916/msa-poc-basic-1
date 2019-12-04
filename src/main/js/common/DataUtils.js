/**
 * DataUtils.js
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

/**
 * Fetch API Wrapper (for GET method only)
 * 
 * @param {string} url 
 * @param {object} headers 
 * @param {function} onSuccess 
 * @param {function} onFailure 
 */
function FetchGetWrapper(url, headers, onSuccess, onFailure) {
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
 * 取得多筆資料（repository）
 * 
 * @param {number} pageNo
 * @param {object} sort
 * @param {function} onSuccess 
 * @param {function} onFailure 
 */
function GetRepository(repository, pageNo, sort, onSuccess, onFailure) {
  const API_URI = `${Globals.API_ROOT}/${repository}/?size=${Globals.PAGE_SIZE}&page=${pageNo}&sort=${sort.field},${sort.direction}`;
  const headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/hal+json' });
  FetchGetWrapper(API_URI, headers,  onSuccess, onFailure);

  // fetch(API_URI, {
  //   credentials: 'include',
  //   method: 'GET',
  //   mode: 'cors',
  //   redirect: 'follow',
  //   headers: headers
  // })
  // .then(response => response.json())
  // .then(
  //   response => { if (onSuccess) { onSuccess(response); }},
  //   response => { if (onFailure) { onFailure(response); }}
  // );
}

/**
 * 根據 Id 來取得資料
 * 
 * @param {string} repository 
 * @param {string} entityId 
 * @param {function} onSuccess 
 * @param {function} onFailure 
 */
function GetEntityById(repository, entityId, onSuccess, onFailure) {
  const API_URI = `${Globals.API_ROOT}/${repository}/${entityId}`;
  const headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/hal+json' });
  FetchGetWrapper(API_URI, headers,  onSuccess, onFailure);
}

/**
 * 新增一筆資料
 * 
 * @param {string} repository 
 * @param {object} inputs 
 * @param {function} onSuccess 
 * @param {function} onFailure 
 */
function PostEntity(repository, inputs, onSuccess, onFailure) {
  const API_URI = `${Globals.API_ROOT}/${repository}/`;
  fetch(API_URI, {
    body: JSON.stringify(inputs),
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
  })
  .then(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 修改單一筆資料
 * 
 * @param {string} repository 
 * @param {object} entity 
 * @param {object} inputs 
 * @param {function} onSuccess 
 * @param {function} onFailure 
 */
function PatchEntity(repository, entity, inputs, onSuccess, onFailure) {
  Object.keys(inputs).map(key => {
    if (typeof inputs[key].value !== 'undefined') {
      entity[key] = inputs[key].value.trim();
    }
  });
  let API_URI = entity._links.self.href;
  fetch(API_URI, {
    body: JSON.stringify(entity),
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json'
    },
    method: 'PATCH',
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
  })
  .then(
    response => { if (onSuccess) { onSuccess(response); }},
    response => { if (onFailure) { onFailure(response); }}
  );
}

/**
 * 刪除單一筆資料
 * 
 * @param {object} entity 
 * @param {function} onSuccess 
 * @param {function} onFailure 
 */
function DeleteEntity(entity, onSuccess, onFailure) {
  const API_URI = entity._links.self.href;
  fetch(API_URI, {
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json'
    },
    method: 'DELETE',
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
  })
  .then(
    response => { if (onSuccess) { onSuccess(response); }},
    response => {
      if (response.status === 403) {
        alert('禁止存取。您並未被授權刪除此項目。');
      }
      if (onFailure) { onFailure(response); }
    }
  );
}

/**
 * 依據 act 來顯示操作成功的訊息
 *
 * @param {string} act 
 * @param {string} msg 
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
 * 依據 act 來顯示操作錯誤的訊息
 * 
 * @param {string} act 
 * @param {string} msg 
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

export {
  FetchGetWrapper,
  GetRepository,
  GetEntityById,
  PostEntity,
  PatchEntity,
  DeleteEntity,
  showSuccessMsg,
  showFailureMsg,
};