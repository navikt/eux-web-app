import Add from 'assets/icons/Add'
import classNames from 'classnames'
import { AlignStartRow } from 'components/StyledComponents'
import { Validation } from 'declarations/types'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface ReasonToComeProps {
  personID: string
  validation: Validation
}

const ReasonToCome: React.FC<ReasonToComeProps> = ({
  personID,
  validation
}: ReasonToComeProps): JSX.Element => {
  const { t } = useTranslation()
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newSender, setNewSender] = useState<string>('')
  const [_newReceiver, setNewReceiver] = useState<string>('')
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)

  const namespace = 'familymanager-' + personID + '-personensstatus-reasontocome'

  const onStartDatoChange = (dato: string) => {
    setNewStartDato(dato)
    // onValueChanged(`${personID}.XXX`, dato)
  }

  const onSluttDatoChange = (dato: string) => {
    setNewSluttDato(dato)
    // onValueChanged(`${personID}.XXX`, dato)
  }

  const onSenderChange = (sender: string) => {
    setNewSender(sender)
    // onValueChanged(`${personID}.XXX`, sender)
  }

  const onReceiverChange = (receiver: string) => {
    setNewReceiver(receiver)
    // onValueChanged(`${personID}.XXX`, receiver)
  }

  return (
    <>
      <Undertittel>
        {t('el:title-reason-for-coming')}
      </Undertittel>
      <VerticalSeparatorDiv />

      {!_seeNewForm
        ? (
            <div className='slideInFromLeft'>
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setSeeNewForm(true)}
            >
              <Add />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('label:add-new-reason-to-coming')}
            </HighContrastFlatknapp>
          </div>

          )
        : (
          <div>
            <UndertekstBold className='slideInFromLeft'>
              {t('label:duration-stay')}
            </UndertekstBold>
            <VerticalSeparatorDiv />
            <AlignStartRow
              className={classNames('slideInFromLeft')}
              style={{animationDelay: '0.1s'}}
            >
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-startdato-input'}
                  feil={validation[namespace + '-startdato']}
                  id={'c-' + namespace + '-startdato-input'}
                  label={t('label:start-date')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onStartDatoChange(e.target.value)}
                  placeholder={t('el:placeholder-date-default')}
                  value={_newStartDato}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-sluttdato-input'}
                  feil={validation[namespace + '-sluttdato']}
                  id={'c-' + namespace + '-sluttdato-input'}
                  label={t('label:end-date')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSluttDatoChange(e.target.value)}
                  placeholder={t('el:placeholder-date-default')}
                  value={_newSluttDato}
                />
              </Column>
              <Column/>
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow
              className={classNames('slideInFromLeft')}
              style={{animationDelay: '0.2s'}}
            >
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-sender-input'}
                  feil={validation[namespace + '-sender']}
                  id={'c-' + namespace + '-sender-input'}
                  label={t('label:moving-date-sender')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSenderChange(e.target.value)}
                  placeholder={t('el:placeholder-input-default')}
                  value={_newSender}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-receiver-input'}
                  feil={validation[namespace + '-receiver']}
                  id={'c-' + namespace + '-receiver-input'}
                  label={t('label:moving-date-receiver')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onReceiverChange(e.target.value)}
                  placeholder={t('el:placeholder-input-default')}
                  value={_newReceiver}
                />
              </Column>
              <Column/>
            </AlignStartRow>
          </div>
        )}
    </>
  )
}

export default ReasonToCome
