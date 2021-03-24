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
  const [_avsenderinstitusjon, setAvsenderinstitusjon] = useState<string>('')
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
        {t('label:periode')}:
      </UndertekstBold>
      <VerticalSeparatorDiv data-size='0.5' />
      {_anmodningsperiode && (
        <>
          <FlexDiv className='slideInFromLeft'>
            <HighContrastInput
              data-test-id='c-seddetails-anmodningsperiode-startdato-input'
              feil={validation['seddetails-anmodningsperiode-startdato']
                ? validation['seddetails-anmodningsperiode-startdato']!.feilmelding
                : undefined}
              id='c-seddetails-anmodningsperiode-startdato-input'
              onChange={(e: any) => setAnmodningsperiodeStartDato(e.target.value)}
              value={_anmodningsperiode.startdato}
              placeholder={t('el:placeholder-date-default')}
            />
            <HorizontalSeparatorDiv data-size='0.35' />
            <HighContrastInput
              data-test-id='c-seddetails-anmodningsperiode-sluttdato-input'
              feil={validation['seddetails-anmodningsperiode-sluttdato']
                ? validation['seddetails-anmodningsperiode-sluttdato']!.feilmelding
                : undefined}
              id='c-seddetails-anmodningsperiode-sluttdato-input'
              onChange={(e: any) => setAnmodningsperiodeSluttDato(e.target.value)}
              value={_anmodningsperiode.sluttdato}
              placeholder={t('el:placeholder-date-default')}
            />
          </FlexDiv>
          <VerticalSeparatorDiv data-size='0.5' />
        </>
      )}
      {_anmodningsperioder && _anmodningsperioder.map((p, i) => (
        <>
          <FlexDiv className='slideInFromLeft' style={{ animationDelay: i * 0.1 + 's' }}>
            <HighContrastInput
              data-test-id={'c-seddetails-anmodningsperioder[' + i + ']-startdato-input'}
              feil={validation['seddetails--anmodningsperioder[' + i + ']-startdato']
                ? validation['seddetails--anmodningsperioder[' + i + ']-startdato']!.feilmelding
                : undefined}
              id={'c-seddetails-anmodningsperioder[' + i + ']-startdato-input'}
              onChange={(e: any) => setAnmodningsperioderStartDato(e.target.value, i)}
              value={_anmodningsperioder[i].startdato}
              placeholder={t('el:placeholder-date-default')}
            />
            <HorizontalSeparatorDiv data-size='0.35' />
            <HighContrastInput
              data-test-id={'c-seddetails-anmodningsperioder[' + i + ']-sluttdato-input'}
              feil={validation['seddetails-anmodningsperioder[' + i + ']-sluttdato']
                ? validation['seddetails-anmodningsperioder[' + i + ']-sluttdato']!.feilmelding
                : undefined}
              id={'c-seddetails-anmodningsperioder[' + i + ']-sluttdato-input'}
              onChange={(e: any) => setAnmodningsperioderSluttDato(e.target.value, i)}
              value={_anmodningsperioder[i].sluttdato}
              placeholder={t('el:placeholder-date-default')}
            />
          </FlexDiv>
          <VerticalSeparatorDiv data-size='0.5' />
        </>
      ))}
      <VerticalSeparatorDiv />
      <UndertekstBold>
        {t('label:searcher')}
      </UndertekstBold>
      <VerticalSeparatorDiv data-size='0.5' />
      <FlexDiv className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <HighContrastInput
          data-test-id='c-seddetails-søker-fornavn-input'
          feil={validation['seddetails-søker-fornavn']
            ? validation['seddetails-søker-fornavn']!.feilmelding
            : undefined}
          id='c-seddetails-søker-fornavn-input'
          onChange={(e: any) => setBrukerFornavn(e.target.value)}
          value={_brukerFornavn}
          placeholder={t('label:firstname')}
        />
        <HorizontalSeparatorDiv data-size='0.35' />
        <HighContrastInput
          data-test-id='c-seddetails-søker-etternavn-input'
          feil={validation['seddetails-søker-etternavn']
            ? validation['seddetails-søker-etternavn']!.feilmelding
            : undefined}
          id='c-seddetails-søker-etternavn-input'
          onChange={(e: any) => setBrukerEtternavn(e.target.value)}
          value={_brukerEtternavn}
          placeholder={t('label:lastname')}
        />
      </FlexDiv>
      <VerticalSeparatorDiv />
      <UndertekstBold>
        {t('app:relationship-ektefelle')}
      </UndertekstBold>
      <VerticalSeparatorDiv data-size='0.5' />
      <FlexDiv className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <HighContrastInput
          data-test-id='c-seddetails-ektefelle-fornavn-input'
          feil={validation['seddetails-ektefelle-fornavn']
            ? validation['seddetails-ektefelle-fornavn']!.feilmelding
            : undefined}
          id='c-seddetails-ektefelle-fornavn-input'
          onChange={(e: any) => setEktefelleFornavn(e.target.value)}
          value={_ektefelleFornavn}
          placeholder={t('label:firstname')}
        />
        <HorizontalSeparatorDiv data-size='0.35' />
        <HighContrastInput
          data-test-id='c-seddetails-ektefelle-etternavn-input'
          feil={validation['seddetails-ektefelle-etternavn']
            ? validation['seddetails-ektefelle-etternavn']!.feilmelding
            : undefined}
          id='c-seddetails-ektefelle-etternavn-input'
          onChange={(e: any) => setEktefelleEtternavn(e.target.value)}
          value={_ektefelleEtternavn}
          placeholder={t('label:lastname')}
        />
      </FlexDiv>
      <VerticalSeparatorDiv />
      <div className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <HighContrastInput
          data-test-id='c-seddetails-sakseier-input'
          feil={validation['seddetails-sakseier']
            ? validation['seddetails-sakseier']!.feilmelding
            : undefined}
          id='c-seddetails-sakseier-input'
          onChange={(e: any) => setSakseier(e.target.value)}
          value={_sakseier}
          label={t('label:caseOwner')}
          placeholder={t('el:placeholder-input-default')}
        />
      </div>
      <VerticalSeparatorDiv data-size='0.5' />
      <div className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <HighContrastInput
          data-test-id='c-seddetails-avsenderinstitusjon-input'
          feil={validation['seddetails-avsenderinstitusjon']
            ? validation['seddetails-avsenderinstitusjon']!.feilmelding
            : undefined}
          id='c-seddetails-avsenderinstitusjon-input'
          onChange={(e: any) => setAvsenderinstitusjon(e.target.value)}
          value={_avsenderinstitusjon}
          label={t('label:sender')}
          placeholder={t('el:placeholder-input-default')}
        />
      </div>
      <VerticalSeparatorDiv />
      <div className='slideInFromLeft' style={{ animationDelay: '0.6s' }}>
        <HighContrastRadioGroup
          legend={t('label:typeKrav')}
          data-test-id='c-seddetails-typeKrav-radiogroup'
          feil={validation['seddetails-typeKrav']
            ? validation['seddetails-typeKrav']!.feilmelding
            : undefined}
          id='c-seddetails-typeKrav-radiogroup'
        >
          <HighContrastRadio
            name='c-seddetails-typeKrav-radiogroup'
            checked={_typeKrav === 'nytt_krav'}
            label={t('app:kravType-nytt_krav')}
            onClick={() => setTypeKrav('nytt_krav')}
          />
          <HighContrastRadio
            checked={_typeKrav === 'endrete_omstendigheter'}
            name='c-seddetails-typeKrav-radiogroup'
            label={t('app:kravType-endrete_omstendigheter')}
            onClick={() => setTypeKrav('endrete_omstendigheter')}
          />
        </HighContrastRadioGroup>
      </div>
      <VerticalSeparatorDiv />
      <div className='slideInFromLeft' style={{ animationDelay: '0.7s' }}>
        <HighContrastRadioGroup
          legend={t('label:application-information')}
          data-test-id='c-seddetails-informasjon-radiogroup'
          feil={validation['seddetails-informasjon']
            ? validation['seddetails-informasjon']!.feilmelding
            : undefined}
          id='c-seddetails-informasjon-radiogroup'
        >
          <HighContrastRadio
            name='c-seddetails-informasjon-radiogroup'
            checked={_informasjon === 'vi_bekrefter_leverte_opplysninger'}
            label={t('app:info-confirm-information')}
            onClick={() => setInformasjon('vi_bekrefter_leverte_opplysninger')}
          />
          <HighContrastRadio
            checked={_informasjon === 'gi_oss_punktvise_opplysninger'}
            name='c-seddetails-informasjon-radiogroup'
            label={t('app:info-point-information')}
            onClick={() => setInformasjon('gi_oss_punktvise_opplysninger')}
          />
          {_informasjon === 'gi_oss_punktvise_opplysninger' && (
            <div className='slideInFromLeft'>
              <VerticalSeparatorDiv />
              <HighContrastTextArea
                style={{ width: '100%', minHeight: '6rem' }}
                data-test-id='c-seddetails-opplysninger-textarea'
                id='c-seddetails-opplysninger-textarea'
                className={classNames({
                  'skjemaelement__input--harFeil':
                  validation['seddetails-opplysninger']
                })}
                placeholder={t('el:placeholder-input-default')}
                label={t('label:opplysninger')}
                value={_opplysninger}
                feil={validation['seddetails-opplysninger']
                  ? validation['seddetails-opplysninger']!.feilmelding
                  : undefined}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOpplysninger(e.target.value)}
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
          {t('label:save')}
        </HighContrastHovedknapp>
        <HorizontalSeparatorDiv data-size='0.5' />
        <HighContrastKnapp
          kompakt mini
          onClick={onCancel}
        >
          {t('label:cancel')}
        </HighContrastKnapp>

      </div>
    </>
  )
}

export default SEDDetailsEdit
