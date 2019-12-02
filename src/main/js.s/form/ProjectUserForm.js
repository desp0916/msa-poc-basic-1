/**
 * 群組成員
 * 
 * @author  Gary Liu<gary_liu@pic.net.tw>
 * @since Wed Feb 15 14:32:07 CST 2017
 * @flow
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, ControlLabel, HelpBlock } from 'react-bootstrap';

import * as Globals from '../common/Globals';
import { MetadataBlock } from '../common/MetadataBlock';
import 'react-bootstrap-typeahead/css/Token.css';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { FormError, FieldGroup, Span } from '../common/FormObjects';
import { FetchItemById, FetchEntityAssocLink, PutEntityAssoc, FindGroupUserByCname, showSuccessMsg, showFailureMsg } from '../common/DataUtils';
import { ModalDialog } from '../common/ModalDialog';

export default class ProjectUserForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: {},
      errors: {},
      options: [],  // 使用者輸入時，透過 API 查詢取得的資料 
      members: [],    // UI 載入時，從 API（資料庫）中取出的舊資料
      isLoading: false,
      showDialog: false,
    };

    this.repository = 'projects';
    this.assocKey = 'users';  // 某一群組的所有成員
    this.dialogTitles = {};
    this.dialogTitles['updateUsers'] = '修改專案系統成員';
    this.errors = {};
    this.groupTypeOptions = [
      {key: 'p', value: '主要群組'},
      {key: 's', value: '次要群組'},
    ];

    this._handleSearch = this._handleSearch.bind(this);
    this._handleHide = this._handleHide.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleSuccess = this._handleSuccess.bind(this);
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
    if (itemId.toString().length > 0 && this.props.act === Globals.ACT_UPDATE) { // 修改
      this.setState({ isLoading: true, showDialog: false });
      FetchItemById(this.repository, itemId,
        (response) => {
          const freshItem = Object.assign({headers: response.headers, _links: response.entity._links}, response.entity);
          this.setState({
            item: freshItem,
            showDialog: true
          });
          FetchEntityAssocLink(freshItem, this.assocKey,
            response => {
              // 檢查物件是否為陣列的方法：
              // http://stackoverflow.com/questions/4775722/check-if-object-is-array
              if (Object.prototype.toString.call(response.entity._embedded[this.assocKey]) 
                === '[object Array]') {
                this.setState({
                  isLoading: false,
                  members: response.entity._embedded[this.assocKey]
                });
              }
            }
          );
        },
        (response) => { alert('載入資料失敗'); }
      );
    } else { // 新增
      this.setState({
        isLoading: false,
        showDialog: true,
      });
    }
  }

  // componentWillMount() {
  //   FetchEntity(this.props.item,
  //     response => {
  //       // 重新抓取物件資料（主要是為了取得 Header 中的 Etag）
  //       this.item = Object.assign({headers: response.headers}, this.props.item);
  //       FetchEntityAssocLink(this.item, this.assocKey,
  //         response => {
  //           // 檢查物件是否為陣列的方法：
  //           // http://stackoverflow.com/questions/4775722/check-if-object-is-array
  //           if (Object.prototype.toString.call(response.entity._embedded[this.assocKey]) 
  //             === '[object Array]') {
  //             this.setState({
  //               members: response.entity._embedded[this.assocKey]
  //             });
  //           }
  //         }
  //       );
  //     }
  //   );
  // }

  _handleSearch(query) {
    if (!query) {
      return;
    }
    FindGroupUserByCname(query, 
      (response) => {
        this.setState({options: response._embedded[this.assocKey]});
      },
      this._showErrors);
  }

  _handleSubmit(e) {
    e.preventDefault();
    this._clearErrors();
    let assocEntities = this.refs.typeahead.getInstance().state.selected;
    PutEntityAssoc(this.state.item, this.assocKey, assocEntities, 
      this._handleSuccess, this._showErrors);
  }

  _handleSuccess(response) {
    showSuccessMsg(Globals.ACT_UPDATE);
    // this.props.onRefreshList();
  }

  _clearErrors() {
    this.setState({errors: {}});
  }

  _showErrors(response) {
    showFailureMsg(Globals.ACT_UPDATE);
    if (response && response.entity && response.entity.errors) {
      response.entity.errors.map(item => this.errors[item.property] = item.message);
      this.setState({errors: this.errors});
    }
  }

  render() {
    return (
      <ModalDialog title={this.dialogTitles['updateUsers']} show={this.state.showDialog} onHide={this._handleHide}>
        <Form onSubmit={this._handleSubmit}>
          <FormError error={this.state.errors.id} />
          <FieldGroup id="sysId" type="text" label="專案系統英文代號 *" placeholder="請輸入專案系統英文代號"
            defaultValue={this.state.item.sysId} readOnly />
          <FieldGroup id="cname" type="text" label="專案系統中文名稱 *" placeholder="請輸入專案系統中文名稱"
            defaultValue={this.state.item.cname} readOnly />
          <FieldGroup id="ename" type="text" label="專案系統英文名稱 *" placeholder="請輸入專案系統英文名稱"
            defaultValue={this.state.item.ename} readOnly />
          <ControlLabel>專案系統成員（接收通知的對象，選取自您的群組成員）</ControlLabel>
          <AsyncTypeahead
            ref="typeahead"
            clearButton
            multiple
            isLoading
            ignoreDiacritics={false}
            useCache
            labelKey="cname"
            promptText="請輸入群組成員的中文姓名"
            searchText="查詢群組成員中..."
            placeholder="請輸入使用者中文姓名"
            onInputChange={this._handleSearch}
            onSearch={this._handleSearch}
            selected={this.state.members}
            options={this.state.options}
            renderMenuItemChildren={(option, props, index) => (
              <div><span>{option.cname}</span></div>
            )}
            help={<HelpBlock bsStyle="custom">this.state.errors.users</HelpBlock>}
        />
        <MetadataBlock show={this.props.act === Globals.ACT_UPDATE} data={this.state.item} />
        <div style={Globals.STYLE_CENTER}><br />
            <Button onClick={this._handleHide}>取消</Button><Span/>
            <Button bsStyle="primary" type="submit">儲存</Button>
          </div>
        </Form>
      </ModalDialog>
    );
  }
}

ProjectUserForm.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  myProfile: PropTypes.object,
  act: PropTypes.string,
};