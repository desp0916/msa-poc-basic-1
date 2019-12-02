/**
 * 統計報表排程通知紀錄
 * 
 * @author Gary Liu<gary_liu@pic.net.tw>
 * @since  Fri Jun 2 23:59:38 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { Panel, Glyphicon, Button, Form } from 'react-bootstrap';
import { FieldGroup, Select, Span } from '../common/FormObjects';
import { Switch, Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import * as Globals from '../common/Globals';
import { Loading } from '../common/FormObjects';
import { Sort, ItemList, ItemRow } from '../common/ItemList';

const ReportTaskRecordView = Loadable({
  loader: () => import('../form/ReportTaskRecordView'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const client = require('../client');
const stompClient = require('../websocket-listener');

export default class ReportTaskRecordPage extends Component {

  constructor(props) {
    super(props);

    // 要顯示在列表的欄位
    this.columns = {
      id: ['ID', 'id'],
      projectSysId: ['系統代號', 'project'],
      // taskType: ['監控排程類型', 'taskType'],
      taskName: ['監控排程名稱', 'taskName'],
      taskNotification: ['通知內容', 'taskNotification'],
      // taskSql: ['SQL', null],
      result: ['結果值', 'result'],
      // filename: ['明細檔', 'filename'],
      createdDate: ['資料建立日期', 'createdDate'],
    };

    this.searchOptions = [
      {key: 'findByIdForCurrentUser', value: '通知紀錄ID' },
      {key: 'findByTaskIdForCurrentUser', value: '統計報表排程ID' },
      // {key: 'findByKwKeywordContainsForCurrentUser', value: '關鍵字' },
    ];

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
      sort: new Sort(this.columns.createdDate[1], 'desc'),
    };

    this.repository = 'reporttaskrecords';
    this.pageTitle = '統計報表排程通知紀錄';
    this.pageSize = Globals.PAGE_SIZE;
    this.inputs = {
      search: '',
      keyword: ''
    };

    this.detailColumn = 'id';
    this.detailPath = '/ReportTaskRecord/ReportTaskRecordView';
    this.downloadPath = '/reporttaskrecord/file/';

    this._handleSearch = this._handleSearch.bind(this);
    this._handleRefreshList = this._handleRefreshList.bind(this);
  }

  componentDidMount() {
    this._handleSearch(0);
    stompClient.register([
			{route: '/topic/newReportTaskRecord', callback: this._handleRefreshList},
			{route: '/topic/updateReportTaskRecord', callback: this._handleRefreshList},
			{route: '/topic/deleteReportTaskRecord', callback: this._handleRefreshList}
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
      case 'findByIdForCurrentUser':
        searchUri = '/search/'+searchType+'?id=' + keyword;
        break;
      case 'findByTaskIdForCurrentUser':
        searchUri = '/search/'+searchType+'?taskId=' + keyword;
        break;
      // case 'findByKwKeywordContainsForCurrentUser':
      //   searchUri = '/search/'+searchType+'?kwKeyword=' + keyword;
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

  _handleDownload(act, item) {
    if (act === Globals.ACT_OTHER) {
      window.location = Globals.API_ROOT + this.downloadPath + item.filename;
    }
  }

  _renderItemRows() {
    return (Array.isArray(this.state.items) && this.state.items.length > 0) ?
      this.state.items.map(item => 
        <ItemRow key={item.id} item={item} columns={this.columns} detailColumn={this.detailColumn} detailPath={this.detailPath}
          buttons={[
            <LinkContainer key={item.id+'_button'} to={`${this.detailPath}/${item.id}`}><Button key={item.id+'_view'}><Glyphicon glyph="zoom-in" /> 檢視</Button></LinkContainer>,
            <Button key={item.id+'_download'} onClick={() => this._handleDownload(Globals.ACT_OTHER, item)}><Glyphicon glyph="zoom-in" /> 下載檔案</Button>
          ]}
        />
      ) : null;
  }

  render() {
    const pageTitle = (<h3>{this.pageTitle}</h3>);
    return (
      <div>
        <Switch>
          <Route path={`${this.detailPath}/:itemId`} render={(props) => (<ReportTaskRecordView {...props} dialogTitle={this.dialogTitle} repository={this.repository} act={Globals.ACT_VIEW} />)}/>
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