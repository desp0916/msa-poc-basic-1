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

// Loading.propTypes = {
//   error: PropTypes.bool,
//   timedOut: PropTypes.bool,
//   pastDelay: PropTypes.bool,
// };

/**
 * FormError
 * 用於顯示整個表單（非特定欄位）的錯誤訊息
 * 如：不合法的認證
 */
function FormError({ error }) {
  return (error) ? (
    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
  ) : null;
}

// FormError.propTypes = {
//   error: PropTypes.string,
// };

/**
 *  FieldGroup
 */
function FieldGroup({ id, label, help, ...props }) {
  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control {...props} />
      {help && <Form.Control.Feedback>{help}</Form.Control.Feedback>}
    </Form.Group>
  );
}

// FieldGroup.propTypes = {
//   id: PropTypes.string,
//   label: PropTypes.string,
//   help: PropTypes.string,
// };

/**
 * TextArea
 */
function TextArea({ id, label, help, ...props }) {
  return (
    <Form.Group
      id={id}
      label={label}
      as="textarea"
      help={help}
      {...props}
    />
  );
}

// TextArea.propTypes = {
//   id: PropTypes.string,
//   label: PropTypes.string,
//   help: PropTypes.string,
// };

/**
 * Span
 */
function Span() {
  return (<span>{' '}{' '}{' '}{' '}</span>);
}

export {
  Loading,
  FormError,
  FieldGroup,
  TextArea,
  Span,
};