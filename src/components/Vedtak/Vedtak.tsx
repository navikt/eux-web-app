import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import Select from 'components/Select/Select'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
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
const TextAreaDiv = styled.div`
  textarea {
    width: 100%;
  }
`
const AlignEndRow = styled(Row)`
  align-items: flex-end;
`
export interface VedtakProps {
  highContrast: boolean
}

const Vedtak: React.FC<VedtakProps> = ({
  highContrast
}: VedtakProps): JSX.Element => {

  const { t } = useTranslation()
  const [_allKids, setAllKids] = useState<string | undefined>(undefined)
  const [_startDato, setStartDato] = useState<string>('')
  const [_sluttDato, setSluttDato] = useState<string>('')
  const [_reason, setReason] = useState<string>('')
  const [_validation, ] = useState<Validation>({})
  const [_vedtakType, setVedtakType] = useState<string | undefined>(undefined)
  const [_perioder, setPerioder] = useState<Array<Periode>>([])
  const [_currentStartDato, setCurrentStartDato] = useState<string>('')
  const [_currentSluttDato, setCurrentSluttDato] = useState<string>('')
  const [_seeNewPeriode, setSeeNewPeriode] = useState<boolean>(false)

  const setMoreStartDato = (s: string, i: number) => {
    if (i < 0) {
      setCurrentStartDato(s)
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].startdato = s
      setPerioder(newPerioder)
    }
  }

  const setMoreSluttDato = (s: string, i: number) => {
    if (i < 0) {
      setCurrentSluttDato(s)
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].sluttdato = s
      setPerioder(newPerioder)
    }
  }

  const onRemove = (i: number) => {
    const newPerioder = _.cloneDeep(_perioder)
    newPerioder.splice(i, 1)
    setPerioder(newPerioder)
  }

  const onAdd = () => {
    const newPerioder = _.cloneDeep(_perioder)
    const periode: Periode = {
      startdato: _currentStartDato
    }
    if (_currentSluttDato) {
      periode.sluttdato = _currentSluttDato
    } else {
      periode.aapenPeriodeType = 'åpen_sluttdato'
    }
    newPerioder.push(periode)
    setPerioder(newPerioder)

    setCurrentSluttDato('')
    setCurrentStartDato('')
  }

  const vedtakTypeOptions = [
    {label: t('ui:option-vedtaktype-1'), value: '1'},
    {label: t('ui:option-vedtaktype-2'), value: '2'},
    {label: t('ui:option-vedtaktype-3'), value: '3'},
    {label: t('ui:option-vedtaktype-4'), value: '4'}
  ]

  const renderPeriode = (p: Periode | null, i: number) => (
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
            value={i < 0 ? _currentStartDato : p?.startdato}
            label={t('ui:label-startDate')}
            placeholder={t('ui:placeholder-date-default')}
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
            value={i < 0 ? _currentSluttDato : p?.sluttdato}
            label={t('ui:label-endDate')}
            placeholder={t('ui:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => (i < 0 ? onAdd() : onRemove(i))}
          >
            {i < 0 ? <Tilsette /> : <Trashcan />}
            <HorizontalSeparatorDiv data-size='0.5' />
            {i < 0 ? t('ui:label-add') : t('ui:label-remove')}
          </HighContrastFlatknapp>
        </Column>
      </AlignEndRow>
      <VerticalSeparatorDiv data-size='0.5'/>
    </>
  )

  return (
    <PanelDiv>
      <Undertittel>
        {t('ui:title-vedtak')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <HighContrastPanel>
        <HighContrastRadioGroup
          legend={t('ui:label-allKids-radiogroup')}
          feil={_validation['vedtak-allkids']
              ? _validation['vedtak-allkids']!.feilmelding
              : undefined}
          >
          <FlexDiv>
            <HighContrastRadio
            name={'c-vedtak-allkids'}
            checked={_allKids === 'ja'}
              label={t('ui:label-yes')}
            onClick={() => setAllKids('ja') }/>
          <HorizontalSeparatorDiv data-size='2'/>
            <HighContrastRadio
            name={'c-vedtak-allkids'}
            checked={_allKids === 'nei'}
            label={t('ui:label-no')}
            onClick={() => setAllKids('nei') }/>
          </FlexDiv>
        </HighContrastRadioGroup>
        <VerticalSeparatorDiv/>
        <Row>
          <Column>
            <HighContrastInput
              data-test-id={'c-vedtak-startdato-input'}
              id={'c-vedtak-startdato-input'}
              feil={_validation['vedtak-startdato']
                ? _validation['vedtak-startdato']!.feilmelding
                : undefined}
              onChange={(e: any) => setStartDato(e.target.value)}
              value={_startDato}
              label={t('ui:label-startDate')}
              placeholder={t('ui:placeholder-date-default')}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id={'c-vedtak-sluttdato-input'}
              id={'c-vedtak-sluttdato-input'}
              feil={_validation['vedtak-sluttdato']
                ? _validation['vedtak-sluttdato']!.feilmelding
                : undefined}
              onChange={(e: any) => setSluttDato(e.target.value)}
              value={_sluttDato}
              label={t('ui:label-endDate')}
              placeholder={t('ui:placeholder-date-default')}
            />
          </Column>
          <Column/>
        </Row>
        <VerticalSeparatorDiv/>
        <Row>
          <Column>
            <Select
            data-test-id={'c-vedtak-type-select'}
            error={_validation['vedtak-type']
              ? _validation['vedtak-type']!.feilmelding
              : undefined}
            highContrast={highContrast}
            id={'c-vedtak-type-select'}
            label={t('ui:label-vedtak-type')}
            onChange={(e: any) => setVedtakType(e.value)}
            options={vedtakTypeOptions}
            placeholder={t('ui:placeholder-select-default')}
            selectedValue={_vedtakType}
          />
          </Column>
          <Column/>
        </Row>
        <VerticalSeparatorDiv/>
        <Row>
          <Column>
            <TextAreaDiv>
              <HighContrastTextArea
                data-test-id='c-vedtak-reason-textarea'
                id='c-vedtak-reason-textarea'
                className={classNames({ 'skjemaelement__input--harFeil': _validation.comment })}
                label={t('ui:label-comment-title')}
                placeholder={t('ui:label-comment-placeholder')}
                onChange={(e: any) => setReason(e.target.value)}
                value={_reason}
                feil={_validation.comment ? _validation.comment.feilmelding : undefined}
              />
            </TextAreaDiv>
          </Column>
          <Column/>
        </Row>
        <VerticalSeparatorDiv/>
        {_perioder.map(renderPeriode)}
        <hr />
        {_seeNewPeriode
          ? renderPeriode(null, -1)
          : (
            <Row>
              <Column>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => setSeeNewPeriode(true)}
                >
                  <Tilsette />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('ui:label-add-new-periode')}
                </HighContrastFlatknapp>
              </Column>
            </Row>
          )}
      </HighContrastPanel>
    </PanelDiv>
  )
}


export default Vedtak
