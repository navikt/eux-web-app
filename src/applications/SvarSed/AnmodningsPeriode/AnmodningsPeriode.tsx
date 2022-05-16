import { AddCircle } from '@navikt/ds-icons'
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
import DateInput from 'components/Forms/DateInput'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import TextArea from 'components/Forms/TextArea'
import { RepeatableRow, SpacedHr, TextAreaDiv } from 'components/StyledComponents'
import { F002Sed, FSed, Periode } from 'declarations/sed'
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
  validateAnmodningsPerioder,
  ValidationAnmodningsPeriodeProps,
  ValidationAnmodningsPerioderProps
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
  const getId = (p: Periode | null): string => p ? p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new'

  const [_newAnmodningsperiode, _setNewAnmodningsperiode] = useState<Periode | undefined>(undefined)
  const [_editAnmodningsperiode, _setEditAnmodningsperiode] = useState<Periode | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAnmodningsPeriodeProps>(validateAnmodningsPeriode, namespace)

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationAnmodningsPerioderProps>(validation, namespace, validateAnmodningsPerioder, {
      anmodningsperioder: (replySed as FSed).anmodningsperioder
    })
    dispatch(setValidation(newValidation))
  })

  const setAnmodningsperioder = (newPeriode: Periode, index: number) => {
    if (index < 0) {
      _setNewAnmodningsperiode(newPeriode)
      _resetValidation(namespace + '-perioder-stardato')
      _resetValidation(namespace + '-perioder-sluttdato')
      return
    }
    _setEditAnmodningsperiode(newPeriode)
    dispatch(resetValidation(namespace + '-perioder' + getIdx(index)))
  }

  const setInfoPresisering = (infoPresisering: string) => {
    dispatch(updateReplySed('krav.infoPresisering', infoPresisering.trim()))
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
    const [valid, newValidation] = performValidation<ValidationAnmodningsPeriodeProps>(
      validation, namespace + '-perioder', validateAnmodningsPeriode, {
        anmodningsperiode: _editAnmodningsperiode,
        index: _editIndex
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editAnmodningsperiode))
      onCloseEdit(namespace + '-perioder' + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
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
      dispatch(updateReplySed('anmodningsperioder', newPerioder))
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
                hideLabel={false}
                setPeriode={(p: Periode) => setAnmodningsperioder(p, index)}
                value={_periode}
              />
              )
            : (
              <Column>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato'],
                    sluttdato: _v[_namespace + '-sluttdato']
                  }}
                  periode={_periode}
                />
              </Column>
              )}
          <AlignEndColumn>
            <AddRemovePanel<Periode>
              item={periode}
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
                >
                  <AddCircle />
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
              <DateInput
                error={validation[namespace + '-kravMottattDato']?.feilmelding}
                namespace={namespace}
                key={(replySed as F002Sed).krav?.kravMottattDato ?? ''}
                id='kravMottattDato'
                label={t('label:krav-mottatt-dato')}
                onChanged={setKravMottattDato}
                value={(replySed as F002Sed).krav?.kravMottattDato}
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
              <Radio value='vi_bekrefter_leverte_opplysninger'>
                {t('label:info-confirm-information')}
              </Radio>
              <Radio value='gi_oss_punktvise_opplysninger'>
                {t('label:info-point-information')}
              </Radio>
              {(replySed as F002Sed).krav?.infoType === 'gi_oss_punktvise_opplysninger' && (
                <div>
                  <VerticalSeparatorDiv />
                  <TextAreaDiv>
                    <TextArea
                      error={validation[namespace + '-opplysninger']?.feilmelding}
                      id='opplysninger'
                      namespace={namespace}
                      label={t('label:opplysninger')}
                      maxLength={500}
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
