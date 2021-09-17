import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { State } from 'declarations/reducers'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import { validateSakseier, validateSEDDetail, ValidationSakseierProps, ValidationSEDDetailsProps } from './validation'
import Add from 'assets/icons/Add'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator, TextAreaDiv } from 'components/StyledComponents'
import { F002Sed, FSed, LokaleSakId, Periode, ReplySed, USed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { UndertekstBold } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { isF002Sed, isFSed, isUSed } from 'utils/sed'

export interface SEDDetailsEditProps {
  replySed: ReplySed
}

const SEDDetailsEdit: React.FC<SEDDetailsEditProps> = ({
  replySed
}: SEDDetailsEditProps): JSX.Element => {
  const { t } = useTranslation()
  const validation: Validation = {}
  const dispatch = useDispatch()

  const landkoderList: Array<Kodeverk> | undefined = useSelector((state: State): Array<Kodeverk> | undefined => (state.app.landkoder))

  const [_newAnmodningsperioderStartDato, setNewAnmodningsperioderStartDato] = useState<string>('')
  const [_newAnmodningsperioderSluttDato, setNewAnmodningsperioderSluttDato] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => p.startdato)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationSEDDetailsProps>({}, validateSEDDetail)

  const [_newSakseierSaksnummer, _setNewSakseierSaksnummer] = useState<string>('')
  const [_newSakseierInstitusjonsnavn, _setNewSakseierInstitusjonsnavn] = useState<string>('')
  const [_newSakseierInstitusjonsid, _setNewSakseierInstitusjonsid] = useState<string>('')
  const [_newSakseierLand, _setNewSakseierLand] = useState<string>('')

  const [sakseierAddToDeletion, sakseierRemoveFromDeletion, sakseierIsInDeletion] = useAddRemove<LokaleSakId>((id: LokaleSakId): string => id.institusjonsid)
  const [_sakseierSeeNewForm, _setSakseierSeeNewForm] = useState<boolean>(false)
  const [_sakseierValidation, _sakseierResetValidation, sakseierPerformValidation] = useValidation<ValidationSakseierProps>({}, validateSakseier)

  const namespace = 'seddetails'

  const setSakseierLand = (land: string, index: number) => {
    if (index < 0) {
      _setNewSakseierLand(land.trim())
      _resetValidation(namespace + '-lokaleSakIder-land')
    } else {
      dispatch(updateReplySed(`lokaleSakIder[${index}].land`, land.trim()))
      if (validation[namespace + '-lokaleSakIder' + getIdx(index) + '-land']) {
        dispatch(resetValidation(namespace + '-lokaleSakIder' + getIdx(index) + '-land'))
      }
    }
  }

  const setSakseierInstitusjonsid = (institusjonsid: string, index: number) => {
    if (index < 0) {
      _setNewSakseierInstitusjonsid(institusjonsid.trim())
      _resetValidation(namespace + '-lokaleSakIder-institusjonsid')
    } else {
      dispatch(updateReplySed(`lokaleSakIder[${index}].institusjonsid`, institusjonsid.trim()))
      if (validation[namespace + '-lokaleSakIder' + getIdx(index) + '-institusjonsid']) {
        dispatch(resetValidation(namespace + '-lokaleSakIder' + getIdx(index) + '-institusjonsid'))
      }
    }
  }

  const setSakseierInstitusjonsnavn = (institusjonsnavn: string, index: number) => {
    if (index < 0) {
      _setNewSakseierInstitusjonsnavn(institusjonsnavn.trim())
      _resetValidation(namespace + '-lokaleSakIder-institusjonsnavn')
    } else {
      dispatch(updateReplySed(`lokaleSakIder[${index}].institusjonsnavn`, institusjonsnavn.trim()))
      if (validation[namespace + '-lokaleSakIder' + getIdx(index) + '-institusjonsnavn']) {
        dispatch(resetValidation(namespace + '-lokaleSakIder' + getIdx(index) + '-institusjonsnavn'))
      }
    }
  }

  const setSakseierSaksnummer = (saksnummer: string, index: number) => {
    if (index < 0) {
      _setNewSakseierSaksnummer(saksnummer.trim())
      _resetValidation(namespace + '-lokaleSakIder-saksnummer')
    } else {
      dispatch(updateReplySed(`lokaleSakIder[${index}].saksnummer`, saksnummer.trim()))
      if (validation[namespace + '-lokaleSakIder' + getIdx(index) + '-saksnummer']) {
        dispatch(resetValidation(namespace + '-lokaleSakIder' + getIdx(index) + '-saksnummer'))
      }
    }
  }

  const setInfoPresisering = (infoPresisering: string) => {
    dispatch(updateReplySed('krav.infoPresisering', infoPresisering.trim()))
    if (validation[namespace + '-infoPresisering']) {
      dispatch(resetValidation(namespace + '-infoPresisering'))
    }
  }

  const setKravMottattDato = (kravDato: string) => {
    dispatch(updateReplySed('krav.kravMottattDato', kravDato.trim()))
    if (validation[namespace + '-kravMottattDato']) {
      dispatch(resetValidation(namespace + '-kravMottattDato'))
    }
  }
  const setKravType = (krav: string) => {
    dispatch(updateReplySed('krav.kravType', krav.trim()))
    if (validation[namespace + '-kravType']) {
      dispatch(resetValidation(namespace + '-kravType'))
    }
  }

  const setInfoType = (info: string) => {
    dispatch(updateReplySed('krav.infoType', info.trim()))
    if (validation[namespace + '-infoType']) {
      dispatch(resetValidation(namespace + '-infoType'))
    }
  }

  const setBrukerFornavn = (fornavn: string) => {
    dispatch(updateReplySed('bruker.personInfo.fornavn', fornavn.trim()))
    if (validation[namespace + '-søker-fornavn']) {
      dispatch(resetValidation(namespace + '-søker-fornavn'))
    }
  }

  const setBrukerEtternavn = (etternavn: string) => {
    dispatch(updateReplySed('bruker.personInfo.etternavn', etternavn.trim()))
    if (validation[namespace + '-søker-etternavn']) {
      dispatch(resetValidation(namespace + '-søker-etternavn'))
    }
  }

  const setEktefelleFornavn = (fornavn: string) => {
    dispatch(updateReplySed('ektefelle.personInfo.fornavn', fornavn.trim()))
    if (validation[namespace + '-ektefelle-fornavn']) {
      dispatch(resetValidation(namespace + '-ektefelle-fornavn'))
    }
  }

  const setEktefelleEtternavn = (etternavn: string) => {
    dispatch(updateReplySed('ektefelle.personInfo.etternavn', etternavn.trim()))
    if (validation[namespace + '-ektefelle-etternavn']) {
      dispatch(resetValidation(namespace + '-ektefelle-etternavn'))
    }
  }

  const setAnmodningsperiodeStartDato = (newDate: string) => {
    dispatch(updateReplySed('anmodningsperiode', newDate))
    if (validation[namespace + '-anmodningsperiode-stardato']) {
      dispatch(resetValidation(namespace + '-anmodningsperiode-stardato'))
    }
  }

  const setAnmodningsperiodeSluttDato = (newDate: string) => {
    const newAnmodningsperiode = _.cloneDeep((replySed as USed).anmodningsperiode)
    if (newDate === '') {
      delete newAnmodningsperiode.sluttdato
      newAnmodningsperiode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newAnmodningsperiode.aapenPeriodeType
      newAnmodningsperiode.sluttdato = newDate.trim()
    }
    dispatch(updateReplySed('anmodningsperiode', newAnmodningsperiode))
    if (validation[namespace + '-anmodningsperiode-sluttdato']) {
      dispatch(resetValidation(namespace + '-anmodningsperiode-sluttdato'))
    }
  }

  const setAnmodningsperioderStartDato = (newDate: string, index: number) => {
    if (index < 0) {
      setNewAnmodningsperioderStartDato(newDate.trim())
      _resetValidation(namespace + '-anmodningsperioder-stardato')
    } else {
      dispatch(updateReplySed(`anmodningsperioder[${index}]`, newDate))
      if (validation[namespace + '-anmodningsperioder' + getIdx(index) + '-stardato']) {
        dispatch(resetValidation(namespace + '-anmodningsperiode' + getIdx(index) + '-stardato'))
      }
    }
  }

  const setAnmodningsperioderSluttDato = (newDate: string, index: number) => {
    if (index < 0) {
      setNewAnmodningsperioderSluttDato(newDate.trim())
      _resetValidation(namespace + '-anmodningsperioder-sluttdato')
    } else {
      const newAnmodningsperioder = _.cloneDeep((replySed as FSed).anmodningsperioder)
      if (newDate === '') {
        delete newAnmodningsperioder[index].sluttdato
        newAnmodningsperioder[index].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newAnmodningsperioder[index].aapenPeriodeType
        newAnmodningsperioder[index].sluttdato = newDate.trim()
      }
      dispatch(updateReplySed('anmodningsperioder', newAnmodningsperioder))
      if (validation[namespace + '-anmodningsperioder' + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + '-anmodningsperioder' + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const resetForm = () => {
    setNewAnmodningsperioderStartDato('')
    setNewAnmodningsperioderSluttDato('')
    _resetValidation()
  }

  const sakseierResetForm = () => {
    _setNewSakseierInstitusjonsid('')
    _setNewSakseierInstitusjonsnavn('')
    _setNewSakseierLand('')
    _setNewSakseierSaksnummer('')
    _sakseierResetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onSakeierCancel = () => {
    _setSakseierSeeNewForm(false)
    sakseierResetForm()
  }

  const onRemove = (index: number) => {
    const newAnmodningsperioder: Array<Periode> = _.cloneDeep((replySed as FSed).anmodningsperioder)
    const deletedAnmodningsperioder: Array<Periode> = newAnmodningsperioder.splice(index, 1)
    if (deletedAnmodningsperioder && deletedAnmodningsperioder.length > 0) {
      removeFromDeletion(deletedAnmodningsperioder[0])
    }
    dispatch(updateReplySed('anmodningsperioder', newAnmodningsperioder))
  }

  const onSakeierRemove = (index: number) => {
    const newLokaleSaksIds: Array<LokaleSakId> = _.cloneDeep((replySed as USed).lokaleSakIder)
    const deletedLokaleSaksIds: Array<LokaleSakId> = newLokaleSaksIds.splice(index, 1)
    if (deletedLokaleSaksIds && deletedLokaleSaksIds.length > 0) {
      sakseierRemoveFromDeletion(deletedLokaleSaksIds[0])
    }
    dispatch(updateReplySed('lokaleSakIder', newLokaleSaksIds))
  }

  const onAdd = () => {
    const newPeriode: Periode = {
      startdato: _newAnmodningsperioderStartDato.trim()
    }
    if (_newAnmodningsperioderSluttDato) {
      newPeriode.sluttdato = _newAnmodningsperioderSluttDato.trim()
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }

    const valid: boolean = performValidation({
      anmodningsperiode: newPeriode,
      namespace: namespace
    })
    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep((replySed as FSed).anmodningsperioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(newPeriode)
      dispatch(updateReplySed('anmodningsperioder', newPerioder))
      resetForm()
    }
  }

  const onSakseierAdd = () => {
    const newLokaleSaksId: LokaleSakId = {
      saksnummer: _newSakseierSaksnummer.trim(),
      institusjonsid: _newSakseierInstitusjonsid.trim(),
      institusjonsnavn: _newSakseierInstitusjonsnavn.trim(),
      land: _newSakseierLand
    }

    const valid: boolean = sakseierPerformValidation({
      lokaleSakId: newLokaleSaksId,
      namespace: namespace
    })
    if (valid) {
      let newLokaleSaksIder: Array<LokaleSakId> = _.cloneDeep((replySed as USed).lokaleSakIder)
      if (_.isNil(newLokaleSaksIder)) {
        newLokaleSaksIder = []
      }
      newLokaleSaksIder = newLokaleSaksIder.concat(newLokaleSaksId)
      dispatch(updateReplySed('lokaleSakIder', newLokaleSaksIder))
      sakseierResetForm()
    }
  }

  const renderPeriode = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    const getErrorFor = (index: number, el: string): string | undefined => {
      return index < 0
        ? _validation[namespace + '-anmodningsperioder' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-anmodningsperioder' + idx + '-' + el]?.feilmelding
    }
    const startdato = index < 0 ? _newAnmodningsperioderStartDato : periode?.startdato
    const sluttdato = index < 0 ? _newAnmodningsperioderSluttDato : periode?.sluttdato
    return (
      <>
        <AlignStartRow>
          <Period
            key={'' + startdato + sluttdato}
            namespace={namespace + '-perioder' + getIdx(index)}
            errorStartDato={getErrorFor(index, 'startdato')}
            errorSluttDato={getErrorFor(index, 'sluttdato')}
            setStartDato={(dato: string) => setAnmodningsperioderStartDato(dato, index)}
            setSluttDato={(dato: string) => setAnmodningsperioderSluttDato(dato, index)}
            valueStartDato={startdato}
            valueSluttDato={sluttdato}
          />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periode)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periode)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </>
    )
  }

  const renderLokaleSakId = (lokaleSakId: LokaleSakId | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : sakseierIsInDeletion(lokaleSakId)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    const getErrorFor = (index: number, el: string): string | undefined => {
      return index < 0
        ? _sakseierValidation[namespace + '-lokaleSakIder' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-lokaleSakIder' + idx + '-' + el]?.feilmelding
    }

    return (
      <>
        <AlignStartRow>
          <Column>
            <Input
              feil={getErrorFor(index, 'saksnummer')}
              namespace={namespace}
              key={namespace + '-lokaleSakIder-saksnummer' + (index < 0 ? _newSakseierSaksnummer : lokaleSakId?.saksnummer)}
              id='-saksnummer'
              label={t('label:saksnummer') + ' *'}
              onChanged={(saksnummer: string) => setSakseierSaksnummer(saksnummer, index)}
              value={(index < 0 ? _newSakseierSaksnummer : lokaleSakId?.saksnummer) ?? ''}
            />
          </Column>
          <Column>
            <CountrySelect
              ariaLabel={t('label:land')}
              closeMenuOnSelect
              data-test-id={namespace + '-lokaleSakIder' + idx + '-land'}
              error={getErrorFor(index, 'land')}
              flagWave
              key={namespace + '-lokaleSakIder' + idx + '-land' + (index < 0 ? _newSakseierLand : lokaleSakId?.land)}
              id={namespace + '-lokaleSakIder' + idx + '-land'}
              label={t('label:land')}
              includeList={landkoderList?.map((l: Kodeverk) => l.kode) || []}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => setSakseierLand(e.value, index)}
              required
              values={(index < 0 ? _newSakseierLand : lokaleSakId?.land)}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              feil={getErrorFor(index, 'institusjonsid')}
              namespace={namespace}
              key={namespace + '-lokaleSakIder-institusjonsid' + lokaleSakId?.institusjonsid}
              id='-institusjonsid'
              label={t('label:institusjonens-id') + ' *'}
              onChanged={(institusjonsid: string) => setSakseierInstitusjonsid(institusjonsid, index)}
              value={lokaleSakId?.institusjonsid ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'institusjonsnavn')}
              namespace={namespace}
              key={namespace + '-lokaleSakIder-institusjonsnavn' + lokaleSakId?.institusjonsnavn}
              id='-institusjonsnavn'
              label={t('label:institusjonens-navn') + ' *'}
              onChanged={(institusjonsnavn: string) => setSakseierInstitusjonsnavn(institusjonsnavn, index)}
              value={lokaleSakId?.institusjonsnavn ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => sakseierAddToDeletion(lokaleSakId)}
              onConfirmRemove={() => onSakeierRemove(index)}
              onCancelRemove={() => sakseierRemoveFromDeletion(lokaleSakId)}
              onAddNew={onSakseierAdd}
              onCancelNew={onSakeierCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </>
    )
  }

  return (
    <>
      <UndertekstBold>
        {t('label:periode')}
      </UndertekstBold>
      <VerticalSeparatorDiv size='0.5' />
      {isUSed(replySed) && (
        <>
          <AlignStartRow>
            <Period
              key={'' + (replySed as USed).anmodningsperiode.startdato + (replySed as USed).anmodningsperiode.sluttdato}
              namespace={namespace + '-anmodningsperiode'}
              errorStartDato={validation[namespace + '-anmodningsperiode-startdato']?.feilmelding}
              errorSluttDato={validation[namespace + '-anmodningsperiode-sluttdato']?.feilmelding}
              setStartDato={setAnmodningsperiodeStartDato}
              setSluttDato={setAnmodningsperiodeSluttDato}
              valueStartDato={(replySed as USed).anmodningsperiode.startdato ?? ''}
              valueSluttDato={(replySed as USed).anmodningsperiode.sluttdato ?? ''}
            />
          </AlignStartRow>
          <VerticalSeparatorDiv size='0.5' />
        </>
      )}
      {isFSed(replySed) && (
        <>
          {(replySed as FSed)?.anmodningsperioder?.map(renderPeriode)}
          <VerticalSeparatorDiv />
          <HorizontalLineSeparator />
          <VerticalSeparatorDiv />
          {_seeNewForm
            ? renderPeriode(null, -1)
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
          <VerticalSeparatorDiv />
        </>
      )}
      <VerticalSeparatorDiv />
      <UndertekstBold>
        {t('label:søker')}
      </UndertekstBold>
      <VerticalSeparatorDiv size='0.5' />
      <AlignStartRow>
        <Column>
          <Input
            feil={validation[namespace + '-søker-fornavn']?.feilmelding}
            namespace={namespace}
            key={namespace + '-søker-fornavn' + replySed.bruker.personInfo.fornavn}
            id='-søker-fornavn'
            label={t('label:fornavn') + ' *'}
            onChanged={setBrukerFornavn}
            value={replySed.bruker.personInfo.fornavn ?? ''}
          />
        </Column>
        <HorizontalSeparatorDiv size='0.35' />
        <Column>
          <Input
            feil={validation[namespace + '-søker-etternavn']?.feilmelding}
            namespace={namespace}
            key={namespace + '-søker-etternavn' + replySed.bruker.personInfo.etternavn}
            id='-søker-etternavn'
            label={t('label:etternavn') + ' *'}
            onChanged={setBrukerEtternavn}
            value={replySed.bruker.personInfo.etternavn ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {isUSed(replySed) && (
        <>
          <UndertekstBold>
            {t('label:motpart-sakseier')}
          </UndertekstBold>
          <VerticalSeparatorDiv size='0.5' />
          {(replySed as USed)?.lokaleSakIder?.map(renderLokaleSakId)}
          <VerticalSeparatorDiv />
          <HorizontalLineSeparator />
          <VerticalSeparatorDiv />
          {_sakseierSeeNewForm
            ? renderLokaleSakId(null, -1)
            : (
              <Row>
                <Column>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => _setSakseierSeeNewForm(true)}
                  >
                    <Add />
                    <HorizontalSeparatorDiv size='0.5' />
                    {t('el:button-add-new-x', { x: t('label:motpart-sakseier').toLowerCase() })}
                  </HighContrastFlatknapp>
                </Column>
              </Row>
              )}
          <VerticalSeparatorDiv />
        </>
      )}
      {isF002Sed(replySed) && (
        <>
          <UndertekstBold>
            {t('label:partner')}
          </UndertekstBold>
          <VerticalSeparatorDiv size='0.5' />
          <AlignStartRow>
            <Column>
              <Input
                feil={validation[namespace + '-ektefelle-fornavn']?.feilmelding}
                namespace={namespace}
                key={namespace + '-ektefelle-fornavn' + (replySed as F002Sed).ektefelle.personInfo.fornavn}
                id='-ektefelle-fornavn'
                label={t('label:fornavn') + ' *'}
                onChanged={setEktefelleFornavn}
                value={(replySed as F002Sed).ektefelle.personInfo.fornavn ?? ''}
              />
            </Column>
            <HorizontalSeparatorDiv size='0.35' />
            <Column>
              <Input
                feil={validation[namespace + '-ektefelle-etternavn']?.feilmelding}
                namespace={namespace}
                key={namespace + '-ektefelle-etternavn' + (replySed as F002Sed).ektefelle.personInfo.etternavn}
                id='-ektefelle-etternavn'
                label={t('label:etternavn') + ' *'}
                onChanged={setEktefelleEtternavn}
                value={(replySed as F002Sed).ektefelle.personInfo.etternavn ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <div>
            <HighContrastRadioGroup
              legend={t('label:type-krav')}
              data-test-id='seddetails-typeKrav'
              feil={validation['seddetails-typeKrav']?.feilmelding}
              id='seddetails-kravType'
            >
              <HighContrastRadio
                name='seddetails-typeKrav'
                checked={(replySed as F002Sed).krav.kravType === 'nytt_krav'}
                label={t('app:kravType-nytt_krav')}
                onClick={() => setKravType('nytt_krav')}
              />
              <HighContrastRadio
                checked={(replySed as F002Sed).krav.kravType === 'endrede_omstendigheter'}
                name='seddetails-typeKrav'
                label={t('app:kravType-endrede_omstendigheter')}
                onClick={() => setKravType('endrede_omstendigheter')}
              />
            </HighContrastRadioGroup>
          </div>
          <VerticalSeparatorDiv />
          <DateInput
            feil={validation[namespace + '-kravMottattDato']?.feilmelding}
            namespace={namespace}
            key={(replySed as F002Sed).krav.kravMottattDato ?? ''}
            id='kravMottattDato'
            label={t('label:krav-mottatt-dato')}
            onChanged={setKravMottattDato}
            value={(replySed as F002Sed).krav.kravMottattDato}
          />
          <VerticalSeparatorDiv />
          <div>
            <HighContrastRadioGroup
              legend={t('label:informasjon-om-søknaden')}
              data-test-id='seddetails-informasjon'
              feil={validation['seddetails-informasjon']
                ? validation['seddetails-informasjon']!.feilmelding
                : undefined}
              id='seddetails-informasjon'
            >
              <HighContrastRadio
                name='seddetails-informasjon'
                checked={(replySed as F002Sed).krav?.infoType === 'vi_bekrefter_leverte_opplysninger'}
                label={t('app:info-confirm-information')}
                onClick={() => setInfoType('vi_bekrefter_leverte_opplysninger')}
              />
              <HighContrastRadio
                checked={(replySed as F002Sed).krav?.infoType === 'gi_oss_punktvise_opplysninger'}
                name='seddetails-informasjon'
                label={t('app:info-point-information')}
                onClick={() => setInfoType('gi_oss_punktvise_opplysninger')}
              />
              {(replySed as F002Sed).krav?.infoType === 'gi_oss_punktvise_opplysninger' && (
                <div className='slideInFromLeft'>
                  <VerticalSeparatorDiv />
                  <TextAreaDiv>
                    <TextArea
                      feil={validation['seddetails-opplysninger']?.feilmelding}
                      id='opplysninger'
                      namespace='seddetails'
                      label={t('label:opplysninger')}
                      maxLength={500}
                      onChanged={setInfoPresisering}
                      value={(replySed as F002Sed).krav?.infoPresisering ?? ''}
                    />
                  </TextAreaDiv>
                </div>
              )}
            </HighContrastRadioGroup>
          </div>
        </>
      )}
    </>
  )
}

export default SEDDetailsEdit
