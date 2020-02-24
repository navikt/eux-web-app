import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import './AbortModal.css'

Ui.Nav.Modal.setAppElement('#root')

export interface AbortModalProps {
  closeModal: () => void;
  onAbort: () => void;
  visModal: boolean;
}

const AbortModal: React.FC<AbortModalProps> = ({ closeModal, onAbort, visModal }: AbortModalProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Ui.Nav.Modal
      isOpen={visModal}
      onRequestClose={() => closeModal()}
      closeButton={false}
      contentLabel={t('ui:modal-abort-contentLabel')}
    >
      <div className='modal__innhold'>
        <Ui.Nav.Container align='center' fluid>
          <Ui.Nav.Undertittel>{t('ui:modal-abort-title')}</Ui.Nav.Undertittel>
          <Ui.Nav.Normaltekst className='modal__tekst'>{t('ui:modal-abort-description')}</Ui.Nav.Normaltekst>
          <Ui.Nav.Row>
            <Ui.Nav.Column xs='6'>
              <Ui.Nav.Hovedknapp className='modal__knapp' onClick={onAbort}>{t('ui:modal-abort-yes-button')}</Ui.Nav.Hovedknapp>
            </Ui.Nav.Column>
            <Ui.Nav.Column xs='6'>
              <Ui.Nav.Knapp className='modal__knapp' onClick={closeModal}>{t('ui:modal-abort-no-continue')}</Ui.Nav.Knapp>
            </Ui.Nav.Column>
          </Ui.Nav.Row>
        </Ui.Nav.Container>
      </div>
    </Ui.Nav.Modal>
  )
}

AbortModal.propTypes = {
  closeModal: PT.func.isRequired,
  onAbort: PT.func.isRequired,
  visModal: PT.bool.isRequired
}

export default AbortModal
