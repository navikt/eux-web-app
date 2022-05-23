import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignEndRow,
  AlignStartRow,
  Column,
  FlexDiv,
  FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse, Institusjon, Periode, PeriodeDagpenger } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validatePeriodeDagpenger,
  validatePerioderDagpenger,
  ValidatePerioderDagpengerProps,
  ValidationPeriodeDagpengerProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const PeriodeForDagpenger: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-${personID}-periodefordagpenger`
  const target = 'perioderDagpenger'
  const perioder: Array<PeriodeDagpenger> | undefined = _.get(replySed, target)
  const getId = (p: PeriodeDagpenger | null | undefined) => p ? p.periode?.startdato + '-' + p.institusjon?.id : 'new'

  const [_newPeriodeDagpenger, _setNewPeriodeDagpenger] = useState<PeriodeDagpenger | undefined>(undefined)
  const [_editPeriodeDagpenger, _setEditPeriodeDagpenger] = useState<PeriodeDagpenger | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPeriodeDagpengerProps>(validatePeriodeDagpenger, namespace)

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidatePerioderDagpengerProps>(
      validation, namespace, validatePerioderDagpenger, {
        perioderDagpenger: perioder,
        personName
      }
    )
    dispatch(setValidation(newValidation))
  })

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriodeDagpenger({
        ..._newPeriodeDagpenger,
        periode
      } as PeriodeDagpenger)
      _resetValidation(namespace + '-periode')
      return
    }
    _setEditPeriodeDagpenger({
      ..._editPeriodeDagpenger,
      periode
    } as PeriodeDagpenger)
    dispatch(resetValidation(namespace + getIdx(index) + '-periode'))
  }

  const setInstitutionId = (id: string, index: number) => {
    if (index < 0) {
      _setNewPeriodeDagpenger({
        ..._newPeriodeDagpenger,
        institusjon: {
          ..._newPeriodeDagpenger?.institusjon,
          id
        }
      } as PeriodeDagpenger)
      _resetValidation(namespace + '-institusjon-id')
      return
    }
    _setEditPeriodeDagpenger({
      ..._editPeriodeDagpenger,
      institusjon: {
        ..._editPeriodeDagpenger?.institusjon,
        id
      }
    } as PeriodeDagpenger)
    dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-id'))
  }

  const setInstitutionNavn = (navn: string, index: number) => {
    if (index < 0) {
      _setNewPeriodeDagpenger({
        ..._newPeriodeDagpenger,
        institusjon: {
          ..._newPeriodeDagpenger?.institusjon,
          navn
        }
      } as PeriodeDagpenger)
      _resetValidation(namespace + '-institusjon-navn')
      return
    }
    _setEditPeriodeDagpenger({
      ..._editPeriodeDagpenger,
      institusjon: {
        ..._editPeriodeDagpenger?.institusjon,
        navn
      }
    } as PeriodeDagpenger)
    dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-navn'))
  }

  const setInstitutionIdMangler = (newIdMangler: boolean, index: number) => {
    if (index < 0) {
      let newPeriodeDagpenger: PeriodeDagpenger | undefined = _.cloneDeep(_newPeriodeDagpenger)
      if (!newIdMangler) {
        newPeriodeDagpenger = {
          ...newPeriodeDagpenger,
          __cache: newPeriodeDagpenger?.institusjon?.idmangler,
          institusjon: {
            id: newPeriodeDagpenger?.institusjon.id,
            navn: newPeriodeDagpenger?.institusjon.navn
          } as Institusjon
        } as PeriodeDagpenger
      } else {
        newPeriodeDagpenger = {
          ...newPeriodeDagpenger,
          __cache: newPeriodeDagpenger?.institusjon?.idmangler,
          institusjon: {
            ...newPeriodeDagpenger?.institusjon,
            idmangler: newPeriodeDagpenger?.__cache ?? {}
          } as Institusjon
        } as PeriodeDagpenger
      }
      _setNewPeriodeDagpenger(newPeriodeDagpenger)
      _resetValidation(namespace + '-institusjon-idmangler')
      return
    }

    let editPeriodeDagpenger: PeriodeDagpenger | undefined = _.cloneDeep(_editPeriodeDagpenger)
    if (!newIdMangler) {
      editPeriodeDagpenger = {
        ...editPeriodeDagpenger,
        __cache: editPeriodeDagpenger?.institusjon?.idmangler,
        institusjon: {
          id: editPeriodeDagpenger?.institusjon.id,
          navn: editPeriodeDagpenger?.institusjon.navn
        } as Institusjon
      } as PeriodeDagpenger
    } else {
      editPeriodeDagpenger = {
        ...editPeriodeDagpenger,
        __cache: editPeriodeDagpenger?.institusjon?.idmangler,
        institusjon: {
          ...editPeriodeDagpenger?.institusjon,
          idmangler: editPeriodeDagpenger?.__cache ?? {}
        } as Institusjon
      } as PeriodeDagpenger
    }
    _setEditPeriodeDagpenger(editPeriodeDagpenger)
    dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler'))
  }

  const setInstitutionIdManglerNavn = (navn: string, index: number) => {
    if (index < 0) {
      _setNewPeriodeDagpenger({
        ..._newPeriodeDagpenger,
        institusjon: {
          ..._newPeriodeDagpenger?.institusjon,
          idmangler: {
            ..._newPeriodeDagpenger?.institusjon.idmangler,
            navn
          }
        }
      } as PeriodeDagpenger)
      _resetValidation(namespace + '-institusjon-idmangler-navn')
      return
    }
    _setEditPeriodeDagpenger({
      ..._editPeriodeDagpenger,
      institusjon: {
        ..._editPeriodeDagpenger?.institusjon,
        idmangler: {
          ..._newPeriodeDagpenger?.institusjon.idmangler,
          navn
        }
      }
    } as PeriodeDagpenger)
    dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler-navn'))
  }

  const setInstitutionIdManglerAdresse = (adresse: Adresse, index: number) => {
    if (index < 0) {
      _setNewPeriodeDagpenger({
        ..._newPeriodeDagpenger,
        institusjon: {
          ..._newPeriodeDagpenger?.institusjon,
          idmangler: {
            ..._newPeriodeDagpenger?.institusjon.idmangler,
            adresse
          }
        }
      } as PeriodeDagpenger)
      _resetValidation(namespace + '-institusjon-idmangler-adresse')
      return
    }
    _setEditPeriodeDagpenger({
      ..._editPeriodeDagpenger,
      institusjon: {
        ..._editPeriodeDagpenger?.institusjon,
        idmangler: {
          ..._newPeriodeDagpenger?.institusjon.idmangler,
          adresse
        }
      }
    } as PeriodeDagpenger)
    dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler-adresse'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPeriodeDagpenger(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPeriodeDagpenger(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (p: PeriodeDagpenger, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPeriodeDagpenger(p)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationPeriodeDagpengerProps>(
      validation, namespace, validatePeriodeDagpenger, {
        periodeDagpenger: _editPeriodeDagpenger,
        perioderDagpenger: perioder,
        index: _editIndex,
        personName
      })
    if (valid) {
      delete _editPeriodeDagpenger?.__cache
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPeriodeDagpenger))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removed: PeriodeDagpenger) => {
    const newPerioder: Array<PeriodeDagpenger> = _.reject(perioder,
      (p: PeriodeDagpenger) => _.isEqual(removed, p))
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderDagpenger' })
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periodeDagpenger: _newPeriodeDagpenger,
      perioderDagpenger: perioder,
      personName
    })
    if (!!_newPeriodeDagpenger && valid) {
      let newPerioderDagpenger: Array<PeriodeDagpenger> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderDagpenger)) {
        newPerioderDagpenger = []
      }
      delete _newPeriodeDagpenger.__cache
      newPerioderDagpenger.push(_newPeriodeDagpenger)
      dispatch(updateReplySed(target, newPerioderDagpenger))
      standardLogger('svarsed.editor.newPerioderDagpenger.add', { type: 'perioderDagpenger' })
      onCloseNew()
    }
  }

  const renderRow = (periodeDagpenger: PeriodeDagpenger | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periodeDagpenger = index < 0 ? _newPeriodeDagpenger : (inEditMode ? _editPeriodeDagpenger : periodeDagpenger)
    const idmangler = !!_periodeDagpenger && Object.prototype.hasOwnProperty.call(_periodeDagpenger, 'institusjon') && Object.prototype.hasOwnProperty.call(_periodeDagpenger.institusjon, 'idmangler')
    const institusjonKjent = !idmangler

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(periodeDagpenger)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignEndRow style={{ minHeight: '2.2rem' }}>
          {inEditMode
            ? (
              <PeriodeInput
                namespace={_namespace + '-periode'}
                hideLabel={false}
                error={{
                  startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                }}
                setPeriode={(p: Periode) => setPeriode(p, index)}
                value={_periodeDagpenger?.periode}
              />
              )
            : (
              <Column>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-periode-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-periode-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace}
                  periode={_periodeDagpenger?.periode}
                />
              </Column>
              )}
          <AlignEndColumn>
            <AddRemovePanel<PeriodeDagpenger>
              item={periodeDagpenger}
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
        </AlignEndRow>
        <VerticalSeparatorDiv />
        {inEditMode
          ? (
            <>
              <AlignStartRow>
                <Column>
                  <Input
                    error={_v[_namespace + '-institusjon-id']?.feilmelding}
                    namespace={_namespace}
                    id='institusjon-id'
                    label={t('label:institusjonens-id')}
                    onChanged={(institusjonsid: string) => setInstitutionId(institusjonsid, index)}
                    value={_periodeDagpenger?.institusjon?.id}
                  />
                </Column>
                <Column>
                  <Input
                    error={_v[_namespace + '-institusjon-navn']?.feilmelding}
                    namespace={_namespace}
                    id='institusjon-navn'
                    label={t('label:institusjonens-navn')}
                    onChanged={(institusjonsnavn: string) => setInstitutionNavn(institusjonsnavn, index)}
                    value={_periodeDagpenger?.institusjon?.navn}
                  />
                </Column>
                <Column />
              </AlignStartRow>
              <VerticalSeparatorDiv />
            </>
            )
          : (
            <AlignStartRow>
              <Column>
                <FlexDiv>
                  <Label>{t('label:institusjon') + ':'}</Label>
                  <HorizontalSeparatorDiv size='0.5' />
                  <FlexDiv>
                    <FormText
                      error={_v[_namespace + '-institusjon-id']?.feilmelding}
                      id={_namespace + '-institusjon-id'}
                    >
                      {_periodeDagpenger?.institusjon?.id}
                    </FormText>
                    <HorizontalSeparatorDiv size='0.5' />
                    -
                    <HorizontalSeparatorDiv size='0.5' />
                    <FormText
                      error={_v[_namespace + '-institusjon-navn']?.feilmelding}
                      id={_namespace + '-institusjon-navn'}
                    >
                      {_periodeDagpenger?.institusjon?.navn}
                    </FormText>
                  </FlexDiv>
                </FlexDiv>
              </Column>
            </AlignStartRow>
            )}
        {inEditMode
          ? (
            <AlignStartRow>
              <Column>
                <RadioPanelGroup
                  value={institusjonKjent ? 'ja' : 'nei'}
                  data-testid={_namespace + '-institusjon-idmangler'}
                  data-no-border
                  id={_namespace + '-institusjon-idmangler'}
                  error={_v[_namespace + '-institusjon-idmangler']}
                  legend={t('label:institusjonens-id-er-kjent') + ' *'}
                  name={_namespace + '-idmangler'}
                  onChange={(e: string) => setInstitutionIdMangler(e === 'nei', index)}
                >
                  <FlexRadioPanels>
                    <RadioPanel value='ja'>{t('label:ja')}</RadioPanel>
                    <RadioPanel value='nei'>{t('label:nei')}</RadioPanel>
                  </FlexRadioPanels>
                </RadioPanelGroup>
              </Column>
              <Column />
            </AlignStartRow>
            )
          : (
            <FlexDiv>
              <FormText
                error={_v[_namespace + '-institusjon-idmangler']?.feilmelding}
                id={_namespace + '-institusjon-idmangler'}
              >
                <FlexDiv>
                  <Label>{t('label:institusjonens-id-er-kjent') + ':'}</Label>
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('label:' + (institusjonKjent ? 'ja' : 'nei'))}
                </FlexDiv>
              </FormText>
              <HorizontalSeparatorDiv />
              {idmangler && (
                <FormText
                  error={_v[_namespace + '-institusjon-idmangler-navn']?.feilmelding}
                  id={_namespace + '-institusjon-idmangler-navn'}
                >
                  <FlexDiv>
                    <Label>{t('label:navn') + ':'}</Label>
                    <HorizontalSeparatorDiv size='0.5' />
                    {_periodeDagpenger?.institusjon.idmangler?.navn ?? '-'}
                  </FlexDiv>
                </FormText>
              )}
            </FlexDiv>
            )}
        <VerticalSeparatorDiv />
        {idmangler && (
          <>
            {inEditMode && (
              <AlignStartRow>
                <Column>
                  <Input
                    error={_v[_namespace + '-institusjon-idmangler-navn']?.feilmelding}
                    namespace={_namespace}
                    id='institusjon-idmangler-navn'
                    label={t('label:navn')}
                    onChanged={(navn: string) => setInstitutionIdManglerNavn(navn, index)}
                    value={_periodeDagpenger?.institusjon.idmangler?.navn}
                  />
                </Column>
                <Column />
              </AlignStartRow>
            )}
            <VerticalSeparatorDiv />
            {inEditMode
              ? (
                <AdresseForm
                  adresse={_periodeDagpenger?.institusjon.idmangler?.adresse}
                  onAdressChanged={(a) => setInstitutionIdManglerAdresse(a, index)}
                  namespace={_namespace + '-institusjon-idmangler-adresse'}
                  validation={_v}
                />
                )
              : (
                <AlignStartRow>
                  <Column flex='2'>
                    <AdresseBox adresse={_periodeDagpenger?.institusjon.idmangler?.adresse} seeType />
                  </Column>
                  <Column />
                </AlignStartRow>
                )}
          </>
        )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(perioder)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : perioder?.map(renderRow)}
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
    </>
  )
}

export default PeriodeForDagpenger
