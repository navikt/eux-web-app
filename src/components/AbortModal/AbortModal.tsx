import { Hovedknapp, Knapp } from 'nav-frontend-knapper'
import Modal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

if (document && document.getElementById('root')) {
  Modal.setAppElement('#root')
}

const Content = styled.div`
  margin: 1.5em 2em 3em 2em;
  text-align: center;
`

const Text = styled(Normaltekst)`
  padding: 2em;
  margin-bottom: 1em;
`
const Buttons = styled.div`
  display: flex;
`

export interface AbortModalProps {
  closeModal: () => void
  isOpen?: boolean
  onAbort: () => void
}

const AbortModal: React.FC<AbortModalProps> = ({
  closeModal, isOpen = false, onAbort
}: AbortModalProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      closeButton={false}
      contentLabel={t('ui:modal-abort-contentLabel')}
    >
      <Content>
        <Undertittel>
          {t('ui:modal-abort-title')}
        </Undertittel>
        <Text>
          {t('ui:modal-abort-description')}
        </Text>
        <Buttons>
          <Hovedknapp onClick={onAbort}>
            {t('ui:modal-abort-yes-button')}
          </Hovedknapp>
          <Knapp onClick={closeModal}>
            {t('ui:modal-abort-no-continue')}
          </Knapp>
        </Buttons>
      </Content>
    </Modal>
  )
}

AbortModal.propTypes = {
  closeModal: PT.func.isRequired,
  onAbort: PT.func.isRequired,
  isOpen: PT.bool
}

export default AbortModal
