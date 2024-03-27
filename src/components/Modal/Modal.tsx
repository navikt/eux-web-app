import classNames from 'classnames'
import { Button, Modal } from '@navikt/ds-react'
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
  className?: string
  icon?: JSX.Element | undefined
  onModalClose?: () => void
  open: boolean,
  modal: ModalContent | undefined
}

const ModalFC: React.FC<ModalProps> = ({
  className,
  icon = undefined,
  onModalClose = () => {},
  open,
  modal
}: ModalProps): JSX.Element => {
  return (
    <Modal
      className={className}
      open={open}
      onClose={onModalClose}
      header={{heading: modal?.modalTitle ?? '', icon: icon ?? undefined}}
    >
      <Modal.Body>
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
      </Modal.Body>
    </Modal>

  )
}

ModalFC.propTypes = {
  className: PT.string,
  onModalClose: PT.func,
  modal: ModalContentPropType
}

export default ModalFC
