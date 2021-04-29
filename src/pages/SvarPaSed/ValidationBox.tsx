import { Validation } from 'declarations/types'
import _ from 'lodash'
import Lenke from 'nav-frontend-lenker'
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Column, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface ValidationBoxProps {
  validation: Validation
}

const ValidationBox: React.FC<ValidationBoxProps> = ({
  validation
}: ValidationBoxProps): JSX.Element => {
  const { t } = useTranslation()

  const isValid = _.find(_.values(validation), (e) => e !== undefined) === undefined

  if (isValid) {
    return <div />
  }
  return (
    <div>
      <VerticalSeparatorDiv data-size='2' />
      <Row>
        <Column>
          <Feiloppsummering
            data-test-id='opprettsak__feiloppsummering'
            tittel={t('message:validation-feiloppsummering')}
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
                  const el = document.getElementById(item.skjemaelementId)
                  if (!el) {
                    document.dispatchEvent(new CustomEvent('feillenke', { detail: item }))
                  } else {
                    el?.scrollIntoView({
                      behavior: 'smooth'
                    })
                    el?.focus()
                  }
                }}
              >
                {item.feilmelding}
              </Lenke>
            )}
          />
        </Column>
        <HorizontalSeparatorDiv data-size='2' />
        <Column />
      </Row>
    </div>
  )
}

export default ValidationBox
