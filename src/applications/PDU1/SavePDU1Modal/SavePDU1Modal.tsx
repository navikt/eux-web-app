import { saveEntry } from 'actions/localStorage'
import Modal from 'components/Modal/Modal'
import { AlertstripeDiv } from 'components/StyledComponents'
import { ReplyPdu1 } from 'declarations/pd'
import { LocalStorageEntry, Validation } from 'declarations/types'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import {
  FlexCenterSpacedDiv,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastInput,
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
  highContrast: boolean
  onModalClose: () => void
  replyPdu1: ReplyPdu1
  storageKey: string
  open: boolean
}

const SendPDU1Modal = ({
  open,
  highContrast,
  onModalClose,
  replyPdu1,
  storageKey
}: SavePDU1ModalProps): JSX.Element => {
  const { t } = useTranslation()
  const [_name, setName] = useState<string>(replyPdu1.type + '-' + new Date().getTime())
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
      } as FeiloppsummeringFeil
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onSave = async () => {
    if (performValidation()) {
      const now = new Date()
      const dateString = now.toDateString()
      const newItem: LocalStorageEntry<ReplyPdu1> = {
        id: '' + now.getTime(),
        name: _name,
        date: dateString,
        content: replyPdu1
      } as LocalStorageEntry
      dispatch(saveEntry('svarsed', storageKey, newItem))
      setSaved(true)
      setMessage(t('label:lagret-sed-utkast', { name: _name, date: dateString }))
    }
  }

  return (
    <Modal
      open={open}
      highContrast={highContrast}
      modal={{
        closeButton: false,
        modalContent: (
          <MinimalModalDiv>
            <Undertittel>
              {t('label:save-sed')}
            </Undertittel>
            <VerticalSeparatorDiv />
            {_message && (
              <>
                <AlertstripeDiv>
                  <AlertStripe type='suksess'>
                    {t(_message)}
                  </AlertStripe>
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
                        <HighContrastInput
                          data-test-id='savesedmodal-name'
                          feil={_validation['savesedmodal-name']?.feilmelding}
                          id='savesedmodal-name'
                          label={t('label:navn')}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                          placeholder={t('el:placeholder-input-default')}
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
                      <HighContrastHovedknapp
                        mini
                        onClick={onSave}
                      >
                        {t('el:button-save-draft')}
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

export default SendPDU1Modal
