/**
 * 常用的表單物件
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Fri Jan 13 00:24:33 CST 2017
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

/**
 * 用於 Code-splitting 的載入
 * 
 * https://github.com/jamiebuilds/react-loadable
 * 
 * @param {object} props 
 */
function Loading(props) {
  if (props.error) {
    return <div>Error!</div>;
  } else if (props.timedOut) {
    return <div>Taking a long time...</div>;
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}

/**
 * Span
 */
function Span() {
  return (<span>{' '}{' '}{' '}{' '}</span>);
}

export {
  Loading,
  Span,
};