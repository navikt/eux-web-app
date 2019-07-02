import React from 'react';
import Modal from 'react-modal';
import PT from 'prop-types';
import { Hovedknapp, Column, Row, Container } from '../utils/navFrontend';

import './avsluttModal.css';

Modal.setAppElement('body');

const avsluttModal = props => {
  const { visModal, closeModal } = props;
  return (
    <Modal
      isOpen={visModal}
      onRequestClose={closeModal}
      contentLabel="Bekreft navigering tilbake til forsiden"
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="modal__innhold">
        <Container fluid>
          <Row className="modal__overskrift">
            <h3> Er du sikker på at du vil avbryte? </h3>
          </Row >
          <Row className="modal__tekst">
            Informasjonen du har fyllt inn hittil vil ikke bli lagret.
          </Row>
          <Row>
            <Column xs="6">
              <a href="/">
                <Hovedknapp className="modal__knapp">JA, AVBRYT</Hovedknapp>
              </a>
            </Column >
            <Column xs="6">
              <Hovedknapp className="modal__knapp" onClick={closeModal}>NEI, FORTSETT</Hovedknapp>
            </Column >
          </Row>
        </Container>
      </div >
    </Modal>
  );
};

avsluttModal.propTypes = {
  visModal: PT.bool.isRequired,
  closeModal: PT.func.isRequired,
};

export default avsluttModal;
