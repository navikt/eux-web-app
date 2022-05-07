import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Heading, Tag } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  FlexRadioPanels,
  PaddedDiv,
  PaddedHorizontallyDiv,
  PileDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { ForsikringPeriode, Periode, PeriodeSort, Person } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getNSIdx, readNSIdx } from 'utils/namespace'
import { validateDekkedePeriode, ValidationDekkedePeriodeProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const DekkedePerioder: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = `${personID}`
  const person: Person = _.get(replySed, target)

  const namespace = `${parentNamespace}-${personID}-trygdeordning-dekkede`
  const getId = (p: Periode | null) => p ? p.__type + '[' + p.__index + ']' : 'new-periode'

  const [_newType, _setNewType] = useState<string | undefined>(undefined)
  const [_allPeriods, _setAllPeriods] = useState<Array<ForsikringPeriode>>([])
  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)

  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_sort, _setSort] = useState<PeriodeSort>('time')
  const [_editing, _setEditing] = useState<Array<string>>([])
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationDekkedePeriodeProps>(validateDekkedePeriode, namespace)

  const periodeSort = (a: Periode, b: Periode) => moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1

  useEffect(() => {
    const periodes: Array<Periode> = []
    person?.perioderMedITrygdeordning?.forEach((p: Periode, i: number) => periodes.push({ ...p, __index: i, __type: 'perioderMedITrygdeordning' }))
    person?.perioderUtenforTrygdeordning?.forEach((p: Periode, i: number) => periodes.push({ ...p, __index: i, __type: 'perioderUtenforTrygdeordning' }))
    _setAllPeriods(periodes.sort(periodeSort))
  }, [replySed])

  const setType = (newType: string, oldType: string, index: number) => {
    if (index < 0) {
      _setNewType(newType)
      _resetValidation(namespace + '-type')
    } else {
      const _newEditing: Array<string> = []

      // we have to clone the get result, or we can get errors by sorting arrays that are still tied to state
      let oldPeriods: Array<Periode> = _.cloneDeep(_.get(person, oldType))
      let newPeriods = _.cloneDeep(_.get(person, newType))

      // we have to track the curently editing peroids, as they will switch from one list to another, thus type/index change
      _editing.forEach((editIndex) => {
        const [t, i] = readNSIdx(editIndex)
        if (t === 'perioderMedITrygdeordning') {
          oldPeriods[i].__edit = true
        }
        if (t === 'perioderUtenforTrygdeordning') {
          newPeriods[i].__edit = true
        }
      })

      // oldPeriods is already sorted, no need to re-sort
      const switchingPeriod: Array<Periode> = oldPeriods.splice(index, 1)
      newPeriods.push(switchingPeriod[0])
      newPeriods = newPeriods.sort(periodeSort)

      // restore editing, remove editing flag
      oldPeriods = oldPeriods.map((p: Periode, i: number) => {
        if (Object.prototype.hasOwnProperty.call(p, '__edit')) {
          if (p.__edit) {
            _newEditing.push(getNSIdx('perioderMedITrygdeordning', i))
          }
          delete p.__edit
        }
        return p
      })

      // restore editing, remove editing flag
      newPeriods = newPeriods.map((p: Periode, i: number) => {
        if (Object.prototype.hasOwnProperty.call(p, '__edit')) {
          if (p.__edit) {
            _newEditing.push(getNSIdx('perioderUtenforTrygdeordning', i))
          }
          delete p.__edit
        }
        return p
      })

      const newPerson = _.cloneDeep(person)
      _.set(newPerson, oldType, oldPeriods)
      _.set(newPerson, newType, newPeriods)

      if (validation[namespace + getNSIdx(oldType, index) + '-type']) {
        dispatch(resetValidation(namespace + getNSIdx(oldType, index) + '-type'))
      }

      dispatch(updateReplySed(target, newPerson))
      _setEditing(_newEditing)
    }
  }

  const setPeriode = (periode: Periode, whatChanged: string, type: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-' + whatChanged)
    } else {
      delete periode.__type
      delete periode.__index
      delete periode.__edit
      dispatch(updateReplySed(`${type}[${index}]`, periode))
      if (validation[namespace + getNSIdx(type, index) + '-' + whatChanged]) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-' + whatChanged))
      }
    }
  }

  const resetForm = () => {
    _setNewPeriode(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (periode: Periode) => {
    const newPerioder: Array<Periode> = _.get(replySed, periode.__type!) as Array<Periode>
    newPerioder.splice(periode.__index!, 1)
    dispatch(updateReplySed(periode.__type!, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: periode.__type! })
  }

  const onAdd = () => {
    let newPerioder: Array<Periode> | undefined = _.get(replySed, _newType!)
    if (_.isNil(newPerioder)) {
      newPerioder = []
    }
    const valid: boolean = _performValidation({
      periode: _newPeriode,
      type: _newType,
      personName
    })
    if (valid && _newType) {
      newPerioder = newPerioder.concat(_newPeriode!)
      dispatch(updateReplySed(_newType, newPerioder))
      standardLogger('svarsed.editor.periode.add', { type: _newType })
      onCancel()
    }
  }

  const getTag = (type: string) => (
    <Tag size='small' variant='info'>{t('label:' + type)}</Tag>
  )

  const renderRow = (periode: Periode | null, index: number) => {
    const _type: string = index < 0 ? _newType! : periode!.__type!
    const _index: number = index < 0 ? index : periode!.__index! // replace index order from map (which is "ruined" by a sort) with real index from replySed
    // namespace for index < 0: svarsed-bruker-trygdeordning-dekkede-startdato
    // namespace for index >= 0: svarsed-bruker-trygdeordning-dekkede[perioderMedITrygdeordning][2]-startdato
    const idx = getNSIdx(_type, _index)
    const editing: boolean = periode === null || _.find(_editing, i => i === idx) !== undefined
    const _v: Validation = index < 0 ? _validation : validation
    const _periode = index < 0 ? _newPeriode : periode

    const addremovepanel = (
      <AddRemovePanel2<Periode>
        item={periode}
        marginTop={index < 0}
        index={index}
        onRemove={onRemove}
        onAddNew={onAdd}
        onCancelNew={onCancel}
        onStartEdit={() => _setEditing(_editing.concat(idx))}
        onCancelEdit={() => _setEditing(_.filter(_editing, i => i !== idx))}
      />
    )

    return (
      <RepeatableRow
        className={classNames({ new: index < 0 })}
        key={getId(periode)}
      >
        <VerticalSeparatorDiv size='0.5' />
        {editing
          ? (
            <>
              <AlignStartRow>
                <PeriodeInput
                  namespace={namespace + idx}
                  hideLabel={index >= 0}
                  error={{
                    startdato: _v[namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[namespace + '-sluttdato']?.feilmelding
                  }}
                  setPeriode={(p: Periode, whatChanged: string) => setPeriode(p, whatChanged, _type, _index)}
                  value={_periode}
                />
                <Column>
                  {addremovepanel}
                </Column>
              </AlignStartRow>
              <AlignStartRow>
                <Column>
                  <RadioPanelGroup
                    value={_type}
                    data-no-border
                    data-testid={namespace + idx + '-type'}
                    error={_v[namespace + idx + '-type']?.feilmelding}
                    id={namespace + idx + '-type'}
                    legend=''
                    hideLabel
                    name={namespace + idx + '-type'}
                    onChange={(newType: string) => setType(newType, _type, _index)}
                  >
                    <FlexRadioPanels>
                      <RadioPanel value='perioderMedITrygdeordning'>
                        {t('label:dekkede')}
                      </RadioPanel>
                      <RadioPanel value='perioderUtenforTrygdeordning'>
                        {t('label:udekkede')}
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
              <Column>
                <FlexCenterDiv>
                  <PileDiv>
                    <BodyLong>
                      {periode?.startdato}
                    </BodyLong>
                    {_v[namespace + '-startdato']?.feilmelding && (
                      <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
                        {_v[namespace + '-startdato']?.feilmelding}
                      </div>
                    )}
                  </PileDiv>
                  <PileDiv>
                    <BodyLong>
                      {periode?.sluttdato}
                    </BodyLong>
                    {_v[namespace + '-sluttdato']?.feilmelding && (
                      <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
                        {_v[namespace + '-sluttdato']?.feilmelding}
                      </div>
                    )}
                  </PileDiv>
                </FlexCenterDiv>
              </Column>
              <Column>
                {getTag(_type)}
              </Column>
              <Column>
                {addremovepanel}
              </Column>
            </AlignStartRow>
            )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <Heading size='small'>
        {t('label:dekning-trygdeordningen')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      {!_.isEmpty(_allPeriods) && (
        <>
          <Checkbox
            checked={_sort === 'group'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSort(e.target.checked ? 'group' : 'time')}
          >
            {t('label:group-by-dekkede')}
          </Checkbox>
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {_.isEmpty(_allPeriods)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : (_sort === 'time'
            ? _allPeriods?.map(renderRow)
            : (
              <>
                {getTag('perioderMedITrygdeordning')}
                {person?.perioderMedITrygdeordning?.map((p: Periode, i: number) =>
                  ({ ...p, __type: 'perioderMedITrygdeordning', __index: i }))
                  .sort(periodeSort).map(renderRow)}
                {getTag('perioderUtenforTrygdeordning')}
                {person?.perioderUtenforTrygdeordning?.map((p: Periode, i: number) =>
                  ({ ...p, __type: 'perioderUtenforTrygdeordning', __index: i }))
                  .sort(periodeSort).map(renderRow)}
              </>
              ))}
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setSeeNewForm(true)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:dekkede-periode').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default DekkedePerioder
