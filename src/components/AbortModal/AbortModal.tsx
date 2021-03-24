import { FlexDiv } from 'components/StyledComponents'
import Modal from 'nav-frontend-modal'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import NavHighContrast, { HighContrastHovedknapp, HighContrastKnapp } from 'nav-hoykontrast'
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
export interface AbortModalProps {
  closeModal: () => void
  highContrast: boolean
  isOpen?: boolean
  onAbort: () => void
}

const AbortModal: React.FC<AbortModalProps> = ({
  closeModal, highContrast, isOpen = false, onAbort
}: AbortModalProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      closeButton={false}
      contentLabel={t('app:modal-abort-contentLabel')}
    >
      <NavHighContrast highContrast={highContrast}>
        <Content>
          <Undertittel>
            {t('app:modal-abort-title')}
          </Undertittel>
          <Text>
            {t('app:modal-abort-description')}
          </Text>
          <FlexDiv>
            <HighContrastHovedknapp onClick={onAbort}>
              {t('app:modal-abort-yes-cancel')}
            </HighContrastHovedknapp>
            <HighContrastKnapp onClick={closeModal}>
              {t('app:modal-abort-no-continue')}
            </HighContrastKnapp>
          </FlexDiv>
        </Content>
      </NavHighContrast>
    </Modal>
  )
}

AbortModal.propTypes = {
  closeModal: PT.func.isRequired,
  highContrast: PT.bool.isRequired,
  isOpen: PT.bool,
  onAbort: PT.func.isRequired
}

export default AbortModal
