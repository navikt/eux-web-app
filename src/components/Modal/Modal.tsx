import classNames from 'classnames'
import { Button, Modal, Heading } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { ModalContent } from 'declarations/components'
import { ModalContentPropType } from 'declarations/components.pt'
import _ from 'lodash'
import PT from 'prop-types'
import React from 'react'

import styled from 'styled-components'

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
`
const ContentDiv = styled.div`
  overflow: auto;
  max-height: 85vh;
  &.icon {
    margin-top: 6rem;
  }
  &.buttons {
    margin-top: 3rem;
  }
`

export interface ModalProps {
  appElementId?: string
  className?: string
  icon?: JSX.Element | undefined
  onModalClose?: () => void
  shouldCloseOnOverlayClick ?: boolean
  open: boolean,
  modal: ModalContent | undefined
}

const ModalFC: React.FC<ModalProps> = ({
  appElementId = 'body',
  className,
  icon = undefined,
  onModalClose = () => {},
  shouldCloseOnOverlayClick = true,
  open,
  modal
}: ModalProps): JSX.Element => {
  if (typeof (window) !== 'undefined') {
    Modal.setAppElement(document.getElementById(appElementId) ?? 'body')
  }

  return (
    <Modal
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      className={className}
      open={open}
      onClose={onModalClose}
    >
      <Modal.Content>
        {icon && (
          <IconDiv>{icon}</IconDiv>
        )}
        {modal?.modalTitle && (
          <>
            <Heading size='small' data-testid='modal__title-id'>
              {modal?.modalTitle}
            </Heading>
            <VerticalSeparatorDiv />
          </>
        )}
        <ContentDiv className={classNames({ icon: !!icon })}>
          {modal?.modalContent || (
            <ModalText data-testid='modal__text-id'>
              {modal?.modalText}
            </ModalText>
          )}
        </ContentDiv>
        {modal?.modalButtons && (
          <ModalButtons className={classNames('buttons')}>
            {modal?.modalButtons.map((button, i) => {
              if (button.hide) {
                return null
              }
              let variant  = button.variant
              //let variant: 'tertiary' | 'primary' | 'secondary' | 'danger' | undefined = 'secondary'
              if (button.main) {
                variant = 'primary'
              }
              if (button.flat) {
                variant = 'tertiary'
              }
              const handleClick = _.isFunction(button.onClick)
                ? () => {
                  button.onClick!()
                  onModalClose()
                  }
                : onModalClose
              return (
                <ButtonMargin key={i}>
                  <Button
                    variant={variant ? variant : 'secondary'}
                    data-testid={'modal__button-id-' + i}
                    disabled={button.disabled || false}
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
      </Modal.Content>
    </Modal>

  )
}

ModalFC.propTypes = {
  appElementId: PT.string,
  className: PT.string,
  onModalClose: PT.func,
  modal: ModalContentPropType
}

export default ModalFC
