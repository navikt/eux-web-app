import React from 'react';
import PT from 'prop-types';
import { Hovedknapp, Column, Row, Container, Modal, Undertittel, Normaltekst } from '../utils/navFrontend';

import './avsluttModal.css';

Modal.setAppElement('#root');

const avsluttModal = props => {
  const { visModal, closeModal } = props;
  return (
    <Modal
      isOpen={visModal}
      onRequestClose={() => closeModal()}
      closeButton={false}
      contentLabel="Bekreft navigasjon tilbake til forsiden"
    >
      <div className="modal__innhold">
        <Container align="center" fluid>
          <Row className="modal__overskrift">
            <Undertittel> Er du sikker på at du vil avbryte? </Undertittel>
          </Row >
          <Row className="modal__tekst">
            <Normaltekst>Informasjonen du har fyllt inn hittil vil ikke bli lagret.</Normaltekst>
          </Row>
          <Row>
            <Column xs="6">
              {/* Hack for å bruke en nav-knapp som lenke */}
              <a href="/" tabIndex="-1">
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
