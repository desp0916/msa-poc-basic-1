/**
 * 新增或修改群組資料
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Wed Mar 8 17:18:25 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Button, ControlLabel, Form, FormGroup, Checkbox, Radio } from 'react-bootstrap';

import * as Globals from '../common/Globals';
import { MetadataBlock } from '../common/MetadataBlock';
import { FormError, TextInputWithoutLabel, SelectWithoutLabel, TextArea, Span } from '../common/FormObjects';
import { FetchItemById, FetchProjects, FetchEntityAssocLink, PatchEntity, PostEntity, showSuccessMsg, showFailureMsg } from '../common/DataUtils';
import * as APLog from '../common/APLog';
import { ModalDialog } from '../common/ModalDialog';

export default class ReportTaskForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: {},
      errors: {},
      projects: [],
      details: [],
    };

    this.repository = 'reporttasks';
    this.dialogTitles = {};
    this.dialogTitles[Globals.ACT_CREATE] = '新增統計報表排程';
    this.dialogTitles[Globals.ACT_UPDATE] = '修改統計報表排程';
    this.projects = [];
    this.intervalOptions = APLog.taskIntervals;
    this.inputs = {};
    this.errors = {};

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleHide = this._handleHide.bind(this);
    this._handleSuccess = this._handleSuccess.bind(this);
    this._handleChangeProject = this._handleChangeProject.bind(this);
    this._showErrors = this._showErrors.bind(this);
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
    FetchProjects(
      this.projects,
      () => {
        if (this.props.act === Globals.ACT_UPDATE) { // 修改
          FetchItemById(this.repository, itemId,
            (response) => {
              const freshItem = Object.assign({headers: response.headers, _links: response.entity._links}, response.entity);
              FetchEntityAssocLink(freshItem, 'project',
                response => {
                  const project = response.entity._links.self.href;
                  this.setState({
                    item: freshItem,
                    isLoading: false,
                    showDialog: true,
                    projects: this.projects,
                    project: project,
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
            projects: this.projects,
          });
        }
      }
    );
  }

  _handleSubmit(e) {
    e.preventDefault();
    this._clearErrors();

    this.inputs.emailTarget.value = (this.inputs.emailTarget1.checked) ? 0 : 1;
    delete this.inputs.emailTarget1;
    delete this.inputs.emailTarget2;

    if (this.inputs.emailFormat2.checked) {
      this.inputs.emailFormat.value = this.inputs.emailFormat2.value;
    } else if (this.inputs.emailFormat3.checked) {
      this.inputs.emailFormat.value = this.inputs.emailFormat3.value;
    } else if (this.inputs.emailFormat4.checked) {
      this.inputs.emailFormat.value = this.inputs.emailFormat4.value;
    } else {
      this.inputs.emailFormat.value = this.inputs.emailFormat1.value;
    }

    Object.keys(this.inputs).map(key => {
      if (this.inputs[key].type == 'checkbox') {
        this.inputs[key].value = (this.inputs[key].checked) ? 1 : 0;
      }
    });

    if (this.props.act === Globals.ACT_UPDATE) {
      PatchEntity(this.state.item, this.inputs, this.repository, this._handleSuccess, this._showErrors);
    } else if (this.props.act === Globals.ACT_CREATE) {
      PostEntity(this.inputs, this.repository, this._handleSuccess, this._showErrors);
    } else {
      console.error('未知的操作');
    }
  }

  _handleSuccess(response) {
    const act = (this.props.act == Globals.ACT_CREATE) ? '新增' : '修改';
    showSuccessMsg(this.props.act, `${act}成功，請記得回清單頁啟動此排程`);
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

  _handleChangeProject(event) {
    this.setState({ project: event.target.value });
  }

  render() {
    return (
      <ModalDialog title={this.dialogTitles[this.props.act]} show={this.state.showDialog} onHide={this._handleHide}>
        <Form horizontal onSubmit={this._handleSubmit}>
        <FormError error={this.state.errors.id} />
        <input type="hidden" defaultValue="0" ref={ref => this.inputs.emailTarget = ref} />
        <input type="hidden" defaultValue="1" ref={ref => this.inputs.emailFormat = ref} />
        <FormGroup controlId="name">
            <Col sm={2}><ControlLabel>報表排程名稱 *</ControlLabel></Col>
            <Col sm={10}><TextInputWithoutLabel type="text" placeholder="請輸入報表排程名稱" defaultValue={this.state.item.name} inputRef={ref => this.inputs.name = ref} help={this.state.errors.name} maxLength={30}  />
            </Col>
        </FormGroup>
        <FormGroup controlId="project">
            <Col sm={2}><ControlLabel>專案系統 *</ControlLabel></Col>
            <Col sm={10}><SelectWithoutLabel options={this.state.projects} value={this.state.project} inputRef={ref => this.inputs.project = ref} help={this.state.errors.project} onChange={this._handleChangeProject} /></Col>
        </FormGroup>
          <FormGroup>
            <Col sm={2}><ControlLabel>執行間隔時間 *</ControlLabel></Col>
            <Col sm={10}><SelectWithoutLabel options={this.intervalOptions} defaultValue={this.state.item.taskInterval} inputRef={ref => this.inputs.taskInterval = ref} /></Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}><ControlLabel>SQL 指令*（<a href="https://github.com/NLPchina/elasticsearch-sql" target="_blank">參考</a>）</ControlLabel></Col>
            <Col sm={10}> 
            <TextArea id="taskSql" inputRef={ref => this.inputs.taskSql = ref} defaultValue={this.state.item.taskSql} help={this.state.errors.taskSql} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}><ControlLabel>寄送對象 *</ControlLabel></Col>
            <Col sm={10}> 
            <Radio inline name="emailTarget" defaultValue="0" defaultChecked={this.props.act === Globals.ACT_CREATE || this.state.item.emailTarget === 0} inputRef={ref => this.inputs.emailTarget1 = ref}>本專案系統所有成員</Radio>
            <Radio inline name="emailTarget" defaultValue="1" defaultChecked={this.state.item.emailTarget === 1} inputRef={ref => this.inputs.emailTarget2 = ref}>報表排程的建立者</Radio>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}><ControlLabel>通知方式 *</ControlLabel></Col>
            <Col sm={2}> 
            <Checkbox inline id="actEmail" inputRef={ref => this.inputs.actEmail = ref} defaultValue="1" defaultChecked={this.props.act === Globals.ACT_CREATE || this.state.item.actEmail === 1} >E-mail</Checkbox>
            </Col>
            <Col sm={2}><ControlLabel>格式 *</ControlLabel></Col>
            <Col sm={6}>
              <Radio inline name="emailFormat" defaultValue="1" defaultChecked={this.props.act === Globals.ACT_CREATE || this.state.item.emailFormat === 1} inputRef={ref => this.inputs.emailFormat1 = ref}>郵件內文</Radio>
              <Radio inline name="emailFormat" defaultValue="2" defaultChecked={this.state.item.emailFormat === 2} inputRef={ref => this.inputs.emailFormat2 = ref}>CSV</Radio>
              <Radio inline name="emailFormat" defaultValue="3" defaultChecked={this.state.item.emailFormat === 3} inputRef={ref => this.inputs.emailFormat3 = ref}>Excel</Radio>
              <Radio inline name="emailFormat" defaultValue="4" defaultChecked={this.state.item.emailFormat === 4} inputRef={ref => this.inputs.emailFormat4 = ref}>PDF</Radio>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={2} sm={2}><Checkbox inline id="actCallback" inputRef={ref => this.inputs.actCallback = ref} defaultValue="1" defaultChecked={this.state.item.actCallback === 1}>Callback</Checkbox></Col>
            <Col sm={8}><TextInputWithoutLabel type="text" placeholder="Callback URL 1" defaultValue={this.state.item.actCallbackUrl1} inputRef={ref => this.inputs.actCallbackUrl1 = ref} help={this.state.errors.actCallbackUrl1} maxLength={128} /></Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={4} sm={8}><TextInputWithoutLabel type="text" placeholder="Callback URL 2" defaultValue={this.state.item.actCallbackUrl2} inputRef={ref => this.inputs.actCallbackUrl2 = ref} help={this.state.errors.actCallbackUrl2} maxLength={128} /></Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}><ControlLabel>通知內容</ControlLabel></Col>
            <Col sm={10}> 
            <TextArea id="notification" inputRef={ref => this.inputs.notification = ref} placeholder="用於 E-mail 與推播的內文" defaultValue={this.state.item.notification} help={this.state.errors.notification} />
            </Col>
          </FormGroup>
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

ReportTaskForm.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  act: PropTypes.string,
};