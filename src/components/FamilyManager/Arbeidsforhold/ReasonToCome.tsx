import Add from 'assets/icons/Add'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const ReasonToCome = ({
  personID,
  validation
}: any) => {
  const { t } = useTranslation()
  const [_seeNewReasonToComing, setSeeNewReasonToComing] = useState<boolean>(false)
  const [_currentDurationStayStartDato, setCurrentDurationStayStartDato] = useState<string>('')
  const [_currentDurationStaySluttDato, setCurrentDurationStaySluttDato] = useState<string>('')
  const [_currentDurationStaySender, setCurrentDurationStaySender] = useState<string>('')
  const [_currentDurationStayReceiver, setCurrentDurationStayReceiver] = useState<string>('')

  return (
    <>
      <Undertittel>
        {t('label:reason-for-coming')}
      </Undertittel>
      <VerticalSeparatorDiv />

      {!_seeNewReasonToComing
        ? (
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => setSeeNewReasonToComing(true)}
          >
            <Add />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('label:add-new-reason-to-coming')}
          </HighContrastFlatknapp>
          )
        : (
          <div>
            <UndertekstBold>
              {t('label:duration-stay')}
            </UndertekstBold>
            <VerticalSeparatorDiv />
            <Row>
              <Column>
                <HighContrastInput
                  data-test-id={'c-familymanager-' + personID + '-personensstatus-durationstay-startdato-input'}
                  feil={validation['person-' + personID + '-personensstatus-durationstay-startdato']
                    ? validation['person-' + personID + '-personensstatus-durationstay-startdato']!.feilmelding
                    : undefined}
                  id={'c-familymanager-' + personID + '-personensstatus-durationstay-startdato-input'}
                  onChange={(e: any) => setCurrentDurationStayStartDato(e.target.value)}
                  value={_currentDurationStayStartDato}
                  label={t('label:startDate')}
                  placeholder={t('elements:placeholder-date-default')}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-familymanager-' + personID + '-personensstatus-durationStay-sluttdato-input'}
                  feil={validation['person-' + personID + '-personensstatus-durationStay-sluttdato']
                    ? validation['person-' + personID + '-personensstatus-durationStay-sluttdato']!.feilmelding
                    : undefined}
                  id={'c-familymanager-' + personID + '-personensstatus-durationStay-sluttdato-input'}
                  onChange={(e: any) => setCurrentDurationStaySluttDato(e.target.value)}
                  value={_currentDurationStaySluttDato}
                  label={t('label:endDate')}
                  placeholder={t('elements:placeholder-date-default')}
                />
              </Column>
            </Row>
            <VerticalSeparatorDiv />
            <Row>
              <Column>
                <HighContrastInput
                  data-test-id={'c-familymanager-' + personID + '-personensstatus-durationStay-startdato-input'}
                  feil={validation['person-' + personID + '-personensstatus-durationStay-startdato']
                    ? validation['person-' + personID + '-personensstatus-durationStay-startdato']!.feilmelding
                    : undefined}
                  id={'c-familymanager-' + personID + '-personensstatus-durationStay-startdato-input'}
                  onChange={(e: any) => setCurrentDurationStaySender(e.target.value)}
                  value={_currentDurationStaySender}
                  label={t('label:moving-date-sender')}
                  placeholder={t('elements:placeholder-date-default')}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-familymanager-' + personID + '-personensstatus-durationStay-sluttdato-input'}
                  feil={validation['person-' + personID + '-personensstatus-durationStay-sluttdato']
                    ? validation['person-' + personID + '-personensstatus-durationStay-sluttdato']!.feilmelding
                    : undefined}
                  id={'c-familymanager-' + personID + '-personensstatus-durationStay-sluttdato-input'}
                  onChange={(e: any) => setCurrentDurationStayReceiver(e.target.value)}
                  value={_currentDurationStayReceiver}
                  label={t('label:moving-date-receiver')}
                  placeholder={t('elements:placeholder-date-default')}
                />
              </Column>
            </Row>
          </div>
          )}
    </>
  )
}

export default ReasonToCome
