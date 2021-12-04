
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
            borderColor: props.error ? 'var(--navds-color-text-error)' : 'var(--navds-text-field-color-border)',
            borderRadius: 'var(--navds-border-radius)',
            color: 'var(--navds-color-text-primary)',
            backgroundColor: isDisabled ? 'var(--navds-color-disabled)' : 'var(--navds-color-background)'
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: 'var(--navds-text-field-color-border)'
          }),
          menu: (styles: any) => ({
            ...styles,
            zIndex: 500
          }),
          menuList: (styles: any) => ({
            ...styles,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--navds-text-field-color-border)',
            backgroundColor: 'var(--navds-semantic-color-component-background-alternate)'
          }),
          option: (styles: any, { isDisabled, isFocused, isSelected }) => ({
            ...styles,
            color: isFocused
              ? 'var(--navds-color-text-inverse)'
              : isSelected
                ? 'var(--navds-color-text-inverse)'
                : 'var(--navds-color-text-primary)',
            backgroundColor: isFocused
              ? 'var(--navds-semantic-color-focus)'
              : isSelected
                ? 'var(--navds-semantic-color-interaction-primary-default)'
                : isDisabled
                  ? 'var(--navds-color-disabled)'
                  : 'var(--navds-semantic-color-component-background-alternate)'
          }),
          placeholder: (styles: any) => {
            return {
              ...styles,
              color: 'var(--navds-color-disabled)'
            }
          },
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
