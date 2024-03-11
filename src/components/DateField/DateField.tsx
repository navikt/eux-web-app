import React, {useEffect, useState} from 'react'

import { TextField } from '@navikt/ds-react'
import {useAppDispatch} from "../../store";
import {setTextFieldDirty} from "../../actions/ui";
import moment, {Moment} from "moment/moment";
import {useTranslation} from "react-i18next";

export interface DateFieldProps {
  ariaLabel ?: string
  className ?: string
  namespace: string
  error: string | null | undefined
  id: string
  label: string
  required ?: boolean
  uiFormat ?: string
  finalFormat ?: string
  onChanged: (dato: string) => void
  dateValue: string | undefined
  resetError?: boolean
  hideLabel?: boolean
}

const parseDate = (date: string | undefined): Moment | undefined => {
  if (!date || date === '') return undefined
  let newDate: Moment
  if (date.match(/\d{2}[.]\d{2}[.]\d{4}/)) {
    newDate = moment(date, 'DD.MM.YYYY')
  } else if (date.match(/\d{2}[.]\d{2}[.]\d{2}/)) {
    newDate = moment(date, 'DD.MM.YY')
  } else if (date.match(/\d{4}-\d{2}-\d{2}/)) {
    newDate = moment(date, 'YYYY-MM-DD')
  } else if (date.match(/^\d{6}$/)) {
    newDate = moment(date, 'DDMMYY')
  } else if (date.match(/^\d{8}$/)) {
    newDate = moment(date, 'DDMMYYYY')
  } else {
    return undefined
  }
  return newDate
}

export const isDateValidFormat = (date: string | undefined): boolean => {
  return !date ||
    moment(date, "YYYY-MM-DD", true).isValid() ||
    moment(date, "DD.MM.YYYY", true).isValid() ||
    moment(date, "DD.MM.YY", true).isValid() ||
    moment(date, "DDMMYY", true).isValid();
}

export const toDateFormat = (date: string | undefined, format: string): string => {
  const newDate = parseDate(date?.trim())
  if (!newDate) { return '' }
  return newDate.isValid() ? newDate!.format(format) : ''
}

const DateField = ({
  ariaLabel,
  className,
  namespace,
  error,
  id,
  label,
  required = false,
  onChanged,
  dateValue,
  uiFormat = 'DD.MM.YYYY',
  finalFormat = 'YYYY-MM-DD',
  resetError,
  hideLabel = false,

}: DateFieldProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [_dato, _setDato] = useState<string>(() => isDateValidFormat(dateValue) ? toDateFormat(dateValue, uiFormat!) : dateValue ? dateValue : '')
  const [_error, _setError] = useState<string | undefined>(() => undefined)
  const [_blurred, _setBlurred] = useState<boolean>(() => false)


  useEffect(() => {
    if(isDateValidFormat(dateValue)){
      _setError(undefined)
      _setDato(toDateFormat(dateValue, uiFormat!))
    } else {
      _setError(t('validation:invalidDateFormat'))
      dateValue ? _setDato(dateValue) : ''
    }
  }, [dateValue, _blurred])

  useEffect(() => {
    if(_error){
      _setDato("")
      _setError(undefined)
    }
  }, [resetError])

  const onDateBlur = () => {
    if(isDateValidFormat(_dato)){
      _setError(undefined)
      const date = toDateFormat(_dato, finalFormat!)
      onChanged(date)
      dispatch(setTextFieldDirty(false))
    } else {
      _setError(t('validation:invalidDateFormat'))
      onChanged(_dato)
    }
    _setBlurred(!_blurred)
  }

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    _setDato(e.target.value)
    dispatch(setTextFieldDirty(true))
  }

  return (
    <TextField
      aria-invalid={!!error}
      aria-label={ariaLabel ?? label}
      className={className}
      data-testid={namespace + ''}
      id={namespace + '-' + id}
      error={error || _error}
      label={(label ?? t('label:dato')) + ' (' + t('el:placeholder-date-default') + ')' + (required ? ' *' : '')}
      required={required}
      onBlur={onDateBlur}
      onChange={onDateChange}
      value={_dato}
      hideLabel={hideLabel}
    />
  )
}

export default DateField
