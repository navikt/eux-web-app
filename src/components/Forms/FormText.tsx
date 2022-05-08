import { Label } from '@navikt/ds-react'
import { PileDiv } from '@navikt/hoykontrast'
import React from 'react'

const FormText = ({
  children,
  error
}: any) => (
  <PileDiv>
    <div id={error?.skjemaelementId}>
      {children}
    </div>
    {error?.feilmelding && (
      <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
        {error.feilmelding}
      </Label>
    )}
  </PileDiv>
)

export default FormText
