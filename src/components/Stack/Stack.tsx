import { AddCircle } from '@navikt/ds-icons'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import { MyTag } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import useAddRemove from 'hooks/useAddRemove'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { Heading, Button } from '@navikt/ds-react'
import { FlexCenterSpacedDiv, PileDiv, HorizontalSeparatorDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface StackProps {
  error: ErrorElement | undefined
  initialValues: any
  itemLabel: string
  namespace: string
  options: Array<Option>
  onChange: (options: any, action: 'add' | 'remove', item: string) => void
  selectLabel?: string
  title?: string
}

const Stack: React.FC<StackProps> = ({
  error,
  initialValues,
  itemLabel,
  namespace,
  options,
  onChange,
  selectLabel,
  title
}: StackProps) => {
  const { t } = useTranslation()

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<string>(_item => _item)
  const [_addItem, setAddItem] = useState<boolean>(false)
  const [_items, setItems] = useState<Array<string>>(initialValues || [])
  const [_newItem, setNewItem] = useState<Option | undefined>(undefined)
  const [_itemValues, setItemValues] = useState<Array<Option>>(_.filter(options, p => _items.indexOf(p.value) < 0))

  const saveChanges = (newFormaals: Array<string>, action: 'add' | 'remove', item: string) => {
    const newFormaalValues = _.filter(options, p => newFormaals.indexOf(p.value) < 0)
    setItems(newFormaals)
    setItemValues(newFormaalValues as Array<Option>)
    onChange(newFormaals, action, item)
  }
  const onRemove = (item: string) => {
    removeFromDeletion(item)
    const newItems : Array<string> = _.filter(_items, _f => _f !== item)
    saveChanges(newItems, 'remove', item)
  }

  const onAdd = () => {
    if (_newItem) {
      const newItems = _items.concat(_newItem.value.trim())
      saveChanges(newItems, 'add', _newItem.value.trim())
      setNewItem(undefined)
    }
  }

  return (
    <>
      {title && (
        <>
          <Heading size='small'>
            {title}
          </Heading>
          <VerticalSeparatorDiv />
        </>
      )}
      {_items
        .filter(i => i)
        ?.sort((a, b) => {
          const _a = _.find(options, _f => _f.value === a)?.label ?? ''
          const _b = _.find(options, _f => _f.value === b)?.label ?? ''
          return _a.localeCompare(_b)
        })
        ?.map((item: string) => (
          <FlexCenterSpacedDiv key={item}>
            <MyTag variant='info' data-border>
              {_.find(options, _f => _f.value === item)?.label}
            </MyTag>
            <AddRemovePanel
              candidateForDeletion={isInDeletion(item)}
              existingItem
              onBeginRemove={() => addToDeletion(item)}
              onConfirmRemove={() => onRemove(item)}
              onCancelRemove={() => removeFromDeletion(item)}
            />
          </FlexCenterSpacedDiv>
        )
        )}
      <VerticalSeparatorDiv />
      {!_addItem
        ? (
          <div>
            <Button
              variant='tertiary'
              onClick={() => setAddItem(!_addItem)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: itemLabel.toLowerCase() })}
            </Button>
          </div>
          )
        : (
          <FlexCenterSpacedDiv>
            <div style={{ flex: 2 }}>
              {selectLabel && (
                <>
                  <label className='skjemaelement-label'>
                    {selectLabel}
                  </label>
                  <VerticalSeparatorDiv size='0.5' />
                </>
              )}
              <Select
                data-testid={namespace}
                id={namespace}
                value={_newItem}
                menuPortalTarget={document.body}
                onChange={(e: unknown) => setNewItem(e as Option)}
                options={_itemValues}
              />
            </div>
            <HorizontalSeparatorDiv size='0.5' />
            <PileDiv>
              {selectLabel && <VerticalSeparatorDiv size='1.3' />}
              <FlexCenterSpacedDiv>
                <Button
                  variant='secondary'
                  onClick={onAdd}
                >
                  <AddCircle />
                  {t('el:button-add')}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
                <Button
                  variant='tertiary'
                  onClick={() => setAddItem(!_addItem)}
                >
                  {t('el:button-cancel')}
                </Button>
              </FlexCenterSpacedDiv>
            </PileDiv>
          </FlexCenterSpacedDiv>
          )}
      {error && (
        <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
          {error.feilmelding}
        </div>
      )}
    </>
  )
}

export default Stack
