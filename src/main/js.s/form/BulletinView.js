/**
 * 我的個人檔案
 * 
 * @author Gary Liu<gary_liu@pic.net.tw>
 * @since  Fri Apr 14 10:48:20 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import * as Globals from '../common/Globals';
import { Span } from '../common/FormObjects';
import { FetchItemById } from '../common/DataUtils';
import { ModalDialog } from '../common/ModalDialog';

export default class BulletinView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: {},
      isLoading: false,
      showDialog: false,
    };
    this.repository = 'bulletins';
    this._handleHide = this._handleHide.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.itemWillChange(nextProps.match.params.itemId);
  }

  // First Load
  componentWillMount() {
    this.itemWillChange(this.props.match.params.itemId);
  }

  itemWillChange(itemId) {
    if (itemId.toString().length > 0 && this.props.act === Globals.ACT_VIEW) {
      this.setState({ isLoading: true, showDialog: false });
      FetchItemById(this.repository, itemId,
        (response) => {
          const freshItem = Object.assign({headers: response.headers, _links: response.entity._links}, response.entity);
          this.setState({
            item: freshItem,
            isLoading: false,
            showDialog: true,    
          });
        },
        (response) => { alert('載入資料失敗'); }
      );
    } else {
      this.setState({
        isLoading: false,
        showDialog: true
      });
    }
  }

  _handleHide() {
    this.setState({
      showDialog: false,
    });
    this.props.history.goBack();
  }

  render() {
    const { item, isLoading } = this.state;

    // Loading.....
    if (isLoading) {
      return null;
    }

    return (
      <ModalDialog title={item.subject} show={this.state.showDialog} onHide={this._handleHide}>
        <div><p><strong>【作業時間】</strong>{item.startTime} ～ {item.endTime}</p></div>
        <div><p><strong>【作業內容】</strong></p>
          {item.content.split('\n').map((item, key) => {
            return (<p key={key}>{item}</p>);
          })}
        </div>
        <div><p><strong>【影響範圍】</strong></p>
          {item.impact.split('\n').map((item, key) => {
            return (<p key={key}>{item}</p>);
          })}
        </div>
        <div><p><strong>【聯絡資訊】</strong></p>
          {item.contactInfo.split('\n').map((item, key) => {
            return (<p key={key}>{item}</p>);
          })}
          <br />
        </div>
        <div><p><strong>【資料建立者】</strong>{item.creatorCname}</p></div>
        <div><p><strong>【資料建立日期時間】</strong>{item.createdDate}</p></div>
        <div><p><strong>【資料更新者】</strong>{item.updaterCname}</p></div>
        <div><p><strong>【資料更新日期時間】</strong>{item.updatedDate}</p></div>
        <div style={Globals.STYLE_CENTER}>
          <Button onClick={this._handleHide}>關閉</Button><Span/>
        </div>
      </ModalDialog>
    );
  }
}

BulletinView.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  act: PropTypes.string,
};