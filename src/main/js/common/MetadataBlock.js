/**
 * Meatadata Block
 *
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Fri Apr 28 11:41:22 CST 2017
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

// MetadataBlock.propTypes = {
//   show: React.PropTypes.bool,
//   data: React.PropTypes.object,
// };

function MetadataBlock(props) {
  return (props.show) ? (
    <div>
      <div><p><strong>資料建立者：</strong>{props.data.creatorCname}</p></div>
      <div><p><strong>資料建立日期：</strong>{props.data.createdDate}</p></div>
      <div><p><strong>資料更新者：</strong>{props.data.updaterCname}</p></div>
      <div><p><strong>資料更新日期：</strong>{props.data.updatedDate}</p></div>
    </div>
  ) : null;
}

// MetadataBlock.propTypes = {
//   show: PropTypes.bool,
//   data: PropTypes.object
// };

export {
  MetadataBlock,
};