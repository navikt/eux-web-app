import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import './AbortModal.css'

Ui.Nav.Modal.setAppElement('#root')

export interface AbortModalProps {
  onAbort: () => void;
  visModal: boolean;
  closeModal: () => void;
}

const AbortModal: React.FC<AbortModalProps> = ({ onAbort, visModal, closeModal }: AbortModalProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Ui.Nav.Modal
      isOpen={visModal}
      onRequestClose={() => closeModal()}
      closeButton={false}
      contentLabel={t('ui:modal-abort-contentLabel')}
    >
      <div className="modal__innhold">
        <Ui.Nav.Container align="center" fluid>
          <Ui.Nav.Undertittel> Er du sikker på at du vil avbryte? </Ui.Nav.Undertittel>
          <Ui.Nav.Normaltekst className="modal__tekst">Informasjonen du har fyllt inn hittil vil ikke bli lagret.</Ui.Nav.Normaltekst>
          <Ui.Nav.Row>
            <Ui.Nav.Column xs="6">
              <Ui.Nav.Hovedknapp className="modal__knapp" onClick={onAbort}>JA, AVBRYT</Ui.Nav.Hovedknapp>
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

AbortModal.propTypes = {
  visModal: PT.bool.isRequired,
  closeModal: PT.func.isRequired,
};

export default AbortModal
