import { PileDiv } from '@navikt/hoykontrast'
import ErrorLabel from 'components/Forms/ErrorLabel'
import React from 'react'

export interface FormTextProps {
  error: string | undefined
  id: string
  children: any
}

const FormText = ({
  children,
  error,
  id
}: FormTextProps) => (
  <PileDiv tabIndex={0} id={id}>
    {children}
    <ErrorLabel error={error} />
  </PileDiv>
)

export default FormText
