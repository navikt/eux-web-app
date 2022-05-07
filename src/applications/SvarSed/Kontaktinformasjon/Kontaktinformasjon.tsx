import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Label } from '@navikt/ds-react'
import { AlignStartRow, AlignEndColumn, Column, PaddedDiv, PaddedHorizontallyDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Epost, Telefon, TelefonType } from 'declarations/sed'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
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
  const getTelefonId = (t: Telefon) => t.nummer
  const getEpostId = (e: Epost) => e.adresse

  const [_newNummer, _setNewNummer] = useState<string>('')
  const [_newType, _setNewType] = useState<TelefonType | undefined>(undefined)
  const [_seeNewTelefonForm, _setSeeNewTelefonForm] = useState<boolean>(false)

  const [_newAdresse, _setNewAdresse] = useState<string>('')
  const [_seeNewEpostForm, _setSeeNewEpostForm] = useState<boolean>(false)

  const [_telefonEditing, _setTelefonEditing] = useState<Array<number>>([])
  const [_epostEditing, _setEpostEditing] = useState<Array<number>>([])

  const [_validationTelefon, resetValidationTelefon, _performValidationTelefon] =
    useLocalValidation<ValidationKontaktsinformasjonTelefonProps>(validateKontaktsinformasjonTelefon, namespaceTelefon)
  const [_validationEpost, resetValidationEpost, _performValidationEpost] =
    useLocalValidation<ValidationKontaktsinformasjonEpostProps>(validateKontaktsinformasjonEpost, namespaceEpost)

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidateTelefonerProps>(validation, namespaceTelefon, validateKontaktsinformasjonTelefoner, {
      telefoner, personName
    })
    const [, moreNewValidation] = performValidation<ValidateEposterProps>(newValidation, namespaceEpost, validateKontaktsinformasjonEposter, {
      eposter, personName
    })
    dispatch(setValidation(moreNewValidation))
  })

  const telefonTypeOptions: Options = [
    { label: t('el:option-telefon-type-arbeid'), value: 'arbeid' },
    { label: t('el:option-telefon-type-hjem'), value: 'hjem' },
    { label: t('el:option-telefon-type-mobil'), value: 'mobil' }
  ]

  const onTypeChanged = (type: TelefonType, index: number) => {
    if (index < 0) {
      _setNewType(type.trim() as TelefonType)
      resetValidationTelefon(namespaceTelefon + '-type')
    } else {
      dispatch(updateReplySed(`${targetTelefon}[${index}].type`, type.trim()))
      if (validation[namespaceTelefon + getIdx(index) + '-type']) {
        dispatch(resetValidation(namespaceTelefon + getIdx(index) + '-type'))
      }
    }
  }

  const onNummerChanged = (nummer: string, index: number) => {
    if (index < 0) {
      _setNewNummer(nummer.trim())
      resetValidationTelefon(namespaceTelefon + '-nummer')
    } else {
      dispatch(updateReplySed(`${targetTelefon}[${index}].nummer`, nummer.trim()))
      if (validation[namespaceTelefon + getIdx(index) + '-nummer']) {
        dispatch(resetValidation(namespaceTelefon + getIdx(index) + '-nummer'))
      }
    }
  }

  const onAdresseChanged = (adresse: string, index: number) => {
    if (index < 0) {
      _setNewAdresse(adresse.trim())
      resetValidationEpost(namespaceEpost + '-adresse')
    } else {
      dispatch(updateReplySed(`${targetEpost}[${index}].adresse`, adresse.trim()))
      if (validation[namespaceEpost + getIdx(index) + '-adresse']) {
        dispatch(resetValidation(namespaceEpost + getIdx(index) + '-adresse'))
      }
    }
  }

  const resetForm = (what: string) => {
    if (what === 'telefon') {
      _setNewType(undefined)
      _setNewNummer('')
      resetValidationTelefon()
    }
    if (what === 'epost') {
      _setNewAdresse('')
      resetValidationEpost()
    }
  }

  const onCancel = (what: string) => {
    if (what === 'telefon') _setSeeNewTelefonForm(false)
    if (what === 'epost') _setSeeNewEpostForm(false)
    resetForm(what)
  }

  const onTelefonRemove = (removedTelefon: Telefon) => {
    const newTelefoner: Array<Telefon> = _.reject(telefoner, (t: Telefon) => _.isEqual(removedTelefon, t))
    dispatch(updateReplySed(targetTelefon, newTelefoner))
    standardLogger('svarsed.editor.telefon.remove')
  }

  const onEpostRemove = (removedEpost: Epost) => {
    const newEposter: Array<Epost> = _.reject(eposter, (e: Epost) => _.isEqual(removedEpost, e))
    dispatch(updateReplySed(targetEpost, newEposter))
    standardLogger('svarsed.editor.epost.remove')
  }

  const onTelefonAdd = () => {
    const telefon: Telefon = {
      type: _newType?.trim() as TelefonType,
      nummer: _newNummer?.trim()
    } as Telefon

    const valid: boolean = _performValidationTelefon({
      telefon,
      telefoner,
      personName
    })

    if (valid) {
      let newTelefoner = _.cloneDeep(telefoner)
      if (_.isNil(newTelefoner)) {
        newTelefoner = []
      }
      newTelefoner.push(telefon)
      dispatch(updateReplySed(targetTelefon, newTelefoner))
      standardLogger('svarsed.editor.telefon.add')
      onCancel('telefon')
    }
  }

  const onEpostAdd = () => {
    const epost: Epost = {
      adresse: _newAdresse?.trim()
    } as Epost

    const valid: boolean = _performValidationEpost({
      epost,
      eposter,
      personName
    })

    if (valid) {
      let newEposter = _.cloneDeep(eposter)

      if (_.isNil(newEposter)) {
        newEposter = []
      }
      newEposter.push(epost)
      dispatch(updateReplySed(targetEpost, newEposter))
      standardLogger('svarsed.editor.epost.add')
      onCancel('epost')
    }
  }

  const getErrorFor = (index: number, what: string, el: string): string | undefined => {
    const namespace = what === 'telefon' ? namespaceTelefon : namespaceEpost
    const _validation = what === 'telefon' ? _validationTelefon : _validationEpost
    return index < 0
      ? _validation[namespace + '-' + el]?.feilmelding
      : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const getTypeOption = (value: string | undefined | null) => _.find(telefonTypeOptions, s => s.value === value)

  const renderTelefonRow = (telefon: Telefon | null, index: number) => {
    const idx = getIdx(index)
    const editing: boolean = telefon === null || _.find(_telefonEditing, i => i === index) !== undefined
    const _nummer = index < 0 ? _newNummer : telefon?.nummer
    const _type = index < 0 ? _newType : telefon?.type
    return (
      <RepeatableRow
        className={classNames({ new: index < 0 })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            {editing
              ? (
                <Input
                  ariaLabel={t('label:telefonnummer')}
                  error={getErrorFor(index, 'telefon', 'nummer')}
                  key={namespaceTelefon + idx + '-nummer-' + _nummer}
                  id='nummer'
                  label={t('label:telefonnummer')}
                  hideLabel={index >= 0}
                  namespace={namespaceTelefon + idx}
                  onChanged={(value: string) => onNummerChanged(value, index)}
                  required
                  value={_nummer}
                />
                )
              : (
                <BodyLong>{_nummer}</BodyLong>
                )}
          </Column>
          <Column>
            {editing
              ? (
                <Select
                  data-testid={namespaceTelefon + idx + '-type'}
                  error={getErrorFor(index, 'telefon', 'type')}
                  id={namespaceTelefon + idx + '-type'}
                  key={namespaceTelefon + idx + '-type-' + _type}
                  menuPortalTarget={document.body}
                  onChange={(e: unknown) => onTypeChanged((e as Option).value as TelefonType, index)}
                  options={telefonTypeOptions}
                  label={t('label:type')}
                  hideLabel={index >= 0}
                  required
                  noMarginTop={index >= 0}
                  value={getTypeOption(_type)}
                  defaultValue={getTypeOption(_type)}
                />
                )
              : (
                <BodyLong>{t('el:option-telefon-type-' + _type)}</BodyLong>
                )}
          </Column>
          <Column>
            <AddRemovePanel2<Telefon>
              item={telefon}
              marginTop={index < 0}
              index={index}
              onRemove={onTelefonRemove}
              onAddNew={onTelefonAdd}
              onCancelNew={() => onCancel('telefon')}
              onStartEdit={(s, index) => _setTelefonEditing(_telefonEditing.concat(index))}
              onCancelEdit={(s, index) => _setTelefonEditing(_.filter(_telefonEditing, i => i !== index))}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  const renderEpostRow = (epost: Epost | null, index: number) => {
    const idx = getIdx(index)
    const editing: boolean = epost === null || _.find(_epostEditing, i => i === index) !== undefined
    const _adresse = index < 0 ? _newAdresse : epost?.adresse
    return (
      <RepeatableRow
        className={classNames({ new: index < 0 })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column flex='2'>
            {editing
              ? (
                <Input
                  label={t('label:epost')}
                  ariaLabel={t('label:epost')}
                  error={getErrorFor(index, 'epost', 'adresse')}
                  namespace={namespaceEpost + idx}
                  key={namespaceEpost + idx + '-adresse-' + _adresse}
                  id='adresse'
                  hideLabel={index >= 0}
                  onChanged={(value: string) => onAdresseChanged(value, index)}
                  required
                  value={_adresse}
                />
                )
              : (
                <BodyLong>
                  {_adresse}
                </BodyLong>
                )}
          </Column>
          <AlignEndColumn>
            <AddRemovePanel2<Epost>
              item={epost}
              marginTop={index < 0}
              index={index}
              onRemove={onEpostRemove}
              onAddNew={onEpostAdd}
              onCancelNew={() => onCancel('epost')}
              onStartEdit={(s, index) => _setEpostEditing(_epostEditing.concat(index))}
              onCancelEdit={(s, index) => _setEpostEditing(_.filter(_epostEditing, i => i !== index))}
            />
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <VerticalSeparatorDiv size='2' />
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
                >
                  <AddCircle />
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
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:epost').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Kontaktinformasjon
