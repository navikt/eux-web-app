import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexRadioPanels,
  FlexStartDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { PensjonPeriode, PensjonsType, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodePeriodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateWithSubsidiesPeriode, ValidationWithSubsidiesProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const WithSubsidies: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-withsubsidies`
  const target: string = `${personID}.perioderMedPensjon`
  const perioderMedPensjon: Array<PensjonPeriode> | undefined = _.get(replySed, target)
  const getId = (p: PensjonPeriode | null): string => p ? p.pensjonstype + '-' + p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType) : 'new'

  const [_newPensjonPeriode, _setNewPensjonPeriode] = useState<PensjonPeriode | undefined>(undefined)
  const [_editPensjonPeriode, _setEditPensjonPeriode] = useState<PensjonPeriode | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationWithSubsidiesProps>(validateWithSubsidiesPeriode, namespace)

  const setPeriode = (periode: Periode, whatChanged: string, index: number) => {
    if (index < 0) {
      _setNewPensjonPeriode({
        ..._newPensjonPeriode,
        periode
      } as PensjonPeriode)
      _resetValidation(namespace + '-' + whatChanged)
      return
    }
    _setEditPensjonPeriode({
      ..._editPensjonPeriode,
      periode
    } as PensjonPeriode)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const setPensjonsType = (pensjonstype: string | undefined, index: number) => {
    if (pensjonstype) {
      if (index < 0) {
        _setNewPensjonPeriode({
          ..._newPensjonPeriode,
          pensjonstype
        } as PensjonPeriode)
        _resetValidation(namespace + '-pensjontype')
        return
      }
      _setEditPensjonPeriode({
        ..._editPensjonPeriode,
        pensjonstype
      } as PensjonPeriode)
      dispatch(resetValidation(namespace + getIdx(index) + '-pensjontype'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPensjonPeriode(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPensjonPeriode(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (periode: PensjonPeriode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPensjonPeriode(periode)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationWithSubsidiesProps>(
      validation, namespace, validateWithSubsidiesPeriode, {
        pensjonPeriode: _editPensjonPeriode,
        perioder: perioderMedPensjon,
        index: _editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPensjonPeriode))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removedPeriode: PensjonPeriode) => {
    const newPerioder: Array<PensjonPeriode> = _.reject(perioderMedPensjon, (p: PensjonPeriode) => _.isEqual(removedPeriode, p))
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderMedPensjon' })
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      pensjonPeriode: _newPensjonPeriode,
      perioder: perioderMedPensjon,
      personName
    })

    if (!!_newPensjonPeriode && valid) {
      let newPensjonPerioder: Array<PensjonPeriode> | undefined = _.cloneDeep(perioderMedPensjon)
      if (_.isNil(newPensjonPerioder)) {
        newPensjonPerioder = []
      }
      newPensjonPerioder.push(_newPensjonPeriode)
      newPensjonPerioder.sort(periodePeriodeSort)
      dispatch(updateReplySed(target, newPensjonPerioder))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderMedPensjon' })
      onCloseNew()
    }
  }

  const renderRow = (pensjonPeriode: PensjonPeriode | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _pensjonPeriode = index < 0 ? _newPensjonPeriode : (inEditMode ? _editPensjonPeriode : pensjonPeriode)

    const addremovepanel = (
      <AlignEndColumn>
        <AddRemovePanel2<PensjonPeriode>
          item={pensjonPeriode}
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
        key={getId(pensjonPeriode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        {inEditMode
          ? (
            <>
              <AlignStartRow>
                <PeriodeInput
                  namespace={_namespace}
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  breakInTwo
                  hideLabel={false}
                  setPeriode={(p: Periode, whatChanged: string) => setPeriode(p, whatChanged, index)}
                  value={_pensjonPeriode?.periode}
                />
                <AlignEndColumn>
                  {addremovepanel}
                </AlignEndColumn>
              </AlignStartRow>
              <VerticalSeparatorDiv size='0.5' />
              <AlignStartRow>
                <Column>
                  <RadioPanelGroup
                    value={_pensjonPeriode?.pensjonstype}
                    data-no-border
                    data-testid={_namespace + '-pensjonstype'}
                    error={_v[_namespace + '-pensjonstype']?.feilmelding}
                    id={_namespace + '-pensjonstype'}
                    legend=''
                    hideLabel
                    name={_namespace + '-pensjonstype'}
                    onChange={(newPensjonsType: PensjonsType) => setPensjonsType(newPensjonsType, index)}
                  >
                    <FlexRadioPanels>
                      <RadioPanel value='alderspensjon'>
                        {t('el:option-trygdeordning-alderspensjon')}
                      </RadioPanel>
                      <RadioPanel value='uførhet'>
                        {t('el:option-trygdeordning-uførhet')}
                      </RadioPanel>
                    </FlexRadioPanels>
                  </RadioPanelGroup>
                </Column>
                <Column />
              </AlignStartRow>
            </>
            )
          : (
            <AlignStartRow>
              <PeriodeText
                error={{
                  startdato: _v[_namespace + '-startdato'],
                  sluttdato: _v[_namespace + '-sluttdato']
                }}
                periode={_pensjonPeriode?.periode}
              />
              <Column>
                <FlexStartDiv>
                  <BodyLong>
                    {t('el:option-trygdeordning-' + pensjonPeriode?.pensjonstype)}
                  </BodyLong>
                </FlexStartDiv>
              </Column>
              <AlignEndColumn>
                {addremovepanel}
              </AlignEndColumn>
            </AlignStartRow>
            )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {t('label:periode-pensjon-avsenderlandet')}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(perioderMedPensjon)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : perioderMedPensjon?.map(renderRow)}
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
  )
}

export default WithSubsidies
