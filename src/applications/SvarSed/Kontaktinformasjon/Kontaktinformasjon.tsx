import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  PaddedDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Epost, Telefon, TelefonType } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import {
  ValidateEposterProps,
  validateKontaktsinformasjonEpost,
  validateKontaktsinformasjonEposter,
  validateKontaktsinformasjonTelefon,
  validateKontaktsinformasjonTelefoner,
  ValidateTelefonerProps,
  ValidationKontaktsinformasjonEpostProps,
  ValidationKontaktsinformasjonTelefonProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Kontaktinformasjon: React.FC<MainFormProps> = ({
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
  const targetTelefon = `${personID}.telefon`
  const targetEpost = `${personID}.epost`
  const telefoner: Array<Telefon> = _.get(replySed, targetTelefon)
  const eposter: Array<Epost> = _.get(replySed, targetEpost)
  const namespace = `${parentNamespace}-${personID}-kontaktinformasjon`
  const namespaceTelefon = `${namespace}-telefon`
  const namespaceEpost = `${namespace}-epost`
  const getTelefonId = (t: Telefon | null) => t ? t.nummer : 'new'
  const getEpostId = (e: Epost | null) => e ? e.adresse : 'new'

  const [_newTelefon, _setNewTelefon] = useState<Telefon | undefined>(undefined)
  const [_editTelefon, _setEditTelefon] = useState<Telefon | undefined>(undefined)

  const [_newEpost, _setNewEpost] = useState<Epost | undefined>(undefined)
  const [_editEpost, _setEditEpost] = useState<Epost | undefined>(undefined)

  const [_seeNewTelefonForm, _setSeeNewTelefonForm] = useState<boolean>(false)
  const [_seeNewEpostForm, _setSeeNewEpostForm] = useState<boolean>(false)

  const [_telefonEditIndex, _setTelefonEditIndex] = useState<number | undefined>(undefined)
  const [_epostEditIndex, _setEpostEditIndex] = useState<number | undefined>(undefined)

  const [_validationTelefon, resetValidationTelefon, _performValidationTelefon] =
    useLocalValidation<ValidationKontaktsinformasjonTelefonProps>(validateKontaktsinformasjonTelefon, namespaceTelefon)
  const [_validationEpost, resetValidationEpost, _performValidationEpost] =
    useLocalValidation<ValidationKontaktsinformasjonEpostProps>(validateKontaktsinformasjonEpost, namespaceEpost)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidateTelefonerProps>(
      clonedValidation, namespaceTelefon, validateKontaktsinformasjonTelefoner, {
        telefoner, personName
      }, true)
    performValidation<ValidateEposterProps>(
      clonedValidation, namespaceEpost, validateKontaktsinformasjonEposter, {
        eposter, personName
      })
    dispatch(setValidation(clonedValidation))
  })

  const telefonTypeOptions: Options = [
    { label: t('el:option-telefon-type-arbeid'), value: 'arbeid' },
    { label: t('el:option-telefon-type-hjem'), value: 'hjem' },
    { label: t('el:option-telefon-type-mobil'), value: 'mobil' }
  ]

  const setTelefonType = (type: TelefonType, index: number) => {
    if (index < 0) {
      _setNewTelefon({
        ..._newTelefon,
        type: type.trim() as TelefonType
      } as Telefon)
      resetValidationTelefon(namespaceTelefon + '-type')
      return
    }
    _setEditTelefon({
      ..._editTelefon,
      type: type.trim() as TelefonType
    } as Telefon)
    if (validation[namespace + getIdx(index) + '-type']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-type'))
    }
  }

  const setTelefonNummer = (nummer: string, index: number) => {
    if (index < 0) {
      _setNewTelefon({
        ..._newTelefon,
        nummer: nummer.trim() as string
      } as Telefon)
      resetValidationTelefon(namespaceTelefon + '-nummer')
      return
    }
    _setEditTelefon({
      ..._editTelefon,
      nummer: nummer.trim() as string
    } as Telefon)
    if (validation[namespaceTelefon + getIdx(index) + '-nummer']) {
      dispatch(resetValidation(namespaceTelefon + getIdx(index) + '-nummer'))
    }
  }

  const setEpostAdresse = (adresse: string, index: number) => {
    if (index < 0) {
      _setNewEpost({
        adresse: adresse.trim()
      })
      resetValidationEpost(namespaceEpost + '-adresse')
      return
    }
    _setEditEpost({
      adresse: adresse.trim()
    })
    if (validation[namespaceEpost + getIdx(index) + '-adresse']) {
      dispatch(resetValidation(namespaceEpost + getIdx(index) + '-adresse'))
    }
  }

  const onCloseEdit = (what: string, namespace: string) => {
    if (what === 'telefon') {
      _setEditTelefon(undefined)
      _setTelefonEditIndex(undefined)
    }
    if (what === 'epost') {
      _setEditEpost(undefined)
      _setEpostEditIndex(undefined)
    }
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = (what: string) => {
    if (what === 'telefon') {
      _setNewTelefon(undefined)
      _setSeeNewTelefonForm(false)
      resetValidationTelefon()
    }
    if (what === 'epost') {
      _setNewEpost(undefined)
      _setSeeNewEpostForm(false)
      resetValidationEpost()
    }
  }

  const onStartTelefonEdit = (t: Telefon, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_telefonEditIndex !== undefined) {
      dispatch(resetValidation(namespaceTelefon + getIdx(_telefonEditIndex)))
    }
    _setEditTelefon(t)
    _setTelefonEditIndex(index)
  }

  const onStartEpostEdit = (e: Epost, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_epostEditIndex !== undefined) {
      dispatch(resetValidation(namespaceEpost + getIdx(_epostEditIndex)))
    }
    _setEditEpost(e)
    _setEpostEditIndex(index)
  }

  const onSaveTelefonEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationKontaktsinformasjonTelefonProps>(
      clonedValidation, namespaceTelefon, validateKontaktsinformasjonTelefon, {
        telefon: _editTelefon,
        telefoner,
        index: _telefonEditIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${targetTelefon}[${_telefonEditIndex}]`, _editTelefon))
      onCloseEdit('telefon', namespaceTelefon + getIdx(_telefonEditIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onSaveEpostEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationKontaktsinformasjonEpostProps>(
      clonedValidation, namespaceEpost, validateKontaktsinformasjonEpost, {
        epost: _editEpost,
        eposter,
        index: _epostEditIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${targetEpost}[${_epostEditIndex}]`, _editEpost))
      onCloseEdit('epost', namespaceEpost + getIdx(_epostEditIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onTelefonRemove = (removedTelefon: Telefon) => {
    const newTelefoner: Array<Telefon> = _.reject(telefoner, (t: Telefon) => _.isEqual(removedTelefon, t))
    dispatch(updateReplySed(targetTelefon, newTelefoner))
  }

  const onEpostRemove = (removedEpost: Epost) => {
    const newEposter: Array<Epost> = _.reject(eposter, (e: Epost) => _.isEqual(removedEpost, e))
    dispatch(updateReplySed(targetEpost, newEposter))
  }

  const onTelefonAddNew = () => {
    const valid: boolean = _performValidationTelefon({
      telefon: _newTelefon,
      telefoner,
      personName
    })

    if (!!_newTelefon && valid) {
      let newTelefoner: Array<Telefon> | undefined = _.cloneDeep(telefoner)
      if (_.isNil(newTelefoner)) {
        newTelefoner = []
      }
      newTelefoner.push(_newTelefon)
      dispatch(updateReplySed(targetTelefon, newTelefoner))
      onCloseNew('telefon')
    }
  }

  const onEpostAddNew = () => {
    const valid: boolean = _performValidationEpost({
      epost: _newEpost,
      eposter,
      personName
    })

    if (!!_newEpost && valid) {
      let newEposter: Array<Epost> | undefined = _.cloneDeep(eposter)
      if (_.isNil(newEposter)) {
        newEposter = []
      }
      newEposter.push(_newEpost)
      dispatch(updateReplySed(targetEpost, newEposter))
      onCloseNew('epost')
    }
  }

  const renderTelefonRow = (telefon: Telefon | null, index: number) => {
    const _namespace = namespaceTelefon + getIdx(index)
    const _v: Validation = index < 0 ? _validationTelefon : validation
    const inEditMode = index < 0 || _telefonEditIndex === index
    const _telefon = index < 0 ? _newTelefon : (inEditMode ? _editTelefon : telefon)
    const getTypeOption = (value: string | undefined | null) => _.find(telefonTypeOptions, s => s.value === value)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getTelefonId(telefon)}
        className={classNames({
          new: index < 0,
          error: _v[_namespace + '-nummer'] || _v[_namespace + '-type']
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            {inEditMode
              ? (
                <Input
                  ariaLabel={t('label:telefonnummer')}
                  error={_v[_namespace + '-nummer']?.feilmelding}
                  id='nummer'
                  label={t('label:telefonnummer')}
                  hideLabel={index >= 0}
                  namespace={_namespace}
                  onChanged={(value: string) => setTelefonNummer(value, index)}
                  required
                  value={_telefon?.nummer}
                />
                )
              : (
                <FormText
                  error={_v[_namespace + '-nummer']?.feilmelding}
                  id={_namespace + '-nummer'}
                >
                  <BodyLong>{_telefon?.nummer}</BodyLong>
                </FormText>
                )}
          </Column>
          <Column>
            {inEditMode
              ? (
                <Select
                  data-testid={_namespace + '-type'}
                  error={_v[_namespace + '-type']?.feilmelding}
                  id={_namespace + '-type'}
                  menuPortalTarget={document.body}
                  onChange={(e: unknown) => setTelefonType((e as Option).value as TelefonType, index)}
                  options={telefonTypeOptions}
                  label={t('label:type')}
                  hideLabel={index >= 0}
                  required
                  value={getTypeOption(_telefon?.type)}
                  defaultValue={getTypeOption(_telefon?.type)}
                />
                )
              : (
                <FormText
                  error={_v[_namespace + '-type']?.feilmelding}
                  id={_namespace + '-type'}
                >
                  <BodyLong>{_telefon?.type ? t('el:option-telefon-type-' + _telefon?.type) : ""}</BodyLong>
                </FormText>
                )}
          </Column>
          <Column>
            <AddRemovePanel<Telefon>
              item={telefon}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onTelefonRemove}
              onAddNew={onTelefonAddNew}
              onCancelNew={() => onCloseNew('telefon')}
              onStartEdit={onStartTelefonEdit}
              onConfirmEdit={onSaveTelefonEdit}
              onCancelEdit={() => onCloseEdit('telefon', _namespace)}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  const renderEpostRow = (epost: Epost | null, index: number) => {
    const _namespace = namespaceEpost + getIdx(index)
    const _v: Validation = index < 0 ? _validationEpost : validation
    const inEditMode = index < 0 || _epostEditIndex === index
    const _epost = index < 0 ? _newEpost : (inEditMode ? _editEpost : epost)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getEpostId(epost)}
        className={classNames({
          new: index < 0,
          error: _v[_namespace + '-adresse']
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column flex='2'>
            {inEditMode
              ? (
                <Input
                  label={t('label:epost')}
                  ariaLabel={t('label:epost')}
                  error={_v[_namespace + '-adresse']?.feilmelding}
                  namespace={_namespace}
                  id='adresse'
                  hideLabel={index >= 0}
                  onChanged={(value: string) => setEpostAdresse(value, index)}
                  required
                  value={_epost?.adresse}
                />
                )
              : (
                <FormText
                  error={_v[_namespace + '-adresse']?.feilmelding}
                  id={_namespace + '-adresse'}
                >
                  <BodyLong>{_epost?.adresse}</BodyLong>
                </FormText>
                )}
          </Column>
          <AlignEndColumn>
            <AddRemovePanel<Epost>
              item={epost}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onEpostRemove}
              onAddNew={onEpostAddNew}
              onCancelNew={() => onCloseNew('epost')}
              onStartEdit={onStartEpostEdit}
              onConfirmEdit={onSaveEpostEdit}
              onCancelEdit={() => onCloseEdit('epost', _namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
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
      {_.isEmpty(telefoner)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-telephone')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <AlignStartRow>
                <Column>
                  <Label>
                    {t('label:telefonnummer') + ' *'}
                  </Label>
                </Column>
                <Column>
                  <Label>
                    {t('label:type') + ' *'}
                  </Label>
                </Column>
                <Column />
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {telefoner?.map(renderTelefonRow)}
          </>
          )}
      <VerticalSeparatorDiv />
      {_seeNewTelefonForm
        ? renderTelefonRow(null, -1)
        : (
          <PaddedDiv>
            <AlignStartRow>
              <Column>
                <Button
                  variant='tertiary'
                  onClick={() => _setSeeNewTelefonForm(true)}
                  icon={<PlusCircleIcon/>}
                >
                  {t('el:button-add-new-x', { x: t('label:telefonnummer').toLowerCase() })}
                </Button>
              </Column>
            </AlignStartRow>
          </PaddedDiv>
          )}

      <VerticalSeparatorDiv size='3' />

      {_.isEmpty(eposter)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-email')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <AlignStartRow>
                <Column>
                  <Label>
                    {t('label:epost') + ' *'}
                  </Label>
                </Column>
                <Column />
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {eposter?.map(renderEpostRow)}
          </>
          )}
      <VerticalSeparatorDiv />
      {_seeNewEpostForm
        ? renderEpostRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setSeeNewEpostForm(true)}
              icon={<PlusCircleIcon/>}
            >
              {t('el:button-add-new-x', { x: t('label:epost').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Kontaktinformasjon
