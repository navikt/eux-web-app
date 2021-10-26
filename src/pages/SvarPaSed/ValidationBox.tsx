import { State } from 'declarations/reducers'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import Lenke from 'nav-frontend-lenker'
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Column, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const ValidationBox = (): JSX.Element => {
  const { t } = useTranslation()

  const validation: Validation = useSelector<State, any>(state => state.validation.status)

  const isValid = _.find(_.values(validation), (e) => e !== undefined && e.feilmelding !== 'notnull') === undefined

  if (isValid) {
    return <div />
  }
  return (
    <div>
      <VerticalSeparatorDiv size='2' />
      <Row>
        <Column>
          <Feiloppsummering
            data-test-id='opprettsak__feiloppsummering'
            tittel={t('validation:feiloppsummering')}
            feil={Object.values(validation)
              .filter(v => v !== undefined)
              .filter(v => v?.feilmelding !== 'notnull')
              .map(v => ({
                feilmelding: v!.feilmelding,
                skjemaelementId: v!.skjemaelementId
              })) as Array<FeiloppsummeringFeil>}
            customFeilRender={(item: FeiloppsummeringFeil) => (
              <Lenke
                href={`#${item.skjemaelementId}`} onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(item.skjemaelementId)
                  if (element) {
                    element?.focus()
                    element?.scrollIntoView({
                      behavior: 'smooth'
                    })
                  } else {
                    document.dispatchEvent(new CustomEvent('feillenke', { detail: item }))
                  }
                }}
              >
                {item.feilmelding}
              </Lenke>
            )}
          />
        </Column>
        <HorizontalSeparatorDiv size='2' />
        <Column />
      </Row>
    </div>
  )
}

export default ValidationBox
