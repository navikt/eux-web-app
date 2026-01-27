import ErrorLabel from 'components/Forms/ErrorLabel'
import React from 'react'
import {VStack} from "@navikt/ds-react";

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
  <VStack gap="4" tabIndex={0} id={id}>
    {children}
    <ErrorLabel error={error} />
  </VStack>
)

export default FormText
