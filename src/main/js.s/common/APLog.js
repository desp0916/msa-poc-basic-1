/**
 * AP Log 共用設定檔
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Sat Feb 25 16:13:56 CST 2017
 * @flow
 */

const KEYWORD_MONITOR_TASK = 1;
const THRESHOLD_MONITOR_TASK = 2;

/**
 * 給「關鍵字監控排程任務」用的額外欄位
 */
var fieldsForKeywordMontiorTask = {
  apID: {type: 'string', usedBy: null},
  functID: {type: 'string', usedBy: null},
  who: {type: 'string', usedBy: null},
  reqFrom: {type: 'string', usedBy: null},
  reqAt: {type: 'string', usedBy: null},
  reqTo: {type: 'string', usedBy: null},
  reqAction: {type: 'string', usedBy: null},
  reqResult: {type: 'string', usedBy: null},
  msgLevel: {type: 'string', usedBy: null},
  msgCode: {type: 'string', usedBy: null},
  reqTable: {type: 'string', usedBy: null},
  dataCnt: {type: 'number', usedBy: null},
  procTime: {type: 'number', usedBy: null},
};

/**
 * 給「門檻值監控排程任務」用的額外欄位
 */
var fieldsForThresholdMontiorTask = {
  apID: {type: 'string', usedBy: null},
  functID: {type: 'string', usedBy: null},
  who: {type: 'string', usedBy: null},
  reqFrom: {type: 'string', usedBy: null},
  reqAt: {type: 'string', usedBy: null},
  reqTo: {type: 'string', usedBy: null},
  reqAction: {type: 'string', usedBy: null},
  reqResult: {type: 'string', usedBy: null},
  kw: {type: 'string', usedBy: null},
  msgLevel: {type: 'string', usedBy: null},
  msg: {type: 'string', usedBy: null},
  msgCode: {type: 'string', usedBy: null},
  reqTable: {type: 'string', usedBy: null},
};

/**
 * 執行間隔時間（秒）
 */
const taskIntervals = [
  {key: '300', value: '5 分鐘'}, {key: '600', value: '10 分鐘'}, {key: '900', value: '15 分鐘'}, 
  {key: '1800', value: '30 分鐘'}, {key: '3600', value: '1 小時'}, {key: '7200', value: '2 小時'},
  {key: '10800', value: '3 小時'}, {key: '14400', value: '4 小時'}, {key: '18000', value: '5 小時'},
  {key: '21600', value: '6 小時'}, {key: '25200', value: '7 小時'}, {key: '28800', value: '8 小時'},
  {key: '32400', value: '9 小時'}, {key: '36000', value: '10 小時'}, {key: '39600', value: '11 小時'},
  {key: '43200', value: '12 小時'}, {key: '46800', value: '13 小時'}, {key: '50400', value: '14 小時'},
  {key: '54000', value: '15 小時'}, {key: '57600', value: '16 小時'}, {key: '61200', value: '17 小時'},
  {key: '64800', value: '18 小時'}, {key: '68400', value: '19 小時'}, {key: '72000', value: '20 小時'},
  {key: '75600', value: '21 小時'}, {key: '79200', value: '22 小時'}, {key: '82800', value: '23 小時'},
  {key: '86400', value: '1 天'},
];

// 字串欄位只能使用「=」或「<>」，不可使用「==」或「!=」
const stringOpOptions = [{key: '=', value: '='}, {key: '<>', value: '<>'}];
const numericOpOptions = [{key: '>', value: '>'}, {key: '>=', value: '>='}, 
  {key: '=', value: '='}, {key: '<=', value: '<='}, {key: '<', value: '<'}];
const thresholdAggTypes =[{key: 'sum', value: 'sum'}, {key: 'avg', value: 'avg'},
  {key: 'min', value: 'min'}, {key: 'max', value: 'max'}];

/**
 * 取得所有還未被使用過的欄位
 * 
 * @param {array} allFields 
 */
function GetUnusedFieldsOptions(allFields, index, fieldEname) {
  let options = [];
  for (let prop in allFields) {
    if (allFields[prop].usedBy == null || allFields[prop].usedBy == index) {
      options.push({key: prop, value: prop});
    }
  }
  if (typeof fieldEname === 'undefined') {
    for (let prop in allFields) {
      if (allFields[prop].usedBy == null || allFields[prop].usedBy == index) {
        fieldEname = prop;
        break;
      }
    }
  }
  allFields[fieldEname].usedBy = index;
  return options;
}

/**
 * 更新欄位
 */
function UpdateFields(allFields, fieldEname, index) {
  for (let prop in allFields) {
    if (allFields[prop].usedBy == index) {
      allFields[prop].usedBy = null;
    }
  }
  allFields[fieldEname].usedBy = index;
}

module.exports = {
  KEYWORD_MONITOR_TASK,
  THRESHOLD_MONITOR_TASK,
  fieldsForKeywordMontiorTask,
  fieldsForThresholdMontiorTask,
  taskIntervals,
  thresholdAggTypes,
  stringOpOptions,
  numericOpOptions,
  GetUnusedFieldsOptions,
  UpdateFields
};