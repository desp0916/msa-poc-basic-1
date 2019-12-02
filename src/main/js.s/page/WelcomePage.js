/**
 * 歡迎頁
 * 
 * 目前是「佈告欄」
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Mon Apr 24 09:12:37 CST 2017
 * @flow
 * @jsx
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import { Panel, Glyphicon, Button } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import * as Globals from '../common/Globals';
import { Loading } from '../common/FormObjects';
import { Sort, ItemList, ItemRow } from '../common/ItemList';

const BulletinView = Loadable({
  loader: () => import('../form/BulletinView'),
  loading: Loading,
});

const client = require('../client');
const stompClient = require('../websocket-listener');

export default class WelcomePage extends Component {

  constructor(props) {
    super(props);
    this.repository = 'bulletins';
    this.pageTitle = '佈告欄';
    this.pageSize = Globals.PAGE_SIZE;
    this.inputs = {
      search: '',
      keyword: ''
    };

    // 要顯示在列表的欄位
    this.columns = {
      subject: ['主旨', 'subject'],
      shortStartTime: ['作業開始時間', 'startTime'],
      shortEndTime: ['作業結束時間', 'endTime'],
      creatorCname: ['資料建立者', 'creator'],
      shortCreatedDate: ['資料建立日期', 'createdDate'],
      updaterCname: ['資料更新者', 'updater'],
      shortUpdatedDate: ['資料更新日期', 'updatedDate'],
    };

    this.searchOptions = [
      {key: 'findBySubjectContainsForCurrentUser', value: '主旨' },
    ];

    this.state = {
      items: [],
      dialogTitle: '新增佈告',
      attributes: [],           // 欄位屬性
      item: {},
      response: {},
      inputs: {
        search: '',
        keyword: '',
      },
      page: {
        size: this.pageSize,
        totalElements: 0,
        totalPages: 0,
        number: 0     // 第一頁
      },
      sort: new Sort(this.columns.shortUpdatedDate[1], 'desc')
    };

    this.detailColumn = 'subject';
    this.detailPath = '/Welcome/BulletinView';

    this._handleSearch = this._handleSearch.bind(this);
    this._handleRefreshList = this._handleRefreshList.bind(this);
  }

  componentDidMount() {
    this._handleSearch(0);
    stompClient.register([
      {route: '/topic/newBulletin', callback: this._handleRefreshList},
      {route: '/topic/updateBulletin', callback: this._handleRefreshList},
      {route: '/topic/deleteBulletin', callback: this._handleRefreshList}
    ]);
  }

  _handleSearch(pageNo = 0, sort = this.state.sort) {
    let baseUri = Globals.API_ROOT + '/' + this.repository;
    let navUri = '';
    let searchUri = '/?';
    const searchType = (this.inputs.search) ? this.inputs.search.value.trim() : '';
    const keyword = (this.inputs.keyword) ? this.inputs.keyword.value.trim() : '';
    // if (searchType.length > 0 && keyword.length > 0) {
    //   switch (searchType) {
    //   case 'findBySubjectContainsForCurrentUser':
    //     searchUri ='/search/'+searchType+'?subject=' + keyword;
    //     break;
    //   // case 'findByCnameContainsForCurrentUser':
    //   //   searchUri = '/search/'+searchType+'?cname=' + keyword;
    //   //   break;
    //   // case 'findByEmailContainsForCurrentUser':
    //   //   searchUri = '/search/'+searchType+'?email=' + keyword;
    //   //   break;
    //   }
    // } else {
      searchUri = '/search/findAllForAnonymousUser?';
    // }
    navUri = baseUri + searchUri + '&size=' + this.pageSize + '&page=' + pageNo + '&sort=' + sort.field + ',' + sort.direction;
    client({
      method: 'GET',
      path: navUri
    }).done(response => {
      this.setState({
        inputs: {search: searchType, keyword: keyword},
        items: response.entity._embedded[this.repository],
        page: response.entity.page,
        sort: sort,
      });
    });
  }

  _handleRefreshList() {
    this._handleSearch(this.state.page.number);
  }

  _renderItemRows() {
    return (Array.isArray(this.state.items) && this.state.items.length > 0) ?
      this.state.items.map(item => 
        <ItemRow key={item.id} item={item} columns={this.columns} detailColumn={this.detailColumn} detailPath={this.detailPath}
          buttons={[
            <LinkContainer key={item.id+'_button'} to={`${this.detailPath}/${item.id}`}><Button key={item.id+'_view'}><Glyphicon glyph="zoom-in" /> 檢視</Button></LinkContainer>
          ]}
        />
      ) : null;
  }

  render() {
    const pageTitle = (<h3>{this.pageTitle}</h3>);
    return (
      <div>
        <Switch>
          <Route path={`${this.detailPath}/:itemId`} render={(props) => (<BulletinView {...props} act={Globals.ACT_VIEW} />)}/>
        </Switch>
        <Panel header={pageTitle}>
          <ItemList
            page={this.state.page}
            columns={this.columns}
            onSearch={this._handleSearch}
            itemRows={this._renderItemRows()}
            sort={this.state.sort} />
        </Panel>
      </div>
    );
  }
}

WelcomePage.propTypes = {
  myProfile: PropTypes.object
};