/**
 * 我的個人檔案
 * 
 * @author Gary Liu<gary_liu@pic.net.tw>
 * @since  Thu Jan 12 10:48:20 CST 2017
 * @flow
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import { Panel } from 'react-bootstrap';

import * as Globals from '../common/Globals';
import { Loading } from '../common/FormObjects';

const UserForm = Loadable({
  loader: () => import('../form/UserForm'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

export default class MyProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      act: Globals.ACT_UPDATE,
      myProfile: {}
    };
    this.pageTitle = '我的個人檔案';
  }

  render() {
    const pageTitle = (<h3>{this.pageTitle}</h3>);
    return (
      <Panel header={pageTitle}>
        <Panel>
          <UserForm
            { ...this.props }
            myProfile={this.props.myProfile}
            act={Globals.ACT_UPDATE} />
        </Panel>
      </Panel>
    );
  }
}

MyProfilePage.propTypes = {
  myProfile: PropTypes.object,
};