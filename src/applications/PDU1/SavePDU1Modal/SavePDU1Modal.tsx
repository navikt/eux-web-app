import { saveEntry } from 'actions/localStorage'
import Modal from 'components/Modal/Modal'
import { PDU1 } from 'declarations/pd'
import { LocalStorageEntry, Validation } from 'declarations/types'
import _ from 'lodash'
import { Alert, Heading, Button, TextField } from '@navikt/ds-react'
import { ErrorElement } from 'declarations/app.d'
import {
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv,
  PileDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const MinimalModalDiv = styled.div`
  min-height: 200px;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`
const MinimalContentDiv = styled.div`
  flex: 1;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
`
const SectionDiv = styled.div`
  flex: 1;
  align-items: stretch;
  flex-direction: row;
  display: flex;
  justify-content: center;
`

interface SavePDU1ModalProps {
  onModalClose: () => void
  PDU1: PDU1
  open: boolean
}

const SendPDU1Modal = ({
  open,
  onModalClose,
  PDU1
}: SavePDU1ModalProps): JSX.Element => {
  const { t } = useTranslation()
  const [_name, setName] = useState<string>('pdu1-' + new Date().getTime())
  const [_message, setMessage] = useState<string>('')
  const [_validation, setValidation] = useState<Validation>({})
  const [_saved, setSaved] = useState<boolean>(false)

  const dispatch = useDispatch()
  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const validation: Validation = {}
    if (!_name) {
      validation['savepdu1modal-name'] = {
        skjemaelementId: 'savepdu1modal-name',
        feilmelding: t('validation:noNavn')
      } as ErrorElement
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onSave = async () => {
    if (performValidation()) {
      const now = new Date()
      const dateString = now.toDateString()
      const newItem: LocalStorageEntry<PDU1> = {
        id: '' + now.getTime(),
        name: _name,
        date: dateString,
        content: PDU1
      } as LocalStorageEntry
      dispatch(saveEntry('pdu1', newItem))
      setSaved(true)
      setMessage(t('label:lagret-pdu1-utkast', { name: _name, date: dateString }))
    }
  }

  return (
    <Modal
      open={open}
      modal={{
        closeButton: false,
        modalContent: (
          <MinimalModalDiv>
            <Heading size='small'>
              {t('label:save-pdu1')}
            </Heading>
            <VerticalSeparatorDiv />
            {_message && (
              <>
                <Alert variant='success'>
                  {t(_message)}
                </Alert>
                <VerticalSeparatorDiv />
              </>
            )}
            <MinimalContentDiv>
              {!_saved && (
                <SectionDiv>
                  <PileDiv style={{ alignItems: 'flex-start' }}>
                    <div>
                      <FlexCenterSpacedDiv>
                        <TextField
                          data-test-id='savepdu1modal-name'
                          error={_validation['savepdu1modal-name']?.feilmelding}
                          id='savepdu1modal-name'
                          label={t('label:navn')}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                          value={_name}
                        />
                      </FlexCenterSpacedDiv>
                    </div>
                    <VerticalSeparatorDiv size='0.5' />
                  </PileDiv>
                </SectionDiv>
              )}
              <SectionDiv>
                <VerticalSeparatorDiv />
                {!_saved
                  ? (
                    <div>
                      <Button
                        variant='primary'
                        onClick={onSave}
                      >
                        {t('el:button-save-draft-x', { x: 'PD U1' })}
                      </Button>
                      <HorizontalSeparatorDiv />
                      <Button
                        variant='tertiary'
                        onClick={onModalClose}
                      >
                        {t('el:button-cancel')}
                      </Button>

                    </div>
                    )
                  : (
                    <div>
                      <Button
                        variant='primary'
                        onClick={onModalClose}
                      >
                        {t('el:button-close')}
                      </Button>
                    </div>
                    )}
              </SectionDiv>
            </MinimalContentDiv>
          </MinimalModalDiv>
        )
      }}
      onModalClose={onModalClose}
    />
  )
}

export default SendPDU1Modal
