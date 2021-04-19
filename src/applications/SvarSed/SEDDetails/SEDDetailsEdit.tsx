// import { setReplySed } from 'actions/svarpased'
import { setReplySed } from 'actions/svarpased'
import classNames from 'classnames'
import { F002Sed, FSed, Periode, ReplySed, USed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { UndertekstBold } from 'nav-frontend-typografi'
import {
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastRadio,
  HighContrastRadioGroup,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const FlexDiv = styled.div`
  display: flex;
`

export interface SEDDetailsEditProps {
  replySed: ReplySed
  onCancel: () => void
  onSave: () => void
}

const SEDDetailsEdit: React.FC<SEDDetailsEditProps> = ({
  replySed,
  onCancel,
  onSave = () => {}
}: SEDDetailsEditProps): JSX.Element => {
  const { t } = useTranslation()
  const validation: Validation = {}
  const dispatch = useDispatch()

  const [_anmodningsperiode, setAnmodningsperiode] = useState<Periode>((replySed as USed).anmodningsperiode)
  const [_anmodningsperioder, setAnmodningsperioder] = useState<Array<Periode>>((replySed as FSed).anmodningsperioder)

  const [_brukerFornavn, setBrukerFornavn] = useState<string>(replySed.bruker.personInfo.fornavn)
  const [_brukerEtternavn, setBrukerEtternavn] = useState<string>(replySed.bruker.personInfo.etternavn)
  const [_ektefelleFornavn, setEktefelleFornavn] = useState<string>((replySed as F002Sed).ektefelle?.personInfo.fornavn)
  const [_ektefelleEtternavn, setEktefelleEtternavn] = useState<string>((replySed as F002Sed).ektefelle?.personInfo.etternavn)

  const [_sakseier, setSakseier] = useState<string>('')
  const [_typeKrav, setTypeKrav] = useState<string>((replySed as F002Sed).krav.kravType)
  const [_informasjon, setInformasjon] = useState<string>((replySed as F002Sed).krav.kravType)
  const [_opplysninger, setOpplysninger] = useState<string>('')

  const setAnmodningsperiodeStartDato = (e: string) => {
    setAnmodningsperiode({
      ..._anmodningsperiode,
      startdato: e
    })
  }
  const setAnmodningsperiodeSluttDato = (e: string) => {
    setAnmodningsperiode({
      ..._anmodningsperiode,
      sluttdato: e
    })
  }
  const setAnmodningsperioderStartDato = (e: string, i: number) => {
    const newAnmodningsperioder = _.cloneDeep(_anmodningsperioder)
    newAnmodningsperioder[i].startdato = e
    setAnmodningsperioder(newAnmodningsperioder)
  }

  const setAnmodningsperioderSluttDato = (e: string, i: number) => {
    const newAnmodningsperioder = _.cloneDeep(_anmodningsperioder)
    newAnmodningsperioder[i].sluttdato = e
    setAnmodningsperioder(newAnmodningsperioder)
  }

  const saveChanges = () => {
    const newReplySed = _.cloneDeep(replySed)
    newReplySed.bruker.personInfo.fornavn = _brukerFornavn
    dispatch(setReplySed(newReplySed))
    onSave()
  }

  return (
    <>
      <UndertekstBold>
        {t('label:periode')}
      </UndertekstBold>
      <VerticalSeparatorDiv data-size='0.5' />
      {_anmodningsperiode && (
        <>
          <FlexDiv className='slideInFromLeft'>
            <HighContrastInput
              data-test-id='c-seddetails-anmodningsperiode-startdato-date'
              feil={validation['seddetails-anmodningsperiode-startdato']
                ? validation['seddetails-anmodningsperiode-startdato']!.feilmelding
                : undefined}
              id='c-seddetails-anmodningsperiode-startdato-date'
              onChange={(e: any) => setAnmodningsperiodeStartDato(e.target.value)}
              value={_anmodningsperiode.startdato}
              placeholder={t('el:placeholder-date-default')}
            />
            <HorizontalSeparatorDiv data-size='0.35' />
            <HighContrastInput
              data-test-id='c-seddetails-anmodningsperiode-sluttdato-date'
              feil={validation['seddetails-anmodningsperiode-sluttdato']
                ? validation['seddetails-anmodningsperiode-sluttdato']!.feilmelding
                : undefined}
              id='c-seddetails-anmodningsperiode-sluttdato-date'
              onChange={(e: any) => setAnmodningsperiodeSluttDato(e.target.value)}
              value={_anmodningsperiode.sluttdato}
              placeholder={t('el:placeholder-date-default')}
            />
          </FlexDiv>
          <VerticalSeparatorDiv data-size='0.5' />
        </>
      )}
      {_anmodningsperioder && _anmodningsperioder.map((p, i) => (
        <div key={i}>
          <FlexDiv className='slideInFromLeft' style={{ animationDelay: i * 0.1 + 's' }}>
            <HighContrastInput
              data-test-id={'c-seddetails-anmodningsperioder[' + i + ']-startdato-date'}
              feil={validation['seddetails--anmodningsperioder[' + i + ']-startdato']
                ? validation['seddetails--anmodningsperioder[' + i + ']-startdato']!.feilmelding
                : undefined}
              id={'c-seddetails-anmodningsperioder[' + i + ']-startdato-date'}
              onChange={(e: any) => setAnmodningsperioderStartDato(e.target.value, i)}
              value={_anmodningsperioder[i].startdato}
              placeholder={t('el:placeholder-date-default')}
            />
            <HorizontalSeparatorDiv data-size='0.35' />
            <HighContrastInput
              data-test-id={'c-seddetails-anmodningsperioder[' + i + ']-sluttdato-date'}
              feil={validation['seddetails-anmodningsperioder[' + i + ']-sluttdato']
                ? validation['seddetails-anmodningsperioder[' + i + ']-sluttdato']!.feilmelding
                : undefined}
              id={'c-seddetails-anmodningsperioder[' + i + ']-sluttdato-date'}
              onChange={(e: any) => setAnmodningsperioderSluttDato(e.target.value, i)}
              value={_anmodningsperioder[i].sluttdato}
              placeholder={t('el:placeholder-date-default')}
            />
          </FlexDiv>
          <VerticalSeparatorDiv data-size='0.5' />
        </div>
      ))}
      <VerticalSeparatorDiv />
      <UndertekstBold>
        {t('label:søker')}
      </UndertekstBold>
      <VerticalSeparatorDiv data-size='0.5' />
      <FlexDiv className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <HighContrastInput
          data-test-id='c-seddetails-søker-fornavn-text'
          feil={validation['seddetails-søker-fornavn']
            ? validation['seddetails-søker-fornavn']!.feilmelding
            : undefined}
          id='c-seddetails-søker-fornavn-text'
          onChange={(e: any) => setBrukerFornavn(e.target.value)}
          value={_brukerFornavn}
          placeholder={t('label:firstname')}
        />
        <HorizontalSeparatorDiv data-size='0.35' />
        <HighContrastInput
          data-test-id='c-seddetails-søker-etternavn-text'
          feil={validation['seddetails-søker-etternavn']
            ? validation['seddetails-søker-etternavn']!.feilmelding
            : undefined}
          id='c-seddetails-søker-etternavn-text'
          onChange={(e: any) => setBrukerEtternavn(e.target.value)}
          value={_brukerEtternavn}
          placeholder={t('label:lastname')}
        />
      </FlexDiv>
      <VerticalSeparatorDiv />
      <UndertekstBold>
        {t('label:partner')}
      </UndertekstBold>
      <VerticalSeparatorDiv data-size='0.5' />
      <FlexDiv className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <HighContrastInput
          data-test-id='c-seddetails-ektefelle-fornavn-text'
          feil={validation['seddetails-ektefelle-fornavn']
            ? validation['seddetails-ektefelle-fornavn']!.feilmelding
            : undefined}
          id='c-seddetails-ektefelle-fornavn-text'
          onChange={(e: any) => setEktefelleFornavn(e.target.value)}
          value={_ektefelleFornavn}
          placeholder={t('label:firstname')}
        />
        <HorizontalSeparatorDiv data-size='0.35' />
        <HighContrastInput
          data-test-id='c-seddetails-ektefelle-etternavn-text'
          feil={validation['seddetails-ektefelle-etternavn']
            ? validation['seddetails-ektefelle-etternavn']!.feilmelding
            : undefined}
          id='c-seddetails-ektefelle-etternavn-text'
          onChange={(e: any) => setEktefelleEtternavn(e.target.value)}
          value={_ektefelleEtternavn}
          placeholder={t('label:lastname')}
        />
      </FlexDiv>
      <VerticalSeparatorDiv />
      <div className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <HighContrastInput
          data-test-id='c-seddetails-sakseier-text'
          feil={validation['seddetails-sakseier']
            ? validation['seddetails-sakseier']!.feilmelding
            : undefined}
          id='c-seddetails-sakseier-text'
          onChange={(e: any) => setSakseier(e.target.value)}
          value={_sakseier}
          label={t('label:motpart-sakseier')}
          placeholder={t('el:placeholder-input-default')}
        />
      </div>
      <VerticalSeparatorDiv data-size='0.5' />
      <div className='slideInFromLeft' style={{ animationDelay: '0.6s' }}>
        <HighContrastRadioGroup
          legend={t('label:typeKrav')}
          data-test-id='c-seddetails-typeKrav-text'
          feil={validation['seddetails-typeKrav']
            ? validation['seddetails-typeKrav']!.feilmelding
            : undefined}
          id='c-seddetails-typeKrav-text'
        >
          <HighContrastRadio
            name='c-seddetails-typeKrav-text'
            checked={_typeKrav === 'nytt_krav'}
            label={t('app:kravType-nytt_krav')}
            onClick={() => setTypeKrav('nytt_krav')}
          />
          <HighContrastRadio
            checked={_typeKrav === 'endrede_omstendigheter'}
            name='c-seddetails-typeKrav-text'
            label={t('app:kravType-endrede_omstendigheter')}
            onClick={() => setTypeKrav('endrede_omstendigheter')}
          />
        </HighContrastRadioGroup>
      </div>
      <VerticalSeparatorDiv />
      <div className='slideInFromLeft' style={{ animationDelay: '0.7s' }}>
        <HighContrastRadioGroup
          legend={t('label:application-information')}
          data-test-id='c-seddetails-informasjon-text'
          feil={validation['seddetails-informasjon']
            ? validation['seddetails-informasjon']!.feilmelding
            : undefined}
          id='c-seddetails-informasjon-text'
        >
          <HighContrastRadio
            name='c-seddetails-informasjon-text'
            checked={_informasjon === 'vi_bekrefter_leverte_opplysninger'}
            label={t('app:info-confirm-information')}
            onClick={() => setInformasjon('vi_bekrefter_leverte_opplysninger')}
          />
          <HighContrastRadio
            checked={_informasjon === 'gi_oss_punktvise_opplysninger'}
            name='c-seddetails-informasjon-text'
            label={t('app:info-point-information')}
            onClick={() => setInformasjon('gi_oss_punktvise_opplysninger')}
          />
          {_informasjon === 'gi_oss_punktvise_opplysninger' && (
            <div className='slideInFromLeft'>
              <VerticalSeparatorDiv />
              <HighContrastTextArea
                className={classNames({
                  'skjemaelement__input--harFeil':
                    validation['seddetails-opplysninger']
                })}
                data-test-id='c-seddetails-opplysninger-text'
                feil={validation['seddetails-opplysninger']?.feilmelding}
                id='c-seddetails-opplysninger-text'
                label={t('label:opplysninger')}
                maxLength={500}
                placeholder={t('el:placeholder-input-default')}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOpplysninger(e.target.value)}
                style={{ width: '100%', minHeight: '6rem' }}
                value={_opplysninger}
              />
            </div>
          )}
        </HighContrastRadioGroup>
      </div>
      <VerticalSeparatorDiv />
      <div className='slideInFromLeft' style={{ animationDelay: '0.8s' }}>
        <HighContrastHovedknapp
          kompakt mini
          onClick={saveChanges}
        >
          {t('el:button-save')}
        </HighContrastHovedknapp>
        <HorizontalSeparatorDiv data-size='0.5' />
        <HighContrastKnapp
          kompakt mini
          onClick={onCancel}
        >
          {t('el:button-cancel')}
        </HighContrastKnapp>

      </div>
    </>
  )
}

export default SEDDetailsEdit
