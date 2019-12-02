/**
 * 新增或修改佈告欄資料
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Wed Mar 29 09:44:26 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

import * as Globals from '../common/Globals';
import { MetadataBlock } from '../common/MetadataBlock';
import { FormError, FieldGroup, TextArea, Span, DateTimeFieldGroup } from '../common/FormObjects';
import { FetchItemById, PostEntity, PatchEntity, showSuccessMsg, showFailureMsg } from '../common/DataUtils';
import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';
import moment from 'moment';
import { ModalDialog } from '../common/ModalDialog';

export default class BulletinForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: {},
      response: {},
      errors: {},
      isLoading: false,
      showDialog: false,
    };

    this.repository = 'bulletins';
    this.dialogTitles = {};
    this.dialogTitles[Globals.ACT_CREATE] = '新增佈告';
    this.dialogTitles[Globals.ACT_UPDATE] = '修改佈告';
    this.item = {};       // 暫存物件
    this.now = moment().format('YYYY-MM-DD HH:mm:00');
    this.inputs = {};
    this.errors = {};

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleHide = this._handleHide.bind(this);
    this._showErrors = this._showErrors.bind(this);
    this._handleSuccess = this._handleSuccess.bind(this);
    this._handleChangeTime = this._handleChangeTime.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.itemWillChange(nextProps.match.params.itemId);
  }

  componentWillMount() {
    this.itemWillChange(this.props.match.params.itemId);
  }

  _handleHide() {
    this.setState({
      showDialog: false,
    });
    this.props.history.goBack();
  }

  itemWillChange(itemId) {
    if (itemId.toString().length > 0 && this.props.act === Globals.ACT_UPDATE) {
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
        item: { startTime: this.now, endTime: this.now },
        isLoading: false,
        showDialog: true
      });
    }
  }

  _handleSubmit(e) {
    e.preventDefault();
    this._clearErrors();
    if (this.props.act === Globals.ACT_UPDATE) {
      PatchEntity(this.state.item, this.inputs, this.repository, this._handleSuccess, this._showErrors);
    } else if (this.props.match.params.itemId === Globals.ACT_CREATE) {
      PostEntity(this.inputs, this.repository, this._handleSuccess, this._showErrors);
    } else {
      console.error('未知的操作');
    }
  }

  _handleSuccess(response) {
    showSuccessMsg(this.props.act);
    // this.props.onRefreshList();
  }

  _clearErrors() {
    this.setState({response: {}, errors: {}});
  }

  _showErrors(response) {
    showFailureMsg(this.props.act);
    if (response && response.entity && response.entity.errors) {
      response.entity.errors.map(item => this.errors[item.property] = item.message);
      this.setState({errors: this.errors});
    }
  }

  _handleChangeTime(fieldName, newDate) {
    Object.assign(this.state.item[fieldName], {value: newDate});
    // console.log('######' + fieldName);
    // this.setState({fieldName: newDate});
  }

  render() {
    return (
      <ModalDialog title={this.dialogTitles[this.props.act]} show={this.state.showDialog} onHide={this._handleHide}>
        <Form onSubmit={this._handleSubmit}>
          <FormError error={this.state.errors.id} />
          <FieldGroup id="subject" type="text" label="主旨 *" placeholder="請輸入主旨" 
            defaultValue={this.state.item.subject} inputRef={ref => this.inputs.subject = ref}
            help={this.state.errors.subject} maxLength={150} />
          <DateTimeFieldGroup id="startTime" label="作業開始時間 *" defaultValue={this.state.item.startTime} 
            help={this.state.errors.startTime}
            onChange={(newDate) => { this._handleChangeTime('startTime', newDate); } }/>
          <DateTimeFieldGroup id="endTime" label="作業結束時間 *" defaultValue={this.state.item.endTime}
            help={this.state.errors.endTime}
            onChange={(newDate) => { this._handleChangeTime('endTime', newDate); } }/>
          <TextArea id="content" label="作業內容 *" placeholder="請輸入作業內容"
            defaultValue={this.state.item.content} inputRef={ref => this.inputs.content = ref}
            help={this.state.errors.content} maxLength={4096} />
          <TextArea id="impact" label="作業影響範圍 *" placeholder="請輸入作業影響範圍" 
            defaultValue={this.state.item.impact} inputRef={ref => this.inputs.impact = ref}
            help={this.state.errors.impact} maxLength={1024} />
          <TextArea id="contactInfo" label="聯絡資訊 *" placeholder="請輸入聯絡資訊"
            defaultValue={this.state.item.contactInfo} inputRef={ref => this.inputs.contactInfo = ref} help={this.state.errors.contactInfo} maxLength={1024} />
          <MetadataBlock show={this.props.act === Globals.ACT_UPDATE} data={this.state.item} />
          <div style={Globals.STYLE_CENTER}>
            <Button onClick={this._handleHide}>取消</Button><Span/>
            <Button bsStyle="primary" type="submit">儲存</Button>
          </div>
        </Form>
      </ModalDialog>
    );
  }
}

BulletinForm.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  act: PropTypes.string,
  // onCancel: PropTypes.func,
  // onRefreshList: PropTypes.func,
};