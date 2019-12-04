/**
 * 首頁
 *
 * 使用者透過這個頁面上的 NavigationBar 來跳轉至其他頁面
 *
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Thu Jan 12 10:45:22 CST 2017
 * @flow
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import { HashRouter as Router, Route } from 'react-router-dom';
import * as Globals from '../common/Globals';
import { Loading } from '../common/FormObjects';

const ArticlePage = Loadable({
  loader: () => import('./ArticlePage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

export const PAGES = {
  'ArticlePage': ArticlePage,   // 預設首頁
};

export default class Container extends Component {

  constructor(props) {
    super(props);
    let selectedPage = this.props.selectedPage ? this.props.selectedPage : PAGES['ArticlePage'];
    this.state = {
      selectedPage: (selectedPage),
    };
  }

  render() {
    const containerStyle = {
      padding: '20px',
    };
    return (
      <Router>
        <div style={containerStyle}>
          <Route exact path="/" component={ArticlePage}/>
          <Route path="/Article" component={ArticlePage}/>
        </div>
      </Router>
    );
  }
}

Container.propTypes = {
  selectedPage: PropTypes.object
};