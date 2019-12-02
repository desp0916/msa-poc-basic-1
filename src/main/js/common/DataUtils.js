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
 * Fetch API Wrapper
 * 
 * @param {*} url 
 * @param {*} headers 
 * @param {*} onSuccess 
 * @param {*} onFailure 
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
 * 列出文章
 * 
 * @param {*} pageNumber
 * @param {*} sort
 * @param {*} onSuccess 
 * @param {*} onFailure 
 */
function ListArticles(pageNumber, sort, onSuccess, onFailure) {
  const API_URI = `${Globals.API_ROOT}/articles/?size=${Globals.PAGE_SIZE}&number=${pageNumber}&sort=${sort.field},${sort.direction}`;
  const headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/hal+json' });
  FetchWrapper(API_URI, headers,  onSuccess, onFailure);
}

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
  FetchWrapper,
  ListArticles,
  showFailureMsg,
};