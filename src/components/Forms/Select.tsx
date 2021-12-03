
import classNames from 'classnames'
import ReactSelect, { Props } from 'react-select'

interface SelectProps extends Props {
  error?: string
  label?: string | undefined
  'data-test-id'?: string
}

const Select: React.FC<SelectProps> = (props: SelectProps): JSX.Element => {
  return (
    <div data-test-id={props['data-test-id'] || props.id}>
      {props.label && (<label className='skjemaelement__label'>{props.label ?? ''}</label>)}
      <ReactSelect
        inputId={props.id}
        className={classNames({ skjemaelement__feilmelding: !!props.error })}
        isOptionDisabled={(option: any) => option.isDisabled}
        styles={{
          control: (styles: any, { isDisabled }) => ({
            ...styles,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: props.error ? 'var(--navds-color-text-error)' : 'var(--navds-color-border)',
            borderRadius: 'var(--navds-border-radius)',
            color: 'var(--navds-color-text-primary)',
            backgroundColor: isDisabled ? 'var(--navds-color-disabled)' : 'var(--navds-color-background)'
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: 'var(--navds-color-border)'
          }),
          menu: (styles: any) => ({
            ...styles,
            zIndex: 500
          }),
          menuList: (styles: any) => ({
            ...styles,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--navds-color-border)',
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
        <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
          {props.error}
        </div>
      )}
    </div>
  )
}

export default Select
