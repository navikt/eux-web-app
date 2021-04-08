import { clientClear } from 'actions/alert'
import Alert from 'components/Alert/Alert'
import Modal from 'components/Modal/Modal'
import { FlexCenterDiv, PileDiv } from 'components/StyledComponents'
import { AlertStatus } from 'declarations/components'
import { ReplySed } from 'declarations/sed'
import { ReplySedEntry, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import { HighContrastHovedknapp, HighContrastInput, VerticalSeparatorDiv, HorizontalSeparatorDiv, HighContrastFlatknapp } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const AlertstripeDiv = styled.div`
  margin: 0.5rem;
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

interface SaveSEDModalProps {
  highContrast: boolean
  replySed: ReplySed
  onModalClose: () => void
}

const SendSEDModal: React.FC<SaveSEDModalProps> = ({
  highContrast,
  replySed,
  onModalClose
}: SaveSEDModalProps): JSX.Element => {

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
      let items: string | null = await window.localStorage.getItem('replysed')
      let replySeds: Array<ReplySedEntry> | null | undefined = undefined
      if (_.isString(items)) {
        replySeds = JSON.parse(items)
      } else {
        replySeds = []
      }
      let newReplySeds = replySeds!.concat({
        name: _name,
        date: new Date().toDateString(),
        replySed: replySed
      } as ReplySedEntry)
      await window.localStorage.setItem('replysed', JSON.stringify(newReplySeds, null, 2))
      setSaved(true)
      setMessage(t('label:saved'))
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
            <VerticalSeparatorDiv/>
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
                <VerticalSeparatorDiv/>
              </>
            )}
            <MinimalContentDiv>
            <SectionDiv>
              <PileDiv style={{alignItems: 'flex-start'}}>
                <div>
                  <FlexCenterDiv>
                    <HighContrastInput
                      data-test-id={'c-savesedmodal-name-text'}
                      feil={_validation['savesedmodal-name']?.feilmelding}
                      id={'c-savesedmodal-name-text'}
                      label={t('label:name')}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      placeholder={t('el:placeholder-input-default')}
                      value={_name}
                    />
                  </FlexCenterDiv>
                </div>
                <VerticalSeparatorDiv data-size='0.5'/>
              </PileDiv>
            </SectionDiv>
            <SectionDiv>
              <VerticalSeparatorDiv/>
              {!_saved ? (
                <div>
                  <HighContrastHovedknapp
                    mini
                    onClick={onSave}
                  >
                    {t('el:button-save')}
                  </HighContrastHovedknapp>
                  <HorizontalSeparatorDiv/>
                  <HighContrastFlatknapp
                    mini
                    onClick={onModalClose}
                  >
                    {t('el:button-cancel')}
                  </HighContrastFlatknapp>

                </div>
              ) : (
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
      )}}
      onModalClose={onModalClose}
    />
  )
}

export default SendSEDModal
