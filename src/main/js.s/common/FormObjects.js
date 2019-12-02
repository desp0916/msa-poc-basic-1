/**
 * 常用的表單物件
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Fri Jan 13 00:24:33 CST 2017
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';

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

Loading.propTypes = {
  error: PropTypes.bool,
  timedOut: PropTypes.bool,
  pastDelay: PropTypes.bool,
};

/**
 * FormError
 * 用於顯示整個表單（非特定欄位）的錯誤訊息
 * 如：不合法的認證
 */
function FormError({ error }) {
  return (error) ? (
    <HelpBlock bsStyle="custom">{error}</HelpBlock>
  ) : null;
}

FormError.propTypes = {
  error: PropTypes.string,
};

/**
 *  FieldGroup
 */
function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock bsStyle="custom">{help}</HelpBlock>}
    </FormGroup>
  );
}

FieldGroup.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.string,
};
 
/**
 * TextArea
 */
function TextArea({ id, label, help, ...props }) {
  return (
    <FieldGroup
      id={id}
      label={label}
      componentClass="textarea"
      help={help}
      {...props}
    />
  );
}

TextArea.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.string,
};

/**
 * Select
 * 
 * 有時候會有「flattenChildren(…): Encountered two children with the same key」
 * 的警告訊息，不過沒有關係，可以忽略。
 */
function Select({ id, label, options, help, ...props }) {
  const optionsList = (Array.isArray(options) && options.length > 0) ?
    options.map(item => <option key={item.key} value={item.key}>{item.value}</option>) : null;
  return (
    <FieldGroup
      id={id}
      label={label}
      componentClass="select"
      help={help}
      {...props}
    >
      {optionsList}
    </FieldGroup>
  );
}

Select.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.string,
  options: PropTypes.array,
};

/**
 * SelectWithoutLabel
 */
function SelectWithoutLabel({ help, options, ...props }) {
  const optionsList = (Array.isArray(options) && options.length > 0) ?
    options.map(item => <option key={item.key} value={item.key}>{item.value}</option>) : null;
  return (
    <div>
      <FormControl {...props} componentClass="select">
        {optionsList}
      </FormControl>
      {help && <HelpBlock bsStyle="custom">{help}</HelpBlock>}
    </div>
  );
}

SelectWithoutLabel.propTypes = {
  id: PropTypes.string,
  help: PropTypes.string,
  options: PropTypes.array,
};

/**
 * TextInputWithoutLabel
 */
function TextInputWithoutLabel({ help, ...props }) {
  return (
    <div>
      <FormControl type="text" {...props} />
      {help && <HelpBlock bsStyle="custom">{help}</HelpBlock>}
    </div>
  );
}

TextInputWithoutLabel.propTypes = {
  help: PropTypes.string,
};

/**
 * Span
 */
function Span() {
  return (<span>{' '}{' '}{' '}{' '}</span>);
}

/**
 * react-bootstrap-datetimepicker
 * http://dev.quri.com/react-bootstrap-datetimepicker/
 * https://github.com/quri/react-bootstrap-datetimepicker
 * http://momentjs.com/docs/#/displaying/format/
 * http://stackoverflow.com/questions/20972728/validate-datetime-with-javascript-and-regex
 */
function DateTimeFieldGroup({ id, label, help, ...props }) {
  let { defaultValue } = props;
  let dateTime;
  const moment = require('moment');

  if (!moment(defaultValue, 'YYYY-MM-DD HH:mm:ss').isValid()) {
    dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  } else {
    dateTime = defaultValue;
  }

  return (
    <FormGroup controlId={id}>
       <ControlLabel>{label}</ControlLabel>
       <DateTimeField dateTime={dateTime} format='YYYY-MM-DD HH:mm:ss'
         inputFormat='YYYY-MM-DD HH:mm:ss' {...props} />
       {help && <HelpBlock bsStyle="custom">{help}</HelpBlock>}
    </FormGroup>
  );
}

DateTimeFieldGroup.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.string,
  defaultValue: PropTypes.string,
  inputProps: PropTypes.object,
};

module.exports = {
  Loading,
  FormError,
  FieldGroup,
  TextArea,
  Select,
  SelectWithoutLabel,
  TextInputWithoutLabel,
  Span,
  DateTimeFieldGroup,
};