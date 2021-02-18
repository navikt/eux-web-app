import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { Ingress, Undertekst, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface TrygdeordningProps {
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}
const KontaktinformasjonDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`

type SedCategory = 'perioderMedArbeid' | 'perioderMedTrygd' |
  'perioderMedITrygdeordning' | 'perioderUtenforTrygdeordning' |
  'perioderMedYtelser' | 'perioderMedPensjon'

type PageCategory = 'dekkede' | 'udekkede' | 'familieYtelse'

type What = 'startdato' | 'sluttdato' | 'category'

type PensjonType = 'alderspensjon' | 'uførhet' | 'enkepensjon' | 'barnepensjon=' | 'etterlattepensjon'

const Trygdeordning: React.FC<TrygdeordningProps> = ({
  highContrast,
  onValueChanged,
  personID,
  replySed,
  validation
}: TrygdeordningProps): JSX.Element => {
  const [_currentStartDato, setCurrentStartDato] = useState<{[k in PageCategory]: string}>({
    dekkede: '', udekkede: '', familieYtelse: ''
  })
  const [_currentSluttDato, setCurrentSluttDato] = useState<{[k in PageCategory]: string}>({
    dekkede: '', udekkede: '', familieYtelse: ''
  })
  const [_currentCategory, setCurrentCategory] = useState<{[k in PageCategory]: SedCategory | undefined}>({
    dekkede: undefined, udekkede: undefined, familieYtelse: undefined
  })
  const [_seeNewForm, setSeeNewForm] = useState<{[k in PageCategory]: boolean}>({
    dekkede: false, udekkede: false, familieYtelse: false
  })

  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()
  const perioder: {[k in SedCategory]: Array<Periode>} = {
    perioderMedArbeid: _.get(replySed, `${personID}.perioderMedArbeid`),
    perioderMedTrygd: _.get(replySed, `${personID}.perioderMedTrygd`),
    perioderMedITrygdeordning: _.get(replySed, `${personID}.perioderMedITrygdeordning`),
    perioderUtenforTrygdeordning: _.get(replySed, `${personID}.perioderUtenforTrygdeordning`),
    perioderMedYtelser: _.get(replySed, `${personID}.perioderMedYtelser`),
    perioderMedPensjon: _.get(replySed, `${personID}.perioderMedPensjon`)
  }

  const onRemoved = (newSedCategory: SedCategory, i: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(perioder[newSedCategory])
    newPerioder.splice(i, 1)
    setIsDirty(true)
    onValueChanged(`${personID}.${newSedCategory}`, newPerioder)
  }

  const onAdd = (pageCategory: PageCategory) => {
    if (!_.isNil(_currentCategory[pageCategory])) {
      const newSedCategory: SedCategory = _currentCategory[pageCategory]!
      let newPerioder: Array<Periode> = _.cloneDeep(perioder[newSedCategory])
      const newPeriode: Periode = {
        startdato: _currentStartDato[pageCategory]
      }
      if (_currentSluttDato[pageCategory] && _currentSluttDato[pageCategory].length > 0) {
        newPeriode.sluttdato = _currentSluttDato[pageCategory]
      } else {
        newPeriode.aapenPeriodeType = 'åpen_sluttdato'
      }
      newPerioder = newPerioder.concat(newPeriode)
      setIsDirty(true)
      setCurrentStartDato({
        ..._currentStartDato,
        [pageCategory]: ''
      })
      setCurrentSluttDato({
        ..._currentSluttDato,
        [pageCategory]: ''
      })
      setCurrentCategory({
        ..._currentCategory,
        [pageCategory]: undefined
      })
      onValueChanged(`${personID}.${newSedCategory}`, newPerioder)
    }
  }

  const onChanged = (e: string, what: What, pageCategory: PageCategory, newSedCategory: SedCategory | null, i: number) => {
    if (i < 0) {
      if (what === 'startdato') {
        setCurrentStartDato({
          ..._currentStartDato,
          [pageCategory]: e
        })
      }
      if (what === 'sluttdato') {
        setCurrentSluttDato({
          ..._currentSluttDato,
          [pageCategory]: e
        })
      }
      if (what === 'category') {
        setCurrentCategory({
          ..._currentCategory,
          [pageCategory]: e
        })
      }
    } else {
      setIsDirty(true)
      if (what === 'startdato' || what === 'sluttdato') {
        const newPerioder: Array<Periode> = _.cloneDeep(perioder[newSedCategory!])
        newPerioder[i][what] = e
        onValueChanged(`${personID}.${newSedCategory}`, newPerioder)
      }
    }
  }

  const existsDekket = (perioder.perioderMedArbeid.length + perioder.perioderMedTrygd.length +
    perioder.perioderMedITrygdeordning.length + perioder.perioderMedYtelser.length) > 0

  const existsUdekket = (perioder.perioderUtenforTrygdeordning.length + perioder.perioderMedPensjon.length) > 0

  const existsFamilieYtelser = (perioder.perioderMedArbeid.length + perioder.perioderMedTrygd.length +
    perioder.perioderMedITrygdeordning.length + perioder.perioderMedYtelser.length + perioder.perioderMedPensjon.length) > 0

  const selectOptions = {
    dekkede: [{
      label: t('ui:option-trygdeordning-perioderMedArbeid'), value: 'perioderMedArbeid'
    }, {
      label: t('ui:option-trygdeordning-perioderMedTrygd'), value: 'perioderMedTrygd'
    }, {
      label: t('ui:option-trygdeordning-perioderMedITrygdeordning'), value: 'perioderMedITrygdeordning'
    }, {
      label: t('ui:option-trygdeordning-perioderMedYtelser'), value: 'perioderMedYtelser'
    }],
    udekkede: [{
      label: t('ui:option-trygdeordning-perioderUtenforTrygdeordning'), value: 'perioderUtenforTrygdeordning'
    }, {
      label: t('ui:option-trygdeordning-perioderMedPensjon'), value: 'perioderMedPensjon'
    }],
    familieYtelse: [{
      label: t('ui:option-trygdeordning-perioderMedArbeid'), value: 'perioderMedArbeid'
    }, {
      label: t('ui:option-trygdeordning-perioderMedTrygd'), value: 'perioderMedTrygd'
    }, {
      label: t('ui:option-trygdeordning-perioderMedITrygdeordning'), value: 'perioderMedITrygdeordning'
    }, {
      label: t('ui:option-trygdeordning-perioderMedYtelser'), value: 'perioderMedYtelser'
    }, {
      label: t('ui:option-trygdeordning-perioderMedPensjon'), value: 'perioderMedPensjon'
    }]
  }

  const renderRow = (e: Periode | null, pageCategory: PageCategory, sedCategory: SedCategory | null, i: number) => (
    <>
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-startdato-input'}
            feil={validation['person-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-startdato']
              ? validation['person-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-startdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-startdato-input'}
            onChange={(e: any) => onChanged(e.target.value, 'startdato', pageCategory, sedCategory, i)}
            value={i < 0 ? _currentStartDato[pageCategory] : e?.startdato}
            placeholder={t('ui:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sluttdato-input'}
            feil={validation['person-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sluttdato']
              ? validation['person-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sluttdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sluttdato-input'}
            onChange={(e: any) => onChanged(e.target.value, 'sluttdato', pageCategory, sedCategory, i)}
            value={i < 0 ? _currentSluttDato[pageCategory] : e?.sluttdato}
            placeholder={t('ui:placeholder-date-default')}
          />
        </Column>
        <Column>
          {i < 0
            ? (
              <Select
                data-test-id={'c-familymanager-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sedCategory-select'}
                error={validation['person-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sedCategory']
                  ? validation['person-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sedCategory']!.feilmelding
                  : undefined}
                highContrast={highContrast}
                id={'c-familymanager-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sedCategory-select'}
                onChange={(e: any) => onChanged(e.value, 'category', pageCategory, sedCategory, i)}
                options={selectOptions[pageCategory]}
                placeholder={t('ui:placeholder-select-default')}
                selectedValue={_currentCategory[pageCategory]}
              />
              )
            : (
              <Undertekst>
                {t('ui:option-trygdeordning-' + sedCategory)}
              </Undertekst>
              )}
        </Column>
        <Column>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => i < 0 ? onAdd(pageCategory) : onRemoved(sedCategory!, i)}
          >
            {i < 0 ? <Tilsette /> : <Trashcan />}
            <HorizontalSeparatorDiv data-size='0.5' />
            {i < 0 ? t('ui:label-add') : t('ui:label-remove')}
          </HighContrastFlatknapp>
        </Column>
      </Row>
      <VerticalSeparatorDiv />
    </>
  )

  const renderAddButton = (pageCategory: PageCategory) => (
    <Row>
      <Column>
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={() => setSeeNewForm({
            ..._seeNewForm,
            [pageCategory]: true
          })}
        >
          <Tilsette />
          <HorizontalSeparatorDiv data-size='0.5' />
          {t('ui:label-add-new-period')}
        </HighContrastFlatknapp>
      </Column>
    </Row>
  )

  return (
    <KontaktinformasjonDiv>
      <Undertittel>
        {t('ui:label-dekning-trygdeordningen')}
      </Undertittel>
      <>
        <VerticalSeparatorDiv />
        <Ingress>
          {t('ui:label-trygdeordningen-dekkede')}
        </Ingress>
        <VerticalSeparatorDiv />
        {existsDekket && (
          <Row>
            <Column>
              <label className='skjemaelement__label'>
                {t('ui:label-startDate')}
              </label>
            </Column>
            <Column>
              <label className='skjemaelement__label'>
                {t('ui:label-endDate')}
              </label>
            </Column>
            <Column />
          </Row>
        )}
        <VerticalSeparatorDiv />
        {perioder.perioderMedArbeid.map((p, i) => renderRow(p, 'dekkede', 'perioderMedArbeid', i))}
        {perioder.perioderMedTrygd.map((p, i) => renderRow(p, 'dekkede', 'perioderMedTrygd', i))}
        {perioder.perioderMedITrygdeordning.map((p, i) => renderRow(p, 'dekkede', 'perioderMedITrygdeordning', i))}
        {perioder.perioderMedYtelser.map((p, i) => renderRow(p, 'dekkede', 'perioderMedYtelser', i))}
        {_seeNewForm.dekkede
          ? renderRow(null, 'dekkede', null, -1)
          : renderAddButton('dekkede')}
        <hr />
        <VerticalSeparatorDiv data-size={2} />
        <Ingress>
          {t('ui:label-trygdeordningen-udekkede')}
        </Ingress>
        <VerticalSeparatorDiv />
        {existsUdekket && (
          <Row>
            <Column>
              <label className='skjemaelement__label'>
                {t('ui:label-startDate')}
              </label>
            </Column>
            <Column>
              <label className='skjemaelement__label'>
                {t('ui:label-endDate')}
              </label>
            </Column>
            <Column />
          </Row>
        )}
        <VerticalSeparatorDiv />
        {perioder.perioderUtenforTrygdeordning.map((p, i) => renderRow(p, 'udekkede', 'perioderUtenforTrygdeordning', i))}
        {perioder.perioderMedPensjon.map((p, i) => renderRow(p, 'udekkede', 'perioderMedPensjon', i))}
        {_seeNewForm.udekkede
          ? renderRow(null, 'udekkede', null, -1)
          : renderAddButton('udekkede')}
        <hr />
        <VerticalSeparatorDiv data-size={2} />
        <Ingress>
          {t('ui:label-trygdeordningen-familieYtelse')}
        </Ingress>
        <VerticalSeparatorDiv />
        {existsFamilieYtelser && (
          <Row>
            <Column>
              <label className='skjemaelement__label'>
                {t('ui:label-startDate')}
              </label>
            </Column>
            <Column>
              <label className='skjemaelement__label'>
                {t('ui:label-endDate')}
              </label>
            </Column>
            <Column />
          </Row>
        )}
        <VerticalSeparatorDiv />
        {perioder.perioderMedArbeid.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedArbeid', i))}
        {perioder.perioderMedTrygd.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedTrygd', i))}
        {perioder.perioderMedITrygdeordning.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedITrygdeordning', i))}
        {perioder.perioderMedYtelser.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedYtelser', i))}
        {perioder.perioderMedPensjon.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedPensjon', i))}
        {_seeNewForm.udekkede
          ? renderRow(null, 'familieYtelse', null, -1)
          : renderAddButton('familieYtelse')}
      </>
      {_isDirty && '*'}
    </KontaktinformasjonDiv>
  )
}

export default Trygdeordning
