/**
 * 新增或修改使用者資料
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Sun Feb 5 12:32:57 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

import * as Globals from '../common/Globals';
import { MetadataBlock } from '../common/MetadataBlock';
import { FormError, FieldGroup, Select, Span } from '../common/FormObjects';
import { FetchItemById, PostEntity, PatchEntity, showSuccessMsg, showFailureMsg } from '../common/DataUtils';
import { ModalDialog } from '../common/ModalDialog';

export default class UserForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: {},
      response: {},
      errors: {},
      isLoading: false,
      showDialog: false,
    };

    this.repository = 'users';
    this.dialogTitles = {};
    this.dialogTitles[Globals.ACT_CREATE] = '新增使用者';
    this.dialogTitles[Globals.ACT_UPDATE] = '修改使用者';
    this.options = [
      {key: '100', value: '一般使用者'},
      {key: '200', value: '專案系統管理者'},
      {key: '999', value: '最高權限管理者'},
    ];
    this.item = {};       // 暫存物件
    this.inputs = {};
    this.errors = {};

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleHide = this._handleHide.bind(this);
    this._showErrors = this._showErrors.bind(this);
    this._handleSuccess = this._handleSuccess.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // 判斷是否來自 MyProfile？
    let itemId = (typeof nextProps.match.params.itemId == 'undefined') ? this.props.myProfile.id : nextProps.match.params.itemId;
    this.itemWillChange(itemId);
  }

  componentWillMount() {
    // 判斷是否來自 MyProfile？
    let itemId = (typeof this.props.match.params.itemId == 'undefined') ? this.props.myProfile.id : this.props.match.params.itemId;
    this.itemWillChange(itemId);
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
    } else if (this.props.act === Globals.ACT_CREATE) {
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

  render() {
    const passwordPlaceHolder = (this.props.act === Globals.ACT_UPDATE) ? 
      '請輸入新密碼（如需變更密碼才要輸入）' : '請輸入密碼';
    return (
      <ModalDialog title={this.dialogTitles[this.props.act]} show={this.state.showDialog} onHide={this._handleHide}>
        <Form onSubmit={this._handleSubmit}>
          <FormError error={this.state.errors.id} />
          <FieldGroup id="name" type="text" label="帳號 *" placeholder="請輸入帳號"
            defaultValue={this.state.item.name} inputRef={ref => this.inputs.name = ref}
            help={this.state.errors.name} maxLength={10}/>
          <FieldGroup id="password" type="password" label="密碼 *" placeholder={passwordPlaceHolder}
            defaultValue={this.state.item.password} inputRef={ref => this.inputs.password = ref}
            help={this.state.errors.password} maxLength={15}/>
          <FieldGroup id="cname" type="text" label="中文姓名 *" placeholder="請輸入中文姓名"
            defaultValue={this.state.item.cname} inputRef={ref => this.inputs.cname = ref} 
            help={this.state.errors.cname} maxLength={10}/>
          <FieldGroup id="mobileNo" type="text" label="手機 *" placeholder="請輸入手機"
            defaultValue={this.state.item.mobileNo} inputRef={ref => this.inputs.mobileNo = ref} 
            help={this.state.errors.mobileNo} maxLength={15}/>
          <FieldGroup id="tel" type="text" label="公司電話" placeholder="請輸入公司電話"
            defaultValue={this.state.item.telNo} inputRef={ref => this.inputs.telNo = ref}
            help={this.state.errors.telNo} maxLength={15}/>
          <FieldGroup id="ext" type="text" label="分機" placeholder="請輸入分機號碼"
            defaultValue={this.state.item.ext} inputRef={ref => this.inputs.ext = ref} 
            help={this.state.errors.ext} maxLength={6}/>
          <FieldGroup id="email" type="email" label="E-mail *" placeholder="請輸入E-mail"
            defaultValue={this.state.item.email} inputRef={ref => this.inputs.email = ref}
            help={this.state.errors.email} maxLength={32}/>
          <Select id="roleId" label="角色 *" placeholder="select" options={this.options}
            defaultValue={this.state.item.roleId} inputRef={ref => this.inputs.roleId = ref}
            help={this.state.errors.roleId} readOnly={this.props.myProfile.roleId !== Globals.ROLE_SUPERUSER}/>
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

UserForm.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  myProfile: PropTypes.object,
  act: PropTypes.string,
};