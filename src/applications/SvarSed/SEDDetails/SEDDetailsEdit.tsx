import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { validateSEDDetail, ValidationSEDDetailsProps } from 'applications/SvarSed/SEDDetails/validation'
import Add from 'assets/icons/Add'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator, TextAreaDiv } from 'components/StyledComponents'
import { F002Sed, FSed, Periode, ReplySed, USed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { UndertekstBold } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { getIdx } from 'utils/namespace'

export interface SEDDetailsEditProps {
  replySed: ReplySed
}

const SEDDetailsEdit: React.FC<SEDDetailsEditProps> = ({
  replySed
}: SEDDetailsEditProps): JSX.Element => {
  const { t } = useTranslation()
  const validation: Validation = {}
  const dispatch = useDispatch()

  const [_newAnmodningsperioderStartDato, setNewAnmodningsperioderStartDato] = useState<string>('')
  const [_newAnmodningsperioderSluttDato, setNewAnmodningsperioderSluttDato] = useState<string>('')

  const [_sakseier, setSakseier] = useState<string>('')
  const [_typeKrav, setTypeKrav] = useState<string | undefined>((replySed as F002Sed).krav?.kravType)
  const [_informasjon, setInformasjon] = useState<string | undefined>((replySed as F002Sed).krav?.infoType)
  const [_opplysninger, setOpplysninger] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => p.startdato)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationSEDDetailsProps>({}, validateSEDDetail)
  const namespace = 'seddetails'

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

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newAnmodningsperioder: Array<Periode> = _.cloneDeep((replySed as FSed).anmodningsperioder)
    const deletedAnmodningsperioder: Array<Periode> = newAnmodningsperioder.splice(index, 1)
    if (deletedAnmodningsperioder && deletedAnmodningsperioder.length > 0) {
      removeFromDeletion(deletedAnmodningsperioder[0])
    }
    dispatch(updateReplySed('anmodningsperioder', newAnmodningsperioder))
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

  return (
    <>
      <UndertekstBold>
        {t('label:periode')}
      </UndertekstBold>
      <VerticalSeparatorDiv size='0.5' />
      {!_.isNil((replySed as USed).anmodningsperiode) && (
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
      {!_.isNil((replySed as FSed).anmodningsperioder) && (
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
        <HighContrastInput
          data-test-id='seddetails-sakseier'
          feil={validation['seddetails-sakseier']
            ? validation['seddetails-sakseier']!.feilmelding
            : undefined}
          id='seddetails-sakseier'
          onChange={(e: any) => setSakseier(e.target.value)}
          value={_sakseier}
          label={t('label:motpart-sakseier')}
          placeholder={t('el:placeholder-input-default')}
        />
      </div>
      <VerticalSeparatorDiv size='0.5' />
      <div>
        <HighContrastRadioGroup
          legend={t('label:type-krav')}
          data-test-id='seddetails-typeKrav'
          feil={validation['seddetails-typeKrav']
            ? validation['seddetails-typeKrav']!.feilmelding
            : undefined}
          id='seddetails-typeKrav'
        >
          <HighContrastRadio
            name='seddetails-typeKrav'
            checked={_typeKrav === 'nytt_krav'}
            label={t('app:kravType-nytt_krav')}
            onClick={() => setTypeKrav('nytt_krav')}
          />
          <HighContrastRadio
            checked={_typeKrav === 'endrede_omstendigheter'}
            name='seddetails-typeKrav'
            label={t('app:kravType-endrede_omstendigheter')}
            onClick={() => setTypeKrav('endrede_omstendigheter')}
          />
        </HighContrastRadioGroup>
      </div>
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
            checked={_informasjon === 'vi_bekrefter_leverte_opplysninger'}
            label={t('app:info-confirm-information')}
            onClick={() => setInformasjon('vi_bekrefter_leverte_opplysninger')}
          />
          <HighContrastRadio
            checked={_informasjon === 'gi_oss_punktvise_opplysninger'}
            name='seddetails-informasjon'
            label={t('app:info-point-information')}
            onClick={() => setInformasjon('gi_oss_punktvise_opplysninger')}
          />
          {_informasjon === 'gi_oss_punktvise_opplysninger' && (
            <div className='slideInFromLeft'>
              <VerticalSeparatorDiv />
              <TextAreaDiv>
                <TextArea
                  feil={validation['seddetails-opplysninger']?.feilmelding}
                  id='opplysninger'
                  namespace='seddetails'
                  label={t('label:opplysninger')}
                  maxLength={500}
                  onChanged={setOpplysninger}
                  value={_opplysninger}
                />
              </TextAreaDiv>
            </div>
          )}
        </HighContrastRadioGroup>
      </div>
    </>
  )
}

export default SEDDetailsEdit
