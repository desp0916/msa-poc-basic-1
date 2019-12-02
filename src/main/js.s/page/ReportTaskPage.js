/**
 * 統計報表排程
 * 
 * @author Gary Liu<gary_liu@pic.net.tw>
 * @since  Thu Jan 12 10:48:20 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { Panel, Glyphicon, Button, Form } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import * as Globals from '../common/Globals';
import { Loading, FieldGroup, Select, Span } from '../common/FormObjects';
import { Sort, ItemList, ItemRow } from '../common/ItemList';
import { DeleteEntity, showSuccessMsg, showFailureMsg, SendRequest } from '../common/DataUtils';

const ReportTaskForm = Loadable({
  loader: () => import('../form/ReportTaskForm'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const client = require('../client');
const stompClient = require('../websocket-listener');

export default class ReportTaskPage extends Component {

  constructor(props) {
    super(props);
    // 要顯示在列表的欄位
    this.columns = {
      id: ['任務ID', 'id'],
      name: ['監控排程名稱', 'name'],
      projectSysId: ['系統代號', 'project'],
      taskInterval: ['執行間隔(秒)', 'taskInterval'],
      taskSql: ['SQL指令', 'taskSql'],
      creatorCname: ['資料建立者', 'creator'],
      shortCreatedDate: ['資料建立日期', 'createdDate'],
      updaterCname: ['資料更新者', 'updater'],
      shortUpdatedDate: ['資料更新日期', 'updatedDate'],
    };
    this.state = {
      act: Globals.ACT_CREATE,
      items: [],
      showDialog: false,        // 是否顯示新增或修改對話框
      item: {},
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
      sort: new Sort(this.columns.shortUpdatedDate[1], 'desc')
    };

    this.repository = 'reporttasks';
    this.pageTitle = '統計報表排程管理';
    this.pageSize = Globals.PAGE_SIZE;
    this.inputs = {
      search: '',
      keyword: ''
    };

    this.searchOptions = [
      {key: 'findBySysIdContainsForCurrentUser', value: '專案系統英文代號' },
      {key: 'findByNameContainsForCurrentUser', value: '統計報表排程名稱' },
      // {key: 'findByKwKeywordContainsForCurrentUser', value: '關鍵字' },
    ];

    this.detailColumn = 'name';
    this.detailPath = '/ReportTask/ReportTaskForm';

    this._handleSearch = this._handleSearch.bind(this);
    this._handleRefreshList = this._handleRefreshList.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._handleToggleSchedule = this._handleToggleSchedule.bind(this);
  }

  componentDidMount() {
    this._handleSearch(0);
    stompClient.register([
			{route: '/topic/newReportTask', callback: this._handleRefreshList},
			{route: '/topic/updateReportTask', callback: this._handleRefreshList},
			{route: '/topic/deleteReportTask', callback: this._handleRefreshList}
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
        searchUri = `/search/${searchType}?sysId=${keyword}`;
        break;
      case 'findByNameContainsForCurrentUser':
        searchUri = `/search/${searchType}?name=${keyword}`;
        break;
      // case 'findByKwKeywordContainsForCurrentUser':
      //   searchUri = '/search/'+searchType+'?kwKeyword=' + keyword;
      //   break;
      }
    } else {
      searchUri = '/search/findAllForCurrentUser?';
    }
    navUri = `${baseUri}${searchUri}&size=${this.pageSize}&page=${pageNo}&sort=${sort.field},${sort.direction}`;
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

  _handleToggleSchedule(item) {
    const uri = `${Globals.API_ROOT}/reporttask/${item.id}`;
    if (item.scheduled === 1) {
      SendRequest('DELETE', uri,
        () => {
          showSuccessMsg(Globals.ACT_OTHER, '停止排程成功');
          this._handleRefreshList();
        },
        () => {
          showFailureMsg(Globals.ACT_OTHER, '停止排程失敗');
        }
      );
    } else {
      SendRequest('POST', uri,
        () => {
          showSuccessMsg(Globals.ACT_OTHER, '啟動排程成功');
          this._handleRefreshList();
        }, 
        () => {
          showFailureMsg(Globals.ACT_OTHER, '啟動排程失敗');
        }
      );
    }
  }

  _renderItemRows() {
    return (Array.isArray(this.state.items) && this.state.items.length > 0) ?
      this.state.items.map(item => 
        <ItemRow key={item.id} item={item} columns={this.columns} detailColumn={this.detailColumn} detailPath={this.detailPath}
          buttons={[
            <Button key={item.id+'_toggleSchedule'} onClick={() => this._handleToggleSchedule(item)} style={(item.scheduled === 1) ? Globals.STYLE_COLOR_GREEN : Globals.STYLE_COLOR_RED}>
              <Glyphicon glyph="off" /> { (item.scheduled === 1) ? '停止' : '啟動' }
            </Button>,
            <LinkContainer key={item.id+'button'} to={`${this.detailPath}/${item.id}`}>
              <Button key={item.id+'_edit'}><Glyphicon glyph="edit" /> 修改</Button>
            </LinkContainer>,
            <Button key={item.id+'_delete'} onClick={() => this._handleDelete(item)}>
              <Glyphicon glyph="trash" /> 刪除
            </Button>
          ]}
        />
      ) : null;
  }

  render() {
    const pageTitle = (<h3>{this.pageTitle}</h3>);
    return (
      <div>
        <Switch>
          <Route path={`${this.detailPath}/${Globals.ACT_CREATE}`} render={(props) => (<ReportTaskForm {...props} act={Globals.ACT_CREATE} />)}/>
          <Route path={`${this.detailPath}/:itemId`} render={(props) => (<ReportTaskForm {...props} act={Globals.ACT_UPDATE} />)}/>
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