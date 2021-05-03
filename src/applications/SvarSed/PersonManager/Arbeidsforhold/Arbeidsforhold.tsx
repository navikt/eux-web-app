import {
  validateArbeidsgiver,
  ValidationArbeidsgiverProps
} from 'applications/SvarSed/PersonManager/PersonensStatus/ansattValidation'
import Add from 'assets/icons/Add'
import ArbeidsgiverBox from 'components/Arbeidsgiver/ArbeidsgiverBox'
import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import Input from 'components/Forms/Input'
import Period, { toFinalDateFormat } from 'components/Period/Period'
import { AlignStartRow, FlexDiv, PaddedDiv, PileDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Periode, ReplySed } from 'declarations/sed'
import { Arbeidsgiver, Arbeidsperioder, Inntekt, Validation } from 'declarations/types'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastKnapp,
  HighContrastLink,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import TableSorter, { Item, Column as TableColumn } from 'tabell'
import { formatterPenger } from 'utils/PengeUtils'

interface ArbeidsforholdProps {
  arbeidsperioder: Arbeidsperioder
  getArbeidsperioder: () => void
  gettingArbeidsperioder: boolean
  inntekter: any
  getInntekter: () => void
  highContrast: boolean
  gettingInntekter: boolean
  parentNamespace: string
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const CustomTableSorter = styled(TableSorter)`
  table-layout: fixed;
  th, tr {
    width: 16.666%;
  }
`
const ArbeidsgiverDiv = styled(FlexDiv)`
 background-color: whitesmoke;
 justify-content: space-between;
 padding: 1rem;
`
const Arbeidsforhold: React.FC<ArbeidsforholdProps> = ({
   arbeidsperioder,
   getArbeidsperioder,
   gettingArbeidsperioder,
   inntekter,
   getInntekter,
   gettingInntekter,
   highContrast,
   parentNamespace,
   personID,
   replySed,
   resetValidation,
   updateReplySed,
   validation
}:ArbeidsforholdProps): JSX.Element => {
  const { t } = useTranslation()
  const target = 'anmodningsperiode'
  const anmodningsperiode: Periode = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-arbeidsforhold`

  const [_newArbeidsgiverStartDato, _setNewArbeidsgiverStartDato] = useState<string>('')
  const [_newArbeidsgiverSluttDato, _setNewArbeidsgiverSluttDato] = useState<string>('')
  const [_newArbeidsgiverOrgnr, _setNewArbeidsgiverOrgnr] = useState<string>('')
  const [_newArbeidsgiverNavn, _setNewArbeidsgiverNavn] = useState<string>('')
  const [_seeNewArbeidsgiver, _setSeeNewArbeidsgiver] = useState<boolean>(false)
  const [_validationArbeidsgiver, _resetValidationArbeidsgiver, performValidationArbeidsgiver] =
    useValidation<ValidationArbeidsgiverProps>({}, validateArbeidsgiver)

  const [_addedArbeidsperioder, setAddedArbeidsperioder] = useState<Arbeidsperioder>(() => ({
    arbeidsperioder: [],
    uriArbeidsgiverRegister: '',
    uriInntektRegister: ''
  }))

  const setStartDato = (startdato: string) => {
    updateReplySed('{target}.startdato', startdato.trim())
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
    }
  }

  const setSluttDato = (sluttdato: string) => {
    const newAnmodningsperiode: Periode = _.cloneDeep(anmodningsperiode)
    if (sluttdato === '') {
      delete newAnmodningsperiode.sluttdato
      newAnmodningsperiode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newAnmodningsperiode.aapenPeriodeType
      newAnmodningsperiode.sluttdato = sluttdato.trim()
    }
    updateReplySed(target, newAnmodningsperiode)
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }

  const resetArbeidsgiverForm = () => {
    _setNewArbeidsgiverNavn('')
    _setNewArbeidsgiverOrgnr('')
    _setNewArbeidsgiverSluttDato('')
    _setNewArbeidsgiverStartDato('')
    _resetValidationArbeidsgiver()
  }

  const onCancelArbeidsgiverClicked = () => {
    resetArbeidsgiverForm()
    _setSeeNewArbeidsgiver(!_seeNewArbeidsgiver)
  }

  const onArbeidsgiverStartDatoChanged = (dato: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-startdato')
    _setNewArbeidsgiverStartDato(dato)
  }

  const onArbeidsgiverSluttDatoChanged = (dato: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-sluttdato')
    _setNewArbeidsgiverSluttDato(dato)
  }

  const onArbeidsgiverOrgnrChanged = (newOrg: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-orgnr')
    _setNewArbeidsgiverOrgnr(newOrg)
  }

  const onArbeidsgiverNameChanged = (newName: string) => {
    _resetValidationArbeidsgiver(namespace + '-arbeidsgiver-navn')
    _setNewArbeidsgiverNavn(newName)
  }

  const onArbeidsgiverAdd = () => {
    const newArbeidsgiver: Arbeidsgiver = {
      arbeidsgiverNavn: _newArbeidsgiverNavn,
      arbeidsgiverOrgnr: _newArbeidsgiverOrgnr,
      fraDato: toFinalDateFormat(_newArbeidsgiverStartDato),
      tilDato: toFinalDateFormat(_newArbeidsgiverSluttDato),
      fraInntektsregistreret: '-',
      fraArbeidsgiverregisteret: '-'
    }

    const valid: boolean = performValidationArbeidsgiver({
      arbeidsgiver: newArbeidsgiver,
      namespace: namespace
    })

    if (valid) {
      const newAddedArbeidsperioder: Arbeidsperioder = _.cloneDeep(_addedArbeidsperioder)
      newAddedArbeidsperioder.arbeidsperioder = newAddedArbeidsperioder.arbeidsperioder.concat(newArbeidsgiver)
      setAddedArbeidsperioder(newAddedArbeidsperioder)
      resetArbeidsgiverForm()
    }
  }

  useEffect(() => {
    if (!inntekter && !gettingInntekter) {
      getInntekter()
    }
  }, [])

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('el:title-arbeidsforhold/arbeidsgivere')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Period
          key={'' + anmodningsperiode?.startdato + anmodningsperiode?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={anmodningsperiode?.startdato ?? ''}
          valueSluttDato={anmodningsperiode?.sluttdato ?? ''}
        />
        <Column>
          <VerticalSeparatorDiv data-size='1.8'/>
          <ArbeidsgiverSøk
            gettingArbeidsperioder={gettingArbeidsperioder}
            getArbeidsperioder={getArbeidsperioder}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='2'/>
      <Systemtittel>
        {t('el:title-aa-registeret')}
      </Systemtittel>
      <VerticalSeparatorDiv />
      <Undertittel>
        {t('el:title-registered-arbeidsperiode')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {arbeidsperioder?.arbeidsperioder.map(arbeidsgiver => (
        <AlignStartRow className='slideInFromLeft'>
          <Column>
            <ArbeidsgiverBox
              arbeidsgiver={arbeidsgiver}
              editable={false}
              newArbeidsgiver={false}
              key={arbeidsgiver.arbeidsgiverOrgnr}
              onArbeidsgiverSelect={() => {}}
              namespace={namespace}
            />
          </Column>
        </AlignStartRow>
      ))}

      {_addedArbeidsperioder?.arbeidsperioder.map(arbeidsgiver => (
        <AlignStartRow className='slideInFromLeft'>
          <Column>
            <ArbeidsgiverBox
              arbeidsgiver={arbeidsgiver}
              editable={false}
              newArbeidsgiver={true}
              key={arbeidsgiver.arbeidsgiverOrgnr}
              onArbeidsgiverSelect={() => {}}
              namespace={namespace}
            />
          </Column>
        </AlignStartRow>
      ))}

      {!_seeNewArbeidsgiver
        ? (
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={() => _setSeeNewArbeidsgiver(true)}
        >
          <Add />
          <HorizontalSeparatorDiv data-size='0.5' />
          {t('el:button-add-new-x', {
            x: t('label:arbeidsgiver').toLowerCase()
          })}
        </HighContrastFlatknapp>
      )
        : (
          <>
            <Undertittel>
              {t('el:title-add-arbeidsperiode')}
            </Undertittel>
            <VerticalSeparatorDiv />
            <AlignStartRow className='slideInFromLeft'>
              <Period
                key={'' + _newArbeidsgiverStartDato + _newArbeidsgiverSluttDato}
                namespace={namespace}
                errorStartDato={_validationArbeidsgiver[namespace + '-arbeidsgiver-startdato']?.feilmelding}
                errorSluttDato={_validationArbeidsgiver[namespace + '-arbeidsgiver-sluttdato']?.feilmelding}
                setStartDato={onArbeidsgiverStartDatoChanged}
                setSluttDato={onArbeidsgiverSluttDatoChanged}
                valueStartDato={_newArbeidsgiverStartDato}
                valueSluttDato={_newArbeidsgiverSluttDato}
              />
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv data-size='0.5' />
            <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
              <Column>
                <Input
                  feil={_validationArbeidsgiver[namespace + '-arbeidsgiver-orgnr']?.feilmelding}
                  namespace={namespace + '-arbeidsgiver'}
                  id='orgnr'
                  label={t('label:orgnr')}
                  onChanged={onArbeidsgiverOrgnrChanged}
                  value={_newArbeidsgiverOrgnr}
                />
              </Column>
              <Column>
                <Input
                  feil={_validationArbeidsgiver[namespace + '-arbeidsgiver-navn']?.feilmelding}
                  namespace={namespace + '-arbeidsgiver'}
                  id='navn'
                  label={t('label:navn')}
                  onChanged={onArbeidsgiverNameChanged}
                  value={_newArbeidsgiverNavn}
                />
              </Column>
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
              <Column>
                <HighContrastKnapp
                  mini
                  kompakt
                  onClick={onArbeidsgiverAdd}
                >
                  <Add />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('el:button-add')}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv data-size='0.5' />
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onCancelArbeidsgiverClicked}
                >
                  {t('el:button-cancel')}
                </HighContrastFlatknapp>
              </Column>
            </AlignStartRow>
          </>
        )}
      <VerticalSeparatorDiv data-size='3'/>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('el:title-kontoller-inntekt')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {gettingInntekter && <WaitingPanel/>}
      {inntekter?.map((inntekt: Inntekt) => {

        let _items: Array<Item> = [
          {key: '1', col0: ' ', col1: ' ', col2: ' ', col3: ' ', col4: ' ', avg: formatterPenger(inntekt.gjennomsnitt)}
        ]
        let _columns: Array<TableColumn> = [
          {id: 'col0', label: ' ', type: 'string'},
          {id: 'col1', label: ' ', type: 'string'},
          {id: 'col2', label: ' ', type: 'string'},
          {id: 'col3', label: ' ', type: 'string'},
          {id: 'col4', label: ' ', type: 'string'},
          {id: 'avg', label: t('label:gjennomsnitt'), type: 'string'}
        ]

        inntekt.lønn.forEach((lønn, i)  => {
          const matchingColumn = 'col' + (5 - inntekt.lønn.length + i)
          const targetColumn = _.find(_columns, (c: TableColumn) => c.id === matchingColumn)
          if (targetColumn) {
            targetColumn.label = lønn.fra
          }
          _items[0][matchingColumn] = formatterPenger(lønn.beloep)
        })

        return (
          <>
            <AlignStartRow>
              <Column>
                <ArbeidsgiverDiv>
                  <PileDiv>
                    <Undertittel>
                      {inntekt.arbeidsgiver.navn}
                    </Undertittel>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:orgnr')}</Normaltekst></span>
                    <span><Normaltekst>{inntekt.arbeidsgiver.orgnr}</Normaltekst></span>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:stillingprosent')}</Normaltekst></span>
                    <span><Normaltekst>{inntekt.arbeidsgiver.prosent}</Normaltekst></span>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:siste-lønnsendring')}</Normaltekst></span>
                    <span><Normaltekst>{inntekt.arbeidsgiver.sisteLønn}</Normaltekst></span>
                  </PileDiv>
                </ArbeidsgiverDiv>
                <CustomTableSorter
                  key={personID}
                  highContrast={highContrast}
                  context={{ items: _items }}
                  items={_items}
                  compact
                  searchable={false}
                  sortable={false}
                  striped={false}
                  columns={_columns}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv data-size='0.5'/>
            <AlignStartRow>
              <Column>
                <HighContrastLink href='#'>
                  {t('label:gå-til-A-inntekt')}
                </HighContrastLink>
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv data-size='2'/>
          </>
      )})}
    </PaddedDiv>
  )
}

export default Arbeidsforhold
