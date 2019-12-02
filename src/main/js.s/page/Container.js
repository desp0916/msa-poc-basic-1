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
import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import * as Globals from '../common/Globals';
import { Loading } from '../common/FormObjects';
import { FetchEntity, FetchURI } from '../common/DataUtils';

const WelcomePage = Loadable({
  loader: () => import('./WelcomePage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const BulletinPage = Loadable({
  loader: () => import('./BulletinPage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const MyProfilePage = Loadable({
  loader: () => import('./MyProfilePage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const UserPage = Loadable({
  loader: () => import('./UserPage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const GroupPage = Loadable({
  loader: () => import('./GroupPage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const ProjectPage = Loadable({
  loader: () => import('./ProjectPage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const KeywordTaskPage = Loadable({
  loader: () => import('./KeywordTaskPage'),
  loading: Loading,
});

const ThresholdTaskPage = Loadable({
  loader: () => import('./ThresholdTaskPage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const ReportTaskPage = Loadable({
  loader: () => import('./ReportTaskPage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const KeywordTaskRecordPage = Loadable({
  loader: () => import('./KeywordTaskRecordPage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const ThresholdTaskRecordPage = Loadable({
  loader: () => import('./ThresholdTaskRecordPage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

const ReportTaskRecordPage = Loadable({
  loader: () => import('./ReportTaskRecordPage'),
  loading: Loading,
  timeout: Globals.LOADABLE_TIMEOUT,
});

export const PAGES = {
  'WelcomePage': WelcomePage,   // 預設首頁
  'BulletinPage': BulletinPage,
  'MyProfilePage': MyProfilePage,
  'UserPage': UserPage,
  'GroupPage': GroupPage,
  'ProjectPage': ProjectPage,
  'KeywordTaskPage': KeywordTaskPage,
  'ThresholdTaskPage': ThresholdTaskPage,
  'ReportTaskPage': ReportTaskPage,
  'KeywordTaskRecordPage': KeywordTaskRecordPage,
  'ThresholdTaskRecordPage': ThresholdTaskRecordPage,
  'ReportTaskRecordPage': ReportTaskRecordPage,
};

export default class Container extends Component {

  constructor(props) {
    super(props);
    let selectedPage = this.props.selectedPage ? this.props.selectedPage : PAGES['WelcomePage'];
    this.state = {
      selectedPage: (selectedPage),
      myProfile: {},
      navItems: []
    };
    this._handleSelectMenu = this._handleSelectMenu.bind(this);
    this._handleLogout = this._handleLogout.bind(this);
  }

  componentWillMount() {
    this._loadMyProfile();
  }

  _loadMyProfile() {
    FetchURI('/api/account/me', (response) => {
      delete response.entity.user.creator;
      delete response.entity.user.updater;
      const selfLink = { _links: { self: { href: '/api/users/' + response.entity.user.id } } };
      let profile = Object.assign(selfLink, response.entity.user);
      FetchEntity(profile,
        (response) => {
          let myProfile = Object.assign({ headers: response.headers, _links: response.entity._links }, response.entity);
          this.setState(
            { myProfile: myProfile },
            () => { this._setNavItemsByRole(); }
          );
        },
        () => { alert('載入個人資料失敗'); });
    });
  }

  // http://stackoverflow.com/questions/38132146/recursively-filter-array-of-objects
  _setNavItemsByRole() {
    const roleId = this.state.myProfile.roleId;
    const navItems = Globals.NAV_ITEMS.filter( function f(o) {
      if (o.roles && o.roles.includes(roleId)) { return true; }
      if (o.pages) { return (o.pages = o.pages.filter(f)).length; }}
    );
    this.setState({ navItems: navItems });
  }

  _handleSelectMenu(eventKey, eventObj) {
    this.setState({selectedPage: PAGES[eventKey]});
  }

  _handleLogout() {
    window.location.href = '/logout';
  }

  // What does the three dots in react do?
  // http://stackoverflow.com/questions/31048953/what-does-the-three-dots-in-react-do
  _renderPageByTab(Component) {
    // console.log(Component === object);
    return (<Component {...this.props} myProfile={this.state.myProfile}/>);
  }

  render() {
    const leftMenu = this.state.navItems.map((pageGroup) => {
      return (
        <NavDropdown key={pageGroup.id} eventKey={pageGroup.id} title={pageGroup.name} id={'NavDropdown.' + pageGroup.id}>
          {pageGroup.pages.map((pageItem) => {
            return (
              <LinkContainer key={pageItem.id} to={pageItem.path}>
                <MenuItem key={pageItem.id} eventKey={pageItem.id}>{pageItem.name}</MenuItem>
              </LinkContainer>
            );
          })}
        </NavDropdown>
      );
    });

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