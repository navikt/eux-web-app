import classNames from 'classnames'
import {BodyShort, Box, Button, Heading, HStack, Modal} from '@navikt/ds-react'
import { ModalContent } from 'declarations/components'
import _ from 'lodash'
import React from 'react'
import styles from './Modal.module.css'

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
        <div className={classNames(styles.content, { [styles.icon]: !!icon })}>
          {modal?.modalContent || (
            <div className={styles.modaltext} data-testid='modal__text-id'>
              {modal?.modalText}
            </div>
          )}
        </div>
        {modal?.modalButtons && (
          <Box padding="space-16">
            <HStack justify="center" gap="space-16">
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
                  <Button
                    variant={variant ? variant : 'secondary'}
                    data-testid={'modal__button-id-' + i}
                    disabled={button.disabled || false}
                    id={'modal__button-id-' + i}
                    onClick={handleClick}
                    key={i}
                  >
                    {button.text}
                  </Button>
                )
              })}
            </HStack>
          </Box>
        )}
      </Modal.Body>
    </Modal>

  )
}

export default ModalFC
