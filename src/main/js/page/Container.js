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
import { LinkContainer } from 'react-router-bootstrap';

import * as Globals from '../common/Globals';
import { Loading } from '../common/FormObjects';
import { FetchEntity, FetchURI } from '../common/DataUtils';

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
      myProfile: {},
      navItems: []
    };
  }

  // What does the three dots in react do?
  // http://stackoverflow.com/questions/31048953/what-does-the-three-dots-in-react-do
  _renderPageByTab(Component) {
    // console.log(Component === object);
    return (<Component {...this.props} myProfile={this.state.myProfile}/>);
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">{Globals.APP_NAME}</a>
              </Navbar.Brand>
              <Navbar.Toggle/>
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                {leftMenu}
              </Nav>
              <Nav pullRight>
                <LinkContainer to="/MyProfile"><NavItem eventKey="MyProfilePage" href="#">{this.state.myProfile.name}</NavItem></LinkContainer>
                <NavItem eventKey="Logout" href="#" onClick={this._handleLogout}>登出</NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Route exact path="/" component={WelcomePage}/>
          <Route path="/Welcome" component={WelcomePage}/>
          <Route path="/Bulletin" component={BulletinPage}/>
          <Route path="/MyProfile" render={(props) => <MyProfilePage {...props} myProfile={this.state.myProfile} />}/>
          <Route path="/User" render={(props) => <UserPage {...props} myProfile={this.state.myProfile} />}/>
          <Route path="/Group" render={(props) => <GroupPage {...props} myProfile={this.state.myProfile} />}/>
          <Route path="/Project" render={(props) => <ProjectPage {...props} myProfile={this.state.myProfile} />}/>
          <Route path="/KeywordTask" component={KeywordTaskPage}/>
          <Route path="/ThresholdTask" component={ThresholdTaskPage}/>
          <Route path="/ReportTask" component={ReportTaskPage}/>
          <Route path="/KeywordTaskRecord" component={KeywordTaskRecordPage}/>
          <Route path="/ThresholdTaskRecord" component={ThresholdTaskRecordPage}/>
          <Route path="/ReportTaskRecord" component={ReportTaskRecordPage}/>
        </div>
      </Router>
    );
  }
}

Container.propTypes = {
  selectedPage: PropTypes.object
};