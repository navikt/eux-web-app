import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { Currency } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation, setValidation } from 'actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { RepeatableRow } from 'components/StyledComponents'
import { Inntekt } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateInntekt, ValidationInntektProps } from './validation'

const Inntekter: React.FC<any> = ({
  inntekter,
  onInntekterChanged,
  parentNamespace,
  validation,
  personName
}:any): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-inntekt`
  const getId = (inntekt: Inntekt | null | undefined) => inntekt ? inntekt.type + '-' + inntekt.typeAnnen + '-' + inntekt.beloep : 'new'

  const [_newInntekt, _setNewInntekt] = useState<Inntekt | undefined>(undefined)
  const [_editInntekt, _setEditInntekt] = useState<Inntekt | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationInntektProps>(validateInntekt, namespace)

  const inntektTypeOptions = [
    { label: t('el:option-inntekttype-nettoinntekt_under_ansettelsesforhold_eller_selvstendig_næringsvirksomhet'), value: 'nettoinntekt_under_ansettelsesforhold_eller_selvstendig_næringsvirksomhet' },
    { label: t('el:option-inntekttype-bruttoinntekt_under_ansettelsesforhold_eller_selvstendig_næringsvirksomhet'), value: 'bruttoinntekt_under_ansettelsesforhold_eller_selvstendig_næringsvirksomhet' },
    { label: t('el:option-inntekttype-en_enkelt_utbetaling'), value: 'en_enkelt_utbetaling' },
    { label: t('el:option-inntekttype-overtidsgodtgjørelse'), value: 'overtidsgodtgjørelse' },
    { label: t('el:option-inntekttype-vederlag_for_ferie_som_ikke_er_tatt_ut'), value: 'vederlag_for_ferie_som_ikke_er_tatt_ut' },
    { label: t('el:option-inntekttype-annet_vederlag'), value: 'annet_vederlag' }
  ]

  const onTypeChanged = (type: string, index: number) => {
    if (index < 0) {
      _setNewInntekt({
        ..._newInntekt,
        type: type.trim()
      } as Inntekt)
      _resetValidation(namespace + '-type')
      return
    }
    _setEditInntekt({
      ..._editInntekt,
      type: type.trim()
    } as Inntekt)
    dispatch(resetValidation(namespace + getIdx(index) + '-type'))
  }

  const onTypeAnnenChanged = (typeAnnen: string, index: number) => {
    if (index < 0) {
      _setNewInntekt({
        ..._newInntekt,
        typeAnnen: typeAnnen.trim()
      } as Inntekt)
      _resetValidation(namespace + '-typeAnnen')
      return
    }
    _setEditInntekt({
      ..._editInntekt,
      typeAnnen: typeAnnen.trim()
    } as Inntekt)
    dispatch(resetValidation(namespace + getIdx(index) + '-typeAnnen'))
  }

  const setBeløp = (newBeløp: string, index: number) => {
    const beloep = parseFloat(newBeløp.trim().replace(",", ".")).toFixed(2)
    if (index < 0) {
      _setNewInntekt({
        ..._newInntekt,
        beloep: beloep,
        valuta: _.isNil(_newInntekt?.valuta) ? 'NOK' : _newInntekt?.valuta
      } as Inntekt)
      _resetValidation([namespace + '-beloep', namespace + '-valuta'])
      return
    }
    _setEditInntekt({
      ..._editInntekt,
      beloep: beloep,
      valuta: _.isNil(_editInntekt?.valuta) ? 'NOK' : _editInntekt?.valuta
    } as Inntekt)
    dispatch(resetValidation([namespace + getIdx(index) + '-beloep', namespace + getIdx(index) + '-valuta']))
  }

  const setValuta = (newValuta: Currency, index: number) => {
    if (index < 0) {
      _setNewInntekt({
        ..._newInntekt,
        valuta: newValuta.value
      } as Inntekt)
      _resetValidation(namespace + '-valuta')
      return
    }
    _setEditInntekt({
      ..._editInntekt,
      valuta: newValuta.value
    } as Inntekt)
    dispatch(resetValidation(namespace + getIdx(index) + '-valuta'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditInntekt(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewInntekt(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (i: Inntekt, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditInntekt(i)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationInntektProps>(
      clonedValidation, namespace, validateInntekt, {
        inntekt: _editInntekt,
        index: _editIndex,
        personName
      })
    if (!!_editInntekt && !hasErrors) {
      const newInntekter: Array<Inntekt> = _.cloneDeep(inntekter) as Array<Inntekt>
      newInntekter[_editIndex!] = _editInntekt
      onInntekterChanged(newInntekter)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removed: Inntekt) => {
    const newInntekter: Array<Inntekt> = _.reject(inntekter, (i: Inntekt) => _.isEqual(removed, i))
    onInntekterChanged(newInntekter)
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      inntekt: _newInntekt,
      personName
    })

    if (!!_newInntekt && valid) {
      let newInntekter: Array<Inntekt> | undefined = _.cloneDeep(inntekter)
      if (_.isNil(newInntekter)) {
        newInntekter = []
      }
      newInntekter.push(_newInntekt)
      onInntekterChanged(newInntekter)
      onCloseNew()
    }
  }

  const renderRow = (inntekt: Inntekt | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _inntekt = index < 0 ? _newInntekt : (inEditMode ? _editInntekt : inntekt)

    const addremovepanel = (
      <AlignEndColumn>
        <AddRemovePanel<Inntekt>
          item={inntekt}
          marginTop={inEditMode}
          index={index}
          inEditMode={inEditMode}
          onRemove={onRemove}
          onAddNew={onAddNew}
          onCancelNew={onCloseNew}
          onStartEdit={onStartEdit}
          onConfirmEdit={onSaveEdit}
          onCancelEdit={() => onCloseEdit(_namespace)}
        />
      </AlignEndColumn>
    )

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(inntekt)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          {inEditMode
            ? (
              <>
                <Column>
                  <Select
                    closeMenuOnSelect
                    data-testid={_namespace + '-type'}
                    error={_v[_namespace + '-type']?.feilmelding}
                    id={_namespace + '-type'}
                    label={t('label:type')}
                    menuPortalTarget={document.body}
                    onChange={(e: any) => onTypeChanged(e.value, index)}
                    options={inntektTypeOptions}
                    required
                    value={_.find(inntektTypeOptions, b => b.value === _inntekt?.type)}
                    defaultValue={_.find(inntektTypeOptions, b => b.value === _inntekt?.type)}
                  />
                </Column>
                <Column>
                  <Input
                    error={_v[_namespace + '-beloep']?.feilmelding}
                    namespace={_namespace}
                    id='beloep'
                    label={t('label:beløp')}
                    onChanged={(beløp: string) => setBeløp(beløp, index)}
                    required
                    value={_inntekt?.beloep ? _inntekt?.beloep.replace('.', ',') : undefined}
                  />
                </Column>
                <Column>
                  <CountrySelect
                    closeMenuOnSelect
                    ariaLabel={t('label:valuta')}
                    data-testid={namespace + '-valuta'}
                    error={_v[_namespace + '-valuta']?.feilmelding}
                    id={_namespace + '-valuta'}
                    label={t('label:valuta') + ' *'}
                    locale='nb'
                    menuPortalTarget={document.body}
                    onOptionSelected={(valuta: Currency) => setValuta(valuta, index)}
                    type='currency'
                    values={_inntekt?.valuta}
                  />
                </Column>
                {addremovepanel}
              </>
              )
            : (
              <>
                <Column flex='2'>
                  <PileDiv>
                    <FlexDiv>
                      {t('el:option-inntekttype-' + _inntekt?.type)}
                      {_inntekt?.type === 'annet_vederlag' && (
                        <>
                          <HorizontalSeparatorDiv size='0.5' />
                          <FormText
                            error={_v[_namespace + '-typeAnnen']?.feilmelding}
                            id={_namespace + '-typeAnnen'}
                          >
                            <BodyLong>{_inntekt?.typeAnnen ? "(" + _inntekt?.typeAnnen + ")" : ""}</BodyLong>
                          </FormText>
                        </>
                      )}
                    </FlexDiv>
                    <FlexDiv>
                      <Label>{t('label:beløp') + ':'}</Label>
                      <HorizontalSeparatorDiv size='0.5' />
                      <FlexDiv>
                        <FormText
                          error={_v[_namespace + '-beloep']?.feilmelding}
                          id={_namespace + '-beloep'}
                        >
                          {_inntekt?.beloep ? _inntekt?.beloep.replace('.', ',') : '-'}
                        </FormText>
                        <HorizontalSeparatorDiv size='0.5' />
                        <FormText
                          error={_v[_namespace + '-valuta']?.feilmelding}
                          id={_namespace + '-valuta'}
                        >
                          {_inntekt?.valuta}
                        </FormText>
                      </FlexDiv>
                    </FlexDiv>
                  </PileDiv>
                </Column>
                {addremovepanel}
              </>
              )}
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            {inEditMode && (
              <Input
                ariaLabel={t('label:informasjon-om-vederlag')}
                error={_v[_namespace + '-typeAnnen']?.feilmelding}
                id='informasjonOmVederlag'
                label={t('label:informasjon-om-vederlag')}
                namespace={_namespace}
                onChanged={(typeAnnen: string) => onTypeAnnenChanged(typeAnnen, index)}
                value={_inntekt?.typeAnnen}
              />
            )}
          </Column>
          <Column />
        </AlignStartRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      {inntekter?.map(renderRow)}
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:inntekt').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Inntekter
