import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, HStack, Select, Spacer, Tag, Textarea, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import {MainFormProps, MainFormSelector} from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import {RepeatableBox, SpacedHr} from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import {AnnenInformasjonBarnet_V43, Periode, PeriodeMedGrunn} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodePeriodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validatePeriodeMedGrunn, ValidationPeriodeMedGrunnProps } from './validation'
import {RadioPanel} from "@navikt/hoykontrast";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface PerioderMedGrunnProps extends MainFormProps {
  onPerioderEdited?: () => void
}

const PerioderMedGrunn: React.FC<PerioderMedGrunnProps> = ({
  parentNamespace,
  parentTarget,
  personID,
  personName,
  replySed,
  updateReplySed,
  options
}:PerioderMedGrunnProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}`
  const target: string = `${personID}.${parentTarget}`
  const perioder: Array<PeriodeMedGrunn> | undefined = _.get(replySed, target)
  const getId = (p: PeriodeMedGrunn | null): string => p ? parentNamespace + '-' + p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType) : 'new'

  const [_newPeriodeMedGrunn, _setNewPeriodeMedGrunn] = useState<PeriodeMedGrunn | undefined>(undefined)
  const [_editPeriodeMedGrunn, _setEditPeriodeMedGrunn] = useState<PeriodeMedGrunn | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPeriodeMedGrunnProps>(validatePeriodeMedGrunn, namespace)

  const periodeType = options && options.periodeType ? options.periodeType : "withcheckbox"
  const requiredSluttDato = options && options.requiredSluttDato ? options.requiredSluttDato : false

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriodeMedGrunn({
        ..._newPeriodeMedGrunn,
        periode
      } as PeriodeMedGrunn)
      _resetValidation(namespace)
      return
    }
    _setEditPeriodeMedGrunn({
      ..._editPeriodeMedGrunn,
      periode
    } as PeriodeMedGrunn)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const setTypeGrunn = (typeGrunn: string, index: number) => {
    const annenGrunn = undefined

    if (index < 0) {
      _setNewPeriodeMedGrunn({
        ..._newPeriodeMedGrunn,
        typeGrunn,
        annenGrunn
      } as PeriodeMedGrunn)
      _resetValidation(namespace)
      return
    }
    _setEditPeriodeMedGrunn({
      ..._editPeriodeMedGrunn,
      typeGrunn,
      annenGrunn
    } as PeriodeMedGrunn)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const setAnnenGrunn = (annenGrunn: string, index: number) => {
    if (index < 0) {
      _setNewPeriodeMedGrunn({
        ..._newPeriodeMedGrunn,
        annenGrunn
      } as PeriodeMedGrunn)
      _resetValidation(namespace)
      return
    }
    _setEditPeriodeMedGrunn({
      ..._editPeriodeMedGrunn,
      annenGrunn
    } as PeriodeMedGrunn)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPeriodeMedGrunn(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPeriodeMedGrunn(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (periode: PeriodeMedGrunn, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPeriodeMedGrunn(periode)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationPeriodeMedGrunnProps>(
      clonedValidation, namespace, validatePeriodeMedGrunn, {
        periodeMedGrunn: _editPeriodeMedGrunn,
        perioder: perioder,
        index: _editIndex,
        personName
      })

    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPeriodeMedGrunn))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPeriode: PeriodeMedGrunn) => {
    const newPerioder: Array<PeriodeMedGrunn> = _.reject(perioder, (p: PeriodeMedGrunn) => _.isEqual(removedPeriode, p))
    dispatch(updateReplySed(target, newPerioder))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periodeMedGrunn: _newPeriodeMedGrunn,
      perioder: perioder,
      personName
    })

    console.log(_validation)
    if (!!_newPeriodeMedGrunn && valid) {
      let newPeriodeMedGrunn: Array<PeriodeMedGrunn> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPeriodeMedGrunn)) {
        newPeriodeMedGrunn = []
      }
      newPeriodeMedGrunn.push(_newPeriodeMedGrunn)
      newPeriodeMedGrunn.sort(periodePeriodeSort)
      dispatch(updateReplySed(target, newPeriodeMedGrunn))
      onCloseNew()
    }
  }

  const typeGrunnOptions = [
    { value: 'krav_ikke_framsatt', label: t('label:krav-ikke-framsatt') },
    { value: 'for_hoey_inntekt', label: t('label:for-hoy-inntekt') },
    { value: 'ingen_forsikringsperioder', label: t('label:ingen-forsikringsperioder') },
    { value: 'foreldreansvar_ikke_fastsatt', label: t('label:foreldreansvar-ikke-fastsatt') },
    { value: 'oppfyller_ikke_nasjonale_vilkaar', label: t('label:oppfyller-ikke-nasjonale-vilkaar') },
    { value: 'annet', label: t('label:annet') },
  ]

  const renderRow = (periodeMedGrunn: PeriodeMedGrunn | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _periodeMedGrunn = index < 0 ? _newPeriodeMedGrunn : (inEditMode ? _editPeriodeMedGrunn : periodeMedGrunn)

    return (
      <RepeatableBox
        padding="2"
        id={'repeatablerow-' + _namespace}
        key={getId(periodeMedGrunn)}
        className={classNames({
          new: index < 0,
          errorBorder: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <HStack gap="4" wrap={false} align="start">
          {inEditMode
            ? (
                <VStack gap="2">
                  <HStack gap="4" wrap={false} align="start">
                    <PeriodeInput
                      namespace={_namespace}
                      error={{
                        startdato: _v[_namespace + '-startdato']?.feilmelding,
                        sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                      }}
                      breakInTwo
                      hideLabel={false}
                      setPeriode={(p: Periode) => setPeriode(p, index)}
                      value={_periodeMedGrunn?.periode}
                      requiredSluttDato={requiredSluttDato}
                      periodeType={periodeType}
                    />
                    <div className="navds-button--small"/> {/* Prevent height flicker on hover */}
                    <Spacer/>
                    <AddRemovePanel<PeriodeMedGrunn>
                      item={periodeMedGrunn}
                      marginTop={false}
                      index={index}
                      inEditMode={inEditMode}
                      onRemove={onRemove}
                      onAddNew={onAddNew}
                      onCancelNew={onCloseNew}
                      onStartEdit={onStartEdit}
                      onConfirmEdit={onSaveEdit}
                      onCancelEdit={() => onCloseEdit(_namespace)}
                    />
                  </HStack>
                  <Select
                    id={_namespace + '-type-grunn'}
                    name={_namespace + '-type-grunn'}
                    error={_v[_namespace + '-type-grunn']?.feilmelding}
                    label={t('label:grunn')}
                    value={_periodeMedGrunn?.typeGrunn ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeGrunn(e.target.value, index)}
                  >
                    <option value="" key="">{t('el:placeholder-select-default')}</option>
                    {typeGrunnOptions.map((o) => {
                      return <option value={o.value} key={o.value}>{o.label}</option>
                    })}
                  </Select>
                  {_periodeMedGrunn?.typeGrunn === 'annet' &&
                    <Textarea
                      id={_namespace + '-annen-grunn'}
                      error={_v[_namespace + '-annen-grunn']?.feilmelding}
                      label={"Annen grunn"}
                      value={_periodeMedGrunn.annenGrunn ?? ''}
                      hideLabel={true}
                      maxLength={500}
                      resize={true}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnnenGrunn(e.target.value, index)}
                    />
                  }
                </VStack>
              )
            : (
              <VStack>
                <HStack gap="4" align="center">
                  <PeriodeText
                    error={{
                      startdato: _v[_namespace + '-startdato']?.feilmelding,
                      sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                    }}
                    namespace={_namespace}
                    periode={_periodeMedGrunn?.periode}
                  />
                  <Tag size="small" variant="info">{typeGrunnOptions.find((typeGrunn) => typeGrunn.value ==_periodeMedGrunn?.typeGrunn)?.label}</Tag>
                  <div className="navds-button--small"/> {/* Prevent height flicker on hover */}
                  <Spacer/>
                  <AddRemovePanel<PeriodeMedGrunn>
                    item={periodeMedGrunn}
                    marginTop={false}
                    index={index}
                    inEditMode={inEditMode}
                    onRemove={onRemove}
                    onAddNew={onAddNew}
                    onCancelNew={onCloseNew}
                    onStartEdit={onStartEdit}
                    onConfirmEdit={onSaveEdit}
                    onCancelEdit={() => onCloseEdit(_namespace)}
                  />
                </HStack>
                {_periodeMedGrunn?.typeGrunn === 'annet' &&
                  <Box padding="2">
                    <BodyLong size="small">
                      {_periodeMedGrunn.annenGrunn}
                    </BodyLong>
                  </Box>
                }
              </VStack>
            )
          }
          <Spacer/>
        </HStack>
      </RepeatableBox>
    )
  }

  return (
    <VStack gap="4">
      {_.isEmpty(perioder)
        ? (
          <Box>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </Box>
          )
        : perioder?.map(renderRow)}
      {_newForm
        ? renderRow(null, -1)
        : (
          <Box>
            <Button
              variant='tertiary'
              size={"small"}
              onClick={() => _setNewForm(true)}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
            </Button>
          </Box>
          )
      }
    </VStack>
  )
}

export default PerioderMedGrunn
