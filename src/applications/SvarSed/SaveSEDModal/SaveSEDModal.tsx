import { saveEntry } from 'actions/localStorage'
import Modal from 'components/Modal/Modal'
import { AlertstripeDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { Alert, Button, Heading } from '@navikt/ds-react'
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
import Input from 'components/Forms/Input'

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

interface SaveSEDModalProps {
  open: boolean
  onModalClose: () => void
  replySed: ReplySed
}

const SendSEDModal = ({
  open,
  onModalClose,
  replySed
}: SaveSEDModalProps): JSX.Element => {
  const { t } = useTranslation()
  const [_name, setName] = useState<string>(replySed.saksnummer + '-' + replySed.sedType)
  const [_message, setMessage] = useState<string>('')
  const [_validation, setValidation] = useState<Validation>({})
  const [_saved, setSaved] = useState<boolean>(false)

  const dispatch = useDispatch()
  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const validation: Validation = {}
    if (!_name) {
      validation['savesedmodal-name'] = {
        skjemaelementId: 'savesedmodal-name',
        feilmelding: t('validation:noNavn')
      } as ErrorElement
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onSave = async () => {
    if (performValidation()) {
      const dateString = new Date().toDateString()
      const newItem: LocalStorageEntry<ReplySed> = {
        id: replySed.sedId,
        name: _name,
        date: dateString,
        content: replySed
      } as LocalStorageEntry
      dispatch(saveEntry('svarsed', newItem))
      setSaved(true)
      setMessage(t('label:lagret-sed-utkast', { name: _name, date: dateString }))
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
              {t('label:save-sed')}
            </Heading>
            <VerticalSeparatorDiv />
            {_message && (
              <>
                <AlertstripeDiv>
                  <Alert variant='success'>
                    {t(_message)}
                  </Alert>
                </AlertstripeDiv>
                <VerticalSeparatorDiv />
              </>
            )}
            <MinimalContentDiv>
              {!_saved && (
                <SectionDiv>
                  <PileDiv style={{ alignItems: 'flex-start' }}>
                    <div>
                      <FlexCenterSpacedDiv>
                        <Input
                          data-test-id='savesedmodal-name'
                          error={_validation['savesedmodal-name']?.feilmelding}
                          id='name'
                          namespace='savesedmodal'
                          label={t('label:navn')}
                          onChanged={setName}
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
                        {t('el:button-save-draft-x', { x: 'svarSED' })}
                      </Button>
                      <HorizontalSeparatorDiv />
                      <Button
                        variant='secondary'
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

export default SendSEDModal
