import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, Checkbox, HGrid, HStack, Label, Radio, RadioGroup, Spacer, Tag, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import {RepeatableBox} from 'components/StyledComponents'
import {Periode, PeriodeSort, PersonTypeBrukerF026} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import { getNSIdx, readNSIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validateDekkedePeriode, ValidationDekkedePeriodeProps } from './validation'
import commonStyles from 'assets/css/common.module.css'
import styles from './DekkedePerioder.module.css'

interface DekkedePerioderProps extends MainFormProps {
  validation: Validation
}

const DekkedePerioder: React.FC<DekkedePerioderProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  validation
}: DekkedePerioderProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const target = `${personID}`
  const namespace = `${parentNamespace}-dekkede`
  const person: PersonTypeBrukerF026 = _.get(replySed, target)
  const getId = (p: Periode | null): string => p ? '[' + (p.__type ?? '') + ']-' + p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new'

  const [_allPeriods, _setAllPeriods] = useState<Array<Periode>>([])
  const [_newPeriode, _setNewPeriode] = useState<Periode | undefined>(undefined)
  const [_editPeriode, _setEditPeriode] = useState<Periode | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editTypeAndIndex, _setEditTypeAndIndex] = useState<string | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationDekkedePeriodeProps>(validateDekkedePeriode, namespace)

  const [_sort, _setSort] = useState<PeriodeSort>('time')

  useEffect(() => {
    const periodes: Array<Periode> = []
    person?.dekkedePerioder?.forEach((p: Periode, i: number) => periodes.push({ ...p, __index: i, __type: 'dekkedePerioder' }))
    person?.udekkedePerioder?.forEach((p: Periode, i: number) => periodes.push({ ...p, __index: i, __type: 'udekkedePerioder' }))
    _setAllPeriods(periodes.sort(periodeSort))
  }, [replySed])

  const setType = (newType: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        __type: newType
      } as Periode)
      _resetValidation(namespace + '-type')
      return
    }
    const oldType = _editPeriode?.__type
    _setEditPeriode({
      ..._editPeriode,
      __type: newType
    } as Periode)
    dispatch(resetValidation(namespace + getNSIdx(oldType, _editPeriode?.__index) + '-type'))
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace)
      return
    }
    _setEditPeriode(periode)
    dispatch(resetValidation([
      namespace + getNSIdx(periode.__type!, periode.__index) + '-startdato',
      namespace + getNSIdx(periode.__type!, periode.__index) + '-sluttdato'
    ]))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPeriode(undefined)
    _setEditTypeAndIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPeriode(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (periode: Periode) => {
    // reset any validation that exists from a cancelled edited item
    if (_editTypeAndIndex !== undefined) {
      dispatch(resetValidation(namespace + _editTypeAndIndex))
    }
    _setEditPeriode(periode)
    _setEditTypeAndIndex(getNSIdx(periode.__type!, periode.__index))
  }

  const onSaveEdit = () => {
    const [type, index] = readNSIdx(_editTypeAndIndex!)
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationDekkedePeriodeProps>(
      clonedValidation, namespace, validateDekkedePeriode, {
        periode: _editPeriode,
        perioder: _allPeriods,
        nsIndex: _editTypeAndIndex,
        personName
      })
    if (!!_editPeriode && !hasErrors) {
      // if we switched period types, then we have to remove it from the old array, and add it to the new one

      const __editPeriode = _.cloneDeep(_editPeriode)
      delete __editPeriode.__type
      delete __editPeriode.__index

      if (type !== _editPeriode?.__type) {
        const oldPeriods: Array<Periode> = _.cloneDeep(_.get(person, type))
        let newPeriods: Array<Periode> | undefined = _.cloneDeep(_.get(person, _editPeriode.__type!))

        oldPeriods.splice(index, 1)

        if (_.isUndefined(newPeriods)) {
          newPeriods = []
        }
        newPeriods.push(__editPeriode)
        newPeriods = newPeriods.sort(periodeSort)

        const newPerson = _.cloneDeep(person)
        _.set(newPerson, type, oldPeriods)
        _.set(newPerson, _editPeriode.__type!, newPeriods)
        dispatch(updateReplySed(target, newPerson))
      } else {
        dispatch(updateReplySed(`${target}[${type}][${index}]`, __editPeriode))
      }
      onCloseEdit(namespace + _editTypeAndIndex)
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPeriode: Periode) => {
    const type: string = removedPeriode.__type!
    const index: number = removedPeriode.__index! as number
    const newPerioder : Array<Periode> = _.cloneDeep(_.get(person, type)) as Array<Periode>
    newPerioder.splice(index, 1)
    dispatch(updateReplySed(`${target}.${type}`, newPerioder))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periode: _newPeriode,
      perioder: _allPeriods,
      personName
    })
    if (!!_newPeriode && valid) {
      const type: string = _newPeriode.__type as string
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(_.get(person, type))
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      delete _newPeriode.__type
      delete _newPeriode.__index
      newPerioder.push(_newPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(`${target}.${type}`, newPerioder))
      onCloseNew()
    }
  }

  const getTag = (type: string) => (
    <Tag size='small' variant='info'>
      {type === 'dekkedePerioder' && t('label:dekkede')}
      {type === 'udekkedePerioder' && t('label:udekkede')}
    </Tag>
  )

  const renderRow = (periode: Periode | null, index: number) => {
    // replace index order from map (which is "ruined" by a sort) with real index from replySed
    // namespace for index < 0: svarsed-bruker-trygdeordning-dekkede-startdato
    // namespace for index >= 0: svarsed-bruker-trygdeordning-dekkede[perioderMedITrygdeordning][2]-startdato
    const idx = getNSIdx(periode?.__type, periode?.__index)
    const _namespace = namespace + idx
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editTypeAndIndex === idx
    const _periode = index < 0 ? _newPeriode : (inEditMode ? _editPeriode : periode)

    const addremovepanel = (
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
    )

    return (
      <RepeatableBox
        padding="4"
        id={'repeatablerow-' + _namespace}
        key={getId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        {inEditMode
          ? (
              <VStack gap="4">
                <HStack gap="4">
                  <PeriodeInput
                    namespace={_namespace}
                    hideLabel={false}
                    error={{
                      startdato: _v[_namespace + '-startdato']?.feilmelding,
                      sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                    }}
                    setPeriode={(p: Periode) => setPeriode(p, index)}
                    value={_periode}
                  />
                  <Spacer/>
                  {addremovepanel}
                </HStack>
                <HGrid columns={"2fr 1fr"}>
                  <RadioGroup
                    value={_periode?.__type}
                    data-no-border
                    data-testid={_namespace + '-type'}
                    error={_v[_namespace + '-type']?.feilmelding}
                    id={_namespace + '-type'}
                    legend=''
                    hideLegend={true}
                    name={_namespace + '-type'}
                    onChange={(newType: string) => setType(newType, index)}
                  >
                    <HStack gap="4" width="100%">
                      <Radio className={commonStyles.radioPanel} value='dekkedePerioder'>
                        {t('label:dekkede')}
                      </Radio>
                      <Radio className={commonStyles.radioPanel} value='udekkedePerioder'>
                        {t('label:udekkede')}
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </HGrid>
              </VStack>
            )
          : (
            <HStack gap="4" align="center">
              <PeriodeText
                periode={periode}
                namespace={_namespace}
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
              />
              {_sort === 'time' && getTag(periode?.__type!)}
              <Spacer/>
              {addremovepanel}
            </HStack>
            )}
      </RepeatableBox>
    )
  }

  return (
    <Box padding="4">
      <Box
        background="surface-subtle"
        borderWidth="1"
        borderColor="border-subtle"
        id={namespace + '-dekkedePerioder'}
        className={classNames({
          [styles.errorBox]: hasNamespaceWithErrors(validation, namespace)
        })}
        padding="4"
      >
        <VStack gap="4">
        {!_.isEmpty(_allPeriods) && (
          <Checkbox
            checked={_sort === 'group'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSort(e.target.checked ? 'group' : 'time')}
          >
            {t('label:group-by-dekkede')}
          </Checkbox>
        )}
        {_.isEmpty(_allPeriods)
          ? (
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
            )
          : (_sort === 'time'
              ? _allPeriods?.map(renderRow)
              : (
                <>
                  {!_.isEmpty(person?.dekkedePerioder) && (
                    <Label>
                      {t('label:dekkede')}
                    </Label>
                  )}
                  {person?.dekkedePerioder?.map((p: Periode, i: number) =>
                    ({ ...p, __type: 'dekkedePerioder', __index: i }))
                    .sort(periodeSort).map(renderRow)}
                  {!_.isEmpty(person?.udekkedePerioder) && (
                    <Label>
                      {t('label:udekkede')}
                    </Label>
                  )}
                  {person?.udekkedePerioder?.map((p: Periode, i: number) =>
                    ({ ...p, __type: 'udekkedePerioder', __index: i }))
                    .sort(periodeSort).map(renderRow)}
                </>
                ))}
        {_newForm
          ? renderRow(null, -1)
          : (
              <Box>
                <Button
                  variant='tertiary'
                  size="small"
                  onClick={() => _setNewForm(true)}
                  icon={<PlusCircleIcon/>}
                >
                  {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
                </Button>
              </Box>
          )
        }
        </VStack>
      </Box>
    </Box>
  )
}

export default DekkedePerioder
