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
  const namespace = 'familymanager-' + personID + '-personensstatus-avsenderlandet'
  const [_seeNewPeriodeInSender, setSeeNewPeriodeInSender] = useState<boolean>(false)
  const [_startDato, setStartDato] = useState<string>('')
  const [_sluttDato, setSluttDato] = useState<string>('')

  return (
    <>
      <Undertittel>
        {t('el:title-periods-in-sender-country')}
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
            {t('el:button-add-new-x', {
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
                  data-test-id={'c-' + namespace + '-startdato-date'}
                  feil={validation[namespace + '-startdato']?.feilmelding}
                  id={namespace + '-startdato-date'}
                  label={t('label:start-date')}
                  onChange={(e: any) => setStartDato(e.target.value)}
                  placeholder={t('el:placeholder-date-default')}
                  value={_startDato}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + '-sluttdato-date'}
                  feil={validation[namespace + '-sluttdato']?.feilmelding}
                  id={'c-' + namespace + '-sluttdato-date'}
                  label={t('label:end-date')}
                  onChange={(e: any) => setSluttDato(e.target.value)}
                  placeholder={t('el:placeholder-date-default')}
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
