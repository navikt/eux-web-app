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

const Avsenderlandet = ({
  personID,
  validation
}: any) => {
  const { t } = useTranslation()
  const namespace = 'familymanager-' + personID + '-personensstatus-medlemsperiode'
  const [_seeNewPeriodeInSender, setSeeNewPeriodeInSender] = useState<boolean>(false)
  const [_startDato, setStartDato] = useState<string>('')
  const [_sluttDato, setSluttDato] = useState<string>('')

  return (
    <>
      <Undertittel>
        {t('ui:title-periods-in-sender-country')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {!_seeNewPeriodeInSender
        ? (
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => setSeeNewPeriodeInSender(true)}
          >
            <Add />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('elements:button-add-new-x', {
              x: t('label:period-in-sender-country').toLowerCase()
            })}
          </HighContrastFlatknapp>
          )
        : (
          <div className='slideInFromLeft'>
            <UndertekstBold>
              {t('label:medlemsperiode')}
            </UndertekstBold>
            <VerticalSeparatorDiv />
            <Row>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-startdato-input'}
                  feil={validation[namespace + '-startdato']?.feilmelding}
                  id={namespace + '-startdato-input'}
                  label={t('label:start-date')}
                  onChange={(e: any) => setStartDato(e.target.value)}
                  placeholder={t('elements:placeholder-date-default')}
                  value={_startDato}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-sluttdato-input'}
                  feil={validation[namespace + '-sluttdato']?.feilmelding}
                  id={'c-' + namespace + '-sluttdato-input'}
                  label={t('label:end-date')}
                  onChange={(e: any) => setSluttDato(e.target.value)}
                  placeholder={t('elements:placeholder-date-default')}
                  value={_sluttDato}
                />
              </Column>
              <Column />
            </Row>
          </div>
        )}
    </>
  )
}

export default Avsenderlandet
