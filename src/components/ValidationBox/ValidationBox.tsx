import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorSummary } from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface ValidationBoxProps {
  validation: Validation,
  eventName?: string
}

const ValidationBox: React.FC<ValidationBoxProps> = ({
  validation,
  eventName = 'feillenke'
}: ValidationBoxProps): JSX.Element => {
  const { t } = useTranslation()

  const isValid = _.find(_.values(validation), (e) => e !== undefined && e.feilmelding !== 'notnull') === undefined

  if (isValid) {
    return <div />
  }
  return (
    <ErrorSummary
      data-test-id='validationBox'
      heading={t('validation:feiloppsummering')}
    >
      {Object.values(validation)
        .filter(v => v !== undefined)
        .filter(v => v?.feilmelding !== 'notnull')
        .map(v => ({
          feilmelding: v!.feilmelding,
          skjemaelementId: v!.skjemaelementId
        })).map(item => (
          <ErrorSummary.Item
            key={item.skjemaelementId}
            href={`#${item.skjemaelementId}`}
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById(item.skjemaelementId)
              if (element) {
                element?.focus()
                element?.scrollIntoView({
                  behavior: 'smooth'
                })
              } else {
                document.dispatchEvent(new CustomEvent(eventName, { detail: item }))
              }
            }}
          >
            {item.feilmelding}
          </ErrorSummary.Item>
        ))}
    </ErrorSummary>
  )
}

export default ValidationBox
