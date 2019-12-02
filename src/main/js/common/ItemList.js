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
    // this._handleLoad = this.props.onSearch.bind(this);
  }

  render() {
    return (
      <div>共 {this.props.page.totalElements} 筆資料
      <Table striped condensed hover responsive className="dataTable">
        <tbody>{this.props.itemRows}</tbody>
      </Table>
      </div>
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
      </tr>
    );
  }
}