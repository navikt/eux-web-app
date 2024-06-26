import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  PaddedDiv,
  PaddedHorizontallyDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector, mapState } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import TextArea from 'components/Forms/TextArea'
import DateField from "components/DateField/DateField";
import { RepeatableRow, SpacedHr, TextAreaDiv } from 'components/StyledComponents'
import {F001Sed, F002Sed, FSed, Periode} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { isFSed } from 'utils/sed'
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validateAnmodningsPeriode,
  validateAnmodningsPerioder, validateKrav,
  ValidationAnmodningsPeriodeProps,
  ValidationAnmodningsPerioderProps, ValidationKravProps
} from './validation'

const PeriodeFC: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace: string = `${parentNamespace}-anmodningsperiode`
  const target: string = 'anmodningsperioder'
  const getId = (p: Periode | null): string => p ? p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new-periode'

  const [_newAnmodningsperiode, _setNewAnmodningsperiode] = useState<Periode | undefined>(undefined)
  const [_editAnmodningsperiode, _setEditAnmodningsperiode] = useState<Periode | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAnmodningsPeriodeProps>(validateAnmodningsPeriode, namespace + '-perioder')

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAnmodningsPerioderProps>(
      clonedvalidation, namespace, validateAnmodningsPerioder, {
        anmodningsperioder: (replySed as FSed).anmodningsperioder
      }, true)

    performValidation<ValidationKravProps>(
      clonedvalidation, namespace, validateKrav, {
        krav: (replySed as F001Sed).krav
      }, true)


    dispatch(setValidation(clonedvalidation))
  })

  const setAnmodningsperioder = (newPeriode: Periode, index: number) => {
    if (index < 0) {
      _setNewAnmodningsperiode(newPeriode)
      _resetValidation([namespace + '-perioder-stardato', namespace + '-perioder-sluttdato'])
      return
    }
    _setEditAnmodningsperiode(newPeriode)
    dispatch(resetValidation(namespace + '-perioder' + getIdx(index)))
  }

  const setInfoPresisering = (infoPresisering: string | undefined) => {
    dispatch(updateReplySed('krav.infoPresisering', infoPresisering ? infoPresisering.trim() : undefined))
    if (validation[namespace + '-infoPresisering']) {
      dispatch(resetValidation(namespace + '-infoPresisering'))
    }
  }

  const setKravMottattDato = (kravDato: string) => {
    dispatch(updateReplySed('krav.kravMottattDato', kravDato.trim()))
    if (validation[namespace + '-kravMottattDato']) {
      dispatch(resetValidation(namespace + '-kravMottattDato'))
    }
  }
  const setKravType = (krav: string) => {
    dispatch(updateReplySed('krav.kravType', krav.trim()))
    if (validation[namespace + '-kravType']) {
      dispatch(resetValidation(namespace + '-kravType'))
    }
  }

  const setInfoType = (info: string) => {
    dispatch(updateReplySed('krav.infoType', info.trim()))
    if(info === "bekrefter_opplysninger"){
      setInfoPresisering(undefined)
    }
    if (validation[namespace + '-infoType']) {
      dispatch(resetValidation(namespace + '-infoType'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditAnmodningsperiode(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewAnmodningsperiode(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (periode: Periode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + '-perioder' + getIdx(_editIndex)))
    }
    _setEditAnmodningsperiode(periode)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationAnmodningsPeriodeProps>(
      clonedvalidation, namespace + '-perioder', validateAnmodningsPeriode, {
        anmodningsperiode: _editAnmodningsperiode,
        index: _editIndex
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editAnmodningsperiode))
      onCloseEdit(namespace + '-perioder' + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemove = (removedPeriode: Periode) => {
    const newAnmodningsperioder: Array<Periode> = _.reject((replySed as FSed).anmodningsperioder,
      (p: Periode) => _.isEqual(removedPeriode, p))
    dispatch(updateReplySed(target, newAnmodningsperioder))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      anmodningsperiode: _newAnmodningsperiode
    })
    if (!!_newAnmodningsperiode && valid) {
      let newPerioder: Array<Periode> = _.cloneDeep((replySed as FSed).anmodningsperioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder.push(_newAnmodningsperiode)
      dispatch(updateReplySed(target, newPerioder))
      onCloseNew()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const _namespace = namespace + '-perioder' + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periode = index < 0 ? _newAnmodningsperiode : (inEditMode ? _editAnmodningsperiode : periode)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          {inEditMode
            ? (
              <PeriodeInput
                namespace={_namespace}
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                breakInTwo
                hideLabel={index >= 0}
                setPeriode={(periode: Periode) => setAnmodningsperioder(periode, index)}
                value={_periode}
              />
              )
            : (
              <Column>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace}
                  periode={_periode}
                />
              </Column>
              )}
          <AlignEndColumn>
            <AddRemovePanel<Periode>
              item={periode}
              marginTop={index < 0}
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
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <VerticalSeparatorDiv />
      {isFSed(replySed) && (
        <>
          <PaddedHorizontallyDiv>
            <Heading size='small'>
              {t('label:anmodningsperioder')}
            </Heading>
          </PaddedHorizontallyDiv>
          <VerticalSeparatorDiv />
          {_.isEmpty((replySed as FSed)?.anmodningsperioder)
            ? (
              <PaddedHorizontallyDiv>
                <SpacedHr />
                <BodyLong>
                  {t('message:warning-no-periods')}
                </BodyLong>
                <SpacedHr />
              </PaddedHorizontallyDiv>
              )
            : (replySed as FSed)?.anmodningsperioder?.map(renderRow)}
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
                  {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
                </Button>
              </PaddedDiv>
              )}
          <VerticalSeparatorDiv />
        </>
      )}
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <Row>
          <Column>
            <div>
              <RadioGroup
                legend={t('label:type-krav')}
                data-testid={namespace + '-typeKrav'}
                error={validation[namespace + '-typeKrav']?.feilmelding}
                id={namespace + '-kravType'}
                onChange={(e: string | number | boolean) => setKravType(e as string)}
                value={(replySed as F002Sed).krav?.kravType}
              >
                <Radio value='nytt_krav'>
                  {t('label:kravType-nytt_krav')}
                </Radio>
                <Radio value='endrede_omstendigheter'>
                  {t('label:kravType-endrede_omstendigheter')}
                </Radio>
              </RadioGroup>
              <VerticalSeparatorDiv />
              <DateField
                error={validation[namespace + '-kravMottattDato']?.feilmelding}
                namespace={namespace}
                id='kravMottattDato'
                label={t('label:krav-mottatt-dato')}
                onChanged={setKravMottattDato}
                dateValue={(replySed as F002Sed).krav?.kravMottattDato}
              />
              <VerticalSeparatorDiv />
            </div>
          </Column>
          <Column>
            <RadioGroup
              legend={t('label:informasjon-om-søknaden')}
              data-testid={namespace + '-informasjon'}
              error={validation[namespace + '-informasjon']?.feilmelding}
              id={namespace + '-informasjon'}
              value={(replySed as F002Sed).krav?.infoType}
              onChange={(e: string | number | boolean) => setInfoType(e as string)}
            >
              <Radio value='bekrefter_opplysninger'>
                {t('label:info-confirm-information')}
              </Radio>
              <Radio value='gi_oss_opplysninger'>
                {t('label:info-point-information')}
              </Radio>
              {(replySed as F002Sed).krav?.infoType === 'gi_oss_opplysninger' && (
                <div>
                  <VerticalSeparatorDiv />
                  <TextAreaDiv>
                    <TextArea
                      error={validation[namespace + '-opplysninger']?.feilmelding}
                      id='opplysninger'
                      namespace={namespace}
                      label={t('label:hvilke-opplysninger')}
                      maxLength={255}
                      onChanged={setInfoPresisering}
                      value={(replySed as F002Sed).krav?.infoPresisering ?? ''}
                    />
                  </TextAreaDiv>
                </div>
              )}
            </RadioGroup>
          </Column>
        </Row>
      </PaddedDiv>
    </>
  )
}

export default PeriodeFC
