import { Validation } from 'declarations/types'
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

  const errors = Object.values(validation).filter(v => v !== undefined && v?.feilmelding !== 'error' && v?.feilmelding !== 'ok')

  if ( _.isEmpty(errors)) {
    return <div />
  }
  return (
    <ErrorSummary
      data-testid='validationBox'
      heading={heading}
    >
      {errors.map(item => (
        item!.skjemaelementId
          ? (
            <ErrorSummary.Item
              key={item!.skjemaelementId}
              href={`#${item!.skjemaelementId}`}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(item!.skjemaelementId)
                if (element) {
                  element?.focus()
                  element?.scrollIntoView({
                    behavior: 'smooth'
                  })
                } else {
                  document.dispatchEvent(new CustomEvent(eventName!, { detail: item }))
                }
              }}
            >
              {item!.feilmelding}
            </ErrorSummary.Item>
            )
          : (
            <BodyLong> {item!.feilmelding}</BodyLong>
            )
        ))}
    </ErrorSummary>
  )
}

export default ValidationBox
