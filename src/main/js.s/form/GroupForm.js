/**
 * 新增或修改群組資料
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Sun Feb 5 13:19:04 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

import * as Globals from '../common/Globals';
import { MetadataBlock } from '../common/MetadataBlock';
import { FormError, FieldGroup, Select, Span } from '../common/FormObjects';
import { FetchItemById, FetchEntityAssocLink, FetchManagers, PostEntity, PatchEntity, showSuccessMsg, showFailureMsg } from '../common/DataUtils';
import { ModalDialog } from '../common/ModalDialog';

export default class GroupForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: {},
      response: {},
      errors: {},
      managers: [],
      admin: '',
      isLoading: false,
      showDialog: false,
    };

    this.repository = 'groups';
    this.assocKey = 'admin';
    this.dialogTitles = {};
    this.dialogTitles[Globals.ACT_CREATE] = '新增群組';
    this.dialogTitles[Globals.ACT_UPDATE] = '修改群組';
    this.groupTypeOptions = [
      {key: 'p', value: '主要群組'},
      {key: 's', value: '次要群組'},
    ];
    this.item = {};       // 暫存物件
    this.inputs = {};
    this.errors = {};
    this.managers = [];

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleHide = this._handleHide.bind(this);
    this._showErrors = this._showErrors.bind(this);
    this._handleSuccess = this._handleSuccess.bind(this);
    this._handleChangeAdmin = this._handleChangeAdmin.bind(this);
    this._handleChangeGroupType = this._handleChangeGroupType.bind(this);
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
    FetchManagers(
      this.managers,
      () => {
        if (this.props.act === Globals.ACT_UPDATE) { // 修改
          FetchItemById(this.repository, itemId,
            (response) => {
              const freshItem = Object.assign({headers: response.headers, _links: response.entity._links}, response.entity);
              FetchEntityAssocLink(freshItem, this.assocKey,
                response => {
                  this.setState({
                    item: freshItem,
                    isLoading: false,
                    showDialog: true,
                    managers: this.managers,
                    admin: response.entity._links.self.href,
                  });
                }
              );
            },
            (response) => { alert('載入資料失敗'); }
          );
        } else { // 新增
          this.setState({
            isLoading: false,
            showDialog: true,
            managers: this.managers
          });
        }
      }
    );
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

  _handleChangeAdmin(event) {
    this.setState({ admin: event.target.value });
  }

  _handleChangeGroupType(event) {
    this.setState({ admin: event.target.value });
  }

  render() {
    return (
      <ModalDialog title={this.dialogTitles[this.props.act]} show={this.state.showDialog} onHide={this._handleHide}>
        <Form onSubmit={this._handleSubmit}>
          <FormError error={this.state.errors.id} />
          <FieldGroup id="cname" type="text" label="群組中文名稱 *" placeholder="請輸入群組中文名稱"
            defaultValue={this.state.item.cname} inputRef={ref => this.inputs.cname = ref}
            help={this.state.errors.cname} maxLength={15}/>
          <FieldGroup id="ename" type="text" label="群組英文名稱 *" placeholder="請輸入群組英文名稱"
            defaultValue={this.state.item.ename} inputRef={ref => this.inputs.ename = ref}
            help={this.state.errors.ename} maxLength={30}/>
          <Select id="groupType" label="群組類型 *" placeholder="請選擇群組類型" 
            defaultValue={this.state.item.groupType}
            inputRef={ref => this.inputs.groupType = ref} 
            help={this.state.errors.groupType} options={this.groupTypeOptions}/>
          <Select id="admin" label="群組管理者 *" placeholder="請選擇群組管理者" 
            value={this.state.admin} onChange={this._handleChangeAdmin}
            inputRef={ref => this.inputs.admin = ref} 
            help={this.state.errors.admin} options={this.state.managers}/>
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

GroupForm.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  myProfile: PropTypes.object,
  act: PropTypes.string,
};