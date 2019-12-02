/**
 * React JS 預設的主程式進入點
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Thu Jan 12 10:47:03 CST 2017
 * @flow
 */

import './App.css';
import React from 'react';
import Loadable from 'react-loadable';
import * as Globals from './common/Globals';
import {Loading} from './common/FormObjects';

const Container = Loadable({
  loader: () => import('./page/Container'),
  loading: Loading,
});

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <Container />
      </div>
    );
  }

}

export default App;
