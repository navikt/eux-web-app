import Tilsette from 'assets/icons/Tilsette'
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

const Avsenderlandet = ({
  personID,
  validation
}: any) => {
  const { t } = useTranslation()
  const [_seeNewPeriodeInSender, setSeeNewPeriodeInSender] = useState<boolean>(false)
  const [_currentMedlemsperiodeStartDato, setCurrentMedlemsperiodeStartDato] = useState<string>('')
  const [_currentMedlemsperiodeSluttDato, setCurrentMedlemsperiodeSluttDato] = useState<string>('')

  return (
    <>
      <Undertittel>
        {t('label:periode-in-sender')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {!_seeNewPeriodeInSender
        ? (
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => setSeeNewPeriodeInSender(true)}
          >
            <Tilsette />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('label:add-new-periode-in-sender')}
          </HighContrastFlatknapp>
          )
        : (
          <div>
            <UndertekstBold>
              {t('label:medlemperiode')}
            </UndertekstBold>
            <VerticalSeparatorDiv />
            <Row>
              <Column>
                <HighContrastInput
                  data-test-id={'c-familymanager-' + personID + '-personensstatus-medlemsperiode-startdato-input'}
                  feil={validation['person-' + personID + '-personensstatus-medlemsperiode-startdato']
                    ? validation['person-' + personID + '-personensstatus-medlemsperiode-startdato']!.feilmelding
                    : undefined}
                  id={'c-familymanager-' + personID + '-personensstatus-medlemsperiode-startdato-input'}
                  onChange={(e: any) => setCurrentMedlemsperiodeStartDato(e.target.value)}
                  value={_currentMedlemsperiodeStartDato}
                  label={t('label:startDate')}
                  placeholder={t('elements:placeholder-date-default')}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-familymanager-' + personID + '-personensstatus-medlemsperiode-sluttdato-input'}
                  feil={validation['person-' + personID + '-personensstatus-medlemsperiode-sluttdato']
                    ? validation['person-' + personID + '-personensstatus-medlemsperiode-sluttdato']!.feilmelding
                    : undefined}
                  id={'c-familymanager-' + personID + '-personensstatus-medlemsperiode-sluttdato-input'}
                  onChange={(e: any) => setCurrentMedlemsperiodeSluttDato(e.target.value)}
                  value={_currentMedlemsperiodeSluttDato}
                  label={t('label:endDate')}
                  placeholder={t('elements:placeholder-date-default')}
                />
              </Column>
            </Row>
          </div>
          )}
    </>
  )
}

export default Avsenderlandet
