/**
 * 新增或修改關鍵字監控排程
 *
 * http://stackoverflow.com/questions/29527385/removing-element-from-array-in-component-state
 * http://stackoverflow.com/questions/36651583/dynamically-add-child-components-in-react
 * https://github.com/kolodny/immutability-helper
 * https://facebook.github.io/react/docs/update.html
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since Mon Feb 20 16:41:49 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Button, ControlLabel, Form, FormControl, FormGroup, Checkbox, Radio, Glyphicon, HelpBlock } from 'react-bootstrap';

import * as Globals from '../common/Globals';
import { MetadataBlock } from '../common/MetadataBlock';
import { FormError, TextInputWithoutLabel, SelectWithoutLabel, Span, TextArea } from '../common/FormObjects';
import { FetchItemById, FetchURI, FetchProjects, PutUrl, FetchEntityAssocLink, PatchEntity, PostEntity, DeleteAssocLink, showSuccessMsg, showFailureMsg, PostEntities, CheckHTMLInputElementEmpty } from '../common/DataUtils';
import * as APLog from '../common/APLog';
import update from 'immutability-helper';
import { ModalDialog } from '../common/ModalDialog';
export default class KeywordTaskForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: {},
      errors: {},
      projects: [],
      details: [],
      detailsOneBoundOpOptions: [APLog.stringOpOptions, APLog.stringOpOptions, APLog.stringOpOptions],
      isLoading: false,
      showDialog: false,
    };

    this.repository = 'keywordmonitortasks';
    this.detailsRepository = 'monitortaskdetails';
    this.dialogTitles = {};
    this.dialogTitles[Globals.ACT_CREATE] = '新增關鍵字監控排程';
    this.dialogTitles[Globals.ACT_UPDATE] = '修改關鍵字監控排程';
    this.projects = [];
    this.intervalOptions = APLog.taskIntervals;
    this.twoBoundsOpOptions = [{key: '<', value: '<'}, {key: '<=', value: '<='}];
    this.fields = APLog.fieldsForKeywordMontiorTask;
    this.inputs = {
      details: [ 
        {uiSequence: 0, fieldEname: '', operand: '', operator: ''},
        {uiSequence: 1, fieldEname: '', operand: '', operator: ''},
        {uiSequence: 2, fieldEname: '', operand: '', operator: ''}
      ],
    };
    this.item = {};      // 暫存物件
    this.errors = {};

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleHide = this._handleHide.bind(this);
    this._handleSuccess = this._handleSuccess.bind(this);
    this._handleSubmitDetails = this._handleSubmitDetails.bind(this);
    this._handleAddDetail = this._handleAddDetail.bind(this);
    this._handleRemoveDetail = this._handleRemoveDetail.bind(this);
    this._handleChangeDetailField = this._handleChangeDetailField.bind(this);
    this._handleChangeProject = this._handleChangeProject.bind(this);
    this._showErrors = this._showErrors.bind(this);
    this._genDetailsFieldOptions = this._genDetailsFieldOptions.bind(this);
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
                  FetchURI(freshItem._links.details.href, 
                    response => {
                      this.setState({
                        item: freshItem,
                        isLoading: false,
                        showDialog: true,
                        projects: this.projects,
                        project: project,
                        details: response.entity._embedded[this.detailsRepository]
                      });
                    }
                  );
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

  _handleAddDetail() {
    if (this.state.details.length < 3) {
      this.setState({
        details: this.state.details.concat({})
      });
    } else {
      alert('最多只能有三個欄位條件');
    }
  }

  // FIXME: also need to update the fields
  _handleRemoveDetail(obj) {
    let nameAndIndex = obj.target.id.split('-');
    let index = nameAndIndex[1];
    this.setState({
      details: update(this.state.details, {$splice: [[index, 1]]})
    });
  }

  _genDetailsFieldOptions(index, fieldEname) {
    return APLog.GetUnusedFieldsOptions(this.fields, index, fieldEname);
  }

  /**
   * @param {*} event 
   */
  _handleChangeDetailField(event) {
    let nameAndIndex = event.target.id.split('-');
    let index = nameAndIndex[1];
    let fieldEname = event.target.value;
    APLog.UpdateFields(this.fields, fieldEname, index);
    // 依據欄位型態（目前只有 string 和 number 兩種）產生相對應的運算子
    if (this.fields[fieldEname].type === 'number') {
      this.setState({
        detailsOneBoundOpOptions: update(this.state.detailsOneBoundOpOptions, {$splice: [[index, 1, APLog.numericOpOptions]]})
      });
    } else {
      this.setState({
        detailsOneBoundOpOptions: update(this.state.detailsOneBoundOpOptions, {$splice: [[index, 1, APLog.stringOpOptions]]})
      });
    }
  }

  _handleSubmit(e) {
    e.preventDefault();
    this._clearErrors();

    this.inputs.thresholdBounds.value = (this.inputs.thresholdBounds1.checked) ? 1 : 2;
    delete this.inputs.thresholdBounds1;
    delete this.inputs.thresholdBounds2;
    Object.keys(this.inputs).map(key => {
      if (this.inputs[key].type === 'checkbox') {
        this.inputs[key].value = (this.inputs[key].checked) ? 1 : 0;
      }
    });
    if (this.props.act === Globals.ACT_UPDATE) {
      PatchEntity(this.state.item, this.inputs, this.repository, this._handleSubmitDetails, this._showErrors);
    } else if (this.props.act === Globals.ACT_CREATE) {
      PostEntity(this.inputs, this.repository, this._handleSubmitDetails, this._showErrors);
    } else {
      console.error('未知的操作');
    }
  }

  /**
   * 處理其他欄位條件（必須先取得 task & taskId）
   */
  _handleSubmitDetails(response) {
    let task = '';
    let taskId = '';
    // 1.1 新增時，可從 response 取得 task
    if (this.props.act === Globals.ACT_CREATE) {
      task = response.entity._links.self.href;
      taskId = response.entity.id;
    // 1.2 修改時，可以從 this.state.item.links.self.href 取得 task
    } else if (this.props.act === Globals.ACT_UPDATE) {
      task = this.state.item._links.self.href;
      taskId = this.state.item.id;
    }
    // 2. 先透過 Controller 刪除該監控排程任務下的所有欄位條件
    DeleteAssocLink(`${Globals.API_ROOT}/monitortask/${taskId}/details`);
    // 3. 逐一新增欄位條件
    let details = [];
    for (let detail of this.inputs.details) {
      let {uiSequence, fieldEname, operator, operand} = detail;
      if (!CheckHTMLInputElementEmpty(uiSequence) && !CheckHTMLInputElementEmpty(fieldEname) 
        && !CheckHTMLInputElementEmpty(operator) && !CheckHTMLInputElementEmpty(operand)) {
        details.push(Object.assign({task: {value: task}}, detail));
      }
    }
    // 4. 最後要更新 taskSql 欄位
    let finalCallback = () => { 
      PutUrl(`${Globals.API_ROOT}/monitortask/${taskId}/updateTaskSql`);
    };
    finalCallback.bind(this);
    PostEntities(details, this.detailsRepository, finalCallback);
    this._handleSuccess();
  }

  _handleSuccess(response) {
    const act = (this.props.act == Globals.ACT_CREATE) ? '新增' : '修改';
    showSuccessMsg(this.props.act, `${act}成功，請記得回清單頁啟動此排程`);
    // this.props.onRefreshList();
  }

  _clearErrors() {
    this.setState({errors: {}});
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
        <input type="hidden" defaultValue={APLog.KEYWORD_MONITOR_TASK} ref={ref => this.inputs.type = ref} />
        <input type="hidden" defaultValue="count" ref={ref => this.inputs.thresholdAggType = ref} />
        <input type="hidden" defaultValue="1" ref={ref => this.inputs.thresholdBounds = ref} />
        <FormGroup controlId="name">
            <Col sm={2}><ControlLabel>監控排程名稱 *</ControlLabel></Col>
            <Col sm={10}><TextInputWithoutLabel type="text" placeholder="請輸入監控排程名稱" defaultValue={this.state.item.name} inputRef={ref => this.inputs.name = ref} help={this.state.errors.name} maxLength={30} />
            </Col>
        </FormGroup>
        <FormGroup controlId="project">
            <Col sm={2}><ControlLabel>專案系統 *</ControlLabel></Col>
            <Col sm={10}><SelectWithoutLabel options={this.state.projects} value={this.state.project} inputRef={ref => this.inputs.project = ref} help={this.state.errors.project} onChange={this._handleChangeProject} /></Col>
        </FormGroup>
        <FormGroup>
          <Col sm={2}><ControlLabel>Log 類型 *</ControlLabel></Col>
          <Col sm={10}>
            <Checkbox inline id="logTypeAPI" inputRef={ref => this.inputs.logTypeAPI = ref} defaultValue="1" defaultChecked={this.state.item.logTypeAPI === 1}>api</Checkbox><Span />
            <Checkbox inline id="logTypeBatch" inputRef={ref => this.inputs.logTypeBatch = ref} defaultValue="1" defaultChecked={this.state.item.logTypeBatch === 1}>batch</Checkbox><Span />
            <Checkbox inline id="logTypeTPIPAS" inputRef={ref => this.inputs.logTypeTPIPAS = ref} defaultValue="1" defaultChecked={this.state.item.logTypeTPIPAS === 1}>tpipas</Checkbox><Span />
            <Checkbox inline id="logTypeUI" inputRef={ref => this.inputs.logTypeUI = ref} defaultValue="1" defaultChecked={this.state.item.logTypeUI === 1}>ui</Checkbox>
            {this.state.errors.logTypeUI && <HelpBlock bsStyle="custom">{this.state.errors.logTypeUI}</HelpBlock>}
          </Col>
        </FormGroup>
          <FormGroup>
            <Col sm={2}><ControlLabel>執行間隔時間 *</ControlLabel></Col>
            <Col sm={10}><SelectWithoutLabel options={this.intervalOptions} defaultValue={this.state.item.taskInterval} inputRef={ref => this.inputs.taskInterval = ref} /></Col>
          </FormGroup>
          <FormGroup controlId="kwKeyword">
            <Col sm={2}><ControlLabel>關鍵字 *</ControlLabel></Col>
            <Col sm={10}><TextInputWithoutLabel type="text" placeholder="會出現在kw或msg欄位的關鍵字，以「,」分隔；若輸入「nokeyword」表示不監控此兩欄位" defaultValue={this.state.item.kwKeyword} inputRef={ref => this.inputs.kwKeyword = ref} help={this.state.errors.kwKeyword} maxLength={30}/></Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}><ControlLabel>出現筆數 *</ControlLabel></Col>
            <Col sm={2}><Radio inline name="thresholdBounds" defaultValue="1" defaultChecked={this.props.act === Globals.ACT_CREATE || this.state.item.thresholdBounds === 1} inputRef={ref => this.inputs.thresholdBounds1 = ref}>單尾</Radio></Col>
            <Col sm={2}><SelectWithoutLabel options={APLog.numericOpOptions} defaultValue={this.state.item.thresholdOneBoundOp} inputRef={ref => this.inputs.thresholdOneBoundOp = ref}/></Col>
            <Col sm={6}><TextInputWithoutLabel type="text" placeholder="請輸入出現筆數" defaultValue={this.state.item.thresholdOneBound} inputRef={ref => this.inputs.thresholdOneBound = ref} help={this.state.errors.thresholdOneBound} maxLength={10}/></Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}><Radio inline name="thresholdBounds" defaultValue="2" defaultChecked={this.state.item.thresholdBounds === 2} inputRef={ref => this.inputs.thresholdBounds2 = ref}>雙尾</Radio></Col>
            <Col sm={2}><TextInputWithoutLabel id="thresholdLowerBound" type="text" placeholder="下界" defaultValue={this.state.item.thresholdLowerBound} inputRef={ref => this.inputs.thresholdLowerBound = ref} help={this.state.errors.thresholdLowerBound} maxLength={10}/></Col>
            <Col sm={2}><SelectWithoutLabel options={this.twoBoundsOpOptions} defaultValue={this.state.item.thresholdLowerBoundOp} inputRef={ref => this.inputs.thresholdLowerBoundOp = ref}/></Col>
            <Col sm={2}>出現次數</Col>
            <Col sm={2}><SelectWithoutLabel options={this.twoBoundsOpOptions} defaultValue={this.state.item.thresholdUpperBoundOp} inputRef={ref => this.inputs.thresholdUpperBoundOp = ref}/></Col>
            <Col sm={2}><TextInputWithoutLabel id="thresholdUpperBound" type="text" placeholder="上界" defaultValue={this.state.item.thresholdUpperBound} inputRef={ref => this.inputs.thresholdUpperBound = ref} help={this.state.errors.thresholdUpperBound} maxLength={10}/></Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}><ControlLabel>通知方式 *</ControlLabel></Col>
            <Col sm={10}> 
            <Checkbox inline id="actEmail" inputRef={ref => this.inputs.actEmail = ref} defaultValue="1" defaultChecked={this.props.act === Globals.ACT_CREATE || this.state.item.actEmail === 1} >E-mail</Checkbox><Span />
            <Checkbox inline id="actPush" inputRef={ref => this.inputs.actPush = ref} defaultValue="1"  defaultChecked={this.state.item.actPush === 1}>推播</Checkbox><Span />
            <Checkbox inline id="actOpCallOut" inputRef={ref => this.inputs.actOpCallOut = ref} defaultValue="1" defaultChecked={this.state.item.actOpCallOut === 1}>OP 叫修 (付費功能)</Checkbox>
            {this.state.errors.actEmail && <HelpBlock bsStyle="custom">{this.state.errors.actEmail}</HelpBlock>}
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={2} sm={2}><Checkbox inline id="actCallback" inputRef={ref => this.inputs.actCallback = ref} defaultValue="1" defaultChecked={this.state.item.actCallback === 1}>Callback</Checkbox></Col>
            <Col sm={8}><TextInputWithoutLabel type="text" placeholder="Callback URL 1" defaultValue={this.state.item.actCallbackUrl1} inputRef={ref => this.inputs.actCallbackUrl1 = ref} help={this.state.errors.actCallbackUrl1} maxLength={128}/></Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={4} sm={8}><TextInputWithoutLabel type="text" placeholder="Callback URL 2" defaultValue={this.state.item.actCallbackUrl2} inputRef={ref => this.inputs.actCallbackUrl2 = ref} help={this.state.errors.actCallbackUrl2} maxLength={128}/></Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}><ControlLabel>通知內容 *</ControlLabel></Col>
            <Col sm={10}> 
            <TextArea id="notification" inputRef={ref => this.inputs.notification = ref} placeholder="用於 E-mail、推播與 OP 叫修的內文" defaultValue={this.state.item.notification} help={this.state.errors.notification} />
            </Col>
          </FormGroup>
          {
            this.state.details.map((item, index) => (
              <FormGroup key={index}>
                <Col sm={2}>欄位條件 {index+1}</Col>
                <Col sm={3}>
                  <input type="hidden" defaultValue={index} ref={ref => this.inputs.details[index].uiSequence = ref} />
                  <SelectWithoutLabel id={'detailsFieldEname-'+index} defaultValue={item.fieldEname} options={this._genDetailsFieldOptions(index, item.fieldEname)} inputRef={ref => this.inputs.details[index].fieldEname = ref} onChange={this._handleChangeDetailField}/>
                </Col>
                <Col sm={2}><SelectWithoutLabel id={'detailsOperator-'+index} defaultValue={item.operator} options={this.state.detailsOneBoundOpOptions[index]} inputRef={ref => this.inputs.details[index].operator = ref} /></Col>
                <Col sm={3}><FormControl id={'detailsOperand-'+index} defaultValue={item.operand} type="text" inputRef={ref => this.inputs.details[index].operand = ref} maxLength={10}/></Col>
                <Col sm={2}><Button id={'removeDetailButton-'+index} onClick={index => this._handleRemoveDetail(index)}><Glyphicon glyph="minus" id={'removeDetailIcon-'+index} onClick={index => this._handleRemoveDetail(index)}/></Button></Col>
              </FormGroup>
            ))
          }
          <MetadataBlock show={this.props.act === Globals.ACT_UPDATE} data={this.state.item} />
          <div style={Globals.STYLE_CENTER}>
          <Button onClick={this._handleAddDetail}>
            <Glyphicon glyph="plus"/> 新增欄位條件
          </Button><Span/>
          <Button onClick={this._handleHide}>取消</Button><Span/>
          <Button bsStyle="primary" type="submit">儲存</Button>
          </div>
        </Form>
      </ModalDialog>
    );
  }
}

KeywordTaskForm.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  act: PropTypes.string,
};