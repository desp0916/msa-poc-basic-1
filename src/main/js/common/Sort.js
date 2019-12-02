/**
 * 用於列表排序
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Wed May 3 14:23:27 CST 2017
 * @flow
 * @jsx
 */

export default class Sort {
  constructor(field, direction) {
    this.field = (field === undefined) ? 'updatedDate' : field;
    this.direction = (direction === undefined) ? 'desc' : direction;
  }
}
