import { TextField } from '@navikt/ds-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateFnrDnrNpid } from 'utils/fnrValidator'

export interface FnrTextFieldProps {
  id?: string
  label?: string
  hideLabel?: boolean
  value: string | undefined
  onChange: (raw: string) => void
  onValidFnr: (fnr: string | undefined) => void
  error?: string
}

const FnrTextField: React.FC<FnrTextFieldProps> = ({
  id = 'fnr',
  label,
  hideLabel = false,
  value,
  onChange,
  onValidFnr,
  error: externalError
}: FnrTextFieldProps): JSX.Element => {
  const { t } = useTranslation()
  const [_error, setError] = useState<string | undefined>(undefined)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    onValidFnr(undefined)
    setError(undefined)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const trimmed = e.target.value.trim()
    if (!trimmed) {
      onValidFnr(undefined)
      setError(undefined)
      return
    }
    const result = validateFnrDnrNpid(trimmed)
    if (result.status === 'valid') {
      onValidFnr(trimmed)
      setError(undefined)
    } else {
      onValidFnr(undefined)
      setError(t('validation:invalidFnr'))
    }
  }

  return (
    <TextField
      id={id}
      label={label ?? t('label:fnr')}
      hideLabel={hideLabel}
      error={externalError ?? _error}
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
    />
  )
}

export default FnrTextField
