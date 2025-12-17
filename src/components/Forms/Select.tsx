
import { Label } from '@navikt/ds-react'
import classNames from 'classnames'
import React from 'react'
import ReactSelect, { Props } from 'react-select'

type SelectProps = Props & {
  id?: string
  error?: string
  label?: string
  hideLabel?: boolean
  noMarginTop?: boolean
  size?: 'medium' | 'small'
  required?: boolean
  style?: any
  'data-testid'?: string
}

const Select = (props: SelectProps): JSX.Element => {
  return (
    <div
      className={classNames({ 'navds-select--error': !!props.error })}
      data-testid={props['data-testid'] || props.id}
      style={props.style}
    >
      {props.label && !props.hideLabel && (<Label>{props.label ?? ''}{props.required && ' *'}</Label>)}
      <ReactSelect
        placeholder=''
        inputId={props.id}
        isOptionDisabled={(option: any) => option.isDisabled}
        styles={{
          container: (styles: any) => ({
            ...styles,
            marginTop: props.noMarginTop || props.hideLabel ? '0px' : '8px',
            minHeight: props.size === 'small' ? '35px' : '48px'
          }),
          control: (styles: any, { isDisabled }: any) => ({
            ...styles,
            minHeight: props.size === 'small' ? '35px' : '48px',
            borderWidth: props.error ? '3px' : '1px',
            borderStyle: 'solid',
            borderColor: props.error ? 'var(--a-surface-danger)' : 'var(--a-border-default)',
            borderRadius: '4px',
            color: 'var(--a-text-default)',
            backgroundColor: isDisabled ? 'var(--a-surface-subtle)' : 'var(--a-surface-default)'
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: 'var(--a-border-default)'
          }),
          menu: (styles: any) => ({
            ...styles,
            width: 'auto',
            zIndex: 500
          }),
          menuList: (styles: any) => ({
            ...styles,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--a-border-default)',
            backgroundColor: 'var(--a-surface-subtle)'
          }),
          option: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
            ...styles,
            color: isFocused
              ? 'var(--a-text-on-inverted)'
              : isSelected
                ? 'var(--a-text-on-inverted)'
                : 'var(--a-text-default)',
            backgroundColor: isFocused
              ? 'var(--a-border-focus)'
              : isSelected
                ? 'var(--a-surface-action)'
                : isDisabled
                  ? 'var(--a-surface-subtle)'
                  : 'var(--a-surface-default)'
          }),
          singleValue: (styles: any) => ({
            ...styles,
            color: 'var(--a-text-default)'
          })
        }}
        {...props}
      />
      {props.error && (
        <label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
          {props.error}
        </label>
      )}
    </div>
  )
}

export default Select
