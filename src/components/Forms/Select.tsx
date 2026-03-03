
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
      className={classNames({ 'aksel-select--error': !!props.error })}
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
            borderColor: props.error ? 'var(--ax-bg-danger-strong)' : 'var(--ax-border-neutral)',
            borderRadius: '4px',
            color: 'var(--ax-text-neutral)',
            backgroundColor: isDisabled ? 'var(--ax-bg-neutral-soft)' : 'var(--ax-bg-default)'
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: 'var(--ax-border-neutral)'
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
            borderColor: 'var(--ax-border-neutral)',
            backgroundColor: 'var(--ax-bg-neutral-soft)'
          }),
          option: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
            ...styles,
            color: isFocused
              ? 'var(--ax-text-neutral-contrast)'
              : isSelected
                ? 'var(--ax-text-neutral-contrast)'
                : 'var(--ax-text-neutral)',
            backgroundColor: isFocused
              ? 'var(--ax-border-focus)'
              : isSelected
                ? 'var(--ax-bg-accent-strong)'
                : isDisabled
                  ? 'var(--ax-bg-neutral-soft)'
                  : 'var(--ax-bg-default)'
          }),
          singleValue: (styles: any) => ({
            ...styles,
            color: 'var(--ax-text-neutral)'
          })
        }}
        {...props}
      />
      {props.error && (
        <label role='alert' aria-live='assertive' className='aksel-error-message aksel-label'>
          {props.error}
        </label>
      )}
    </div>
  )
}

export default Select
