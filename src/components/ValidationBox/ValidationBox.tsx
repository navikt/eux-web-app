import { Validation } from 'declarations/app'
import _ from 'lodash'
import { BodyLong, ErrorSummary } from '@navikt/ds-react'
import React from 'react'

export interface ValidationBoxProps {
  validation: Validation,
  heading: string,
  eventName?: string
}

const ValidationBox: React.FC<ValidationBoxProps> = ({
  validation,
  heading,
  eventName = 'feillenke'
}: ValidationBoxProps): JSX.Element => {
  const isValid = _.find(_.values(validation), (e) => e !== undefined && e.feilmelding !== 'notnull') === undefined

  if (isValid) {
    return <div />
  }
  return (
    <ErrorSummary
      data-test-id='validationBox'
      heading={heading}
    >
      {Object.values(validation)
        .filter(v => v !== undefined)
        .filter(v => v?.feilmelding !== 'notnull')
        .map(v => ({
          feilmelding: v!.feilmelding,
          skjemaelementId: v!.skjemaelementId
        })).map(item => {
          return item.skjemaelementId
            ? (
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
              )
            : (
              <BodyLong> {item.feilmelding}</BodyLong>
              )
        })}
    </ErrorSummary>
  )
}

export default ValidationBox
