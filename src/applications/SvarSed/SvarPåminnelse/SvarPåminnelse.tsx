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
import DateInput from 'components/Forms/DateInput'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { RepeatableRow, SpacedHr, TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { DokumentIkkeTilgjengelige, DokumentTilSend, X010Sed } from 'declarations/sed'
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
import {
  validateDokumentIkkeTilgjengelige,
  validateDokumentTilSend,
  validateSvarPåminnelse,
  ValidationDokumentIkkeTilgjengeligeProps,
  ValidationDokumentTilSendProps,
  ValidationSvarPåminnelseProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SvarPåminnelse: React.FC<MainFormProps> = ({
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
  const targetDokumentTilSend = 'besvarelseKommer'
  const targetDokumentIkkeTilgjengelige = 'besvarelseUmulig'
  const dokumenterTilSend = _.get(replySed, targetDokumentTilSend)
  const dokumenterIkkeTilgjengelige = _.get(replySed, targetDokumentIkkeTilgjengelige)
  const namespace = `${parentNamespace}-${personID}-svarpåminnelse`

  const getDokumentTilSendId = (d: DokumentTilSend | null): string => d ? d.gjelder + '-' + d.beskrivelse + '-' + d.innenDato : 'new'
  const getDokumentIkkeTilgjengeligeId = (d: DokumentIkkeTilgjengelige | null): string => d ? d.gjelder + '-' + d.begrunnelseType : 'new'

  const [_newDokumentTilSend, _setNewDokumentTilSend] = useState<DokumentTilSend | undefined>(undefined)
  const [_editDokumentTilSend, _setEditDokumentTilSend] = useState<DokumentTilSend | undefined>(undefined)
  const [_newDokumentIkkeTilgjengelige, _setNewDokumentIkkeTilgjengelige] = useState<DokumentIkkeTilgjengelige | undefined>(undefined)
  const [_editDokumentIkkeTilgjengelige, _setEditDokumentIkkeTilgjengelige] = useState<DokumentIkkeTilgjengelige | undefined>(undefined)

  const [_editDokumentTilSendIndex, _setEditDokumentTilSendIndex] = useState<number | undefined>(undefined)
  const [_editDokumentIkkeTilgjengeligeIndex, _setEditDokumentIkkeTilgjengeligeIndex] = useState<number | undefined>(undefined)
  const [_newDokumentTilSendForm, _setNewDokumentTilSendForm] = useState<boolean>(false)
  const [_newDokumentIkkeTilgjengeligeForm, _setNewDokumentIkkeTilgjengeligeForm] = useState<boolean>(false)
  const [_validationDokumentTilSend, _resetValidationDokumentTilSend, _performValidationDokumentTilSend] =
    useLocalValidation<ValidationDokumentTilSendProps>(validateDokumentTilSend, namespace + '-dokumentTilSend')
  const [_validationDokumentIkkeTilgjengelige, _resetValidationDokumentIkkeTilgjengelige, _performValidationDokumentIkkeTilgjengelige] =
    useLocalValidation<ValidationDokumentIkkeTilgjengeligeProps>(validateDokumentIkkeTilgjengelige, namespace + '-dokumentIkkeTilgjengelige')

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationSvarPåminnelseProps>(
      validation, namespace, validateSvarPåminnelse, {
        dokumenterTilSend: _.get((replySed as X010Sed), targetDokumentTilSend),
        dokumenterIkkeTilgjengelige: _.get((replySed as X010Sed), targetDokumentIkkeTilgjengelige),
        personName
      }
    )
    dispatch(setValidation(newValidation))
  })

  const setDokumentTilSendType = (gjelder: string, index: number) => {
    if (index < 0) {
      _setNewDokumentTilSend({
        ..._newDokumentTilSend,
        gjelder: gjelder.trim()
      } as DokumentTilSend)
      _resetValidationDokumentTilSend(namespace + '-dokumentTilSend-gjelder')
      return
    }
    _setEditDokumentTilSend({
      ..._editDokumentTilSend,
      gjelder: gjelder.trim()
    } as DokumentTilSend)
    if (validation[namespace + '-dokumentTilSend' + getIdx(index) + '-gjelder']) {
      dispatch(resetValidation(namespace + '-dokumentTilSend' + getIdx(index) + '-gjelder'))
    }
  }

  const setDokumentIkkeTilgjengeligeType = (gjelder: string, index: number) => {
    if (index < 0) {
      _setNewDokumentIkkeTilgjengelige({
        ..._newDokumentIkkeTilgjengelige,
        gjelder: gjelder.trim()
      } as DokumentIkkeTilgjengelige)
      _resetValidationDokumentIkkeTilgjengelige(namespace + '-dokumentIkkeTilgjengelige-gjelder')
      return
    }
    _setEditDokumentIkkeTilgjengelige({
      ..._editDokumentIkkeTilgjengelige,
      gjelder: gjelder.trim()
    } as DokumentIkkeTilgjengelige)
    if (validation[namespace + '-dokumentIkkeTilgjengelige' + getIdx(index) + '-gjelder']) {
      dispatch(resetValidation(namespace + '-dokumentIkkeTilgjengelige' + getIdx(index) + '-gjelder'))
    }
  }

  const setDokumentTilSendInfo = (beskrivelse: string, index: number) => {
    if (index < 0) {
      _setNewDokumentTilSend({
        ..._newDokumentTilSend,
        beskrivelse: beskrivelse.trim()
      } as DokumentTilSend)
      _resetValidationDokumentTilSend(namespace + '-dokumentTilSend-beskrivelse')
      return
    }
    _setEditDokumentTilSend({
      ..._editDokumentTilSend,
      beskrivelse: beskrivelse.trim()
    } as DokumentTilSend)
    if (validation[namespace + '-dokumentTilSend' + getIdx(index) + '-beskrivelse']) {
      dispatch(resetValidation(namespace + '-dokumentTilSend' + getIdx(index) + '-beskrivelse'))
    }
  }

  const setDokumentIkkeTilgjengeligeInfo = (beskrivelse: string, index: number) => {
    if (index < 0) {
      _setNewDokumentIkkeTilgjengelige({
        ..._newDokumentIkkeTilgjengelige,
        beskrivelse: beskrivelse.trim()
      } as DokumentIkkeTilgjengelige)
      _resetValidationDokumentIkkeTilgjengelige(namespace + '-dokumentIkkeTilgjengelige-beskrivelse')
      return
    }
    _setEditDokumentIkkeTilgjengelige({
      ..._editDokumentIkkeTilgjengelige,
      beskrivelse: beskrivelse.trim()
    } as DokumentIkkeTilgjengelige)
    if (validation[namespace + '-dokumentIkkeTilgjengelige' + getIdx(index) + '-beskrivelse']) {
      dispatch(resetValidation(namespace + '-dokumentIkkeTilgjengelige' + getIdx(index) + '-beskrivelse'))
    }
  }

  const setInnenDato = (innenDato: string, index: number) => {
    if (index < 0) {
      _setNewDokumentTilSend({
        ..._newDokumentTilSend,
        innenDato: innenDato.trim()
      } as DokumentTilSend)
      _resetValidationDokumentTilSend(namespace + '-dokumentTilSend-innenDato')
      return
    }
    _setEditDokumentTilSend({
      ..._editDokumentTilSend,
      innenDato: innenDato.trim()
    } as DokumentTilSend)
    if (validation[namespace + '-dokumentTilSend' + getIdx(index) + '-innenDato']) {
      dispatch(resetValidation(namespace + '-dokumentTilSend' + getIdx(index) + '-innenDato'))
    }
  }

  const setBegrunnelseType = (begrunnelseType: string, index: number) => {
    if (index < 0) {
      _setNewDokumentIkkeTilgjengelige({
        ..._newDokumentIkkeTilgjengelige,
        begrunnelseType: begrunnelseType.trim()
      } as DokumentIkkeTilgjengelige)
      _resetValidationDokumentTilSend(namespace + '-dokumentIkkeTilgjengelige-begrunnelseType')
      return
    }
    _setEditDokumentIkkeTilgjengelige({
      ..._editDokumentIkkeTilgjengelige,
      begrunnelseType: begrunnelseType.trim()
    } as DokumentIkkeTilgjengelige)
    if (validation[namespace + '-dokumentIkkeTilgjengelige' + getIdx(index) + '-begrunnelseType']) {
      dispatch(resetValidation(namespace + '-dokumentIkkeTilgjengelige' + getIdx(index) + '-begrunnelseType'))
    }
  }

  const setBegrunnelseAnnen = (begrunnelseAnnen: string, index: number) => {
    if (index < 0) {
      _setNewDokumentIkkeTilgjengelige({
        ..._newDokumentIkkeTilgjengelige,
        begrunnelseAnnen: begrunnelseAnnen.trim()
      } as DokumentIkkeTilgjengelige)
      _resetValidationDokumentTilSend(namespace + '-dokumentIkkeTilgjengelige-begrunnelseAnnen')
      return
    }
    _setEditDokumentIkkeTilgjengelige({
      ..._editDokumentIkkeTilgjengelige,
      begrunnelseAnnen: begrunnelseAnnen.trim()
    } as DokumentIkkeTilgjengelige)
    if (validation[namespace + '-dokumentIkkeTilgjengelige' + getIdx(index) + '-begrunnelseAnnen']) {
      dispatch(resetValidation(namespace + '-dokumentIkkeTilgjengelige' + getIdx(index) + '-begrunnelseAnnen'))
    }
  }

  const onCloseDokumentTilSendEdit = (namespace: string) => {
    _setEditDokumentTilSend(undefined)
    _setEditDokumentTilSendIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseDokumentIkkeTilgjengeligeEdit = (namespace: string) => {
    _setEditDokumentIkkeTilgjengelige(undefined)
    _setEditDokumentIkkeTilgjengeligeIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseDokumentTilSendNew = () => {
    _setNewDokumentTilSend(undefined)
    _setNewDokumentTilSendForm(false)
    _resetValidationDokumentTilSend()
  }

  const onCloseDokumentIkkeTilgjengeligeNew = () => {
    _setNewDokumentIkkeTilgjengelige(undefined)
    _setNewDokumentIkkeTilgjengeligeForm(false)
    _resetValidationDokumentIkkeTilgjengelige()
  }

  const onStartDokumentTilSendEdit = (s: DokumentTilSend, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editDokumentTilSendIndex !== undefined) {
      dispatch(resetValidation(namespace + '-dokumentTilSend' + getIdx(_editDokumentTilSendIndex)))
    }
    _setEditDokumentTilSend(s)
    _setEditDokumentTilSendIndex(index)
  }

  const onStartDokumentIkkeTilgjengeligeEdit = (d: DokumentIkkeTilgjengelige, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editDokumentIkkeTilgjengeligeIndex !== undefined) {
      dispatch(resetValidation(namespace + '-dokumentIkkeTilgjengelige' + getIdx(_editDokumentIkkeTilgjengeligeIndex)))
    }
    _setEditDokumentIkkeTilgjengelige(d)
    _setEditDokumentIkkeTilgjengeligeIndex(index)
  }

  const onSaveDokumentTilSendEdit = () => {
    const [valid, newValidation] = performValidation<ValidationDokumentTilSendProps>(
      validation, namespace, validateDokumentTilSend, {
        dokument: _editDokumentTilSend,
        dokumenter: dokumenterTilSend,
        index: _editDokumentTilSendIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${targetDokumentTilSend}[${_editDokumentTilSendIndex}]`, _editDokumentTilSend))
      onCloseDokumentTilSendEdit(namespace + '-dokumentTilSend' + getIdx(_editDokumentTilSendIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onSaveDokumentIkkeTilgjengeligeEdit = () => {
    const [valid, newValidation] = performValidation<ValidationDokumentIkkeTilgjengeligeProps>(
      validation, namespace, validateDokumentIkkeTilgjengelige, {
        dokument: _editDokumentIkkeTilgjengelige,
        dokumenter: dokumenterIkkeTilgjengelige,
        index: _editDokumentIkkeTilgjengeligeIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${targetDokumentIkkeTilgjengelige}[${_editDokumentIkkeTilgjengeligeIndex}]`, _editDokumentIkkeTilgjengelige))
      onCloseDokumentIkkeTilgjengeligeEdit(namespace + '-dokumentIkkeTilgjengelige' + getIdx(_editDokumentIkkeTilgjengeligeIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onDokumentTilSendRemove = (removedDokument: DokumentTilSend) => {
    const newDokumenter: Array<DokumentTilSend> = _.reject(dokumenterTilSend,
      (d: DokumentTilSend) => _.isEqual(removedDokument, d))
    dispatch(updateReplySed(targetDokumentTilSend, newDokumenter))
  }

  const onDokumentIkkeTilgjengeligeRemove = (removedDokument: DokumentIkkeTilgjengelige) => {
    const newDokumenter: Array<DokumentIkkeTilgjengelige> = _.reject(dokumenterIkkeTilgjengelige,
      (d: DokumentIkkeTilgjengelige) => _.isEqual(removedDokument, d))
    dispatch(updateReplySed(targetDokumentIkkeTilgjengelige, newDokumenter))
  }

  const onAddDokumentTilSendNew = () => {
    const valid: boolean = _performValidationDokumentTilSend({
      dokument: _newDokumentTilSend,
      dokumenter: dokumenterTilSend,
      personName
    })
    if (!!_newDokumentTilSend && valid) {
      let newDokumenter: Array<DokumentTilSend> | undefined = _.cloneDeep(dokumenterTilSend)
      if (_.isNil(newDokumenter)) {
        newDokumenter = []
      }
      newDokumenter.push(_newDokumentTilSend)
      dispatch(updateReplySed(targetDokumentTilSend, newDokumenter))
      onCloseDokumentTilSendNew()
    }
  }

  const onAddDocumentIkkeTilgjengeligeNew = () => {
    const valid: boolean = _performValidationDokumentIkkeTilgjengelige({
      dokument: _newDokumentIkkeTilgjengelige,
      dokumenter: dokumenterIkkeTilgjengelige,
      personName
    })
    if (!!_newDokumentIkkeTilgjengelige && valid) {
      let newDokumenter: Array<DokumentIkkeTilgjengelige> | undefined = _.cloneDeep(dokumenterIkkeTilgjengelige)
      if (_.isNil(newDokumenter)) {
        newDokumenter = []
      }
      newDokumenter.push(_newDokumentIkkeTilgjengelige)
      dispatch(updateReplySed(targetDokumentIkkeTilgjengelige, newDokumenter))
      onCloseDokumentIkkeTilgjengeligeNew()
    }
  }

  const renderDokumentTilSendRow = (dokumentTilSend: DokumentTilSend | null, index: number) => {
    const _namespace = namespace + '-dokumentTilSend' + getIdx(index)
    const _v: Validation = index < 0 ? _validationDokumentTilSend : validation
    const inEditMode = index < 0 || _editDokumentTilSendIndex === index
    const _dokumentTilSend = index < 0 ? _newDokumentTilSend : (inEditMode ? _editDokumentTilSend : dokumentTilSend)

    const addremovepanel = (
      <AddRemovePanel<DokumentTilSend>
        item={dokumentTilSend}
        marginTop={inEditMode}
        index={index}
        inEditMode={inEditMode}
        onRemove={onDokumentTilSendRemove}
        onAddNew={onAddDokumentTilSendNew}
        onCancelNew={onCloseDokumentTilSendNew}
        onStartEdit={onStartDokumentTilSendEdit}
        onConfirmEdit={onSaveDokumentTilSendEdit}
        onCancelEdit={() => onCloseDokumentTilSendEdit(_namespace)}
      />
    )

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getDokumentTilSendId(dokumentTilSend)}
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
                    value={_dokumentTilSend?.gjelder}
                    data-no-border
                    data-testid={_namespace + '-gjelder'}
                    error={_v[_namespace + '-gjelder']?.feilmelding}
                    id={_namespace + '-gjelder'}
                    legend={t('label:dokument-type') + ' *'}
                    name={_namespace + '-gjelder'}
                    onChange={(type: string) => setDokumentTilSendType(type, index)}
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
                <Column flex='2'>
                  <TextAreaDiv>
                    <TextArea
                      error={_v[_namespace + '-beskrivelse']?.feilmelding}
                      id='info'
                      maxLength={51}
                      label={t('label:dokument-info')}
                      namespace={_namespace}
                      onChanged={(info: string) => setDokumentTilSendInfo(info, index)}
                      value={_dokumentTilSend?.beskrivelse}
                    />
                  </TextAreaDiv>
                </Column>
                <Column>
                  <DateInput
                    error={_v[_namespace + '-dato']?.feilmelding}
                    id='dato'
                    label={t('label:dato')}
                    namespace={_namespace}
                    onChanged={(innenDato: string) => setInnenDato(innenDato, index)}
                    required
                    value={_dokumentTilSend?.innenDato ?? ''}
                  />
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
                    {t('label:' + _dokumentTilSend?.gjelder)}
                  </FormText>
                  <HorizontalSeparatorDiv />
                  <FormText
                    error={_v[_namespace + '-innenDato']?.feilmelding}
                    id={_namespace + '-innenDato'}
                  >
                    {_dokumentTilSend?.innenDato}
                  </FormText>
                  <HorizontalSeparatorDiv />
                  <FormText
                    error={_v[_namespace + '-beskrivelse']?.feilmelding}
                    id={_namespace + '-beskrivelse'}
                  >
                    {_dokumentTilSend?.beskrivelse}
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

  const renderDokumentIkkeTilgjengeligeRow = (dokumentIkkeTilgjengelige: DokumentIkkeTilgjengelige | null, index: number) => {
    const _namespace = namespace + '-dokumentIkkeTilgjengelige' + getIdx(index)
    const _v: Validation = index < 0 ? _validationDokumentIkkeTilgjengelige : validation
    const inEditMode = index < 0 || _editDokumentIkkeTilgjengeligeIndex === index
    const _dokumentIkkeTilgjengelige = index < 0 ? _newDokumentIkkeTilgjengelige : (inEditMode ? _editDokumentIkkeTilgjengelige : dokumentIkkeTilgjengelige)

    const addremovepanel = (
      <AddRemovePanel<DokumentIkkeTilgjengelige>
        item={dokumentIkkeTilgjengelige}
        marginTop={inEditMode}
        index={index}
        inEditMode={inEditMode}
        onRemove={onDokumentIkkeTilgjengeligeRemove}
        onAddNew={onAddDocumentIkkeTilgjengeligeNew}
        onCancelNew={onCloseDokumentIkkeTilgjengeligeNew}
        onStartEdit={onStartDokumentIkkeTilgjengeligeEdit}
        onConfirmEdit={onSaveDokumentIkkeTilgjengeligeEdit}
        onCancelEdit={() => onCloseDokumentIkkeTilgjengeligeEdit(_namespace)}
      />
    )

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getDokumentIkkeTilgjengeligeId(dokumentIkkeTilgjengelige)}
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
                    value={_dokumentIkkeTilgjengelige?.gjelder}
                    data-no-border
                    data-testid={_namespace + '-gjelder'}
                    error={_v[_namespace + '-gjelder']?.feilmelding}
                    id={_namespace + '-gjelder'}
                    legend={t('label:dokument-type') + ' *'}
                    name={_namespace + '-gjelder'}
                    onChange={(type: string) => setDokumentIkkeTilgjengeligeType(type, index)}
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
                <Column flex='2'>
                  <TextAreaDiv>
                    <TextArea
                      error={_v[_namespace + '-beskrivelse']?.feilmelding}
                      id='beskrivelse'
                      maxLength={51}
                      label={t('label:dokument-info')}
                      namespace={_namespace}
                      onChanged={(info: string) => setDokumentIkkeTilgjengeligeInfo(info, index)}
                      value={_dokumentIkkeTilgjengelige?.beskrivelse}
                    />
                  </TextAreaDiv>
                </Column>
                <Column />
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column flex='2'>
                  <RadioPanelGroup
                    value={_dokumentIkkeTilgjengelige?.begrunnelseType}
                    data-no-border
                    data-testid={_namespace + '-begrunnelseType'}
                    error={_v[_namespace + '-begrunnelseType']?.feilmelding}
                    id={_namespace + '-begrunnelseType'}
                    legend={t('label:begrunnelse')}
                    hideLabel={false}
                    required
                    name={_namespace + '-begrunnelseType'}
                    onChange={(begrunnelseType: string) => setBegrunnelseType(begrunnelseType, index)}
                  >
                    <RadioPanel value='01'>{t('el:option-svarpåminnelse-01')}</RadioPanel>
                    <RadioPanel value='02'>{t('el:option-svarpåminnelse-02')}</RadioPanel>
                    <RadioPanel value='03'>{t('el:option-svarpåminnelse-03')}</RadioPanel>
                    <RadioPanel value='99'>{t('el:option-svarpåminnelse-99')}</RadioPanel>
                  </RadioPanelGroup>
                </Column>
                <Column />
              </AlignStartRow>
              <VerticalSeparatorDiv />
              {_dokumentIkkeTilgjengelige?.begrunnelseType === '99' && (
                <AlignStartRow>
                  <Column>
                    <Input
                      error={_v[_namespace + '-begrunnelseAnnen']?.feilmelding}
                      namespace={_namespace}
                      id='begrunnelseAnnen'
                      label={t('label:begrunnelseAnnen')}
                      hideLabel
                      onChanged={(annen: string) => setBegrunnelseAnnen(annen, index)}
                      required
                      value={_dokumentIkkeTilgjengelige?.begrunnelseAnnen}
                    />
                  </Column>
                </AlignStartRow>
              )}
            </>
            )
          : (
            <>
              <AlignStartRow style={{ minHeight: '2.2rem' }}>
                <Column flex='2'>
                  <FlexDiv>
                    <FormText
                      error={_v[_namespace + '-gjelder']?.feilmelding}
                      id={_namespace + '-gjelder'}
                    >
                      {t('label:' + _dokumentIkkeTilgjengelige?.gjelder)}
                    </FormText>
                    <HorizontalSeparatorDiv />
                    <FormText
                      error={_v[_namespace + '-beskrivelse']?.feilmelding}
                      id={_namespace + '-beskrivelse'}
                    >
                      {_dokumentIkkeTilgjengelige?.beskrivelse}
                    </FormText>
                  </FlexDiv>
                </Column>
                <AlignEndColumn>
                  {addremovepanel}
                </AlignEndColumn>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column flex='2'>
                  <FlexDiv>
                    <FormText
                      error={_v[_namespace + '-begrunnelse']?.feilmelding}
                      id={_namespace + '-begrunnelse'}
                    >
                      {t('el:option-svarpåminnelse-' + _dokumentIkkeTilgjengelige?.begrunnelseType)}
                    </FormText>
                    {_dokumentIkkeTilgjengelige?.begrunnelseType === '99' && (
                      <>
                        <HorizontalSeparatorDiv />
                        <FormText
                          error={_v[_namespace + '-begrunnelseAnnen']?.feilmelding}
                          id={_namespace + '-begrunnelseAnnen'}
                        >
                          {_dokumentIkkeTilgjengelige?.begrunnelseAnnen}
                        </FormText>
                      </>
                    )}
                  </FlexDiv>
                </Column>
              </AlignStartRow>
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
      <PaddedDiv>
        <Heading size='small'>
          {t('label:følgende-dokumenter-sendes-senere')}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(dokumenterTilSend)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-dokument')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : dokumenterTilSend?.map(renderDokumentTilSendRow)}
      <VerticalSeparatorDiv />
      {_newDokumentTilSendForm
        ? renderDokumentTilSendRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewDokumentTilSendForm(true)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:dokument-til-send').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <Heading size='small'>
          {t('label:følgende-dokument-er-ikke-tilgjengelige')}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(dokumenterIkkeTilgjengelige)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-dokument')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : dokumenterIkkeTilgjengelige?.map(renderDokumentIkkeTilgjengeligeRow)}
      <VerticalSeparatorDiv />
      {_newDokumentIkkeTilgjengeligeForm
        ? renderDokumentIkkeTilgjengeligeRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewDokumentIkkeTilgjengeligeForm(true)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:dokument-ikke-tilgjengelige').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default SvarPåminnelse
