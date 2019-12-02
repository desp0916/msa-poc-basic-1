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
    this._handleLoad = this.props.onSearch.bind(this);
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
            // console.log(oldSort);
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