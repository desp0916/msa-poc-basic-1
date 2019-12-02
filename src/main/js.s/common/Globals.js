/**
 * 全域變數或常數
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Thu Jan 12 11:04:58 CST 2017
 * @flow
 */

const APP_NAME = 'AP Log 主控台';
const API_ROOT = '/api';
const PAGE_SIZE = 10;
const ACT_CREATE = 'create';
const ACT_UPDATE = 'update';
const ACT_DELETE = 'delete';
const ACT_QUERY = 'query';
const ACT_VIEW = 'view';
const ACT_OTHER = 'other';
const STYLE_CENTER = {textAlign: 'center'};
const ROLE_SUPERUSER = 999;
const ROLE_MANAGER = 200;
const ROLE_USER = 100;
const IDLE_TIMEOUT = 1200000; // 單位：毫秒，使用者閒置 20 分鐘後將被強制登出
const LOADABLE_TIMEOUT = 10000; // https://github.com/jamiebuilds/react-loadable
const STYLE_COLOR_GREEN = {color: '#2cbc00'};
const STYLE_COLOR_RED = {color: '#c62601' };

// 頁面群組項目，用於導航條上的選單項目與頁面跳轉
const NAV_ITEMS = [
  // 頁面群組 1
  {
    id: 'pgBasic',
    name: '基本功能',
    pages: [
      {
        id: 'WelcomePage',
        name: '佈告欄',
        path: '/Welcome',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER, ROLE_USER],
      },
      {
        id: 'BulletinPage',
        name: '佈告欄管理',
        path: '/Bulletin',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER, ROLE_USER],
      },
      {
        id: 'MyProfilePage',
        name: '我的個人檔案',
        path: '/MyProfile',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER, ROLE_USER],
      },
    ]
  },
  // 頁面群組 2
  {
    id: 'pgPrivileges',
    name: '權限管理',
    pages: [
      {
        id: 'UserPage',
        name: '使用者管理',
        path: '/User',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER],
      },
      {
        id: 'GroupPage',
        name: '群組管理',
        path: '/Group',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER],
      },
      {
        id: 'ProjectPage',
        name: '專案系統管理',
        path: '/Project',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER],
      },
    ]
  },
  // 頁面群組 3
  {
    id: 'pgTasks',
    name: '監控排程',
    pages: [
      {
        id: 'KeywordTaskPage',
        name: '關鍵字監控排程',
        path: '/KeywordTask',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER, ROLE_USER],
      },
      {
        id: 'ThresholdTaskPage',
        name: '門檻值監控排程',
        path: '/ThresholdTask',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER, ROLE_USER],
      },
      {
        id: 'ReportTaskPage',
        name: '統計報表排程',
        path: '/ReportTask',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER, ROLE_USER],
      },
      {
        id: 'KeywordTaskRecordPage',
        name: '關鍵字監控排程通知紀錄',
        path: '/KeywordTaskRecord',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER, ROLE_USER],
      },
      {
        id: 'ThresholdTaskRecordPage',
        name: '門檻值監控排程通知紀錄',
        path: '/ThresholdTaskRecord',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER, ROLE_USER],
      },
      {
        id: 'ReportTaskRecordPage',
        name: '統計報表排程通知紀錄',
        path: '/ReportTaskRecord',
        roles: [ROLE_SUPERUSER, ROLE_MANAGER, ROLE_USER],
      },
    ]
  },
];

module.exports  = {
  APP_NAME,
  API_ROOT,
  PAGE_SIZE,
  NAV_ITEMS,
  ACT_CREATE,
  ACT_UPDATE,
  ACT_DELETE,
  ACT_VIEW,
  ACT_QUERY,
  ACT_OTHER,
  STYLE_CENTER,
  ROLE_SUPERUSER,
  ROLE_MANAGER,
  ROLE_USER,
  IDLE_TIMEOUT,
  LOADABLE_TIMEOUT,
  STYLE_COLOR_RED,
  STYLE_COLOR_GREEN
};