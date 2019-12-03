/**
 * Modal Dialog
 * 
 * 多用合成，少用繼承
 * https://facebook.github.io/react/docs/composition-vs-inheritance.html
 * 
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Sun Feb 5 18:57:29 CST 2017
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

export default function ModalDialog(props) {
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}

// ModalDialog.propTypes = {
//   title: PropTypes.string,
//   show: PropTypes.bool,
//   onHide: PropTypes.func,
//   children: PropTypes.object,
// };
