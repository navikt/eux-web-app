import { BodyLong, Label } from '@navikt/ds-react'
import { HorizontalSeparatorDiv, Column, FlexCenterDiv, PileDiv } from '@navikt/hoykontrast'
import React from 'react'

const PeriodeText = ({
  periode,
  error
}: any) => {
  return (
    <Column>
      <FlexCenterDiv>
        <PileDiv>
          <BodyLong id={error?.startdato?.skjemaelementId}>
            {periode?.startdato}
          </BodyLong>
          {error?.startdato?.feilmelding && (
            <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
              {error.startdato.feilmelding}
            </Label>
          )}
        </PileDiv>
        <HorizontalSeparatorDiv />-
        <HorizontalSeparatorDiv />
        <PileDiv>
          <BodyLong id={error?.sluttdato?.skjemaelementId}>
            {periode?.sluttdato}
          </BodyLong>
          {error?.sluttdato?.feilmelding && (
            <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
              {error.sluttdato.feilmelding}
            </Label>
          )}
        </PileDiv>
      </FlexCenterDiv>
    </Column>
  )
}

export default PeriodeText
