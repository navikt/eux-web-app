import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import Select from 'components/Select/Select'
import { PileDiv, TextAreaDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { F002Sed, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Country } from 'land-verktoy'
import _ from 'lodash'
import { Checkbox } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastPanel,
  HighContrastRadio,
  HighContrastRadioGroup, HighContrastRadioPanelGroup,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface MotregningProps {
  highContrast: boolean
  replySed: ReplySed
  validation: Validation
}

export interface NavnOgBetegnelse {
  navn: string
  betegnelsePåYtelse: string
}

const Motregning: React.FC<MotregningProps> = ({
  highContrast,
  replySed
}: MotregningProps): JSX.Element => {
  const { t } = useTranslation()
  const [_confirmDelete, _setConfirmDelete] = useState<Array<string>>([])
  const [_motregning, _setMotregning] = useState<string | undefined>(undefined)
  const [_navnOgBetegnelse, _setNavnOgBetegnelse] = useState<Array<NavnOgBetegnelse>>([])
  const [_amount, _setAmount] = useState<string>('')
  const [_currency, _setCurrency] = useState<Country | undefined>(undefined)
  const [_startDato, setStartDato] = useState<string>('')
  const [_sluttDato, setSluttDato] = useState<string>('')
  const [_frequency, _setFrequency] = useState<string | undefined>(undefined)
  const [_receiver, _setReceiver] = useState<string | undefined>(undefined)
  const [_grunner, _setGrunner] = useState<string | undefined>(undefined)
  const [_ytterligereInformasjon, _setYtterligereInformasjon] = useState<string | undefined>(undefined)

  const [_validation, _setValidation] = useState<Validation>({})
  const [_seeNewForm, _setSeeNewform] = useState<boolean>(false)

  const setMoreStartDato = (s: string, i: number) => {
    if (i < 0) {
      setCurrentStartDato(s)
    } else {
      const newPerioder = _.cloneDeep(_perioderAndVedtak)
      newPerioder[i].periode.startdato = s
      setPerioderAndVedtak(newPerioder)
    }
  }

  const setMoreSluttDato = (s: string, i: number) => {
    if (i < 0) {
      setCurrentSluttDato(s)
    } else {
      const newPerioder = _.cloneDeep(_perioderAndVedtak)
      newPerioder[i].periode.sluttdato = s
      setPerioderAndVedtak(newPerioder)
    }
  }

  const setMoreVedtakType = (s: string, i: number) => {
    if (i < 0) {
      setCurrentVedtakType(s)
    } else {
      const newPerioder = _.cloneDeep(_perioderAndVedtak)
      newPerioder[i].vedtak = s
      setPerioderAndVedtak(newPerioder)
    }
  }

  const onRemove = (i: number) => {
    const newPerioder = _.cloneDeep(_perioderAndVedtak)
    newPerioder.splice(i, 1)
    setPerioderAndVedtak(newPerioder)
  }

  const onAdd = () => {
    const newPerioder = _.cloneDeep(_perioderAndVedtak)
    const periode: Periode = {
      startdato: _currentStartDato
    }
    if (_currentSluttDato) {
      periode.sluttdato = _currentSluttDato
    } else {
      periode.aapenPeriodeType = 'åpen_sluttdato'
    }
    newPerioder.push({
      periode: periode,
      vedtak: _currentVedtakType
    })
    setPerioderAndVedtak(newPerioder)

    setCurrentSluttDato('')
    setCurrentStartDato('')
    setCurrentVedtakType('')
  }

  const vedtakTypeOptions: Options = [
    { label: t('el:option-vedtaktype-1'), value: '1' },
    { label: t('el:option-vedtaktype-2'), value: '2' },
    { label: t('el:option-vedtaktype-3'), value: '3' },
    { label: t('el:option-vedtaktype-4'), value: '4' }
  ]

  const renderPeriodeAndVedtak = (p: PeriodeAndVedtak | null, i: number) => (
    <>
      <AlignEndRow>
        <Column>
          <HighContrastInput
            data-test-id={'c-vedtak-startdato[' + i + ']-text'}
            feil={_validation['vedtak-startdato[' + i + ']']
              ? _validation['vedtak-startdato[' + i + ']']!.feilmelding
              : undefined}
            id={'c-vedtak-startdato[' + i + ']-text'}
            onChange={(e: any) => setMoreStartDato(e.target.value, i)}
            value={i < 0 ? _currentStartDato : p?.periode.startdato}
            label={t('label:start-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-vedtak-sluttdato[' + i + ']-text'}
            feil={_validation['vedtak-sluttdato[' + i + ']']
              ? _validation['vedtak-sluttdato[' + i + ']']!.feilmelding
              : undefined}
            id={'c-vedtak-sluttdato[' + i + ']-text'}
            onChange={(e: any) => setMoreSluttDato(e.target.value, i)}
            value={i < 0 ? _currentSluttDato : p?.periode.sluttdato}
            label={t('label:end-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        <Column>
          <Select
            key={'c-vedtak-type[' + i + ']-select-key'}
            data-test-id={'c-vedtak-type[' + i + ']-text'}
            error={_validation['vedtak-type[' + i + ']']
              ? _validation['vedtak-type[' + i + ']']!.feilmelding
              : undefined}
            highContrast={highContrast}
            id={'c-vedtak-type[' + i + ']-text'}
            label={t('label:vedtak-type')}
            onChange={(e: any) => setMoreVedtakType(e.value, i)}
            options={vedtakTypeOptions}
            placeholder={t('el:placeholder-select-default')}
            defaultValue={_.find(vedtakTypeOptions, v => v.value === (i < 0 ? _currentVedtakType : p?.vedtak))}
            selectedValue={i < 0 ? _currentVedtakType : p?.vedtak}
          />
        </Column>
        <Column>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => (i < 0 ? onAdd() : onRemove(i))}
          >
            {i < 0 ? <Add /> : <Trashcan />}
            <HorizontalSeparatorDiv data-size='0.5' />
            {i < 0 ? t('label:add') : t('label:remove')}
          </HighContrastFlatknapp>
        </Column>
      </AlignEndRow>
      <VerticalSeparatorDiv data-size='0.5' />
    </>
  )

  return (
    <PileDiv>
      <Undertittel>
        {t('el:title-motregning')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <HighContrastPanel>
        <HighContrastRadioGroup
          legend={t('label:motregning-request')}
          feil={_validation['vedtak-allkids']
            ? _validation['vedtak-allkids']!.feilmelding
            : undefined}
        >

          <HighContrastRadio
            name='c-vedtak-allkids'
            checked={_motregning === 'ja'}
            label={t('label:motregning-request-1')}
            onClick={() => setMotregning('ja')}
          />
          <VerticalSeparatorDiv />
          <HighContrastRadio
            name='c-vedtak-allkids'
            checked={_motregning === 'nei'}
            label={t('label:motregning-request-2')}
            onClick={() => setMotregning('nei')}
          />

        </HighContrastRadioGroup>
        {_motregning === 'nei' && (
          <>
            <div dangerouslySetInnerHTML={{ __html: t('label:allKids-select') + ':' }} />
            <VerticalSeparatorDiv />
            {(replySed as F002Sed)?.barn?.map(b => (
              <div key={b.personInfo.fornavn + ' ' + b.personInfo.etternavn}>
                <Checkbox label={b.personInfo.fornavn + ' ' + b.personInfo.etternavn} />
                <VerticalSeparatorDiv data-size='0.5' />
              </div>
            ))}
          </>
        )}

        <VerticalSeparatorDiv />
        <Row>
          <Column>
            <HighContrastInput
              data-test-id='c-vedtak-startdato-date'
              id='c-vedtak-startdato-date'
              feil={_validation['vedtak-startdato']
                ? _validation['vedtak-startdato']!.feilmelding
                : undefined}
              onChange={(e: any) => setStartDato(e.target.value)}
              value={_startDato}
              label={t('label:start-date')}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id='c-vedtak-sluttdato-date'
              id='c-vedtak-sluttdato-date'
              feil={_validation['vedtak-sluttdato']
                ? _validation['vedtak-sluttdato']!.feilmelding
                : undefined}
              onChange={(e: any) => setSluttDato(e.target.value)}
              value={_sluttDato}
              label={t('label:end-date')}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column />
        </Row>
        <VerticalSeparatorDiv />
        <Row>
          <Column>
            <Select
              data-test-id='c-vedtak-type-text'
              error={_validation['vedtak-type']
                ? _validation['vedtak-type']!.feilmelding
                : undefined}
              highContrast={highContrast}
              id='c-vedtak-type-text'
              label={t('label:vedtak-type')}
              onChange={(e: any) => setVedtakType(e.value)}
              options={vedtakTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={_vedtakType}
            />
          </Column>
          <Column />
        </Row>
        <VerticalSeparatorDiv />
        <Row>
          <Column>
            <TextAreaDiv>
              <HighContrastTextArea
                data-test-id='c-vedtak-reason-text'
                id='c-vedtak-reason-text'
                className={classNames({ 'skjemaelement__input--harFeil': _validation.comment })}
                label={t('label:comment-title')}
                placeholder={t('label:comment-placeholder')}
                onChange={(e: any) => setReason(e.target.value)}
                value={_reason}
                feil={_validation.comment ? _validation.comment.feilmelding : undefined}
              />
            </TextAreaDiv>
          </Column>
          <Column />
        </Row>
        <VerticalSeparatorDiv />
        {_perioderAndVedtak.map(renderPeriodeAndVedtak)}
        <hr />
        {_seeNewPeriode
          ? renderPeriodeAndVedtak(null, -1)
          : (
            <Row>
              <Column>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => setSeeNewPeriode(true)}
                >
                  <Add />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('label:add-new-periode')}
                </HighContrastFlatknapp>
              </Column>
            </Row>
            )}
      </HighContrastPanel>
    </PanelDiv>
  )
}

export default Motregning

<Column>
<HighContrastRadioPanelGroup
checked={_newFrequency}
data-no-border
data-test-id={'c-' + namespace + '-frequency-text'}
id={'c-' + namespace + '-frequency-text'}
feil={validation[namespace + '-frequency']?.feilmelding}
name={namespace + '-frequency'}
legend={t('label:period-frequency')}
radios={[
    { label: t('label:monthly'), value: 'Månedlig' },
{ label: t('label:yearly'), value: 'Årlig' }
]}
onChange={(e: any) => setFrequency(e.target.value)}
/>
</Column>
