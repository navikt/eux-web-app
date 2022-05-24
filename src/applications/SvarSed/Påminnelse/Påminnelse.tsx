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
import { Dokument, X009Sed } from 'declarations/sed'
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
import { validateDokument, validateDokumenter, ValidationDokumenterProps, ValidationDokumentProps } from './validation'

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
  const target = 'dokumenter'
  const dokumenter = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-påminnelse`

  const getId = (d: Dokument | null): string => d ? d.dokumentinfo + '-' + d.dokumenttype : 'new'

  const [_newDokument, _setNewDokument] = useState<Dokument | undefined>(undefined)
  const [_editDokument, _setEditDokument] = useState<Dokument | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationDokumentProps>(validateDokument, namespace)

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationDokumenterProps>(
      validation, namespace, validateDokumenter, {
        dokumenter: (replySed as X009Sed).dokumenter,
        personName
      }
    )
    dispatch(setValidation(newValidation))
  })

  const setDokumentType = (dokumentType: string, index: number) => {
    if (index < 0) {
      _setNewDokument({
        ..._newDokument,
        dokumenttype: dokumentType.trim()
      } as Dokument)
      _resetValidation(namespace + '-dokumentType')
      return
    }
    _setEditDokument({
      ..._editDokument,
      dokumenttype: dokumentType.trim()
    } as Dokument)
    if (validation[namespace + getIdx(index) + '-dokumentType']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-dokumentType'))
    }
  }

  const setDokumentInfo = (dokumentInfo: string, index: number) => {
    if (index < 0) {
      _setNewDokument({
        ..._newDokument,
        dokumentinfo: dokumentInfo.trim()
      } as Dokument)
      _resetValidation(namespace + '-dokumentInfo')
      return
    }
    _setEditDokument({
      ..._editDokument,
      dokumentinfo: dokumentInfo.trim()
    } as Dokument)
    if (validation[namespace + getIdx(index) + '-dokumentInfo']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-dokumentInfo'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditDokument(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewDokument(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (s: Dokument, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditDokument(s)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationDokumentProps>(
      validation, namespace, validateDokument, {
        dokument: _editDokument,
        dokumenter,
        index: _editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editDokument))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removedDokument: Dokument) => {
    const newDokumenter: Array<Dokument> = _.reject(dokumenter,
      (d: Dokument) => _.isEqual(removedDokument, d))
    dispatch(updateReplySed(target, newDokumenter))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      dokument: _newDokument,
      dokumenter,
      personName
    })
    if (!!_newDokument && valid) {
      let newDokumenter: Array<Dokument> | undefined = _.cloneDeep(dokumenter)
      if (_.isNil(newDokumenter)) {
        newDokumenter = []
      }
      newDokumenter.push(_newDokument)
      dispatch(updateReplySed(target, newDokumenter))
      onCloseNew()
    }
  }

  const renderRow = (dokument: Dokument | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _dokument = index < 0 ? _newDokument : (inEditMode ? _editDokument : dokument)

    const addremovepanel = (
      <AddRemovePanel<Dokument>
        item={dokument}
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
        key={getId(dokument)}
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
                    value={_dokument?.dokumenttype}
                    data-no-border
                    data-testid={_namespace + '-dokumenttype'}
                    error={_v[_namespace + '-dokumenttype']?.feilmelding}
                    id={_namespace + '-dokumenttype'}
                    legend={t('label:dokument-type') + ' *'}
                    name={_namespace + '-dokumenttype'}
                    onChange={(type: string) => setDokumentType(type, index)}
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
                      error={_v[_namespace + '-dokumentinfo']?.feilmelding}
                      id='info'
                      maxLength={51}
                      label={t('label:dokument-info')}
                      namespace={_namespace}
                      onChanged={(info: string) => setDokumentInfo(info, index)}
                      value={_dokument?.dokumentinfo}
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
                    error={_v[_namespace + '-dokumenttype']?.feilmelding}
                    id={_namespace + '-dokumenttype'}
                  >
                    {t('label:' + _dokument?.dokumenttype)}
                  </FormText>
                  <HorizontalSeparatorDiv />
                  <FormText
                    error={_v[_namespace + '-dokumentinfo']?.feilmelding}
                    id={_namespace + '-dokumentinfo'}
                  >
                    {_dokument?.dokumentinfo}
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
      {_.isEmpty(dokumenter)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-dokument')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : dokumenter?.map(renderRow)}
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
              {t('el:button-add-new-x', { x: t('label:dokument').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Påminnelse
