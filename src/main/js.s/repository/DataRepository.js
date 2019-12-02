/**
 * Repository
 * 
 * 通用型 Repository
 * 
 * [AJAX與Fetch API](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/ajax_fetch.html)
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Wed Jan 18 15:15:28 CST 2017
 * @flow
 */

import * as Globals from '../common/Globals';

export default class DataRepository {

  constructor(endpoint) {
    this.currentPage = 1;
    this.pageSize = 10;
    this.sort = '';
    this.url = Globals.API_ROOT + '/' + endpoint + '/';
  }

  fetchX() {

    const getReq = new Request(this.url, {method: 'GET'});
    const httpHeaders = new Headers();
    httpHeaders.append('Accept', 'application/json');

    return new Promise((resolve, reject) => {
      console.log();
      fetch(getReq)
        .then((response) => response.json())
        .catch((error) => {
          reject(error);
        }).then((responseData) => {
          if (!responseData || !responseData.items) {
            reject(new Error('responseData is null'));
            return;
          }
          resolve(responseData.items);
        }).done();
    });
  }

}