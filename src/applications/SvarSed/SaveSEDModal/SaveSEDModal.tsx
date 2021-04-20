import { clientClear } from 'actions/alert'
import Alert from 'components/Alert/Alert'
import Modal from 'components/Modal/Modal'
import { FlexCenterDiv, PileDiv } from 'components/StyledComponents'
import { AlertStatus } from 'declarations/components'
import { LocalStorageEntry, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import { HighContrastHovedknapp, HighContrastInput, VerticalSeparatorDiv, HorizontalSeparatorDiv, HighContrastFlatknapp } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const AlertstripeDiv = styled.div`
  padding: 0.5rem;
  width: 100%;
`
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

interface SaveSEDModalProps<CustomLocalStorageContent extends any = any> {
  highContrast: boolean
  onModalClose: () => void
  localStorageContent: CustomLocalStorageContent
  storageKey: string
}

const SendSEDModal = <CustomLocalStorageContent extends any = any>({
  highContrast,
  onModalClose,
  localStorageContent,
  storageKey
}: SaveSEDModalProps<CustomLocalStorageContent>): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_name, setName] = useState<string>('')
  const [_message, setMessage] = useState<string>('')
  const [_validation, setValidation] = useState<Validation>({})
  const [_saved, setSaved] = useState<boolean>(false)

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const validation: Validation = {}
    if (!_name) {
      validation['savesedmodal-name'] = {
        skjemaelementId: 'c-savesedmodal-name-text',
        feilmelding: t('message:validation-noName')
      } as FeiloppsummeringFeil
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onSave = async () => {
    if (performValidation()) {
      const items: string | null = await window.localStorage.getItem(storageKey)
      let savedEntries: Array<LocalStorageEntry<CustomLocalStorageContent>> | null | undefined
      if (_.isString(items)) {
        savedEntries = JSON.parse(items)
      } else {
        savedEntries = []
      }
      const dateString = new Date().toDateString()
      const newReplySeds = savedEntries!.concat({
        name: _name,
        date: dateString,
        content: localStorageContent
      } as LocalStorageEntry<CustomLocalStorageContent>)
      await window.localStorage.setItem(storageKey, JSON.stringify(newReplySeds, null, 2))
      setSaved(true)
      setMessage(t('label:lagret-sed-utkast', { name: _name, date: dateString }))
    }
  }

  return (
    <Modal
      highContrast={highContrast}
      modal={{
        closeButton: false,
        modalContent: (
          <MinimalModalDiv>
            <Undertittel>
              {t('el:title-save-sed')}
            </Undertittel>
            <VerticalSeparatorDiv />
            {_message && (
              <>
                <AlertstripeDiv>
                  <Alert
                    type='client'
                    fixed={false}
                    message={t(_message)}
                    status={'OK' as AlertStatus}
                    onClose={() => dispatch(clientClear())}
                  />
                </AlertstripeDiv>
                <VerticalSeparatorDiv />
              </>
            )}
            <MinimalContentDiv>
              {!_saved && (
                <SectionDiv>
                  <PileDiv style={{ alignItems: 'flex-start' }}>
                    <div>
                      <FlexCenterDiv>
                        <HighContrastInput
                          data-test-id='c-savesedmodal-name-text'
                          feil={_validation['savesedmodal-name']?.feilmelding}
                          id='c-savesedmodal-name-text'
                          label={t('label:navn')}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                          placeholder={t('el:placeholder-input-default')}
                          value={_name}
                        />
                      </FlexCenterDiv>
                    </div>
                    <VerticalSeparatorDiv data-size='0.5' />
                  </PileDiv>
                </SectionDiv>
              )}
              <SectionDiv>
                <VerticalSeparatorDiv />
                {!_saved
                  ? (
                    <div>
                      <HighContrastHovedknapp
                        mini
                        onClick={onSave}
                      >
                        {t('el:button-save')}
                      </HighContrastHovedknapp>
                      <HorizontalSeparatorDiv />
                      <HighContrastFlatknapp
                        mini
                        onClick={onModalClose}
                      >
                        {t('el:button-cancel')}
                      </HighContrastFlatknapp>

                    </div>
                    )
                  : (
                    <div>
                      <HighContrastHovedknapp
                        mini
                        onClick={onModalClose}
                      >
                        {t('el:button-close')}
                      </HighContrastHovedknapp>
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
