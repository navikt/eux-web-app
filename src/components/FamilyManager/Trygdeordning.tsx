import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { PensjonPeriode, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { Ingress, Undertittel } from 'nav-frontend-typografi'
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
import { OptionsType } from 'react-select'
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

type What = 'startdato' | 'sluttdato' | 'category' | 'pensjontype'

type PensjonType = 'alderspensjon' | 'uførhet' // | 'enkepensjon' | 'barnepensjon=' | 'etterlattepensjon'

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
  const [_currentCategory, setCurrentCategory] = useState<SedCategory | undefined>(undefined)
  const [_currentPensjonType, setCurrentPensjonType] = useState<PensjonType | undefined>(undefined)
  const [_seeNewForm, setSeeNewForm] = useState<{[k in PageCategory]: boolean}>({
    dekkede: false, udekkede: false, familieYtelse: false
  })
  const { t } = useTranslation()
  const perioder: {[k in SedCategory]: Array<Periode | PensjonPeriode>} = {
    perioderMedArbeid: _.get(replySed, `${personID}.perioderMedArbeid`),
    perioderMedTrygd: _.get(replySed, `${personID}.perioderMedTrygd`),
    perioderMedITrygdeordning: _.get(replySed, `${personID}.perioderMedITrygdeordning`),
    perioderUtenforTrygdeordning: _.get(replySed, `${personID}.perioderUtenforTrygdeordning`),
    perioderMedYtelser: _.get(replySed, `${personID}.perioderMedYtelser`),
    perioderMedPensjon: _.get(replySed, `${personID}.perioderMedPensjon`)
  }

  const onRemoved = (newSedCategory: SedCategory, i: number) => {
    const newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[newSedCategory])
    newPerioder.splice(i, 1)
    onValueChanged(`${personID}.${newSedCategory}`, newPerioder)
  }

  const onAdd = (pageCategory: PageCategory, newSedCategory: SedCategory | null) => {
    let sedCategory: SedCategory | null = newSedCategory
    if (_.isNil(sedCategory)) {
      sedCategory = _currentCategory as SedCategory
    }
    if (!_.isNil(sedCategory)) {
      let newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[sedCategory])
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      const newPeriode: Periode = {
        startdato: _currentStartDato[pageCategory]
      }
      if (_currentSluttDato[pageCategory] && _currentSluttDato[pageCategory].length > 0) {
        newPeriode.sluttdato = _currentSluttDato[pageCategory]
      } else {
        newPeriode.aapenPeriodeType = 'åpen_sluttdato'
      }

      if (sedCategory === 'perioderMedPensjon') {
        if (_currentPensjonType) {
          newPerioder = (newPerioder as Array<PensjonPeriode>).concat({
            pensjonstype: _currentPensjonType,
            periode: newPeriode
          })
          setCurrentPensjonType(undefined)
        } else {
          return
        }
      } else {
        newPerioder = newPerioder.concat(newPeriode)
      }

      // resetting form values
      setCurrentStartDato({
        ..._currentStartDato,
        [pageCategory]: ''
      })
      setCurrentSluttDato({
        ..._currentSluttDato,
        [pageCategory]: ''
      })
      if (_currentCategory === sedCategory) {
        setCurrentCategory(undefined)
      }
      onValueChanged(`${personID}.${sedCategory}`, newPerioder)
    }

    setSeeNewForm({
      ..._seeNewForm,
      [pageCategory]: false
    })
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
        setCurrentCategory(e as SedCategory)
      }
      if (what === 'pensjontype') {
        setCurrentPensjonType(e as PensjonType)
      }
    } else {
      const newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[newSedCategory!])

      if (what === 'startdato' || what === 'sluttdato') {
        if (newSedCategory === 'perioderMedPensjon') {
          (newPerioder[i] as PensjonPeriode).periode[what] = e
        } else {
          (newPerioder[i] as Periode)[what] = e
        }
        onValueChanged(`${personID}.${newSedCategory}`, newPerioder)
      }
      if (what === 'pensjontype') {
        (newPerioder[i] as PensjonPeriode).pensjonstype = e
        onValueChanged(`${personID}.${newSedCategory}`, newPerioder)
      }
      if (what === 'category') {
        const removedPeriode: Periode | PensjonPeriode = newPerioder.splice(i, 1)[0]
        onValueChanged(`${personID}.${newSedCategory}`, newPerioder)

        let otherPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[e as SedCategory])

        // if removedPerioder is perioderMedPensjon and e is not, convert
        if (newSedCategory === 'perioderMedPensjon') {
          if (e !== 'perioderMedPensjon') {
            otherPerioder = otherPerioder.concat((removedPeriode as PensjonPeriode).periode)
          } else {
            otherPerioder = otherPerioder.concat(removedPeriode)
          }
        } else {
          if (e !== 'perioderMedPensjon') {
            otherPerioder = otherPerioder.concat(removedPeriode)
          } else {
            // add a pensjontype alderspensjon
            otherPerioder = otherPerioder.concat({
              periode: (removedPeriode as Periode),
              pensjonstype: 'alderspensjon'
            })
          }
        }
        onValueChanged(`${personID}.${e}`, otherPerioder)
      }
    }
  }

  const existsDekket = perioder.perioderMedITrygdeordning.length > 0

  const existsUdekket = perioder.perioderUtenforTrygdeordning.length > 0

  const existsFamilieYtelser = (perioder.perioderMedArbeid.length + perioder.perioderMedTrygd.length +
     perioder.perioderMedYtelser.length + perioder.perioderMedPensjon.length) > 0

  const selectCategoryOptions: OptionsType<{label: string, value: SedCategory}> = [{
    label: t('el:option-trygdeordning-perioderMedArbeid'), value: 'perioderMedArbeid'
  }, {
    label: t('el:option-trygdeordning-perioderMedTrygd'), value: 'perioderMedTrygd'
  }, {
    label: t('el:option-trygdeordning-perioderMedYtelser'), value: 'perioderMedYtelser'
  }, {
    label: t('el:option-trygdeordning-perioderMedPensjon'), value: 'perioderMedPensjon'
  }]

  const getCategoryOption = (value: string | undefined | null) => _.find(selectCategoryOptions, s => s.value === value)

  const selectPensjonTypeOptions: Array<{label: string, value: PensjonType}> = [{
    label: t('el:option-trygdeordning-alderspensjon'), value: 'alderspensjon'
  }, {
    label: t('el:option-trygdeordning-uførhet'), value: 'uførhet'
  }]

  const getPensjonTypeOption = (value: string | undefined | null) => _.find(selectPensjonTypeOptions, s => s.value === value)

  const renderRow = (e: Periode | PensjonPeriode | null, pageCategory: PageCategory, sedCategory: SedCategory | null, i: number) => (
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
            value={i < 0
              ? _currentStartDato[pageCategory]
              : (sedCategory === 'perioderMedPensjon'
                  ? (e as PensjonPeriode).periode.startdato
                  : (e as Periode).startdato
                )}
            placeholder={t('el:placeholder-date-default')}
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
            value={i < 0
              ? _currentSluttDato[pageCategory]
              : (sedCategory === 'perioderMedPensjon'
                  ? (e as PensjonPeriode).periode.sluttdato
                  : (e as Periode).sluttdato
                )}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
        {pageCategory !== 'familieYtelse'
          ? (
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => i < 0 ? onAdd(pageCategory, sedCategory) : onRemoved(sedCategory!, i)}
              >
                {i < 0 ? <Add /> : <Trashcan />}
                <HorizontalSeparatorDiv data-size='0.5' />
                {i < 0 ? t('label:add') : t('label:remove')}
              </HighContrastFlatknapp>
            </Column>
            )
          : (
            <Column />
            )}
      </Row>
      {pageCategory === 'familieYtelse' && (
        <>
          <VerticalSeparatorDiv data-size='0.5' />
          <Row>
            <Column>
              <Select
                data-test-id={'c-familymanager-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sedCategory-select'}
                error={validation['person-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sedCategory']
                  ? validation['person-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sedCategory']!.feilmelding
                  : undefined}
                highContrast={highContrast}
                id={'c-familymanager-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-sedCategory-select'}
                onChange={(e: any) => onChanged(e.value, 'category', pageCategory, sedCategory, i)}
                options={selectCategoryOptions}
                placeholder={t('el:placeholder-select-default')}
                selectedValue={getCategoryOption(i < 0 ? _currentCategory : sedCategory)}
                defaultValue={getCategoryOption(i < 0 ? _currentCategory : sedCategory)}
              />
            </Column>
            {(
              (i < 0 && _currentCategory === 'perioderMedPensjon') ||
            (i >= 0 && sedCategory === 'perioderMedPensjon')
            )
              ? (
                <Column>
                  <Select
                    data-test-id={'c-familymanager-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-pensjontype-select'}
                    error={validation['person-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-pensjontype']
                      ? validation['person-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-pensjontype']!.feilmelding
                      : undefined}
                    highContrast={highContrast}
                    id={'c-familymanager-' + personID + '-trygdeordning-' + sedCategory + '-' + i + '-pensjontype-select'}
                    onChange={(e: any) => onChanged(e.value, 'pensjontype', pageCategory, sedCategory, i)}
                    options={selectPensjonTypeOptions}
                    placeholder={t('el:placeholder-select-default')}
                    selectedValue={getPensjonTypeOption(i < 0 ? _currentPensjonType : (e as PensjonPeriode)?.pensjonstype)}
                    defaultValue={getPensjonTypeOption(i < 0 ? _currentPensjonType : (e as PensjonPeriode)?.pensjonstype)}
                  />
                </Column>
                )
              : (
                <Column />
                )}
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => i < 0 ? onAdd(pageCategory, sedCategory) : onRemoved(sedCategory!, i)}
              >
                {i < 0 ? <Add /> : <Trashcan />}
                <HorizontalSeparatorDiv data-size='0.5' />
                {i < 0 ? t('label:add') : t('label:remove')}
              </HighContrastFlatknapp>
            </Column>
          </Row>
        </>
      )}
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
          <Add />
          <HorizontalSeparatorDiv data-size='0.5' />
          {t('label:add-new-periode')}
        </HighContrastFlatknapp>
      </Column>
    </Row>
  )

  return (
    <KontaktinformasjonDiv>
      <Undertittel>
        {t('label:dekning-trygdeordningen')}
      </Undertittel>
      <>
        <VerticalSeparatorDiv />
        <Ingress>
          {t('label:trygdeordningen-dekkede')}
        </Ingress>
        <VerticalSeparatorDiv />
        {existsDekket && (
          <Row>
            <Column>
              <label className='skjemaelement__label'>
                {t('label:start-date')}
              </label>
            </Column>
            <Column>
              <label className='skjemaelement__label'>
                {t('label:end-date')}
              </label>
            </Column>
            <Column />
          </Row>
        )}
        <VerticalSeparatorDiv />
        {perioder.perioderMedITrygdeordning.map((p, i) => renderRow(p, 'dekkede', 'perioderMedITrygdeordning', i))}
        {_seeNewForm.dekkede
          ? renderRow(null, 'dekkede', 'perioderMedITrygdeordning', -1)
          : renderAddButton('dekkede')}
        <hr />
        <VerticalSeparatorDiv data-size={2} />
        <Ingress>
          {t('label:trygdeordningen-udekkede')}
        </Ingress>
        <VerticalSeparatorDiv />
        {existsUdekket && (
          <Row>
            <Column>
              <label className='skjemaelement__label'>
                {t('label:start-date')}
              </label>
            </Column>
            <Column>
              <label className='skjemaelement__label'>
                {t('label:end-date')}
              </label>
            </Column>
            <Column />
          </Row>
        )}
        <VerticalSeparatorDiv />
        {perioder.perioderUtenforTrygdeordning.map((p, i) => renderRow(p, 'udekkede', 'perioderUtenforTrygdeordning', i))}
        {_seeNewForm.udekkede
          ? renderRow(null, 'udekkede', 'perioderUtenforTrygdeordning', -1)
          : renderAddButton('udekkede')}
        <hr />
        <VerticalSeparatorDiv data-size={2} />
        <Ingress>
          {t('label:trygdeordningen-familieYtelse')}
        </Ingress>
        <VerticalSeparatorDiv />
        {existsFamilieYtelser && (
          <Row>
            <Column>
              <label className='skjemaelement__label'>
                {t('label:start-date')}
              </label>
            </Column>
            <Column>
              <label className='skjemaelement__label'>
                {t('label:end-date')}
              </label>
            </Column>
            <Column />
          </Row>
        )}
        <VerticalSeparatorDiv />
        {perioder.perioderMedArbeid.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedArbeid', i))}
        {perioder.perioderMedTrygd.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedTrygd', i))}
        {perioder.perioderMedYtelser.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedYtelser', i))}
        {perioder.perioderMedPensjon.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedPensjon', i))}
        {_seeNewForm.familieYtelse
          ? renderRow(null, 'familieYtelse', null, -1)
          : renderAddButton('familieYtelse')}
      </>
    </KontaktinformasjonDiv>
  )
}

export default Trygdeordning
