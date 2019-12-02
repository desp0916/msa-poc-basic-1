/**
 * 專案系統管理
 * 
 * TODO 目前「專案系統管理」的 UI 是設計給 SUPERUSER 使用的，MANAGER 的 UI 可能還要另外設計或調整
 * 
 * @author Gary Liu<gary_liu@pic.net.tw>
 * @since  Tue Feb 7 09:37:40 CST 2017
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
import { showSuccessMsg, showFailureMsg, SendRequest } from '../common/DataUtils';

const ProjectForm = Loadable({
  loader: () => import('../form/ProjectForm'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const ProjectUserForm = Loadable({
  loader: () => import('../form/ProjectUserForm'),
  loading: Loading,
});

const client = require('../client');
const stompClient = require('../websocket-listener');

export default class ProjectPage extends Component {

  constructor(props) {
    super(props);
    // 要顯示在列表的欄位
    this.columns = {
      sysId: ['系統英文代號', 'sysId'],
      cname: ['中文名稱', 'cname'],
      ename: ['英文名稱', 'ename'],
      adminCname: ['管理者', 'admin'],
      creatorCname: ['資料建立者', 'creator'],
      shortCreatedDate: ['資料建立日期', 'createdDate'],
      updaterCname: ['資料更新者', 'updater'],
      shortUpdatedDate: ['資料更新日期', 'updatedDate'],
    };
    this.state = {
      act: Globals.ACT_CREATE,
      items: [],
      response: {},
      inputs: {
        search: '',
        keyword: '',
      },
      page: {
        size: Globals.PAGE_SIZE,
        totalElements: 0,
        totalPages: 0,
        number: 0     // 第一頁
      },
      sort: new Sort(this.columns.shortUpdatedDate[1], 'desc'),
    };

    this.repository = 'projects';
    this.pageTitle = '專案系統管理';
    this.pageSize = Globals.PAGE_SIZE;
    this.inputs = {
      search: '',
      keyword: ''
    };

    this.searchOptions = [
      {key: 'findBySysIdContainsForCurrentUser', value: '英文代號' },
      {key: 'findByCnameContainsForCurrentUser', value: '中文名稱' },
      {key: 'findByEnameContainsForCurrentUser', value: '英文名稱' },
    ];

    this.detailColumn = 'sysId';
    this.detailPathProject = '/Project/ProjectForm';
    this.detailPathProjectUser = '/Project/ProjectUserForm';

    this._handleSearch = this._handleSearch.bind(this);
    this._handleRefreshList = this._handleRefreshList.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
  }

  componentDidMount() {
    this._handleSearch(0);
    stompClient.register([
			{route: '/topic/newProject', callback: this._handleRefreshList},
			{route: '/topic/updateProject', callback: this._handleRefreshList},
			{route: '/topic/deleteProject', callback: this._handleRefreshList}
    ]);
  }

  /**
   * 處理查詢
   */
  _handleSearch(pageNo = 0, sort = this.state.sort) {
    let baseUri = Globals.API_ROOT + '/' + this.repository;
    let navUri = '';
    let searchUri = '';
    const searchType = (this.inputs.search) ? this.inputs.search.value.trim() : '';
    const keyword = (this.inputs.keyword) ? this.inputs.keyword.value.trim() : '';
    if (searchType.length > 0 && keyword.length > 0) {
      switch (searchType) {
      case 'findBySysIdContainsForCurrentUser':
        searchUri = '/search/'+searchType+'?sysId=' + keyword;
        break;
      case 'findByCnameContainsForCurrentUser':
        searchUri = '/search/'+searchType+'?cname=' + keyword;
        break;
      case 'findByEnameContainsForCurrentUser':
        searchUri = '/search/'+searchType+'?ename=' + keyword;
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
      SendRequest('DELETE', Globals.API_ROOT + '/delete/project/' + item.id,
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
    // 修改、刪除專案系統
    if (roleId === Globals.ROLE_SUPERUSER) {
      return (Array.isArray(this.state.items) && this.state.items.length > 0) ?
        this.state.items.map(item => 
          <ItemRow key={item.id} item={item} columns={this.columns} detailColumn={this.detailColumn} detailPath={this.detailPathProject}
            buttons={[
              <LinkContainer key={item.id+'button'} to={`${this.detailPathProject}/${item.id}`}><Button key={item.id+'_edit'}><Glyphicon glyph="edit" /> 修改</Button></LinkContainer>,
              <Button key={item.id+'_delete'} onClick={() => this._handleDelete(item)}><Glyphicon glyph="trash" /> 刪除</Button>
            ]}
          />
        ) : null;
    // 修改專案系統成員
    } else if (roleId === Globals.ROLE_MANAGER) {
      return (Array.isArray(this.state.items) && this.state.items.length > 0) ?
        this.state.items.map(item =>
          <ItemRow key={item.id+'_row'} item={item} columns={this.columns} detailColumn={this.detailColumn} detailPath={this.detailPathProjectUser}
            buttons={[
              <LinkContainer key={item.id+'_button'} to={`${this.detailPathProjectUser}/${item.id}`}><Button key={item.id+'_updateUsers'}><Glyphicon glyph="edit" /> 修改成員</Button></LinkContainer>
            ]}
          />
        ) : null;
    }
    return null;
  }

  render() {
    const pageTitle = (<h3>{this.pageTitle}</h3>);
    // SUPERUSER 才能新增專案系統
    const buttonToAdd = (this.props.myProfile.roleId === Globals.ROLE_SUPERUSER ) ?
      <LinkContainer to={`${this.detailPathProject}/${Globals.ACT_CREATE}`}><Button>
        <Glyphicon glyph="plus"/> 新增</Button></LinkContainer> : null;

    return (
      <div>
        <Switch>
          <Route path={`${this.detailPathProject}/${Globals.ACT_CREATE}`} render={(props) => (<ProjectForm {...props} myProfile={this.props.myProfile} act={Globals.ACT_CREATE} />)}/>
          <Route path={`${this.detailPathProject}/:itemId`} render={(props) => (<ProjectForm {...props} myProfile={this.props.myProfile} act={Globals.ACT_UPDATE}/>)}/>
          <Route path={`${this.detailPathProjectUser}/:itemId`} render={(props) => (<ProjectUserForm {...props} myProfile={this.props.myProfile} act={Globals.ACT_UPDATE} onRefreshList={this._handleRefreshList}/>)}/>
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

ProjectPage.propTypes = {
  myProfile: PropTypes.object
};