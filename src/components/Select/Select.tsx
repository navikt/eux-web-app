import { Option } from 'declarations/app'
import React from 'react'
import { Feilmelding } from 'nav-frontend-typografi'
import { theme, themeKeys, themeHighContrast } from 'nav-hoykontrast'
import classNames from 'classnames'
import ReactSelect, { Props } from 'react-select'

interface SelectProps extends Props<Option> {
  className?: string
  id: string
  label?: string
  feil?: string
  onChange: (e: any) => void
  highContrast: boolean
  value?: any
}

const Select: React.FC<SelectProps> = (props: SelectProps): JSX.Element => {
  const _theme = props.highContrast ? themeHighContrast : theme
  return (
    <>
      {props.label && <label className='skjemaelement__label'>{props.label}</label>}
      <ReactSelect
        inputId={props.id}
        className={classNames({ skjemaelement__feilmelding: !!props.feil })}
        isOptionDisabled={(option: any) => option.isDisabled}
        styles={{
          control: (styles: any) => ({
            ...styles,
            borderWidth: props.feil ? '2px' : _theme[themeKeys.MAIN_BORDER_WIDTH],
            borderColor: props.feil ? _theme[themeKeys.REDERROR] : _theme[themeKeys.MAIN_BORDER_COLOR],
            borderStyle: 'solid',
            borderRadius: _theme[themeKeys.MAIN_BORDER_RADIUS],
            color: _theme[themeKeys.MAIN_FONT_COLOR],
            backgroundColor: _theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]
          }),
          singleValue: (styles: any) => ({
            ...styles,
            color: _theme[themeKeys.MAIN_FONT_COLOR]
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: _theme[themeKeys.MAIN_BORDER_COLOR]
          }),
          menu: (styles: any) => ({
            ...styles,
            zIndex: 500
          }),
          menuList: (styles: any) => ({
            ...styles,
            borderWidth: _theme[themeKeys.MAIN_BORDER_WIDTH],
            borderColor:  _theme[themeKeys.MAIN_BORDER_COLOR],
            borderStyle: 'solid',
            backgroundColor: _theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]
          }),
          option: (styles: any, { isDisabled, isFocused, isSelected }) => ({
            ...styles,
            color: isFocused
              ? _theme[themeKeys.INVERTED_FONT_COLOR]
              : isSelected
                ? _theme[themeKeys.INVERTED_FONT_COLOR]
                : isDisabled
                  ? _theme[themeKeys.MAIN_DISABLED_COLOR]
                  : _theme[themeKeys.MAIN_FONT_COLOR],
            backgroundColor: isFocused
              ? _theme[themeKeys.MAIN_FOCUS_COLOR]
              : isSelected
                ? _theme[themeKeys.MAIN_INTERACTIVE_COLOR]
                : _theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]
          })
        }}
        {...props}
      />
      {props.feil && (
        <div role='alert' aria-live='assertive' className='feilmelding skjemaelement__feilmelding'>
          <Feilmelding>{props.feil}</Feilmelding>
        </div>
      )}
    </>
  )
}

export default Select
