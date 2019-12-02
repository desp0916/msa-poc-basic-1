/**
 * 使用者管理
 * 
 * TODO 目前「使用者管理」的 UI 還要再調整，特別是「角色」的欄位要因登入者的角色權限而有所不同
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Thu Jan 12 10:48:20 CST 2017
 * @flow
 * @jsx
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
import { SendRequest, showSuccessMsg, showFailureMsg } from '../common/DataUtils';

const UserForm = Loadable({
  loader: () => import('../form/UserForm'),
  loading: Loading,
});

const client = require('../client');
const stompClient = require('../websocket-listener');

export default class UserPage extends Component {

  constructor(props) {
    super(props);
    this.repository = 'users';
    this.pageTitle = '使用者管理';
    this.pageSize = Globals.PAGE_SIZE;
    this.inputs = {
      search: '',
      keyword: ''
    };

    // 要顯示在列表的欄位
    this.columns = {
      name: ['帳號', 'name'],
      cname: ['中文姓名', 'cname'],
      roleName: ['角色', 'roleName'],
      email: ['電子信箱', 'email'],
      mobileNo: ['手機號碼', 'mobileNo'],
      // telNo: ['公司電話', 'telNo'],
      ext: ['分機', 'ext'],
      creatorCname: ['資料建立者', 'creator'],
      shortCreatedDate: ['資料建立日期', 'createdDate'],
      updaterCname: ['資料更新者', 'updater'],
      shortUpdatedDate: ['資料更新日期', 'updatedDate'],
    };

    this.searchOptions = [
      {key: 'findByNameContainsForCurrentUser', value: '帳號' },
      {key: 'findByCnameContainsForCurrentUser', value: '姓名' },
      {key: 'findByEmailContainsForCurrentUser', value: 'E-mail' }
    ];

    this.state = {
      items: [],
      dialogTitle: '新增使用者',
      attributes: [],           // 欄位屬性
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
      sort: new Sort(this.columns.shortUpdatedDate[1], 'desc'),
    };

    this.detailColumn = 'name';
    this.detailPath = '/User/UserForm';

    this._handleSearch = this._handleSearch.bind(this);
    this._handleRefreshList = this._handleRefreshList.bind(this);
    this._handleDelete = this._handleDelete.bind(this); 
  }

  componentDidMount() {
    this._handleSearch(0);
    stompClient.register([
			{route: '/topic/newUser', callback: this._handleRefreshList},
			{route: '/topic/updateUser', callback: this._handleRefreshList},
			{route: '/topic/deleteUser', callback: this._handleRefreshList}
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
      case 'findByNameContainsForCurrentUser':
        searchUri ='/search/'+searchType+'?name=' + keyword;
        break;
      case 'findByCnameContainsForCurrentUser':
        searchUri = '/search/'+searchType+'?cname=' + keyword;
        break;
      case 'findByEmailContainsForCurrentUser':
        searchUri = '/search/'+searchType+'?email=' + keyword;
        break;
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

  // 由 DeleteController 處理
  _handleDelete(item) {
    if (confirm ('確認刪除此項目？')) {
      SendRequest('DELETE', Globals.API_ROOT + '/delete/user/' + item.id,
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
    const { roleId } = this.props.myProfile;
    // 修改、刪除使用者
    if (roleId === Globals.ROLE_SUPERUSER || roleId === Globals.ROLE_MANAGER) {
      return (Array.isArray(this.state.items) && this.state.items.length > 0) ?
        this.state.items.map(item => 
          <ItemRow key={item.id} item={item} columns={this.columns} detailColumn={this.detailColumn} detailPath={this.detailPath}
            buttons={[
              <LinkContainer key={item.id+'button'} to={`${this.detailPath}/${item.id}`}><Button key={item.id+'_edit'}><Glyphicon glyph="edit" /> 修改</Button></LinkContainer>,
              <Button key={item.id+'_delete'} onClick={() => this._handleDelete(item)}><Glyphicon glyph="delete" /><Glyphicon glyph="trash" /> 刪除</Button>
            ]}
          />
        ) : null;
    }
    return null;
  }

  render() {
    const pageTitle = (<h3>{this.pageTitle}</h3>);
    // SUPERUSER 或 MANAGER 才能新增使用者
    const buttonToAdd = (this.props.myProfile.roleId === Globals.ROLE_SUPERUSER || this.props.myProfile.roleId === Globals.ROLE_MANAGER) ?
        <LinkContainer to={`${this.detailPath}/${Globals.ACT_CREATE}`}>
          <Button><Glyphicon glyph="plus"/> 新增</Button></LinkContainer> : null;
    return (
      <div>
        <Switch>
          <Route path={`${this.detailPath}/${Globals.ACT_CREATE}`} render={(props) => (<UserForm {...props} myProfile={this.props.myProfile} act={Globals.ACT_CREATE} />)}/>
          <Route path={`${this.detailPath}/:itemId`} render={(props) => (<UserForm {...props} myProfile={this.props.myProfile} act={Globals.ACT_UPDATE} />)}/>
        </Switch>
        <Panel header={pageTitle}>
          <Panel style={Globals.STYLE_CENTER}>
             <Form inline>
               <Select id="formControlsSelect" label="欄位 " placeholder="select"
                 defaultValue={this.state.inputs.search}
                 options={this.searchOptions} inputRef={ref => this.inputs.search = ref} /><Span/>
               <FieldGroup id="formControlsText" type="text" label="" placeholder="請輸入要查詢的值"
                 defaultValue={this.state.inputs.keyword}
                 inputRef={ref => this.inputs.keyword = ref} /><Span/>
               <Button bsStyle="primary" onClick={()=>this._handleSearch(0)}>
                 <Glyphicon glyph="search"/> 查詢
               </Button><Span/>
               {buttonToAdd}
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

UserPage.propTypes = {
  myProfile: PropTypes.object
};