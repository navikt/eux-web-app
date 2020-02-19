import React from 'react';
import PT from 'prop-types';
import Ui from 'eessi-pensjon-ui'

import './avsluttModal.css';

Ui.Nav.Modal.setAppElement('#root');

const avsluttModal = props => {
  const { visModal, closeModal } = props;
  return (
    <Ui.Nav.Modal
      isOpen={visModal}
      onRequestClose={() => closeModal()}
      closeButton={false}
      contentLabel="Bekreft navigasjon tilbake til forsiden"
    >
      <div className="modal__innhold">
        <Ui.Nav.Container align="center" fluid>
          <Ui.Nav.Row className="modal__overskrift">
            <Ui.Nav.Undertittel> Er du sikker på at du vil avbryte? </Ui.Nav.Undertittel>
          </Ui.Nav.Row >
          <Ui.Nav.Row className="modal__tekst">
            <Ui.Nav.Normaltekst>Informasjonen du har fyllt inn hittil vil ikke bli lagret.</Ui.Nav.Normaltekst>
          </Ui.Nav.Row>
          <Ui.Nav.Row>
            <Ui.Nav.Column xs="6">
              {/* Hack for å bruke en nav-knapp som lenke */}
              <a href="/" tabIndex="-1">
                <Ui.Nav.Hovedknapp className="modal__knapp">JA, AVBRYT</Ui.Nav.Hovedknapp>
              </a>
            </Ui.Nav.Column >
            <Ui.Nav.Column xs="6">
              <Ui.Nav.Hovedknapp className="modal__knapp" onClick={closeModal}>NEI, FORTSETT</Ui.Nav.Hovedknapp>
            </Ui.Nav.Column >
          </Ui.Nav.Row>
        </Ui.Nav.Container>
      </div >
    </Ui.Nav.Modal>
  );
};

avsluttModal.propTypes = {
  visModal: PT.bool.isRequired,
  closeModal: PT.func.isRequired,
};

export default avsluttModal;
