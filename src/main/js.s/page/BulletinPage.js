/**
 * 佈告欄
 * 
 * @author Gary Liu<gary_liu@pic.net.tw>
 * @since  Thu Jan 12 10:48:20 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import { Panel, Glyphicon, Button, Form } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import * as Globals from '../common/Globals';
import { Loading, FieldGroup, Select, Span } from '../common/FormObjects';
import { Sort, ItemList, ItemRow } from '../common/ItemList';
import { DeleteEntity, showSuccessMsg, showFailureMsg } from '../common/DataUtils';

const BulletinForm = Loadable({
  loader: () => import('../form/BulletinForm'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const client = require('../client');
const stompClient = require('../websocket-listener');

export default class BulletinPage extends Component {

  constructor(props) {
    super(props);
    this.repository = 'bulletins';
    this.pageTitle = '佈告欄管理';
    this.pageSize = Globals.PAGE_SIZE;
    this.inputs = {
      search: '',
      keyword: ''
    };

    // 要顯示在列表的欄位
    this.columns = {
      id: ['ID', 'id'],
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
      sort: new Sort(this.columns.shortUpdatedDate[1], 'desc'),
    };

    this.detailColumn = 'subject';
    this.detailPath = '/Bulletin/BulletinForm';

    this._handleSearch = this._handleSearch.bind(this);
    this._handleRefreshList = this._handleRefreshList.bind(this);
    this._handleDelete = this._handleDelete.bind(this); 
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
    let searchUri = '';
    const searchType = (this.inputs.search) ? this.inputs.search.value.trim() : '';
    const keyword = (this.inputs.keyword) ? this.inputs.keyword.value.trim() : '';
    if (searchType.length > 0 && keyword.length > 0) {
      switch (searchType) {
      case 'findBySubjectContainsForCurrentUser':
        searchUri ='/search/'+searchType+'?subject=' + keyword;
        break;
      // case 'findByCnameContainsForCurrentUser':
      //   searchUri = '/search/'+searchType+'?cname=' + keyword;
      //   break;
      // case 'findByEmailContainsForCurrentUser':
      //   searchUri = '/search/'+searchType+'?email=' + keyword;
      //   break;
      }
    } else {
      searchUri = '/search/findAllForCurrentUser?';
    }
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

  _handleDelete(item) {
    if (confirm ('確認刪除此項目？')) {
      DeleteEntity(item,
        () => {
          showSuccessMsg(Globals.ACT_DELETE);
          this._handleRefreshList();
        },
        () => {
          showFailureMsg(Globals.ACT_DELETE);
        }
      );
    }
  }

  _renderItemRows() {
    return (Array.isArray(this.state.items) && this.state.items.length > 0) ?
      this.state.items.map(item => 
        <ItemRow key={item.id} item={item} columns={this.columns}
         detailColumn={this.detailColumn} detailPath={this.detailPath}
          buttons={[
            <LinkContainer key={item.id+'button'} to={`${this.detailPath}/${item.id}`}><Button key={item.id+'_edit'}><Glyphicon glyph="edit" /> 修改</Button></LinkContainer>,
            <Button key={item.id+'_delete'} onClick={() => this._handleDelete(item)}><Glyphicon glyph="trash" /> 刪除</Button>
          ]}
        />
      ) : null;
  }

  render() {
    const pageTitle = (<h3>{this.pageTitle}</h3>);
    return (
      <div>
        <Switch>
          <Route path={`${this.detailPath}/${Globals.ACT_CREATE}`} render={(props) => (<BulletinForm {...props} act={Globals.ACT_CREATE} />)}/>
          <Route path={`${this.detailPath}/:itemId`} render={(props) => (<BulletinForm {...props} act={Globals.ACT_UPDATE} />)}/>
        </Switch>
        <Panel header={pageTitle}>
          <Panel style={Globals.STYLE_CENTER}>
            <Form inline>
              <Select label="欄位 " placeholder="select" 
                defaultValue={this.state.inputs.search}
                options={this.searchOptions} inputRef={ref => this.inputs.search = ref} /><Span/>
              <FieldGroup type="text" label="" placeholder="請輸入要查詢的值"
                defaultValue={this.state.inputs.keyword}
                inputRef={ref => this.inputs.keyword = ref} /><Span/>
              <Button bsStyle="primary" onClick={()=>this._handleSearch(0)}>
                <Glyphicon glyph="search"/> 查詢
              </Button><Span/>
              <LinkContainer to={`${this.detailPath}/${Globals.ACT_CREATE}`}>
                <Button><Glyphicon glyph="plus"/> 新增</Button>
              </LinkContainer>
            </Form>
          </Panel>
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

BulletinPage.propTypes = {
  match: PropTypes.object,
};