import { ModalContent } from 'declarations/components'
import { ModalContentPropType } from 'declarations/components.pt'
import _ from 'lodash'
import Knapp, { Hovedknapp } from 'nav-frontend-knapper'
import Lukknapp from 'nav-frontend-lukknapp'
import NavModal from 'nav-frontend-modal'
import { Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

export interface ModalProps {
  appElement?: Element;
  className?: string;
  onModalClose?: () => void;
  closeButton?: boolean;
  closeButtonLabel?: string;
  modal: ModalContent | undefined;
}

const ModalDiv = styled(NavModal)`
  width: auto !important;
  height: auto !important;
`
const CloseButton = styled(Lukknapp)`
  position: absolute !important;
  right: 0.5rem;
  top: 0.5rem;
  z-index: 999;
`
const Title = styled(Undertittel)`
  text-align: center;
`
const ModalText = styled.div`
  margin: 1.5rem;
  text-align: center;
`
const ModalButtons = styled.div`
  text-align: center;
`
const MainButton = styled(Hovedknapp)`
  margin-right: 1rem;
  margin-bottom: 1rem;
`
const OtherButton = styled(Knapp)`
  margin-right: 1rem;
  margin-bottom: 1rem;
`

export const Modal: React.FC<ModalProps> = ({
  appElement = document.body, className, onModalClose, closeButton = true, closeButtonLabel = '', modal
}: ModalProps): JSX.Element => {
  const [_modal, setModal] = useState<ModalContent | undefined>(modal)

  useEffect(() => {
    if (!_.isEqual(_modal, modal)) {
      setModal(modal)
    }
  }, [modal, _modal])

  const closeModal = (): void => {
    if (_.isFunction(onModalClose)) {
      onModalClose()
    }
  }

  const onCloseButtonClicked = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (_.isFunction(onModalClose)) {
      onModalClose()
    }
  }

  NavModal.setAppElement(appElement)

  return (
    <ModalDiv
      className={className}
      isOpen={!_(_modal).isNil()}
      onRequestClose={closeModal}
      closeButton={false}
      contentLabel='contentLabel'
    >
      {_modal && (
        <div>
          {closeButton && (
            <CloseButton
              onClick={onCloseButtonClicked}
            >
              {closeButtonLabel}
            </CloseButton>
          )}
          {_modal.modalTitle && (
            <Title>
              {_modal.modalTitle}
            </Title>
          )}
          {_modal.modalContent || (
            <ModalText>
              {_modal.modalText}
            </ModalText>
          )}
          {_modal.modalButtons && (
            <ModalButtons>
              {_modal.modalButtons.map(button => {
                const handleClick = _.isFunction(button.onClick) ? () => {
                  button.onClick!()
                  closeModal()
                } : closeModal
                return button.main
                  ? (
                    <MainButton
                      id='c-modal__main-button-id'
                      disabled={button.disabled || false}
                      key={button.text}
                      onClick={handleClick}
                    >
                      {button.text}
                    </MainButton>
                  )
                  : (
                    <OtherButton
                      id='c-modal__other-button-id'
                      key={button.text}
                      onClick={handleClick}
                    >
                      {button.text}
                    </OtherButton>
                  )
              })}
            </ModalButtons>
          )}
        </div>
      )}
    </ModalDiv>
  )
}

Modal.propTypes = {
  appElement: PT.any,
  className: PT.string,
  closeButton: PT.bool,
  closeButtonLabel: PT.string,
  onModalClose: PT.func,
  modal: ModalContentPropType
}
Modal.displayName = 'Modal'
export default Modal
