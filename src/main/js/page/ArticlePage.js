/**
 * 文章
 *
 * 使用者透過這個頁面上的 NavigationBar 來跳轉至其他頁面
 *
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Thu Jan 12 10:45:22 CST 2017
 * @flow
 */

import React, {Suspense} from 'react';
import { Route, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import * as Globals from '../common/Globals';
import { GetRepository, DeleteEntity, showSuccessMsg, showFailureMsg } from '../common/DataUtils';
import { Sort, ItemList, ItemRow } from '../common/ItemList';
import ArticleForm from '../form/ArticleForm';

export default class ArticlePage extends React.Component {

  constructor(props) {
    super(props);
    this.repository = 'articles';
    // 要顯示在列表的欄位
    this.columns = {
      id: ['ID', 'id'],
      subject: ['主旨', 'subject'],
      content: ['內文', 'content'],
      createdDate: ['資料建立日期', 'createdDate'],
      updatedDate: ['資料更新日期', 'updatedDate'],
    };
    this.state = {
      items: [],
      page: {
        size: this.pageSize,
        totalElements: 0,
        totalPages: 0,
        number: 0     // 第一頁
      },
      sort: new Sort(this.columns.updatedDate[1], 'desc')
    };
    this.detailColumn = 'subject';
    this.detailPath = '/Article/ArticleForm';

    this._handleRefreshList = this._handleRefreshList.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
  }

  componentDidMount() {
    GetRepository(this.repository, this.state.page.number, this.state.sort,
      (response) => {
        this.setState({
          items: response._embedded[this.repository],
          page: response.page,
        });
      },
      this._showErrors);
  }

  _handleSearch(pageNo = 0, sort = this.state.sort) {
    GetRepository(this.repository, pageNo, sort,
      (response) => {
        this.setState({
          items: response._embedded[this.repository],
          page: response.page,
        });
      },
      this._showErrors);
  }

  _handleRefreshList() {
    this._handleSearch(this.state.page.number, this.state.sort);
  }

  _showErrors(response) {
    showFailureMsg(Globals.ACT_QUERY);
    if (response && response.entity && response.entity.errors) {
      response.entity.errors.map(item => this.errors[item.property] = item.message);
      this.setState({errors: this.errors});
    }
  }

  _renderItemRows() {
    return (Array.isArray(this.state.items) && this.state.items.length > 0) ?
      this.state.items.map(item => 
        <ItemRow key={item.id} item={item} columns={this.columns}
         detailColumn={this.detailColumn} detailPath={this.detailPath}
          buttons={[
            <LinkContainer key={item.id+'button'} to={`${this.detailPath}/${item.id}`}>
              <Button key={item.id+'_edit'} variant="link">修改</Button>
            </LinkContainer>,
            <Button key={item.id+'_delete'} onClick={() => this._handleDelete(item)} variant="link">刪除</Button>
          ]}
        />
      ) : null;
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

  render() {
    return (
      <div>
        <Switch>
          <Route path={`${this.detailPath}/${Globals.ACT_CREATE}`} component={ArticleForm}/>
          <Route path={`${this.detailPath}/:itemId`} component={ArticleForm}/>
        </Switch>
        <ItemList
          page={this.state.page}
          columns={this.columns}
          onSearch={this._handleSearch}
          itemRows={this._renderItemRows()}
          sort={this.state.sort} />
      </div>);
  }

}
