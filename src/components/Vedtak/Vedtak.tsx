import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import Select from 'components/Select/Select'
import { TextAreaDiv } from 'components/StyledComponents'
import { F002Sed, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { Checkbox } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastPanel,
  HighContrastRadio,
  HighContrastRadioGroup,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const FlexDiv = styled.div`
  display: flex;
`
const AlignEndRow = styled(Row)`
  align-items: flex-end;
`
export interface VedtakProps {
  highContrast: boolean
  replySed: ReplySed
}
export interface PeriodeAndVedtak {
  periode: Periode
  vedtak: string
}

const Vedtak: React.FC<VedtakProps> = ({
  highContrast,
  replySed
}: VedtakProps): JSX.Element => {
  const { t } = useTranslation()
  const [_allKids, setAllKids] = useState<string | undefined>(undefined)
  const [_startDato, setStartDato] = useState<string>('')
  const [_sluttDato, setSluttDato] = useState<string>('')
  const [_reason, setReason] = useState<string>('')
  const [_validation] = useState<Validation>({})
  const [_vedtakType, setVedtakType] = useState<string | undefined>(undefined)
  const [_perioderAndVedtak, setPerioderAndVedtak] = useState<Array<PeriodeAndVedtak>>([])

  const [_currentStartDato, setCurrentStartDato] = useState<string>('')
  const [_currentSluttDato, setCurrentSluttDato] = useState<string>('')
  const [_currentVedtakType, setCurrentVedtakType] = useState<string>('')
  const [_seeNewPeriode, setSeeNewPeriode] = useState<boolean>(false)

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

  const vedtakTypeOptions = [
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
            data-test-id={'c-vedtak-startdato[' + i + ']-input'}
            feil={_validation['vedtak-startdato[' + i + ']']
              ? _validation['vedtak-startdato[' + i + ']']!.feilmelding
              : undefined}
            id={'c-vedtak-startdato[' + i + ']-input'}
            onChange={(e: any) => setMoreStartDato(e.target.value, i)}
            value={i < 0 ? _currentStartDato : p?.periode.startdato}
            label={t('label:start-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-vedtak-sluttdato[' + i + ']-input'}
            feil={_validation['vedtak-sluttdato[' + i + ']']
              ? _validation['vedtak-sluttdato[' + i + ']']!.feilmelding
              : undefined}
            id={'c-vedtak-sluttdato[' + i + ']-input'}
            onChange={(e: any) => setMoreSluttDato(e.target.value, i)}
            value={i < 0 ? _currentSluttDato : p?.periode.sluttdato}
            label={t('label:end-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        <Column>
          <Select
            key={'c-vedtak-type[' + i + ']-select-key'}
            data-test-id={'c-vedtak-type[' + i + ']-select'}
            error={_validation['vedtak-type[' + i + ']']
              ? _validation['vedtak-type[' + i + ']']!.feilmelding
              : undefined}
            highContrast={highContrast}
            id={'c-vedtak-type[' + i + ']-select'}
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
    <PanelDiv>
      <Undertittel>
        {t('el:title-vedtak')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <HighContrastPanel>
        <HighContrastRadioGroup
          legend={t('label:allKids-radiogroup')}
          feil={_validation['vedtak-allkids']
            ? _validation['vedtak-allkids']!.feilmelding
            : undefined}
        >
          <FlexDiv>
            <HighContrastRadio
              name='c-vedtak-allkids'
              checked={_allKids === 'ja'}
              label={t('label:yes')}
              onClick={() => setAllKids('ja')}
            />
            <HorizontalSeparatorDiv data-size='2' />
            <HighContrastRadio
              name='c-vedtak-allkids'
              checked={_allKids === 'nei'}
              label={t('label:no')}
              onClick={() => setAllKids('nei')}
            />
          </FlexDiv>
        </HighContrastRadioGroup>
        {_allKids === 'nei' && (
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
              data-test-id='c-vedtak-startdato-input'
              id='c-vedtak-startdato-input'
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
              data-test-id='c-vedtak-sluttdato-input'
              id='c-vedtak-sluttdato-input'
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
              data-test-id='c-vedtak-type-select'
              error={_validation['vedtak-type']
                ? _validation['vedtak-type']!.feilmelding
                : undefined}
              highContrast={highContrast}
              id='c-vedtak-type-select'
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
                data-test-id='c-vedtak-reason-textarea'
                id='c-vedtak-reason-textarea'
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

export default Vedtak
