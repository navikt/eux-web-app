import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { Inntekt, TelefonType } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Currency } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateInntekt, ValidationInntekterProps } from './validationInntekter'

const Inntekter: React.FC<any> = ({
  highContrast,
  inntekter,
  onInntekterChanged,
  parentNamespace,
  validation
}:any): JSX.Element => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const namespace = `${parentNamespace}-inntekt`

  const [_newType, _setNewType] = useState<string | undefined>(undefined)
  const [_newTypeAnnen, _setNewTypeAnnen] = useState<string | undefined>(undefined)
  const [_newBeløp, _setNewBeløp] = useState<string | undefined>(undefined)
  const [_newValuta, _setNewValuta] = useState<string | undefined>(undefined)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Inntekt>((it: Inntekt): string => it.type + '-' + it.beloep)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationInntekterProps>({}, validateInntekt)

  const onTypeChanged = (type: string, index: number) => {
    if (index < 0) {
      _setNewType(type.trim() as TelefonType)
      resetValidation(namespace + '-type')
    } else {
      const newInntekter: Array<Inntekt> = _.cloneDeep(inntekter)
      newInntekter[index].type = type.trim()
      onInntekterChanged(newInntekter)
      if (validation[namespace + getIdx(index) + '-type']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-type'))
      }
    }
  }

  const onTypeAnnenChanged = (newTypeAnnen: string, index: number) => {
    if (index < 0) {
      _setNewTypeAnnen(newTypeAnnen.trim())
      resetValidation(namespace + '-typeAnnen')
    } else {
      const newInntekter: Array<Inntekt> = _.cloneDeep(inntekter)
      newInntekter[index].typeAnnen = newTypeAnnen.trim()
      onInntekterChanged(newInntekter)
      if (validation[namespace + getIdx(index) + '-typeAnnen']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-typeAnnen'))
      }
    }
  }

  const setBeløp = (newBeløp: string, index: number) => {
    if (index < 0) {
      _setNewBeløp(newBeløp.trim())
      resetValidation(namespace + '-beloep')
    } else {
      const newInntekter: Array<Inntekt> = _.cloneDeep(inntekter)
      newInntekter[index].beloep = newBeløp.trim()
      onInntekterChanged(newInntekter)
      if (validation[namespace + '-beloep']) {
        dispatch(resetValidation(namespace + '-beloep'))
      }
    }
  }

  const setValuta = (newValuta: Currency, index: number) => {
    if (index < 0) {
      _setNewValuta(newValuta.value)
      resetValidation(namespace + '-valuta')
    } else {
      const newInntekter: Array<Inntekt> = _.cloneDeep(inntekter)
      newInntekter[index].valuta = newValuta?.value
      onInntekterChanged(newInntekter)
      if (validation[namespace + '-valuta']) {
        dispatch(resetValidation(namespace + '-valuta'))
      }
    }
  }

  const resetForm = () => {
    _setNewType(undefined)
    _setNewTypeAnnen(undefined)
    _setNewBeløp(undefined)
    _setNewValuta('NOK')
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemoved = (index: number) => {
    const newInntekter = _.cloneDeep(inntekter)
    const deletedInntekter: Array<Inntekt> = newInntekter.splice(index, 1)
    if (deletedInntekter && deletedInntekter.length > 0) {
      removeFromDeletion(deletedInntekter[0])
    }
    onInntekterChanged(newInntekter)
  }

  const onAdd = () => {
    const newInntekt: Inntekt = {
      type: _newType?.trim() as string,
      typeAnnen: _newTypeAnnen?.trim() as string,
      beloep: _newBeløp?.trim() as string,
      valuta: _newValuta as string
    }

    const valid: boolean = performValidation({
      inntekt: newInntekt,
      namespace: namespace
    })

    if (valid) {
      let newInntekter = _.cloneDeep(inntekter)
      if (_.isNil(newInntekter)) {
        newInntekter = []
      }
      newInntekter.push(newInntekt)
      onInntekterChanged(newInntekter)
      resetForm()
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0
      ? _validation[namespace + '-' + el]?.feilmelding
      : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (inntekt: Inntekt | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(inntekt)
    const idx = getIdx(index)
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
          <Column>
            <Input
              ariaLabel={t('label:type')}
              feil={getErrorFor(index, 'type')}
              key={namespace + idx + '-type-' + (index < 0 ? _newType : inntekt?.type ?? '')}
              id='type'
              label={t('label:type')}
              namespace={namespace + idx}
              onChanged={(type: string) => onTypeChanged(type, index)}
              required
              value={index < 0 ? _newType : inntekt?.type ?? ''}
            />
          </Column>
          <Column>
            <Input
              ariaLabel={t('label:typeAnnen')}
              feil={getErrorFor(index, 'typeAnnen')}
              key={namespace + idx + '-typeAnnen-' + (index < 0 ? _newTypeAnnen : inntekt?.typeAnnen ?? '')}
              id='typeAnnen'
              label={t('label:typeAnnen')}
              namespace={namespace + idx}
              onChanged={(typeAnnen: string) => onTypeAnnenChanged(typeAnnen, index)}
              required
              value={index < 0 ? _newTypeAnnen : inntekt?.typeAnnen ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'beloep')}
              namespace={namespace}
              key={namespace + idx + '-beloep-' + (index < 0 ? _newBeløp : inntekt?.beloep ?? '')}
              id='beloep'
              label={t('label:beløp') + ' *'}
              onChanged={(beløp: string) => setBeløp(beløp, index)}
              value={index < 0 ? _newBeløp : inntekt?.beloep ?? ''}
            />
          </Column>
          <Column>
            <CountrySelect
              key={namespace + '-valuta-' + (index < 0 ? _newValuta : inntekt?.valuta ?? '')}
              closeMenuOnSelect
              ariaLabel={t('label:valuta')}
              data-test-id={namespace + '-valuta'}
              error={getErrorFor(index, 'valuta')}
              highContrast={highContrast}
              id={namespace + '-valuta'}
              label={t('label:valuta') + ' *'}
              locale='nb'
              menuPortalTarget={document.body}
              onOptionSelected={(valuta: Currency) => setValuta(valuta, index)}
              type='currency'
              values={index < 0 ? _newValuta : inntekt?.valuta ?? ''}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(inntekt)}
              onConfirmRemove={() => onRemoved(index)}
              onCancelRemove={() => removeFromDeletion(inntekt)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:inntekter')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />

      {inntekter?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:inntekt').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
    </PaddedDiv>
  )
}

export default Inntekter
