import Add from 'assets/icons/Add'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import { Etikett, FlexCenterDiv, PileDiv } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import useAddRemove from 'hooks/useAddRemove'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema/lib/feiloppsummering'
import { Feilmelding, Undertittel } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, HighContrastKnapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface StackProps {
  feil: FeiloppsummeringFeil | undefined
  highContrast: boolean
  initialValues: any
  itemLabel: string
  namespace: string
  options: any
  onChange: (options: any) => void
  selectLabel?: string
  title?: string
}

const Stack: React.FC<StackProps> = ({
  feil,
  highContrast,
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
  const [_newItemIndex, setNewItemIndex] = useState<number | undefined>(undefined)
  const [_itemValues, setItemValues] = useState<Array<Option>>(_.filter(options, p => _items.indexOf(p.value) < 0))

  const saveChanges = (newFormaals: Array<string>) => {
    const newFormaalValues = _.filter(options, p => newFormaals.indexOf(p.value) < 0)
    setItems(newFormaals)
    setItemValues(newFormaalValues)
    onChange(newFormaals)
  }
  const onRemove = (item: string) => {
    removeFromDeletion(item)
    const newItems = _.filter(_items, _f => _f !== item)
    saveChanges(newItems)
  }

  const onAdd = () => {
    if (_newItem) {
      const newItems = _items.concat(_newItem.value.trim())
      setNewItemIndex(newItems.length - 1)
      saveChanges(newItems)
      setNewItem(undefined)
    }
  }

  return (
    <>
      {title && (
        <>
          <Undertittel>
        {title}
      </Undertittel>
          <VerticalSeparatorDiv />
          </>
      )}
      {_items && _items
        .sort((a, b) => a.localeCompare(b))
        .map((item: string, i: number) => (
          <FlexCenterDiv
            className='slideInFromLeft'
            style={{ animationDelay: i === _newItemIndex ? '0s' : (i * 0.1) + 's' }}
            key={item}
          >
            <Etikett data-border>
              {_.find(options, _f => _f.value === item)?.label}
            </Etikett>
            <AddRemovePanel
              candidateForDeletion={isInDeletion(item)}
              existingItem
              onBeginRemove={() => addToDeletion(item)}
              onConfirmRemove={() => onRemove(item)}
              onCancelRemove={() => removeFromDeletion(item)}
            />
          </FlexCenterDiv>
        )
      )}
      <VerticalSeparatorDiv />
      {!_addItem
        ? (
          <div className='slideInFromLeft'>
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setAddItem(!_addItem)}
            >
              <Add />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('el:button-add-new-x', { x: itemLabel.toLowerCase() })}
            </HighContrastFlatknapp>
          </div>
          )
        : (
          <FlexCenterDiv>
            <div style={{ flex: 2 }}>
              {selectLabel && (
                <>
                  <label className='skjemaelement-label'>
                    {selectLabel}
                  </label>
                  <VerticalSeparatorDiv data-size='0.5'/>
                </>
              )}
              <Select
                data-test-id={namespace}
                id={namespace}
                highContrast={highContrast}
                value={_newItem}
                menuPortalTarget={document.body}
                onChange={(option: Option) => setNewItem(option)}
                options={_itemValues}
              />
            </div>
            <HorizontalSeparatorDiv data-size='0.5' />
            <PileDiv>
              {selectLabel && <VerticalSeparatorDiv data-size='1.3'/>}
              <FlexCenterDiv>
                <HighContrastKnapp
                  mini
                  kompakt
                  onClick={onAdd}
                >
                  <Add />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('el:button-add')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv data-size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => setAddItem(!_addItem)}
                >
                  {t('el:button-cancel')}
                </HighContrastFlatknapp>
              </FlexCenterDiv>
            </PileDiv>
          </FlexCenterDiv>
        )}
      {feil && (
        <div role='alert' aria-live='assertive' className='feilmelding skjemaelement__feilmelding'>
          <Feilmelding>
            {feil.feilmelding}
          </Feilmelding>
        </div>
      )}
    </>
  )
}

export default Stack
