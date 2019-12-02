import React from 'react';
import * as Globals from '../common/Globals';
import { ListArticles } from '../common/DataUtils';
import { ItemList, ItemRow } from '../common/ItemList';

export default class ArticlePage extends React.Component {

  constructor(props) {
    super(props);
    this.repository = 'articles';
    // 要顯示在列表的欄位
    this.columns = {
      id: ['ID', 'id'],
      subject: ['主旨', 'subject'],
      content: ['內文', 'content'],
      shortCreatedDate: ['資料建立日期', 'createdDate'],
      shortUpdatedDate: ['資料更新日期', 'updatedDate'],
    };
    this.state = {
      items: [],
      page: {
        size: this.pageSize,
        totalElements: 0,
        totalPages: 0,
        number: 0     // 第一頁
      },
    };
    this.detailColumn = 'subject';
    this.detailPath = '/Article/ArticleForm';

    // this._handleSearch = this._handleSearch.bind(this);
    // this._handleRefreshList = this._handleRefreshList.bind(this);
    // this._handleDelete = this._handleDelete.bind(this); 
  }

  componentDidMount() {
    ListArticles(Globals.PAGE_SIZE, 
      (response) => {
        this.setState({
          items: response._embedded[this.repository],
          page: response.page,
        });
      },
      this._showErrors);
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
        />
      ) : null;
  }

  render() {
    return (<div>
      <ItemList page={this.state.page} itemRows={this._renderItemRows()} />
    </div>);
  }

}
