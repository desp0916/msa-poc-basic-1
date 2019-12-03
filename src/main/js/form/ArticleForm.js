/**
 * 新增或修改文章資料
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Wed Mar 29 09:44:26 CST 2017
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'react-bootstrap';
import * as Globals from '../common/Globals';

import { MetadataBlock } from '../common/MetadataBlock';
import { FormError, FieldGroup, TextArea, Span } from '../common/FormObjects';
import { GetEntityById, PostEntity, PatchEntity, showSuccessMsg, showFailureMsg } from '../common/DataUtils';
import ModalDialog from '../common/ModalDialog';

export default class ArticleForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      item: {},
      response: {},
      errors: {},
      isLoading: false,
      showDialog: true,
    };

    this.repository = 'articles';
    this.dialogTitles = {};
    this.dialogTitles[Globals.ACT_CREATE] = '新增佈告';
    this.dialogTitles[Globals.ACT_UPDATE] = '修改佈告';
    this.item = {};       // 暫存物件
    this.inputs = {};
    this.errors = {};

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleHide = this._handleHide.bind(this);
    this._showErrors = this._showErrors.bind(this);
    this._handleSuccess = this._handleSuccess.bind(this);
  }

// //   UNSAFE_componentWillReceiveProps(nextProps) {
// //     this.itemWillChange(nextProps.match.params.itemId);
// //   }

// //   UNSAFE_componentDidMount() {
// //     this.itemWillChange(this.props.match.params.itemId);
// //   }

  _handleHide() {
    this.setState({
      showDialog: false,
    });
    this.props.history.goBack();
  }

  componentDidMount() {
    this.itemWillChange(this.props.match.params.itemId);
  }

  itemWillChange(itemId) {
      this.setState({
        item: { startTime: this.now, endTime: this.now },
        isLoading: false,
        showDialog: true
      });
  }

  _handleSubmit(e) {
    e.preventDefault();
    this._clearErrors();
    if (this.props.act === Globals.ACT_UPDATE) {
    //   PatchEntity(this.state.item, this.inputs, this.repository, this._handleSuccess, this._showErrors);
    } else if (this.props.match.params.itemId === Globals.ACT_CREATE) {
    //   PostEntity(this.inputs, this.repository, this._handleSuccess, this._showErrors);
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
    return (
      <ModalDialog title={this.dialogTitles[this.props.act]} show={this.state.showDialog} onHide={this._handleHide}>
        <Form onSubmit={this._handleSubmit}>
          <FormError error={this.state.errors.id} />
          <FieldGroup id="subject" type="text" label="主旨 *" placeholder="請輸入主旨" 
            defaultValue={this.state.item.subject} 
            help={this.state.errors.subject} maxLength={150} />
          <TextArea id="content" label="文章內容 *" placeholder="請輸入文章內容"
            defaultValue={this.state.item.content} 
            help={this.state.errors.content} maxLength={4096} />
          <MetadataBlock show={this.props.act === Globals.ACT_UPDATE} data={this.state.item} />
          <div style={Globals.STYLE_CENTER}>
            <Button onClick={this._handleHide}>取消</Button><Span/>
            <Button variant="primary" type="submit">儲存</Button>
          </div>
        </Form>
      </ModalDialog>
    );
  }
}



    //   <ModalDialog title={this.dialogTitles[this.props.act]} show={this.state.showDialog} onHide={this._handleHide}>
    //     <Form onSubmit={this._handleSubmit}>
    //       <FormError error={this.state.errors.id} />
    //       <FieldGroup id="subject" type="text" label="主旨 *" placeholder="請輸入主旨" 
    //         defaultValue={this.state.item.subject} 
    //         help={this.state.errors.subject} maxLength={150} />
    //       <TextArea id="content" label="文章內容 *" placeholder="請輸入文章內容"
    //         defaultValue={this.state.item.content} 
    //         help={this.state.errors.content} maxLength={4096} />
    //       <MetadataBlock show={this.props.act === Globals.ACT_UPDATE} data={this.state.item} />
    //       <div style={Globals.STYLE_CENTER}>
    //         <Button onClick={this._handleHide}>取消</Button><Span/>
    //         <Button variant="primary" type="submit">儲存</Button>
    //       </div>
    //     </Form>
    //   </ModalDialog>