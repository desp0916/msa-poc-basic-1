/**
 * React JS 預設的主程式進入點
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Thu Jan 12 10:47:03 CST 2017
 * @flow
 */

import './App.css';
import React, { Component } from 'react';
import Loadable from 'react-loadable';
import IdleTimer from 'react-idle-timer';

import * as Globals from './common/Globals';
import { Loading } from './common/FormObjects';

const Container = Loadable({
  loader: () => import('./page/Container'),
  loading: Loading,
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeout: Globals.IDLE_TIMEOUT,  // 單位：毫秒
    };
    this._handleIdle = this._handleIdle.bind(this);
  }

  _handleIdle() {
    window.location.href = '/logout';
  }

  render() {
    return (
      <IdleTimer
        ref="idleTimer"
        element={document}
        idleAction={this._handleIdle}
        timeout={this.state.timeout}
        startOnLoad={true}
        format="MM-DD-YYYY HH:MM:ss.SSS">
        <div className="App">
          <Container />
        </div>
      </IdleTimer>
    );
  }
}

export default App;
