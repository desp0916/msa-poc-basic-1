/**
 * 共用列表清單元件
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Sat Jan 21 11:25:18 CST 2017
 * @flow
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination } from 'react-bootstrap';
import * as Globals from '../common/Globals';
import { Link } from 'react-router-dom';

export class Sort {
  constructor(field, direction) {
    this.field = (field === undefined) ? 'updatedDate' : field;
    this.direction = (direction === undefined) ? 'desc' : direction;
  }
}

/**
 * 產生項目清單表格
 */
export class ItemList extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this._handleLoad = this.props.onSearch.bind(this);
  }

  render() {
    return (
      <div>共 {this.props.page.totalElements} 筆資料
      <Table striped condensed hover responsive className="dataTable">
        <thead>
          <TableHeader {...this.props} onSort={this._handleLoad}/>
        </thead>
        <tbody>{this.props.itemRows}</tbody>
      </Table>
      <div style={Globals.STYLE_CENTER}>
        <Pagination boundaryLinks maxButtons={5}
          prev={((this.props.page.number == 0)?false:true)}
          next={((this.props.page.number+1 == this.props.page.totalPages)?false:true)}
          first={((this.props.page.number == 0)?false:true)}
          last={((this.props.page.number+1 == this.props.page.totalPages)?false:true)}
          items={Math.ceil(this.props.page.totalElements / Globals.PAGE_SIZE)}
          activePage={this.props.page.number + 1}
          onSelect={ (eventKey) => { this._handleLoad(eventKey-1, this.props.sort); }} />
        </div>
      </div>
    );
  }
}

ItemList.propTypes = {
  columns: PropTypes.object,
  onSearch: PropTypes.func,
  page: PropTypes.object,
  itemRows: PropTypes.array,
  sort: PropTypes.object,
};

/**
 * 資料表標題列
 */
export class TableHeader extends Component {
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

TableHeader.propTypes = {
  columns: PropTypes.object,
  sort: PropTypes.object,
  onSort: PropTypes.func,
};

/**
 * 資料列
 */
export class ItemRow extends Component {
  render() {
    return (
      <tr>
        {Object.keys(this.props.columns).map((key)=>
          (key === this.props.detailColumn) ?  
            (<td key={key}><Link to={`${this.props.detailPath}/${this.props.item['id']}`}>{this.props.item[key]}</Link></td>) : 
            (<td key={key}>{this.props.item[key]}</td>)
        )}
        <td>
          {this.props.buttons}
        </td>
      </tr>
    );
  }
}

ItemRow.propTypes = {
  columns: PropTypes.object,
  item: PropTypes.object,
  detailColumn: PropTypes.string,
  detailPath: PropTypes.string,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  buttons: PropTypes.array,
};