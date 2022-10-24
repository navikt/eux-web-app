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
import { BesvarelseUmulig, BesvarelseKommer, X010Sed } from 'declarations/sed'
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
  validateBesvarelseUmulig,
  validateBesvarelseKommer,
  validateSvarPåminnelse,
  ValidationBesvarelseUmuligProps,
  ValidationBesvarelseKommerProps,
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
  const targetBesvarelseKommer = 'besvarelseKommer'
  const targetBesvarelseUmulig = 'besvarelseUmulig'
  const besvarelseKommer: Array<BesvarelseKommer> | undefined = _.get(replySed, targetBesvarelseKommer)
  const besvarelseUmulig: Array<BesvarelseUmulig> | undefined = _.get(replySed, targetBesvarelseUmulig)
  const namespace = `${parentNamespace}-${personID}-svarpåminnelse`

  const getBesvarelseKommerId = (d: BesvarelseKommer | null): string => d ? d.gjelder + '-' + d.beskrivelse + '-' + d.innenDato : 'new'
  const getBesvarelseUmuligId = (d: BesvarelseUmulig | null): string => d ? d.gjelder + '-' + d.begrunnelseType : 'new'

  const [_newBesvarelseKommer, _setNewBesvarelseKommer] = useState<BesvarelseKommer | undefined>(undefined)
  const [_editBesvarelseKommer, _setEditBesvarelseKommer] = useState<BesvarelseKommer | undefined>(undefined)
  const [_newBesvarelseUmulig, _setNewBesvarelseUmulig] = useState<BesvarelseUmulig | undefined>(undefined)
  const [_editBesvarelseUmulig, _setEditBesvarelseUmulig] = useState<BesvarelseUmulig | undefined>(undefined)

  const [_editBesvarelseKommerIndex, _setEditBesvarelseKommerIndex] = useState<number | undefined>(undefined)
  const [_editBesvarelseUmuligIndex, _setEditBesvarelseUmuligIndex] = useState<number | undefined>(undefined)
  const [_newBesvarelseKommerForm, _setNewBesvarelseKommerForm] = useState<boolean>(false)
  const [_newBesvarelseUmuligForm, _setNewBesvarelseUmuligForm] = useState<boolean>(false)
  const [_validationBesvarelseKommer, _resetValidationBesvarelseKommer, _performValidationBesvarelseKommer] =
    useLocalValidation<ValidationBesvarelseKommerProps>(validateBesvarelseKommer, namespace + '-BesvarelseKommer')
  const [_validationBesvarelseUmulig, _resetValidationBesvarelseUmulig, _performValidationBesvarelseUmulig] =
    useLocalValidation<ValidationBesvarelseUmuligProps>(validateBesvarelseUmulig, namespace + '-BesvarelseUmulig')

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationSvarPåminnelseProps>(
      clonedValidation, namespace, validateSvarPåminnelse, {
        besvarelseKommer: _.get((replySed as X010Sed), targetBesvarelseKommer),
        besvarelseUmulig: _.get((replySed as X010Sed), targetBesvarelseUmulig),
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const setBesvarelseKommerType = (gjelder: string, index: number) => {
    if (index < 0) {
      _setNewBesvarelseKommer({
        ..._newBesvarelseKommer,
        gjelder: gjelder.trim()
      } as BesvarelseKommer)
      _resetValidationBesvarelseKommer(namespace + '-BesvarelseKommer-gjelder')
      return
    }
    _setEditBesvarelseKommer({
      ..._editBesvarelseKommer,
      gjelder: gjelder.trim()
    } as BesvarelseKommer)
    if (validation[namespace + '-BesvarelseKommer' + getIdx(index) + '-gjelder']) {
      dispatch(resetValidation(namespace + '-BesvarelseKommer' + getIdx(index) + '-gjelder'))
    }
  }

  const setBesvarelseUmuligType = (gjelder: string, index: number) => {
    if (index < 0) {
      _setNewBesvarelseUmulig({
        ..._newBesvarelseUmulig,
        gjelder: gjelder.trim()
      } as BesvarelseUmulig)
      _resetValidationBesvarelseUmulig(namespace + '-BesvarelseUmulig-gjelder')
      return
    }
    _setEditBesvarelseUmulig({
      ..._editBesvarelseUmulig,
      gjelder: gjelder.trim()
    } as BesvarelseUmulig)
    if (validation[namespace + '-BesvarelseUmulig' + getIdx(index) + '-gjelder']) {
      dispatch(resetValidation(namespace + '-BesvarelseUmulig' + getIdx(index) + '-gjelder'))
    }
  }

  const setBesvarelseKommerInfo = (beskrivelse: string, index: number) => {
    if (index < 0) {
      _setNewBesvarelseKommer({
        ..._newBesvarelseKommer,
        beskrivelse: beskrivelse.trim()
      } as BesvarelseKommer)
      _resetValidationBesvarelseKommer(namespace + '-BesvarelseKommer-beskrivelse')
      return
    }
    _setEditBesvarelseKommer({
      ..._editBesvarelseKommer,
      beskrivelse: beskrivelse.trim()
    } as BesvarelseKommer)
    if (validation[namespace + '-BesvarelseKommer' + getIdx(index) + '-beskrivelse']) {
      dispatch(resetValidation(namespace + '-BesvarelseKommer' + getIdx(index) + '-beskrivelse'))
    }
  }

  const setBesvarelseUmuligInfo = (beskrivelse: string, index: number) => {
    if (index < 0) {
      _setNewBesvarelseUmulig({
        ..._newBesvarelseUmulig,
        beskrivelse: beskrivelse.trim()
      } as BesvarelseUmulig)
      _resetValidationBesvarelseUmulig(namespace + '-BesvarelseUmulig-beskrivelse')
      return
    }
    _setEditBesvarelseUmulig({
      ..._editBesvarelseUmulig,
      beskrivelse: beskrivelse.trim()
    } as BesvarelseUmulig)
    if (validation[namespace + '-BesvarelseUmulig' + getIdx(index) + '-beskrivelse']) {
      dispatch(resetValidation(namespace + '-BesvarelseUmulig' + getIdx(index) + '-beskrivelse'))
    }
  }

  const setInnenDato = (innenDato: string, index: number) => {
    if (index < 0) {
      _setNewBesvarelseKommer({
        ..._newBesvarelseKommer,
        innenDato: innenDato.trim()
      } as BesvarelseKommer)
      _resetValidationBesvarelseKommer(namespace + '-BesvarelseKommer-innenDato')
      return
    }
    _setEditBesvarelseKommer({
      ..._editBesvarelseKommer,
      innenDato: innenDato.trim()
    } as BesvarelseKommer)
    if (validation[namespace + '-BesvarelseKommer' + getIdx(index) + '-innenDato']) {
      dispatch(resetValidation(namespace + '-BesvarelseKommer' + getIdx(index) + '-innenDato'))
    }
  }

  const setBegrunnelseType = (begrunnelseType: string, index: number) => {
    if (index < 0) {
      _setNewBesvarelseUmulig({
        ..._newBesvarelseUmulig,
        begrunnelseType: begrunnelseType.trim()
      } as BesvarelseUmulig)
      _resetValidationBesvarelseKommer(namespace + '-BesvarelseUmulig-begrunnelseType')
      return
    }
    _setEditBesvarelseUmulig({
      ..._editBesvarelseUmulig,
      begrunnelseType: begrunnelseType.trim()
    } as BesvarelseUmulig)
    if (validation[namespace + '-BesvarelseUmulig' + getIdx(index) + '-begrunnelseType']) {
      dispatch(resetValidation(namespace + '-BesvarelseUmulig' + getIdx(index) + '-begrunnelseType'))
    }
  }

  const setBegrunnelseAnnen = (begrunnelseAnnen: string, index: number) => {
    if (index < 0) {
      _setNewBesvarelseUmulig({
        ..._newBesvarelseUmulig,
        begrunnelseAnnen: begrunnelseAnnen.trim()
      } as BesvarelseUmulig)
      _resetValidationBesvarelseKommer(namespace + '-BesvarelseUmulig-begrunnelseAnnen')
      return
    }
    _setEditBesvarelseUmulig({
      ..._editBesvarelseUmulig,
      begrunnelseAnnen: begrunnelseAnnen.trim()
    } as BesvarelseUmulig)
    if (validation[namespace + '-BesvarelseUmulig' + getIdx(index) + '-begrunnelseAnnen']) {
      dispatch(resetValidation(namespace + '-BesvarelseUmulig' + getIdx(index) + '-begrunnelseAnnen'))
    }
  }

  const onCloseBesvarelseKommerEdit = (namespace: string) => {
    _setEditBesvarelseKommer(undefined)
    _setEditBesvarelseKommerIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseBesvarelseUmuligEdit = (namespace: string) => {
    _setEditBesvarelseUmulig(undefined)
    _setEditBesvarelseUmuligIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseBesvarelseKommerNew = () => {
    _setNewBesvarelseKommer(undefined)
    _setNewBesvarelseKommerForm(false)
    _resetValidationBesvarelseKommer()
  }

  const onCloseBesvarelseUmuligNew = () => {
    _setNewBesvarelseUmulig(undefined)
    _setNewBesvarelseUmuligForm(false)
    _resetValidationBesvarelseUmulig()
  }

  const onStartBesvarelseKommerEdit = (s: BesvarelseKommer, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editBesvarelseKommerIndex !== undefined) {
      dispatch(resetValidation(namespace + '-BesvarelseKommer' + getIdx(_editBesvarelseKommerIndex)))
    }
    _setEditBesvarelseKommer(s)
    _setEditBesvarelseKommerIndex(index)
  }

  const onStartBesvarelseUmuligEdit = (d: BesvarelseUmulig, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editBesvarelseUmuligIndex !== undefined) {
      dispatch(resetValidation(namespace + '-BesvarelseUmulig' + getIdx(_editBesvarelseUmuligIndex)))
    }
    _setEditBesvarelseUmulig(d)
    _setEditBesvarelseUmuligIndex(index)
  }

  const onSaveBesvarelseKommerEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationBesvarelseKommerProps>(
      clonedValidation, namespace, validateBesvarelseKommer, {
        dokument: _editBesvarelseKommer,
        dokumenter: besvarelseKommer,
        index: _editBesvarelseKommerIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${targetBesvarelseKommer}[${_editBesvarelseKommerIndex}]`, _editBesvarelseKommer))
      onCloseBesvarelseKommerEdit(namespace + '-BesvarelseKommer' + getIdx(_editBesvarelseKommerIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onSaveBesvarelseUmuligEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationBesvarelseUmuligProps>(
      clonedValidation, namespace, validateBesvarelseUmulig, {
        dokument: _editBesvarelseUmulig,
        dokumenter: besvarelseUmulig,
        index: _editBesvarelseUmuligIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${targetBesvarelseUmulig}[${_editBesvarelseUmuligIndex}]`, _editBesvarelseUmulig))
      onCloseBesvarelseUmuligEdit(namespace + '-BesvarelseUmulig' + getIdx(_editBesvarelseUmuligIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onBesvarelseKommerRemove = (removedDokument: BesvarelseKommer) => {
    const newDokumenter: Array<BesvarelseKommer> = _.reject(besvarelseKommer,
      (d: BesvarelseKommer) => _.isEqual(removedDokument, d))
    dispatch(updateReplySed(targetBesvarelseKommer, newDokumenter))
  }

  const onBesvarelseUmuligRemove = (removedDokument: BesvarelseUmulig) => {
    const newDokumenter: Array<BesvarelseUmulig> = _.reject(besvarelseUmulig,
      (d: BesvarelseUmulig) => _.isEqual(removedDokument, d))
    dispatch(updateReplySed(targetBesvarelseUmulig, newDokumenter))
  }

  const onAddBesvarelseKommerNew = () => {
    const valid: boolean = _performValidationBesvarelseKommer({
      dokument: _newBesvarelseKommer,
      dokumenter: besvarelseKommer,
      personName
    })
    if (!!_newBesvarelseKommer && valid) {
      let newDokumenter: Array<BesvarelseKommer> | undefined = _.cloneDeep(besvarelseKommer)
      if (_.isNil(newDokumenter)) {
        newDokumenter = []
      }
      newDokumenter.push(_newBesvarelseKommer)
      dispatch(updateReplySed(targetBesvarelseKommer, newDokumenter))
      onCloseBesvarelseKommerNew()
    }
  }

  const onAddDocumentIkkeTilgjengeligeNew = () => {
    const valid: boolean = _performValidationBesvarelseUmulig({
      dokument: _newBesvarelseUmulig,
      dokumenter: besvarelseUmulig,
      personName
    })
    if (!!_newBesvarelseUmulig && valid) {
      let newDokumenter: Array<BesvarelseUmulig> | undefined = _.cloneDeep(besvarelseUmulig)
      if (_.isNil(newDokumenter)) {
        newDokumenter = []
      }
      newDokumenter.push(_newBesvarelseUmulig)
      dispatch(updateReplySed(targetBesvarelseUmulig, newDokumenter))
      onCloseBesvarelseUmuligNew()
    }
  }

  const renderBesvarelseKommerRow = (BesvarelseKommer: BesvarelseKommer | null, index: number) => {
    const _namespace = namespace + '-BesvarelseKommer' + getIdx(index)
    const _v: Validation = index < 0 ? _validationBesvarelseKommer : validation
    const inEditMode = index < 0 || _editBesvarelseKommerIndex === index
    const _BesvarelseKommer = index < 0 ? _newBesvarelseKommer : (inEditMode ? _editBesvarelseKommer : BesvarelseKommer)

    const addremovepanel = (
      <AddRemovePanel<BesvarelseKommer>
        item={BesvarelseKommer}
        marginTop={inEditMode}
        index={index}
        inEditMode={inEditMode}
        onRemove={onBesvarelseKommerRemove}
        onAddNew={onAddBesvarelseKommerNew}
        onCancelNew={onCloseBesvarelseKommerNew}
        onStartEdit={onStartBesvarelseKommerEdit}
        onConfirmEdit={onSaveBesvarelseKommerEdit}
        onCancelEdit={() => onCloseBesvarelseKommerEdit(_namespace)}
      />
    )

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getBesvarelseKommerId(BesvarelseKommer)}
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
                    value={_BesvarelseKommer?.gjelder}
                    data-no-border
                    data-testid={_namespace + '-gjelder'}
                    error={_v[_namespace + '-gjelder']?.feilmelding}
                    id={_namespace + '-gjelder'}
                    legend={t('label:type') + ' *'}
                    name={_namespace + '-gjelder'}
                    onChange={(type: string) => setBesvarelseKommerType(type, index)}
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
                      label={t('label:opplysninger')}
                      namespace={_namespace}
                      onChanged={(info: string) => setBesvarelseKommerInfo(info, index)}
                      value={_BesvarelseKommer?.beskrivelse}
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
                    value={_BesvarelseKommer?.innenDato ?? ''}
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
                    {t('label:' + _BesvarelseKommer?.gjelder)}
                  </FormText>
                  <HorizontalSeparatorDiv />
                  <FormText
                    error={_v[_namespace + '-innenDato']?.feilmelding}
                    id={_namespace + '-innenDato'}
                  >
                    {_BesvarelseKommer?.innenDato}
                  </FormText>
                  <HorizontalSeparatorDiv />
                  <FormText
                    error={_v[_namespace + '-beskrivelse']?.feilmelding}
                    id={_namespace + '-beskrivelse'}
                  >
                    {_BesvarelseKommer?.beskrivelse}
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

  const renderBesvarelseUmuligRow = (BesvarelseUmulig: BesvarelseUmulig | null, index: number) => {
    const _namespace = namespace + '-BesvarelseUmulig' + getIdx(index)
    const _v: Validation = index < 0 ? _validationBesvarelseUmulig : validation
    const inEditMode = index < 0 || _editBesvarelseUmuligIndex === index
    const _BesvarelseUmulig = index < 0 ? _newBesvarelseUmulig : (inEditMode ? _editBesvarelseUmulig : BesvarelseUmulig)

    const addremovepanel = (
      <AddRemovePanel<BesvarelseUmulig>
        item={BesvarelseUmulig}
        marginTop={inEditMode}
        index={index}
        inEditMode={inEditMode}
        onRemove={onBesvarelseUmuligRemove}
        onAddNew={onAddDocumentIkkeTilgjengeligeNew}
        onCancelNew={onCloseBesvarelseUmuligNew}
        onStartEdit={onStartBesvarelseUmuligEdit}
        onConfirmEdit={onSaveBesvarelseUmuligEdit}
        onCancelEdit={() => onCloseBesvarelseUmuligEdit(_namespace)}
      />
    )

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getBesvarelseUmuligId(BesvarelseUmulig)}
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
                    value={_BesvarelseUmulig?.gjelder}
                    data-no-border
                    data-testid={_namespace + '-gjelder'}
                    error={_v[_namespace + '-gjelder']?.feilmelding}
                    id={_namespace + '-gjelder'}
                    legend={t('label:type') + ' *'}
                    name={_namespace + '-gjelder'}
                    onChange={(type: string) => setBesvarelseUmuligType(type, index)}
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
                      label={t('label:opplysninger')}
                      namespace={_namespace}
                      onChanged={(info: string) => setBesvarelseUmuligInfo(info, index)}
                      value={_BesvarelseUmulig?.beskrivelse}
                    />
                  </TextAreaDiv>
                </Column>
                <Column />
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column flex='2'>
                  <RadioPanelGroup
                    value={_BesvarelseUmulig?.begrunnelseType}
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
              {_BesvarelseUmulig?.begrunnelseType === '99' && (
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
                      value={_BesvarelseUmulig?.begrunnelseAnnen}
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
                      {t('label:' + _BesvarelseUmulig?.gjelder)}
                    </FormText>
                    <HorizontalSeparatorDiv />
                    <FormText
                      error={_v[_namespace + '-beskrivelse']?.feilmelding}
                      id={_namespace + '-beskrivelse'}
                    >
                      {_BesvarelseUmulig?.beskrivelse}
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
                      {t('el:option-svarpåminnelse-' + _BesvarelseUmulig?.begrunnelseType)}
                    </FormText>
                    {_BesvarelseUmulig?.begrunnelseType === '99' && (
                      <>
                        <HorizontalSeparatorDiv />
                        <FormText
                          error={_v[_namespace + '-begrunnelseAnnen']?.feilmelding}
                          id={_namespace + '-begrunnelseAnnen'}
                        >
                          {_BesvarelseUmulig?.begrunnelseAnnen}
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
      {_.isEmpty(besvarelseKommer)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-dokument')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : besvarelseKommer?.map(renderBesvarelseKommerRow)}
      <VerticalSeparatorDiv />
      {_newBesvarelseKommerForm
        ? renderBesvarelseKommerRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewBesvarelseKommerForm(true)}
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
      {_.isEmpty(besvarelseUmulig)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-dokument')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : besvarelseUmulig?.map(renderBesvarelseUmuligRow)}
      <VerticalSeparatorDiv />
      {_newBesvarelseUmuligForm
        ? renderBesvarelseUmuligRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewBesvarelseUmuligForm(true)}
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
