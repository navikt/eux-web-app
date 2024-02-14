import React, {useEffect, useState} from 'react'

import { TextField } from '@navikt/ds-react'
import {useAppDispatch} from "../../store";
import {setTextFieldDirty} from "../../actions/ui";
import moment, {Moment} from "moment/moment";

export interface DateFieldProps {
  error: string | null | undefined
  id: string
  label: string
  required ?: boolean
  uiFormat ?: string
  finalFormat ?: string
  onChanged: (dato: string) => void
  dateValue: string | undefined
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
  } else if (date.match(/\d{2}[/]\d{2}[/]\d{4}/)) {
    newDate = moment(date, 'DD/MM/YYYY')
  } else if (date.match(/\d{2}[/]\d{2}[/]\d{2}/)) {
    newDate = moment(date, 'DD/MM/YY')
  } else {
    newDate = moment(date)
  }
  return newDate
}

export const toDateFormat = (date: string | undefined, format: string): string => {
  const newDate = parseDate(date?.trim())
  if (!newDate) { return '' }
  return newDate.isValid() ? newDate!.format(format) : ''
}

const DateField = ({
  error,
  id,
  label,
  required = false,
  onChanged,
  dateValue,
  uiFormat = 'DD.MM.YYYY',
  finalFormat = 'YYYY-MM-DD',
}: DateFieldProps) => {
  const dispatch = useAppDispatch()
  const [_dato, _setDato] = useState<string>(() => toDateFormat(dateValue, uiFormat!) ?? '')

  useEffect(() => {
    _setDato(toDateFormat(dateValue, uiFormat!))
  }, [dateValue])

  const onDateBlur = () => {
    const date = toDateFormat(_dato, finalFormat!)
    onChanged(date)
    dispatch(setTextFieldDirty(false))
  }

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    _setDato(e.target.value)
    dispatch(setTextFieldDirty(true))
  }

  return (
    <TextField
      error={error}
      id={id}
      label={label}
      required={required}
      onBlur={onDateBlur}
      onChange={onDateChange}
      value={_dato}
    />
  )
}

export default DateField
