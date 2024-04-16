import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import { RepeatableRow, SpacedHr, TextAreaDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { Grunn, GrunnUenighet, ProsedyreVedUenighet } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validateGrunn,
  validateProsedyreVedUenighet,
  ValidationGrunnProps,
  ValidationProsedyreVedUenighetProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const ProsedyreVedUenighetFC: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  personName
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-prosedyre_ved_uenighet`
  const target = 'uenighet'
  const prosedyreVedUenighet: ProsedyreVedUenighet | undefined = _.get(replySed, target)
  const getId = (g: Grunn | null |undefined) => g ? g.grunn : 'new-grunn'

  const [_allGrunns, _setAllGrunns] = useState<Array<Grunn>>([])
  const [_newGrunn, _setNewGrunn] = useState<Grunn | undefined>(undefined)
  const [_editGrunn, _setEditGrunn] = useState<Grunn | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationGrunnProps>(validateGrunn, namespace)

  const availableGrunns: Array<GrunnUenighet> = ['ansettelse', 'pensjon', 'medlemsperiode', 'oppholdetsVarighet', 'bosted', 'personligSituasjon']

  const grunnOptions: Options = [
    { label: t('el:option-grunn-ansettelse'), value: 'ansettelse' },
    { label: t('el:option-grunn-pensjon'), value: 'pensjon' },
    { label: t('el:option-grunn-medlemsperiode'), value: 'medlemsperiode' },
    { label: t('el:option-grunn-oppholdetsVarighet'), value: 'oppholdetsVarighet' },
    { label: t('el:option-grunn-bosted'), value: 'bosted' },
    { label: t('el:option-grunn-personligSituasjon'), value: 'personligSituasjon' }
  ]

  const personOptions: Options = [
    { label: t('el:option-person-søker'), value: 'søker' },
    { label: t('el:option-person-ektefelle_partner'), value: 'ektefelle_partner' },
    { label: t('el:option-person-avdød'), value: 'avdød' },
    { label: t('el:option-person-annen-person'), value: 'annen-person' }
  ]

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationProsedyreVedUenighetProps>(
      clonedValidation, namespace, validateProsedyreVedUenighet, {
        prosedyreVedUenighet,
        formalName: personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  useEffect(() => {
    const newGrunns: Array<Grunn> = []
    if (!_.isNil(prosedyreVedUenighet)) {
      Object.keys(prosedyreVedUenighet).forEach(key => {
        if (availableGrunns.indexOf(key as GrunnUenighet) >= 0) {
          newGrunns.push({
            grunn: key,
            person: _.get(prosedyreVedUenighet, key)
          })
        }
      })
      _setAllGrunns(newGrunns.sort((a: Grunn, b: Grunn) => a.grunn.localeCompare(b.grunn)))
    }
  }, [replySed])

  const setGrunn = (newGrunn: string, oldGrunn : string | undefined, index: number) => {
    if (index < 0) {
      _setNewGrunn({
        ..._newGrunn,
        grunn: newGrunn.trim(),
        __oldGrunn: oldGrunn
      } as Grunn)
      _resetValidation(namespace + '-grunn')
    }
    _setEditGrunn({
      ..._editGrunn,
      grunn: newGrunn.trim(),
      __oldGrunn: oldGrunn
    } as Grunn)
    dispatch(resetValidation(namespace + '-grunn'))
  }

  const setPerson = (person: string, index: number) => {
    if (index < 0) {
      _setNewGrunn({
        ..._newGrunn,
        person: person.trim()
      } as Grunn)
      _resetValidation(namespace + '-person')
      return
    }
    _setEditGrunn({
      ..._editGrunn,
      person: person.trim()
    } as Grunn)
    dispatch(resetValidation(namespace + getIdx(index) + '-person'))
  }

  const setYtterligereGrunner = (newYtterligereGrunner: string) => {
    dispatch(updateReplySed(`${target}.ytterligereGrunner`, newYtterligereGrunner.trim()))
    if (validation[namespace + '-ytterligereGrunner']) {
      dispatch(resetValidation(namespace + '-ytterligereGrunner'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditGrunn(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewGrunn(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (g: Grunn, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditGrunn(g)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationGrunnProps>(
      clonedValidation, namespace, validateGrunn, {
        grunn: _editGrunn,
        grunns: _allGrunns,
        index: _editIndex,
        formalName: personName
      })
    if (!hasErrors) {
      let newProsedyre: ProsedyreVedUenighet = _.cloneDeep(prosedyreVedUenighet) as ProsedyreVedUenighet
      if (!_.isUndefined(_editGrunn?.__oldGrunn)) {
        newProsedyre = _.omit(newProsedyre, _editGrunn!.__oldGrunn)
      }
      _.set(newProsedyre, _editGrunn!.grunn, _editGrunn!.person)
      dispatch(updateReplySed(target, newProsedyre))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedGrunn: Grunn) => {
    let newProsedyre: ProsedyreVedUenighet = _.cloneDeep(prosedyreVedUenighet) as ProsedyreVedUenighet
    newProsedyre = _.omit(newProsedyre, removedGrunn.grunn!)
    dispatch(updateReplySed(target, newProsedyre))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      grunn: _newGrunn,
      grunns: _allGrunns,
      formalName: personName
    })
    if (!!_newGrunn && valid) {
      let newProsedyre: ProsedyreVedUenighet = _.cloneDeep(prosedyreVedUenighet) as ProsedyreVedUenighet
      if (_.isNil(newProsedyre)) {
        newProsedyre = {}
      }
      _.set(newProsedyre, _newGrunn.grunn, _newGrunn.person)
      dispatch(updateReplySed(target, newProsedyre))
      onCloseNew()
    }
  }

  const renderRow = (grunn: Grunn | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _grunn = index < 0 ? _newGrunn : (inEditMode ? _editGrunn : grunn)

    const thisGrunnOptions = grunnOptions.map(o => ({
      ...o,
      isDisabled: Object.prototype.hasOwnProperty.call(prosedyreVedUenighet ?? {}, o.value)
    }))

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(grunn)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow style={{ minHeight: '2.2rem' }}>
          {inEditMode
            ? (
              <>
                <Column>
                  <Select
                    closeMenuOnSelect
                    data-testid={_namespace + '-grunn'}
                    error={_v[_namespace + '-grunn']?.feilmelding}
                    id={_namespace + '-grunn'}
                    label={t('label:velg-grunn-til-uenighet')}
                    menuPortalTarget={document.body}
                    onChange={(o: unknown) => setGrunn((o as Option).value, _grunn?.grunn, index)}
                    options={thisGrunnOptions}
                    value={_.find(grunnOptions, b => b.value === _grunn?.grunn)}
                    defaultValue={_.find(grunnOptions, b => b.value === _grunn?.grunn)}
                  />
                </Column>
                <Column>
                  <Select
                    closeMenuOnSelect
                    data-testid={_namespace + '-person'}
                    error={_v[_namespace + '-person']?.feilmelding}
                    id={_namespace + '-person'}
                    label={t('label:personen-det-gjelder')}
                    menuPortalTarget={document.body}
                    onChange={(o: unknown) => setPerson((o as Option).value, index)}
                    options={personOptions}
                    required
                    value={_.find(personOptions, b => b.value === _grunn?.person)}
                    defaultValue={_.find(personOptions, b => b.value === _grunn?.person)}
                  />
                </Column>
              </>
              )
            : (
              <Column flex='2'>
                <FlexDiv>
                  <FormText
                    error={_v[_namespace + '-grunn']?.feilmelding}
                    id={_namespace + '-grunn'}
                  >
                    {_.find(thisGrunnOptions, g => g.value === _grunn?.grunn)?.label}
                  </FormText>
                  :
                  <HorizontalSeparatorDiv size='0.5' />
                  <FormText
                    error={_v[_namespace + '-person']?.feilmelding}
                    id={_namespace + '-person'}
                  >
                    {_.find(personOptions, p => p.value === _grunn?.person)?.label}
                  </FormText>
                </FlexDiv>
              </Column>
              )}
          <AlignEndColumn>
            <AddRemovePanel<Grunn>
              item={grunn}
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
        <VerticalSeparatorDiv />
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
      {_.isEmpty(_allGrunns)
        ? (
          <PaddedHorizontallyDiv>
            <FormText
              error={validation[namespace + '-grunner']?.feilmelding}
              id={namespace + '-grunner'}
            >
              <SpacedHr />
              {t('message:warning-no-grunn')}
              <SpacedHr />
            </FormText>
          </PaddedHorizontallyDiv>
          )
        : _allGrunns?.map(renderRow)}
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
              {t('el:button-add-new-x', { x: t('label:reason').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <AlignStartRow>
          <Column flex='2'>
            <TextAreaDiv>
              <TextArea
                error={validation[namespace + '-ytterligereGrunner']?.feilmelding}
                namespace={namespace}
                id='ytterligereGrunner'
                label={t('label:ytterligere-grunner-til-uenighet')}
                onChanged={setYtterligereGrunner}
                value={prosedyreVedUenighet?.ytterligereGrunner}
              />
            </TextAreaDiv>
          </Column>
          <Column />
        </AlignStartRow>
      </PaddedDiv>
    </>
  )
}

export default ProsedyreVedUenighetFC
