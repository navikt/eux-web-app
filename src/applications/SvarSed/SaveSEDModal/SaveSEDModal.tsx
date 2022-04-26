import { Alert, Button, Heading } from '@navikt/ds-react'
import { saveEntry } from 'actions/localStorage'
import Input from 'components/Forms/Input'
import { AlertstripeDiv } from 'components/StyledComponents'
import { ErrorElement } from 'declarations/app.d'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, Validation } from 'declarations/types'
import _ from 'lodash'
import { FlexCenterSpacedDiv, HorizontalSeparatorDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
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

interface SaveSEDModalProps {
  saveName ?: string
  onSaved: (name ?: string) => void
  savedButtonText ?: string
  onCancelled: () => void
  replySed: ReplySed
}

const SaveSEDModal = ({
  saveName,
  replySed,
  onSaved,
  savedButtonText,
  onCancelled
}: SaveSEDModalProps): JSX.Element => {
  const { t } = useTranslation()
  const [_name, setName] = useState<string>(saveName ?? replySed.saksnummer + '-' + replySed.sedType)
  const [_message, setMessage] = useState<string>('')
  const [_validation, setValidation] = useState<Validation>({})
  const [_saved, setSaved] = useState<boolean>(false)

  const dispatch = useAppDispatch()
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

  const onSave = async (name: string) => {
    if (performValidation()) {
      const dateString = new Date().toDateString()
      const newItem: LocalStorageEntry<ReplySed> = {
        // replySed.sedId is undefined if we are dealing with a besvar SED, but since the ID is only for local storage purposes
        // only, generate a random one
        id: replySed.sedId ?? 'id-' + new Date().getTime(),
        name,
        date: dateString,
        content: replySed
      } as LocalStorageEntry<ReplySed>
      dispatch(saveEntry('svarsed', newItem))
      setSaved(true)
      setMessage(t('label:lagret-sed-utkast', { name, date: dateString }))
    }
  }

  useEffect(() => {
    if (!_.isEmpty(saveName)) {
      onSave(saveName!)
    }
  }, [])

  return (
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
                    disabled={_saved}
                    data-testid='savesedmodal-name'
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
                  onClick={() => onSave(_name)}
                >
                  {t('el:button-save-draft-x', { x: 'svarSED' })}
                </Button>
                <HorizontalSeparatorDiv />
                <Button
                  variant='secondary'
                  onClick={onCancelled}
                >
                  {t('el:button-cancel')}
                </Button>

              </div>
              )
            : (
              <div>
                <Button
                  variant='primary'
                  onClick={() => onSaved(_name)}
                >
                  {savedButtonText ?? t('el:button-close')}
                </Button>
              </div>
              )}
        </SectionDiv>
      </MinimalContentDiv>
    </MinimalModalDiv>
  )
}

export default SaveSEDModal
