import classNames from 'classnames'
import {BodyShort, Button, Heading, Modal} from '@navikt/ds-react'
import { ModalContent } from 'declarations/components'
import _ from 'lodash'
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
  onBeforeClose?: () => boolean
  open: boolean,
  modal: ModalContent | undefined
  width?: number | "small" | "medium" | `${number}${string}` | undefined
  description?: Array<string>
}

const ModalFC: React.FC<ModalProps> = ({
  className,
  icon = undefined,
  description,
  onModalClose = () => {},
  onBeforeClose = () => true,
  open,
  modal,
  width
}: ModalProps): JSX.Element => {
  return (
    <Modal
      className={className}
      open={open}
      onClose={onModalClose}
      onBeforeClose={onBeforeClose}
      portal={true}
      id="neessiModal"
      width={width}
      header={undefined}
    >
      <Modal.Header>
        <Heading size="medium">{modal?.modalTitle ?? ''}</Heading>
        <>
          {description?.map((d) => {
            return <BodyShort size="small">{d}</BodyShort>
          })}
        </>
      </Modal.Header>
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

export default ModalFC
