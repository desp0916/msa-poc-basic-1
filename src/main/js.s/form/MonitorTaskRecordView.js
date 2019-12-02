/**
 * 檢視監控排程通知紀錄
 * 
 * Read-only View（「關鍵字」與「門檻值」共用）
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Sat May 27 22:22:36 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import * as Globals from '../common/Globals';
import { Span } from '../common/FormObjects';
import { FetchItemById } from '../common/DataUtils';
import { ModalDialog } from '../common/ModalDialog';

export default class MonitorTaskRecordView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: {},
      isLoading: false,
      showDialog: false,
    };
    this.repository = this.props.repository;
    this.downloadPath = '/monitortaskrecord/file/';

    this._handleHide = this._handleHide.bind(this);
    this._genDownloadLink = this._genDownloadLink.bind(this);
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

  _genDownloadLink(filename) {
    return (
      <a href={Globals.API_ROOT + this.downloadPath + filename} target="_blank">{filename}</a>
    );
  }

  _handleHide() {
    this.setState({
      showDialog: false,
    });
    this.props.history.goBack();
  }

  render() {

    if (this.state.isLoading) {
      return null;
    }

    return (
      <ModalDialog title={this.props.dialogTitle} show={this.state.showDialog} onHide={this._handleHide}>
        <div><p><strong>【通知紀錄 ID】</strong>{this.state.item.id}</p></div>
        <div><p><strong>【專案系統代號】</strong>{this.state.item.projectSysId}</p></div>
        <div><p><strong>【專案系統中文名稱】</strong>{this.state.item.projectCname}</p></div>
        <div><p><strong>【專案系統英文名稱】</strong>{this.state.item.projectEname}</p></div>
        <div><p><strong>【監控排程名稱】</strong>{this.state.item.taskName}</p></div>
        <div><p><strong>【通知內容】</strong></p>
          {this.state.item.taskNotification.split('\n').map((item, key) => {
            return (<p key={key}>{item}</p>);
          })}
        </div>
        <div><p><strong>【SQL】</strong>{this.state.item.taskSql}</p></div>
        <div><p><strong>【結果值】</strong>{this.state.item.result}</p></div>
        <div><p><strong>【下載明細檔】</strong>{this._genDownloadLink(this.state.item.filename)}</p></div>
        <div><p><strong>【資料建立日期時間】</strong>{this.state.item.createdDate}</p></div>
        <div style={Globals.STYLE_CENTER}>
          <Button onClick={this._handleHide}>關閉</Button><Span/>
        </div>
      </ModalDialog>
    );
  }
}

MonitorTaskRecordView.propTypes = {
  repository: PropTypes.string,
  dialogTitle: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object,
  act: PropTypes.string,
};