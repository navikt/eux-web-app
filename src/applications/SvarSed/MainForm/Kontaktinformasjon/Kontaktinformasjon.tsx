import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Detail, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Epost, Telefon, TelefonType } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import {
  validateKontaktsinformasjonEpost,
  validateKontaktsinformasjonTelefon,
  ValidationKontaktsinformasjonEpostProps,
  ValidationKontaktsinformasjonTelefonProps
} from './validation'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const Kontaktinformasjon: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const targetTelefon = `${personID}.telefon`
  const targetEpost = `${personID}.epost`
  const telefoner: Array<Telefon> = _.get(replySed, targetTelefon)
  const eposter: Array<Epost> = _.get(replySed, targetEpost)
  const namespaceTelefon = `${parentNamespace}-${personID}-kontaktinformasjon-telefon`
  const namespaceEpost = `${parentNamespace}-${personID}-kontaktinformasjon-epost`

  const [_newNummer, _setNewNummer] = useState<string>('')
  const [_newType, _setNewType] = useState<TelefonType | undefined>(undefined)
  const [_seeNewTelefonForm, _setSeeNewTelefonForm] = useState<boolean>(false)

  const [_newAdresse, _setNewAdresse] = useState<string>('')
  const [_seeNewEpostForm, _setSeeNewEpostForm] = useState<boolean>(false)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Telefon | Epost>((it: Telefon | Epost): string => {
    if ((it as Epost).adresse) return (it as Epost).adresse
    return (it as Telefon).type + '-' + (it as Telefon).nummer
  })
  const [_validationTelefon, resetValidationTelefon, performValidationTelefon] =
    useValidation<ValidationKontaktsinformasjonTelefonProps>({}, validateKontaktsinformasjonTelefon)
  const [_validationEpost, resetValidationEpost, performValidationEpost] =
    useValidation<ValidationKontaktsinformasjonEpostProps>({}, validateKontaktsinformasjonEpost)

  const telefonTypeOptions: Options = [{
    label: t('el:option-telefon-type-work'), value: 'arbeid'
  }, {
    label: t('el:option-telefon-type-home'), value: 'hjem'
  }, {
    label: t('el:option-telefon-type-mobile'), value: 'mobil'
  }]

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

  const onTelefonRemoved = (index: number) => {
    const newTelefoner = _.cloneDeep(telefoner)
    const deletedTelefoner: Array<Telefon> = newTelefoner.splice(index, 1)
    if (deletedTelefoner && deletedTelefoner.length > 0) {
      removeFromDeletion(deletedTelefoner[0])
    }
    dispatch(updateReplySed(targetTelefon, newTelefoner))
    standardLogger('svarsed.editor.telefon.remove')
  }

  const onEpostRemoved = (i: number) => {
    const newEposter = _.cloneDeep(eposter)
    const deletedEposter: Array<Epost> = newEposter.splice(i, 1)
    if (deletedEposter && deletedEposter.length > 0) {
      removeFromDeletion(deletedEposter[0])
    }
    dispatch(updateReplySed(targetEpost, newEposter))
    standardLogger('svarsed.editor.epost.remove')
  }

  const onTelefonAdd = () => {
    const newTelefon: Telefon = {
      type: _newType?.trim() as TelefonType,
      nummer: _newNummer?.trim()
    }

    const valid: boolean = performValidationTelefon({
      telefon: newTelefon,
      telefoner,
      namespace: namespaceTelefon,
      personName
    })

    if (valid) {
      let newTelefoner = _.cloneDeep(telefoner)
      if (_.isNil(newTelefoner)) {
        newTelefoner = []
      }
      newTelefoner.push(newTelefon)
      dispatch(updateReplySed(targetTelefon, newTelefoner))
      standardLogger('svarsed.editor.telefon.add')
      onCancel('telefon')
    }
  }

  const onEpostAdd = () => {
    const newEpost: Epost = {
      adresse: _newAdresse?.trim()
    }

    const valid: boolean = performValidationEpost({
      epost: newEpost,
      eposter,
      namespace: namespaceEpost,
      personName
    })

    if (valid) {
      let newEposter = _.cloneDeep(eposter)

      if (_.isNil(newEposter)) {
        newEposter = []
      }
      newEposter.push(newEpost)
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
    const candidateForDeletion = index < 0 ? false : isInDeletion(telefon)
    const idx = getIdx(index)
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <Column>
            <Input
              ariaLabel={t('label:telefonnummer')}
              error={getErrorFor(index, 'telefon', 'nummer')}
              key={namespaceTelefon + idx + '-nummer-' + (index < 0 ? _newNummer : telefon?.nummer)}
              id='nummer'
              label=''
              namespace={namespaceTelefon + idx}
              onChanged={(value: string) => onNummerChanged(value, index)}
              required
              value={index < 0 ? _newNummer : telefon?.nummer}
            />
          </Column>
          <Column>
            <Select
              data-testid={namespaceTelefon + idx + '-type'}
              error={getErrorFor(index, 'telefon', 'type')}
              id={namespaceTelefon + idx + '-type'}
              key={namespaceTelefon + idx + '-type-' + (index < 0 ? _newType : telefon?.type)}
              menuPortalTarget={document.body}
              onChange={(e: unknown) => onTypeChanged((e as Option).value as TelefonType, index)}
              options={telefonTypeOptions}
              value={getTypeOption(index < 0 ? _newType : telefon?.type)}
              defaultValue={getTypeOption(index < 0 ? _newType : telefon?.type)}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop={false}
              onBeginRemove={() => addToDeletion(telefon)}
              onConfirmRemove={() => onTelefonRemoved(index)}
              onCancelRemove={() => removeFromDeletion(telefon)}
              onAddNew={onTelefonAdd}
              onCancelNew={() => onCancel('telefon')}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  const renderEpostRow = (epost: Epost | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(epost)
    const idx = getIdx(index)
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <Column flex='2'>
            <Input
              ariaLabel={t('label:epost')}
              error={getErrorFor(index, 'epost', 'adresse')}
              namespace={namespaceEpost + idx}
              key={namespaceEpost + idx + '-adresse-' + (index < 0 ? _newAdresse : epost?.adresse)}
              id='adresse'
              label=''
              onChanged={(value: string) => onAdresseChanged(value, index)}
              required
              value={index < 0 ? _newAdresse : epost?.adresse}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop={false}
              onBeginRemove={() => addToDeletion(epost)}
              onConfirmRemove={() => onEpostRemoved(index)}
              onCancelRemove={() => removeFromDeletion(epost)}
              onAddNew={onEpostAdd}
              onCancelNew={() => onCancel('epost')}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      <Heading size='small'>
        {t('label:kontaktinformasjon')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <Row>
        <Column>
          {!_.isEmpty(telefoner)
            ? (
              <Detail>
                {t('label:telefonnummer') + ' *'}
              </Detail>
              )
            : (
              <BodyLong>
                {t('message:warning-no-telephone')}
              </BodyLong>
              )}
        </Column>
        <Column>
          {!_.isEmpty(telefoner) && (
            <Detail>
              {t('label:type') + ' *'}
            </Detail>
          )}
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {telefoner?.map(renderTelefonRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewTelefonForm
        ? renderTelefonRow(null, -1)
        : (
          <Row>
            <Column>
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewTelefonForm(true)}
              >
                <AddCircle />
                {t('el:button-add-new-x', { x: t('label:telefonnummer').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv size='3' />
      <Row>
        <Column>
          {!_.isEmpty(eposter)
            ? (
              <Detail>
                {t('label:epost') + ' *'}
              </Detail>
              )
            : (
              <BodyLong>
                {t('message:warning-no-email')}
              </BodyLong>
              )}
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {eposter?.map(renderEpostRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewEpostForm
        ? renderEpostRow(null, -1)
        : (
          <Row>
            <Column>
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewEpostForm(true)}
              >
                <AddCircle />
                {t('el:button-add-new-x', { x: t('label:epost').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Kontaktinformasjon
