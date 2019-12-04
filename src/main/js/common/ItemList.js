import React from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Globals from '../common/Globals';

export class Sort {
  constructor(field, direction) {
    this.field = (field === undefined) ? 'updatedDate' : field;
    this.direction = (direction === undefined) ? 'desc' : direction;
  }
}

/**
 * 產生項目清單表格
 */
export class ItemList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    // 將本元件的 _handleLoad() 綁定父元件的 onSearch()
    this._handleLoad = this.props.onSearch.bind(this);
  }

  /**
   * 產生分頁區塊
   */
  genPaginationItems() {
    let pageItems = [];
    let currentPageNo = this.props.page.number + 1;
    let totalPages = this.props.page.totalPages;
    if (currentPageNo-1 > 0) {
      pageItems.push(<Pagination.Item key={currentPageNo-1} onClick={() => { this._handleLoad(currentPageNo-2, this.props.sort); }}>上一頁</Pagination.Item>);
    } else {
      pageItems.push(<Pagination.Item key={currentPageNo-1} disabled>上一頁</Pagination.Item>);
    }
    pageItems.push(<Pagination.Item key={currentPageNo} active>{currentPageNo}</Pagination.Item>);
    if (currentPageNo+1 < totalPages) {
      pageItems.push(<Pagination.Item key={currentPageNo+1} onClick={() => { this._handleLoad(currentPageNo, this.props.sort); }}>下一頁</Pagination.Item>);
    } else {
      pageItems.push(<Pagination.Item key={currentPageNo+1} disabled>下一頁</Pagination.Item>);
    }
    return pageItems;
  }

  render() {
    return (
      <div>共 {this.props.page.totalElements} 筆資料
        <Table striped hover responsive className="dataTable">
          <thead>
            <TableHeader {...this.props} onSort={this._handleLoad}/>
          </thead>
          <tbody>{this.props.itemRows}</tbody>
        </Table>
        <div class="container">
           <div class="row justify-content-center">
            <Pagination>
              {this.genPaginationItems()}
            </Pagination>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * 資料表標題列
 */
export class TableHeader extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <tr>
        {Object.keys(this.props.columns).map((key) => {
          if (this.props.columns[key][1] != null) {
            const oldSort = this.props.sort;
            let newSort = new Sort(this.props.columns[key][1], 'asc');
            let className = 'sorting ';
            if (this.props.columns[key][1] == oldSort.field) {
              className += (oldSort.direction == 'asc') ? 'sorting_asc' : 'sorting_desc';
            }
            if (newSort.field == oldSort.field) {
              newSort = (oldSort.direction == 'desc') ? new Sort(oldSort.field, 'asc') : new Sort(oldSort.field, 'desc');
            }
            return (
              <th className={className} key={key} onClick={() => { this.props.onSort(0, newSort); }}>
                {this.props.columns[key][0]}
              </th>);
          } else {
            return (<th key={key}>{this.props.columns[key][0]}</th>);
          }
        })}
        <th>可執行的操作</th>
      </tr>
    );
  }
}

/**
 * 資料列
 */
export class ItemRow extends React.Component {
  render() {
    return (
      <tr>
        {Object.keys(this.props.columns).map((key)=>
          (key === this.props.detailColumn) ?  
            (<td key={key}>{this.props.item[key]}</td>) : 
            (<td key={key}>{this.props.item[key]}</td>)
        )}
        <td>
          {this.props.buttons}
        </td>
      </tr>
    );
  }
}