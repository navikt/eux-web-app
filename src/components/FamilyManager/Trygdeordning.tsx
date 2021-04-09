import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Select/Select'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { PensjonPeriode, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Ingress, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
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
import { validatePensjonPeriode, validatePeriode } from 'validation/trygdeordninger'

interface TrygdeordningProps {
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

type SedCategory = 'perioderMedArbeid' | 'perioderMedTrygd' |
  'perioderMedITrygdeordning' | 'perioderUtenforTrygdeordning' |
  'perioderMedYtelser' | 'perioderMedPensjon'

type PageCategory = 'dekkede' | 'udekkede' | 'familieYtelse'

type What = 'startdato' | 'sluttdato' | 'category' | 'pensjonstype'

type PensjonsType = 'alderspensjon' | 'uførhet'

const Trygdeordning: React.FC<TrygdeordningProps> = ({
  highContrast,
  onValueChanged,
  personID,
  replySed,
  validation
}: TrygdeordningProps): JSX.Element => {
  const [_confirmDelete, setConfirmDelete] = useState<{[k in PageCategory]: Array<string>}>({
    dekkede: [], udekkede: [], familieYtelse: []
  })
  const [_newStartDato, setNewStartDato] = useState<{[k in PageCategory]: string}>({
    dekkede: '', udekkede: '', familieYtelse: ''
  })
  const [_newSluttDato, setNewSluttDato] = useState<{[k in PageCategory]: string}>({
    dekkede: '', udekkede: '', familieYtelse: ''
  })
  const [_newCategory, setNewCategory] = useState<SedCategory | undefined>(undefined)
  const [_newPensjonsType, setNewPensjonsType] = useState<PensjonsType | undefined>(undefined)
  const [_seeNewForm, setSeeNewForm] = useState<{[k in PageCategory]: boolean}>({
    dekkede: false, udekkede: false, familieYtelse: false
  })
  const [_validation, setValidation] = useState<{[k in PageCategory]: Validation}>({
    dekkede: {}, udekkede: {}, familieYtelse: {}
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
  const namespace = 'familymanager-' + personID + '-trygdeordninger'

  const p = _.get(replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  const selectCategoryOptions: OptionsType<{label: string, value: SedCategory}> = [{
    label: t('el:option-trygdeordning-perioderMedArbeid'), value: 'perioderMedArbeid'
  }, {
    label: t('el:option-trygdeordning-perioderMedTrygd'), value: 'perioderMedTrygd'
  }, {
    label: t('el:option-trygdeordning-perioderMedYtelser'), value: 'perioderMedYtelser'
  }, {
    label: t('el:option-trygdeordning-perioderMedPensjon'), value: 'perioderMedPensjon'
  }]

  const selectPensjonsTypeOptions: Array<{label: string, value: PensjonsType}> = [{
    label: t('el:option-trygdeordning-alderspensjon'), value: 'alderspensjon'
  }, {
    label: t('el:option-trygdeordning-uførhet'), value: 'uførhet'
  }]

  const getCategoryOption = (value: string | undefined | null) => _.find(selectCategoryOptions, s => s.value === value)

  const getPensjonsTypeOption = (value: string | undefined | null) => _.find(selectPensjonsTypeOptions, s => s.value === value)

  const resetValidation = (key: string, p: PageCategory): void => {
    setValidation({
      ..._validation,
      [p]: {
        ..._validation[p],
        [key]: undefined
      }
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (pageCategory: PageCategory): boolean => {
    const newValidation: Validation = {}
    let sedCategory: SedCategory = 'perioderMedITrygdeordning'
    if (pageCategory === 'dekkede') {
      sedCategory = 'perioderMedITrygdeordning'
    }
    if (pageCategory === 'udekkede') {
      sedCategory = 'perioderUtenforTrygdeordning'
    }
    if (pageCategory === 'familieYtelse') {
      if (!_newCategory) {
        newValidation[namespace + '-' + pageCategory + '-category'] = {
          feilmelding: t('message:validation-noPensjonTypeTilPerson', { person: personName }),
          skjemaelementId: 'c-' + namespace + '-category-text'
        } as FeiloppsummeringFeil
        setValidation({
          ..._validation,
          [pageCategory]: newValidation
        })
        return hasNoValidationErrors(newValidation)
      }
      sedCategory = _newCategory
    }

    if (sedCategory && sedCategory !== 'perioderMedPensjon') {
      validatePeriode(
        newValidation,
        {
          startdato: _newStartDato[pageCategory],
          sluttdato: _newSluttDato[pageCategory]
        } as Periode,
        sedCategory,
        pageCategory,
        -1,
        t,
        namespace,
        personName
      )
    } else {
      validatePensjonPeriode(
        newValidation,
        {
          periode: {
            startdato: _newStartDato[pageCategory],
            sluttdato: _newSluttDato[pageCategory]
          },
          pensjonstype: _newPensjonsType
        } as PensjonPeriode,
        sedCategory,
        pageCategory,
        -1,
        t,
        namespace,
        personName
      )
    }

    setValidation({
      ..._validation,
      [pageCategory]: newValidation
    })
    return hasNoValidationErrors(newValidation)
  }

  const onAddNewClicked = (p: PageCategory) => setSeeNewForm({
    ..._seeNewForm,
    [p]: true
  })

  const addCandidateForDeletion = (p: PageCategory, key: string) => {
    setConfirmDelete({
      ..._confirmDelete,
      [p]: _confirmDelete[p].concat(key)
    })
  }

  const removeCandidateForDeletion = (p: PageCategory, key: string) => {
    setConfirmDelete({
      ..._confirmDelete,
      [p]: _.filter(_confirmDelete[p], it => it !== key)
    })
  }

  const onChanged = (p: PageCategory, newSedCategory: SedCategory | null, value: string, what: What, i: number) => {
    if (i < 0) {
      if (what === 'startdato') {
        setNewStartDato({
          ..._newStartDato,
          [p]: value
        })
        resetValidation(namespace + '-' + p + '-startdato', p)
      }
      if (what === 'sluttdato') {
        setNewSluttDato({
          ..._newSluttDato,
          [p]: value
        })
        resetValidation(namespace + '-' + p + '-sluttdato', p)
      }
      if (what === 'category') {
        setNewCategory(value as SedCategory)
        resetValidation(namespace + '-' + p + '-category', p)
      }
      if (what === 'pensjonstype') {
        setNewPensjonsType(value as PensjonsType)
        resetValidation(namespace + '-' + p + '-pensjontype', p)
      }
    } else {
      const newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[newSedCategory!])

      if (what === 'startdato' || what === 'sluttdato') {
        if (newSedCategory === 'perioderMedPensjon') {
          (newPerioder[i] as PensjonPeriode).periode[what] = value
        } else {
          (newPerioder[i] as Periode)[what] = value
        }
        onValueChanged(`${personID}.${newSedCategory}`, newPerioder)
      }
      if (what === 'pensjonstype') {
        (newPerioder[i] as PensjonPeriode).pensjonstype = value
        onValueChanged(`${personID}.${newSedCategory}`, newPerioder)
      }
    }
  }

  const resetForm = (p: PageCategory) => {
    setNewStartDato({
      ..._newStartDato,
      [p]: ''
    })
    setNewSluttDato({
      ..._newSluttDato,
      [p]: ''
    })
    if (p === 'familieYtelse') {
      setNewCategory(undefined)
      setNewPensjonsType(undefined)
    }
    setValidation({
      ..._validation,
      [p]: {}
    })
  }

  const onCancel = (p: PageCategory) => {
    setSeeNewForm({
      ..._seeNewForm,
      [p]: false
    })
    resetForm(p)
  }

  const getKey = (p: Periode | PensjonPeriode, sedCategory: SedCategory): string => {
    if (sedCategory === 'perioderMedPensjon') {
      return (p as PensjonPeriode).periode.startdato
    }
    return (p as Periode).startdato
  }

  const onRemove = (p: PageCategory, newSedCategory: SedCategory, i: number) => {
    const newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[newSedCategory])
    const deletedPerioder: Array<Periode | PensjonPeriode> = newPerioder.splice(i, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeCandidateForDeletion(p, getKey(deletedPerioder[0], newSedCategory))
    }
    onValueChanged(`${personID}.${newSedCategory}`, newPerioder)
  }

  const onAdd = (p: PageCategory) => {
    if (performValidation(p)) {
      let category: SedCategory = 'perioderMedITrygdeordning'
      if (p === 'dekkede') {
        category = 'perioderMedITrygdeordning'
      }
      if (p === 'udekkede') {
        category = 'perioderUtenforTrygdeordning'
      }
      if (p === 'familieYtelse') {
        category = _newCategory!
      }

      let newPerioder: Array<Periode | PensjonPeriode> = _.cloneDeep(perioder[category])
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      const newPeriode: Periode = {
        startdato: _newStartDato[p]
      }
      if (_newSluttDato[p] && _newSluttDato[p].length > 0) {
        newPeriode.sluttdato = _newSluttDato[p]
      } else {
        newPeriode.aapenPeriodeType = 'åpen_sluttdato'
      }

      if (category === 'perioderMedPensjon') {
        newPerioder = (newPerioder as Array<PensjonPeriode>).concat({
          pensjonstype: _newPensjonsType!,
          periode: newPeriode
        })
      } else {
        newPerioder = (newPerioder as Array<Periode>).concat(newPeriode)
      }
      resetForm(p)
      onValueChanged(`${personID}.${category}`, newPerioder)
    }
  }

  const existsDekket = perioder.perioderMedITrygdeordning.length > 0

  const existsUdekket = perioder.perioderUtenforTrygdeordning.length > 0

  const existsFamilieYtelser = (perioder.perioderMedArbeid.length + perioder.perioderMedTrygd.length +
     perioder.perioderMedYtelser.length + perioder.perioderMedPensjon.length) > 0

  const getErrorFor = (p: PageCategory, category: SedCategory | null, index: number, el: string): string | undefined => {
    return index < 0
      ? _validation[p][namespace + '-' + p + '-' + el]?.feilmelding
      : validation[namespace + '-' + category! + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (
    p: Periode | PensjonPeriode | null,
    pageCategory: PageCategory,
    sedCategory: SedCategory | null,
    index: number
  ) => {
    const key = p && sedCategory ? getKey(p, sedCategory) : 'new'
    const candidateForDeletion: boolean = index < 0 ? false : _confirmDelete[pageCategory].indexOf(key) >= 0

    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-startdato-date'}
              feil={getErrorFor(pageCategory, sedCategory, index, 'startdato')}
              id={'c-' + namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-startdato-date'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChanged(pageCategory, sedCategory, e.target.value, 'startdato', index)}
              value={index < 0
                ? _newStartDato[pageCategory]
                : (sedCategory === 'perioderMedPensjon'
                    ? (p as PensjonPeriode).periode.startdato
                    : (p as Periode).startdato
                  )}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-sluttdato-date'}
              feil={getErrorFor(pageCategory, sedCategory, index, 'sluttdato')}
              id={'c-' + namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-sluttdato-date'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChanged(pageCategory, sedCategory, e.target.value, 'sluttdato', index)}
              value={index < 0
                ? _newSluttDato[pageCategory]
                : (sedCategory === 'perioderMedPensjon'
                    ? (p as PensjonPeriode).periode.sluttdato
                    : (p as Periode).sluttdato
                  )}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column>
            {sedCategory !== 'perioderMedPensjon' && (! (index < 0 && pageCategory === 'familieYtelse')) && (
              <AddRemovePanel
                candidateForDeletion={candidateForDeletion}
                existingItem={(index >= 0)}
                marginTop={false}
                onBeginRemove={() =>  addCandidateForDeletion(pageCategory, key!)}
                onConfirmRemove={() => onRemove(pageCategory, sedCategory!, index)}
                onCancelRemove={() => removeCandidateForDeletion(pageCategory, key!)}
                onAddNew={() => onAdd(pageCategory)}
                onCancelNew={() => onCancel(pageCategory)}
              />
            )}
          </Column>
        </AlignStartRow>
        {pageCategory === 'familieYtelse' && (
          index < 0 || sedCategory === 'perioderMedPensjon'
        ) && (
          <>
            <VerticalSeparatorDiv data-size='0.5' />
            <AlignStartRow className={classNames('slideInFromLeft')}>
              <Column>
                {index < 0 && (
                  <Select
                    data-test-id={'c-' + namespace + '-' + pageCategory + '-category-text'}
                    feil={getErrorFor(pageCategory, sedCategory, index, 'category')}
                    highContrast={highContrast}
                    id={'c-' + namespace + '-' + pageCategory + '-category-text'}
                    menuPortalTarget={document.body}
                    onChange={(e: any) => onChanged(pageCategory, sedCategory, e.value, 'category', index)}
                    options={selectCategoryOptions}
                    placeholder={t('el:placeholder-select-default')}
                    selectedValue={getCategoryOption(_newCategory)}
                    defaultValue={getCategoryOption(_newCategory)}
                  />
              )}
              </Column>
              <Column>
                {(
                  (index < 0 && _newCategory === 'perioderMedPensjon') ||
                  (index >= 0 && sedCategory === 'perioderMedPensjon')
                )
                && (
                    <Select
                      data-test-id={'c-' + namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-pensjonstype-text'}
                      feil={getErrorFor(pageCategory, sedCategory, index, 'pensjonstype')}
                      highContrast={highContrast}
                      id={'c-' + namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-pensjonstype-text'}
                      menuPortalTarget={document.body}
                      onChange={(e: any) => onChanged(pageCategory, sedCategory, e.value, 'pensjonstype', index)}
                      options={selectPensjonsTypeOptions}
                      placeholder={t('el:placeholder-select-default')}
                      selectedValue={getPensjonsTypeOption(index < 0 ? _newPensjonsType : (p as PensjonPeriode)?.pensjonstype)}
                      defaultValue={getPensjonsTypeOption(index < 0 ? _newPensjonsType : (p as PensjonPeriode)?.pensjonstype)}
                    />
                  )}
              </Column>
              <Column>
                <AddRemovePanel
                  candidateForDeletion={candidateForDeletion}
                  existingItem={(index >= 0)}
                  marginTop={false}
                  onBeginRemove={() =>  addCandidateForDeletion(pageCategory, key!)}
                  onConfirmRemove={() => onRemove(pageCategory, sedCategory!, index)}
                  onCancelRemove={() => removeCandidateForDeletion(pageCategory, key!)}
                  onAddNew={() => onAdd(pageCategory)}
                  onCancelNew={() => onCancel(pageCategory)}
                />
              </Column>
            </AlignStartRow>
          </>
        )}
        <VerticalSeparatorDiv />
      </>
    )
  }

  const renderAddButton = (pageCategory: PageCategory) => (
    <Row className='slideInFromLeft'>
      <Column>
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={() => onAddNewClicked(pageCategory)}
        >
          <Add />
          <HorizontalSeparatorDiv data-size='0.5' />
          {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
        </HighContrastFlatknapp>
      </Column>
    </Row>
  )

  const titleFor = (item: SedCategory) => {
    if (_.isEmpty(perioder[item])) {
      return null
    }
    return (
      <>
        <VerticalSeparatorDiv/>
        <UndertekstBold>
          {t('el:option-trygdeordning-' + item)}
        </UndertekstBold>
        <VerticalSeparatorDiv/>
      </>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel className='slideInFromLeft'>
        {t('el:title-dekning-trygdeordningen')}
      </Undertittel>
      <>
        <VerticalSeparatorDiv />
        <Ingress>
          {t('el:title-trygdeordningen-dekkede')}
        </Ingress>
        <VerticalSeparatorDiv />
        {existsDekket && (
          <Row className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
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
        {perioder.perioderMedITrygdeordning.map((p, i) =>
          renderRow(p, 'dekkede', 'perioderMedITrygdeordning', i))}
        <hr />
        <VerticalSeparatorDiv />
        {_seeNewForm.dekkede
          ? renderRow(null, 'dekkede', null, -1)
          : renderAddButton('dekkede')}
        <VerticalSeparatorDiv data-size={3} />
        <Ingress>
          {t('el:title-trygdeordningen-udekkede')}
        </Ingress>
        <VerticalSeparatorDiv />
        {existsUdekket && (
          <Row className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
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
        {perioder.perioderUtenforTrygdeordning.map((p, i) =>
          renderRow(p, 'udekkede', 'perioderUtenforTrygdeordning', i))}
        <hr />
        <VerticalSeparatorDiv />
        {_seeNewForm.udekkede
          ? renderRow(null, 'udekkede', null, -1)
          : renderAddButton('udekkede')}
        <VerticalSeparatorDiv data-size={3} />
        <Ingress>
          {t('el:title-trygdeordningen-familieYtelse')}
        </Ingress>
        <VerticalSeparatorDiv />
        {existsFamilieYtelser && (
          <Row className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
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
        {titleFor('perioderMedArbeid')}
        {perioder.perioderMedArbeid.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedArbeid', i))}
        {titleFor('perioderMedTrygd')}
        {perioder.perioderMedTrygd.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedTrygd', i))}
        {titleFor('perioderMedYtelser')}
        {perioder.perioderMedYtelser.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedYtelser', i))}
        {titleFor('perioderMedPensjon')}
        {perioder.perioderMedPensjon.map((p, i) => renderRow(p, 'familieYtelse', 'perioderMedPensjon', i))}
        <hr />
        <VerticalSeparatorDiv />
        {_seeNewForm.familieYtelse
          ? renderRow(null, 'familieYtelse', null, -1)
          : renderAddButton('familieYtelse')}
      </>
    </PaddedDiv>
  )
}

export default Trygdeordning
