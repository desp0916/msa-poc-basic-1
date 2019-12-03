/**
 * 新增或修改文章資料
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Wed Mar 29 09:44:26 CST 2017
 * @flow
 */

import React from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
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
      act: Globals.ACT_UPDATE,
    };

    this.repository = 'articles';
    this.item = {};       // 暫存物件
    this.inputs = {};
    this.errors = {};

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleHide = this._handleHide.bind(this);
    this._handleSuccess = this._handleSuccess.bind(this);
    this._showErrors = this._showErrors.bind(this);

    this.subjectInput = React.createRef(); 
    this.contentInput = React.createRef();
    this._handleSubjectChange = this._handleSubjectChange.bind(this);
    this._handleContentChange = this._handleContentChange.bind(this);
  }

  _handleSubjectChange() {
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        subject: this.subjectInput.current.value
      }
    }));
  }

  _handleContentChange() {
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        content: this.contentInput.current.value
      }
    }));
  }

  _handleHide() {
    this.setState({
      showDialog: false,
    });
    this.props.history.goBack();
  }

  componentDidMount() {
    this._getItem(this.props.match.params.itemId);
  }

  _getItem(itemId) {
    if (itemId && itemId.toString().length > 0) {
      this.setState({ isLoading: true, showDialog: false });
      GetEntityById(this.repository, itemId,
        (response) => {
          this.setState({
            item: response,
            isLoading: false,
            showDialog: true,
            act: Globals.ACT_UPDATE, 
          });
        },
        (response) => { alert('載入資料失敗'); }
      );
    } else {
      this.setState({
        isLoading: false,
        showDialog: true,
        act: Globals.ACT_CREATE,
      });
    }
  }

  _handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.item);
    this._clearErrors();
    const inputs = {
      subject: this.subjectInput.current.value,
      content: this.contentInput.current.value
    };
    if (this.state.item && this.state.item._links && this.state.item._links.self && this.state.item._links.self.href.toString().length > 0) {
      PatchEntity(this.repository, this.state.item, inputs, this._handleSuccess, this._showErrors);
    } else {
      PostEntity(this.repository, inputs, this._handleSuccess, this._showErrors);
    }
  }

  _handleSuccess(response) {
    showSuccessMsg(this.state.act);
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
    const dialogTitle = (this.state.act == Globals.ACT_CREATE) ? '新增文章' : '修改文章';
    return (
      <ModalDialog title={dialogTitle} show={this.state.showDialog} onHide={this._handleHide}>
        <Form onSubmit={this._handleSubmit}>
          <FormError error={this.state.errors.id} />
          <Form.Group controlId="subject">
            <Form.Label>標題 *</Form.Label>
            <FormControl ref={this.subjectInput} type="text" placeholder="請輸入標題" 
              defaultValue={this.state.item.subject}
              maxLength={150} onChange={() => this._handleSubjectChange()} />
             {this.state.errors.subject && <Form.Control.Feedback>{this.state.errors.subject}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>文章內容 *</Form.Label>
            <FormControl ref={this.contentInput} as="textarea" rows="5" placeholder="請輸入文章內容"
              defaultValue={this.state.item.content}
              maxLength={4096} onChange={() => this._handleContentChange()} />
             {this.state.errors.content && <Form.Control.Feedback>{this.state.errors.content}</Form.Control.Feedback>}
          </Form.Group>
          <MetadataBlock show={this.props.act === Globals.ACT_UPDATE} data={this.state.item} />
          <div style={Globals.STYLE_CENTER}>
            <Button onClick={this._handleHide}>取消</Button><Span/>
            <Button type="submit">儲存</Button>
          </div>
        </Form>
      </ModalDialog>
    );
  }
}
