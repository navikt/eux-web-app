import { TextField } from '@navikt/ds-react'
import { toDateFormat } from 'components/Forms/PeriodeInput'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {useAppDispatch} from "../../store";
import {setTextFieldDirty} from "../../actions/ui";

export interface DateInputProps {
  ariaLabel ?: string
  className ?: string
  error: string | null | undefined
  hideLabel ?: boolean
  id: string
  index?: number
  label: string
  namespace: string
  onChanged: (dato: string) => void
  required ?: boolean
  value: string | undefined
  uiFormat ?: string
  finalFormat ?: string
  disabled?: boolean
}

const DateInput = ({
  ariaLabel,
  className,
  error,
  id,
  label,
  hideLabel = false,
  namespace,
  onChanged,
  required = false,
  uiFormat = 'DD.MM.YYYY',
  finalFormat = 'YYYY-MM-DD',
  value,
  disabled
}: DateInputProps) => {
  const [_dato, _setDato] = useState<string>(() => toDateFormat(value, uiFormat!) ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const onDatoBlur = () => {
    const date = toDateFormat(_dato, finalFormat!)
    onChanged(date)
  }

  const doSetDirty = (isDirty: boolean) => {
    _setDirty(isDirty)
    dispatch(setTextFieldDirty(isDirty))
  }

  return (
    <TextField
      aria-invalid={!!error}
      aria-label={ariaLabel ?? label}
      className={className}
      data-testid={namespace + ''}
      error={error}
      id={namespace + '-' + id}
      hideLabel={hideLabel}
      label={(label ?? t('label:dato')) + ' (' + t('el:placeholder-date-default') + ')' + (required ? ' *' : '')}
      onBlur={() => {
        if (_dirty) {
          onDatoBlur()
          doSetDirty(false)
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        _setDato(e.target.value)
        doSetDirty(true)
      }}
      required={required}
      value={_dato}
      disabled={disabled}
    />
  )
}

export default DateInput
