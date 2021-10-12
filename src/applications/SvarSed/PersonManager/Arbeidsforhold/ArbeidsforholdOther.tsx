import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import AdresseFC from 'applications/SvarSed/PersonManager/Adresser/Adresse'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse, Periode, PeriodeAnnenForsikring, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Normaltekst } from 'nav-frontend-typografi'
import {
  AlignEndRow,
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validatePeriodeAnnen, ValidationPeriodeAnnenProps } from './validationPeriodeAnnen'

export interface ArbeidsforholdAnnenSelector extends PersonManagerFormSelector {
  replySed: ReplySed | null | undefined
  validation: Validation
}

export interface ArbeidsforholdAnnenProps {
  parentNamespace: string
  target: string
  typeTrygdeforhold: string
}

const mapState = (state: State): ArbeidsforholdAnnenSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdAnnen: React.FC<ArbeidsforholdAnnenProps> = ({
  parentNamespace,
  target,
  typeTrygdeforhold
}: ArbeidsforholdAnnenProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, ArbeidsforholdAnnenSelector>(mapState)
  const dispatch = useDispatch()
  const perioder: Array<PeriodeAnnenForsikring> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newInstitutionsId, _setNewInstitutionsId] = useState<string>('')
  const [_newInstitutionsNavn, _setNewInstitutionsNavn] = useState<string>('')
  const [_newInstitutionsType, _setNewInstitutionsType] = useState<string>('')
  const [_newVirksomhetensart, _setNewVirksomhetensart] = useState<string>('')
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newAdresse, _setNewAdresse] = useState<Adresse | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeAnnenForsikring>(
    (p: PeriodeAnnenForsikring) => p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeAnnenProps>({}, validatePeriodeAnnen)

  const setInstitutionsId = (newInstitutionsId: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsId(newInstitutionsId.trim())
      _resetValidation(namespace + '-institutionsid')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institutionsid`, newInstitutionsId.trim()))
      if (validation[namespace + getIdx(index) + '-institutionsid']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institutionsid'))
      }
    }
  }
  const setInstitutionsNavn = (newInstitutionsNavn: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsNavn(newInstitutionsNavn.trim())
      _resetValidation(namespace + '-institusjonsnavn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjonsnavn`, newInstitutionsNavn.trim()))
      if (validation[namespace + getIdx(index) + '-institusjonsnavn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjonsnavn'))
      }
    }
  }

  const setInstitutionsType = (newInstitutionsType: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsType(newInstitutionsType.trim())
      _resetValidation(namespace + '-institusjonstype')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjonstype`, newInstitutionsType.trim()))
      if (validation[namespace + getIdx(index) + '-institusjonstype']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjonstype'))
      }
    }
  }

  const setVirksomhetensart = (newVirksomhetsart: string, index: number) => {
    if (index < 0) {
      _setNewVirksomhetensart(newVirksomhetsart.trim())
      _resetValidation(namespace + '-virksomhetensart')
    } else {
      dispatch(updateReplySed(`${target}[${index}].virksomhetensart`, newVirksomhetsart.trim()))
      if (validation[namespace + getIdx(index) + '-virksomhetensart']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-virksomhetensart'))
      }
    }
  }

  const setNavn = (newNavn: string, index: number) => {
    if (index < 0) {
      _setNewNavn(newNavn.trim())
      _resetValidation(namespace + '-navn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].navn`, newNavn.trim()))
      if (validation[namespace + getIdx(index) + '-navn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-navn'))
      }
    }
  }

  const setAdresse = (newAdresse: Adresse, index: number) => {
    if (index < 0) {
      _setNewAdresse(newAdresse)
    } else {
      dispatch(updateReplySed(`${target}[${index}].adresse`,newAdresse))
    }
  }

  const resetAdresseValidation = (fullnamespace: string, index: number) => {
    if (index < 0) {
      _resetValidation(fullnamespace)
    } else {
      if (validation[fullnamespace]) {
        dispatch(resetValidation(fullnamespace))
      }
    }
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-startdato')
      _resetValidation(namespace + '-sluttdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode`, periode))
      if (validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
      if (validation[namespace + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const resetForm = () => {
    _setNewInstitutionsNavn('')
    _setNewInstitutionsId('')
    _setNewInstitutionsType('')
    _setNewVirksomhetensart('')
    _setNewNavn('')
    _setNewPeriode({ startdato: '' })
    _setNewAdresse(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PeriodeAnnenForsikring> = _.cloneDeep(perioder) as Array<PeriodeAnnenForsikring>
    const deletedPerioder: Array<PeriodeAnnenForsikring> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderAnnenForsikring' })
  }

  const onAdd = () => {
    const newPeriodeAnnen: PeriodeAnnenForsikring = {
      periode: _newPeriode,
      typeTrygdeforhold: typeTrygdeforhold,
      institusjonsnavn: _newInstitutionsNavn.trim(),
      navn: _newNavn.trim(),
      institusjonsid: _newInstitutionsId.trim(),
      institusjonstype: _newInstitutionsType.trim(),
      virksomhetensart: _newVirksomhetensart.trim(),
      adresse: _newAdresse ?? {} as Adresse
    }

    const valid: boolean = performValidation({
      periodeAnnen: newPeriodeAnnen,
      perioderAnnen: perioder ?? [],
      namespace: namespace
    })
    if (valid) {
      let newPerioderAnnen: Array<PeriodeAnnenForsikring> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderAnnen)) {
        newPerioderAnnen = []
      }
      newPerioderAnnen = newPerioderAnnen.concat(newPeriodeAnnen)
      dispatch(updateReplySed(target, newPerioderAnnen))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderAnnenForsikring' })
      resetForm()
    }
  }

  const renderRow = (periodeAnnen: PeriodeAnnenForsikring | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periodeAnnen)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : periodeAnnen?.periode

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <PeriodeInput
            key={'' + _periode?.startdato + _periode?.sluttdato}
            namespace={namespace}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            setPeriode={(p: Periode) => setPeriode(p, index)}
            value={_periode}
          />
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <Input
              feil={getErrorFor(index, 'institusjonsid')}
              namespace={namespace}
              id='institusjonsid'
              key={'institusjonsid-' + (index < 0 ? _newInstitutionsId : periodeAnnen?.institusjonsid ?? '')}
              label={t('label:institusjonens-id')}
              onChanged={(institusjonsid: string) => setInstitutionsId(institusjonsid, index)}
              value={index < 0 ? _newInstitutionsId : periodeAnnen?.institusjonsid ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'institusjonsnavn')}
              namespace={namespace}
              id='institusjonsnavn'
              key={'institusjonsnavn-' + (index < 0 ? _newInstitutionsNavn : periodeAnnen?.institusjonsnavn ?? '')}
              label={t('label:institusjonens-navn')}
              onChanged={(institusjonsnavn: string) => setInstitutionsNavn(institusjonsnavn, index)}
              value={index < 0 ? _newInstitutionsNavn : periodeAnnen?.institusjonsnavn ?? ''}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <Input
              feil={getErrorFor(index, 'navn')}
              namespace={namespace}
              id='navn'
              key={'navn-' + (index < 0 ? _newNavn : periodeAnnen?.navn ?? '')}
              label={t('label:navn')}
              onChanged={(navn: string) => setNavn(navn, index)}
              value={index < 0 ? _newNavn : periodeAnnen?.navn ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'virksomhetensart')}
              namespace={namespace}
              id='virksomhetensart'
              key={'virksomhetensart-' + (index < 0 ? _newInstitutionsType : periodeAnnen?.virksomhetensart ?? '')}
              label={t('label:virksomhetens-art')}
              onChanged={(virksomhetensart: string) => setVirksomhetensart(virksomhetensart, index)}
              value={index < 0 ? _newVirksomhetensart : periodeAnnen?.virksomhetensart ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AdresseFC
          adresse={(index < 0 ? _newAdresse : periodeAnnen?.adresse)}
          onAdressChanged={(a) => setAdresse(a, index)}
          namespace={namespace + '-adresse'}
          validation={index < 0 ? _validation : validation}
          resetValidation={(fullnamespace: string) => resetAdresseValidation(fullnamespace, index)}
        />
        <VerticalSeparatorDiv />
        <AlignEndRow>
          <Column flex='2'>
            <HighContrastRadioPanelGroup
              checked={_newInstitutionsType}
              data-multiple-line
              data-no-border
              feil={getErrorFor(index, 'institusjonstype')}
              key={namespace + '-institusjonstype-' + _newInstitutionsType}
              data-test-id={namespace + '-institusjonstype'}
              id={namespace + '-institusjonstype'}
              name={namespace + '-institusjonstype'}
              legend={t('label:velg-type') + ' *'}
              radios={[
                { label: t('el:option-institusjonstype-01'), value: 'periode_med_frivillig_uavbrutt_forsikring' },
                { label: t('el:option-institusjonstype-02'), value: 'vederlag_for_ferie_som_ikke_er_tatt_ut' },
                { label: t('el:option-institusjonstype-03'), value: 'annen_periode_behandlet_som_forsikringsperiode' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstitutionsType(e.target.value, index)}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periodeAnnen)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periodeAnnen)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignEndRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      {_.isEmpty(perioder)
        ? (
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
          )
        : perioder?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default ArbeidsforholdAnnen
