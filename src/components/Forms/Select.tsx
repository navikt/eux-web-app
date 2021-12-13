
import classNames from 'classnames'
import React from 'react'
import ReactSelect, { Props } from 'react-select'

interface SelectProps extends Props {
  error?: string
  label?: string | undefined
  style ?: any
  'data-test-id'?: string
}

const Select: React.FC<SelectProps> = (props: SelectProps): JSX.Element => {
  return (
    <div data-test-id={props['data-test-id'] || props.id} style={props.style}>
      {props.label && (<label className='navds-text-field__label navds-label'>{props.label ?? ''}</label>)}
      <ReactSelect
        placeholder=''
        inputId={props.id}
        className={classNames({ 'navds-error-message navds-error-message--medium': !!props.error })}
        isOptionDisabled={(option: any) => option.isDisabled}
        styles={{
          container: (styles: any) => ({
            ...styles,
            marginTop: '8px',
            minHeight: '48px'
          }),
          control: (styles: any, { isDisabled }) => ({
            ...styles,
            minHeight: '48px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: props.error ? 'var(--navds-select-color-border-error)' : 'var(--navds-select-color-border)',
            borderRadius: '4px',
            color: 'var(--navds-color-text-primary)',
            backgroundColor: isDisabled ? 'var(--navds-semantic-color-component-background-alternate)' : 'var(--navds-select-color-background)'
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: 'var(--navds-select-color-border)'
          }),
          menu: (styles: any) => ({
            ...styles,
            zIndex: 500
          }),
          menuList: (styles: any) => ({
            ...styles,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--navds-select-color-border)',
            backgroundColor: 'var(--navds-semantic-color-component-background-alternate)'
          }),
          option: (styles: any, { isDisabled, isFocused, isSelected }) => ({
            ...styles,
            color: isFocused
              ? 'var(--navds-semantic-color-text-inverted)'
              : isSelected
                ? 'var(--navds-semantic-color-text-inverted)'
                : 'var(--navds-semantic-color-text-primary)',
            backgroundColor: isFocused
              ? 'var(--navds-semantic-color-focus)'
              : isSelected
                ? 'var(--navds-semantic-color-interaction-primary)'
                : isDisabled
                  ? 'var(--navds-semantic-color-component-background-alternate)'
                  : 'var(--navds-select-color-background)'
          }),
          singleValue: (styles: any) => ({
            ...styles,
            color: 'var(--navds-color-text-primary)'
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
