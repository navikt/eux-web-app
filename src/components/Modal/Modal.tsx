import classNames from 'classnames'
import { themeKeys, HighContrastFlatknapp, HighContrastHovedknapp, HighContrastKnapp } from 'nav-hoykontrast'
import { ModalContent } from 'declarations/components'
import { ModalContentPropType } from 'declarations/components.pt'
import _ from 'lodash'
import Lukknapp from 'nav-frontend-lukknapp'
import ReactModal from 'react-modal'
import { Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'

import styled, { createGlobalStyle } from 'styled-components'

const ModalDiv = styled(ReactModal)`
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 1rem 1rem;
  border-radius: 4px;
  position: relative;
  flex-grow: 0;
  overflow: inherit;
  max-height: 100%;
  margin-bottom: 0;
  z-index: 1010;
  color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
  background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
`
const OverlayStyle = createGlobalStyle`
  modal__overlay {
    position: fixed;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(61, 56, 49, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
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
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const ButtonMargin = styled.div`
  margin-right: 1rem;
  margin-top: 0.5rem;
  margin-botton: 0.5rem;
`
const IconDiv = styled.div`
  z-index: 40000;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -3rem;
`
const ContentDiv = styled.div`
  overflow: auto;
  max-height: 85vh;
  &.icon {
    margin-top: 3rem;
  }
  &.buttons {
    margin-top: 3rem;
  }
`

export interface ModalProps {
  appElementId?: string
  className?: string
  highContrast: boolean
  icon?: JSX.Element | undefined
  onModalClose?: () => void
  open: boolean,
  closeButton?: boolean
  closeButtonLabel?: string
  modal: ModalContent | undefined
}

const Modal: React.FC<ModalProps> = ({
  appElementId = 'body',
  className,
  icon = undefined,
  onModalClose,
  open,
  closeButton = true,
  closeButtonLabel = '',
  modal
}: ModalProps): JSX.Element => {
  const [_modal, setModal] = useState<ModalContent | undefined>(modal)

  useEffect(() => {
    setModal(modal)
  }, [modal])

  const closeModal = (): void => {
    setModal(undefined)
    if (_.isFunction(onModalClose)) {
      onModalClose()
    }
  }

  const onCloseButtonClicked = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    setModal(undefined)
    if (_.isFunction(onModalClose)) {
      onModalClose()
    }
  }

  if (typeof (window) !== 'undefined') {
    ReactModal.setAppElement(document.getElementById(appElementId) ?? 'body')
  }

  return (
    <>
      <OverlayStyle />
      <ModalDiv
        className={className}
        overlayClassName='modal__overlay'
        isOpen={open}
        onRequestClose={closeModal}
      >
        {icon && (
          <IconDiv>{icon}</IconDiv>
        )}
        {_modal && (
          <>
            <ContentDiv className={classNames({ icon: !!icon })}>
              {closeButton && (
                <CloseButton
                  data-test-id='modal__close-button-id'
                  onClick={onCloseButtonClicked}
                >
                  {closeButtonLabel}
                </CloseButton>
              )}
              {_modal.modalTitle && (
                <Title data-test-id='modal__title-id'>
                  {_modal.modalTitle}
                </Title>
              )}
              {_modal.modalContent || (
                <ModalText data-test-id='modal__text-id'>
                  {_modal.modalText}
                </ModalText>
              )}
            </ContentDiv>
            {_modal.modalButtons && (
              <ModalButtons className={classNames('buttons')}>
                {_modal.modalButtons.map((button, i) => {
                  let Button = HighContrastKnapp
                  if (button.main) {
                    Button = HighContrastHovedknapp
                  }
                  if (button.flat) {
                    Button = HighContrastFlatknapp
                  }
                  const handleClick = _.isFunction(button.onClick)
                    ? () => {
                      button.onClick!()
                      closeModal()
                      }
                    : closeModal

                  return (
                    <ButtonMargin key={i}>
                      <Button
                        data-test-id={'modal__button-id-' + i}
                        disabled={button.disabled || false}
                        key={button.text}
                        id={'modal__button-id-' + i}
                        onClick={handleClick}
                      >
                        {button.text}
                      </Button>
                    </ButtonMargin>
                  )
                })}
              </ModalButtons>
            )}
          </>
        )}
      </ModalDiv>
    </>
  )
}

Modal.propTypes = {
  appElementId: PT.string,
  className: PT.string,
  closeButton: PT.bool,
  closeButtonLabel: PT.string,
  highContrast: PT.bool.isRequired,
  onModalClose: PT.func,
  modal: ModalContentPropType
}

export default Modal
