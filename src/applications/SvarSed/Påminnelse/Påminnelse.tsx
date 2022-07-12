import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import {
  AlignEndColumn,
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
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import TextArea from 'components/Forms/TextArea'
import { RepeatableRow, SpacedHr, TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Purring, X009Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import { validatePurring, validatePurringer, ValidationPurringerProps, ValidationPurringProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Påminnelse: React.FC<MainFormProps> = ({
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
  const target = 'purringer'
  const purringer = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-påminnelse`

  const getId = (p: Purring | null): string => p ? p.gjelder + '-' + p.beskrivelse : 'new'

  const [_newPurring, _setNewPurring] = useState<Purring | undefined>(undefined)
  const [_editPurring, _setEditPurring] = useState<Purring | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPurringProps>(validatePurring, namespace)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationPurringerProps>(
      clonedValidation, namespace, validatePurringer, {
        purringer: (replySed as X009Sed).purringer,
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const setPurringGjelder = (gjelder: string, index: number) => {
    if (index < 0) {
      _setNewPurring({
        ..._newPurring,
        gjelder: gjelder.trim()
      } as Purring)
      _resetValidation(namespace + '-gjelder')
      return
    }
    _setEditPurring({
      ..._editPurring,
      gjelder: gjelder.trim()
    } as Purring)
    if (validation[namespace + getIdx(index) + '-gjelder']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-gjelder'))
    }
  }

  const setPurringBeskrivelse = (beskrivelse: string, index: number) => {
    if (index < 0) {
      _setNewPurring({
        ..._newPurring,
        beskrivelse: beskrivelse.trim()
      } as Purring)
      _resetValidation(namespace + '-beskrivelse')
      return
    }
    _setEditPurring({
      ..._editPurring,
      beskrivelse: beskrivelse.trim()
    } as Purring)
    if (validation[namespace + getIdx(index) + '-beskrivelse']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-beskrivelse'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPurring(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = (namespace?: string) => {
    _setNewPurring(undefined)
    _setNewForm(false)
    _resetValidation()
    if (namespace) {
      dispatch(resetValidation(namespace))
    }
  }

  const onStartEdit = (s: Purring, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPurring(s)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationPurringProps>(
      clonedValidation, namespace, validatePurring, {
        purring: _editPurring,
        purringer,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPurring))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPurring: Purring) => {
    const newPurringer: Array<Purring> = _.reject(purringer,
      (d: Purring) => _.isEqual(removedPurring, d))
    dispatch(updateReplySed(target, newPurringer))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      purring: _newPurring,
      purringer,
      personName
    })
    if (!!_newPurring && valid) {
      let newPurringer: Array<Purring> | undefined = _.cloneDeep(purringer)
      if (_.isNil(newPurringer)) {
        newPurringer = []
      }
      newPurringer.push(_newPurring)
      dispatch(updateReplySed(target, newPurringer))
      onCloseNew(namespace + '-purringer')
    }
  }

  const renderRow = (purring: Purring | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _purring = index < 0 ? _newPurring : (inEditMode ? _editPurring : purring)

    const addremovepanel = (
      <AddRemovePanel<Purring>
        item={purring}
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
    )

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(purring)}
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
                <Column flex='2'>
                  <RadioPanelGroup
                    value={_purring?.gjelder}
                    data-no-border
                    data-testid={_namespace + '-gjelder'}
                    error={_v[_namespace + '-gjelder']?.feilmelding}
                    id={_namespace + '-gjelder'}
                    legend={t('label:dokument-type') + ' *'}
                    name={_namespace + '-gjelder'}
                    onChange={(gjelder: string) => setPurringGjelder(gjelder, index)}
                  >
                    <FlexRadioPanels>
                      <RadioPanel value='dokument'>
                        {t('label:dokument')}
                      </RadioPanel>
                      <RadioPanel value='informasjon'>
                        {t('label:informasjon')}
                      </RadioPanel>
                      <RadioPanel value='sed'>
                        {t('label:sed')}
                      </RadioPanel>
                    </FlexRadioPanels>
                  </RadioPanelGroup>
                </Column>
                <AlignEndColumn>
                  {addremovepanel}
                </AlignEndColumn>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column>
                  <TextAreaDiv>
                    <TextArea
                      error={_v[_namespace + '-beskrivelse']?.feilmelding}
                      id='beskrivelse'
                      maxLength={65}
                      label={t('label:dokument-info')}
                      namespace={_namespace}
                      onChanged={(beskrivelse: string) => setPurringBeskrivelse(beskrivelse, index)}
                      value={_purring?.beskrivelse}
                    />
                  </TextAreaDiv>
                </Column>
              </AlignStartRow>
            </>
            )
          : (
            <AlignStartRow>
              <Column flex='2'>
                <FlexDiv>
                  <FormText
                    error={_v[_namespace + '-gjelder']?.feilmelding}
                    id={_namespace + '-gjelder'}
                  >
                    {t('label:' + _purring?.gjelder)}
                  </FormText>
                  <HorizontalSeparatorDiv />
                  <FormText
                    error={_v[_namespace + '-beskrivelse']?.feilmelding}
                    id={_namespace + '-beskrivelse'}
                  >
                    {_purring?.beskrivelse}
                  </FormText>
                </FlexDiv>
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
          {label}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(purringer)
        ? (
          <PaddedHorizontallyDiv>
            <FormText
              error={validation[namespace + '-purringer']?.feilmelding}
              id={namespace + '-purringer'}
            >
              <SpacedHr />
              <BodyLong>
                {t('message:warning-no-påminnelse')}
              </BodyLong>
              <SpacedHr />
            </FormText>
          </PaddedHorizontallyDiv>
          )
        : purringer?.map(renderRow)}
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
              {t('el:button-add-new-x', { x: t('label:purring').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Påminnelse
