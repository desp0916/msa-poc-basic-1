/**
 * 公用程式
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Wed Mar 29 15:10:10 CST 2017
 * @flow
 */

/**
 * 取得現在的日期（例如：2017-03-29）
 */
function currentDate() {
  let now = new Date();

  let year = now.getFullYear();
  let month = now.getMonth();
  let day = now.getDate();
  let date = [year, month, day].join('-');

  return date;
}

/**
 * 取得現在的時間（精確到秒，例如：15:13:59）
 */
function currentTime() {
  let now = new Date();

  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  let time = [hour, minute, second].join(':');

  return time; 
}

/**
 * 取得現在的日期時間（精確到秒，例如：2017-03-29 15:13:59）
 */
function currentDateTime() {
  let now = new Date();

  let year = now.getFullYear();
  let month = now.getMonth();
  let day = now.getDate();
  let date = [year, month, day].join('-');

  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  let time = [hour, minute, second].join(':');

  return date + ' ' + time; 
}

/**
 * 驗證某字串是否為合法的日期時間格式（yyyy-MM-dd HH:mm:SS）
 * http://stackoverflow.com/questions/20972728/validate-datetime-with-javascript-and-regex
 */
function isValidDateFormat(dateToValidate) {
  let matches = dateToValidate.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  if (matches !== null) {
    // now lets check the date sanity
    var year = parseInt(matches[1], 10);
    var month = parseInt(matches[2], 10) - 1; // months are 0-11
    var day = parseInt(matches[3], 10);
    var hour = parseInt(matches[4], 10);
    var minute = parseInt(matches[5], 10);
    var second = parseInt(matches[6], 10);
    var date = new Date(year, month, day, hour, minute, second);
    if (date.getFullYear() === year
      && date.getMonth() === month
      && date.getDate() === day
      && date.getHours() === hour
      && date.getMinutes() === minute
      && date.getSeconds() === second) {
      return true;
    }
  }
  return false;
}

/**
 * 移除陣列中重複的元素 
 * http://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
 */
function ArrayUnique(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i+1; j < a.length; ++j) {
      if (a[i] === a[j])
        a.splice(j--, 1);
    }
  }
  return a;
}

module.exports = {
  currentDate,
  currentTime,
  currentDateTime,
  isValidDateFormat,
  ArrayUnique,
};