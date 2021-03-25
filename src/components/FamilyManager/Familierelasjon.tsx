import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import Select from 'components/Select/Select'
import { AlignStartRow, FlexCenterDiv, PaddedDiv } from 'components/StyledComponents'
import { FamilieRelasjon2, Periode, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateFamilierelasjon } from 'validation/familierelasjon'

interface FamilierelasjonProps {
  familierelasjonKodeverk: Array<Kodeverk>
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const Familierelasjon: React.FC<FamilierelasjonProps> = ({
  familierelasjonKodeverk,
  highContrast,
  onValueChanged,
  personID,
  replySed,
  validation
}:FamilierelasjonProps): JSX.Element => {
  const { t } = useTranslation()

  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])

  const [_newRelasjonType, setNewRelasjonType] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newAnnenRelasjonType, setNewAnnenRelasjonType] = useState<string>('')
  const [_newAnnenRelasjonPersonNavn, setNewAnnenRelasjonPersonNavn] = useState<string>('')
  const [_newAnnenRelasjonDato, setNewAnnenRelasjonDato] = useState<string>('')
  const [_newBorSammen, setNewBorSammen] = useState<string>('')

  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const [_validation, setValidation] = useState<Validation>({})

  const familierelasjoner: Array<FamilieRelasjon2> = _.get(replySed, `${personID}.familierelasjoner`)
  const namespace = 'familymanager-' + personID + '-familierelasjon'

  const p = _.get(replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  const relasjonTypeOptions = familierelasjonKodeverk.map((f: Kodeverk) => ({
    label: f.term, value: f.kode
  })).concat({
    label: `${t('label:other')} (${t('label:freetext')})`,
    value: 'other'
  })

  const resetValidation = (key: string): void => {
    setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const newValidation: Validation = {}
    validateFamilierelasjon(
      newValidation,
      {
        relasjonType: _newRelasjonType,
        relasjonInfo: '',
        periode: {
          startdato: _newStartDato,
          sluttdato: _newSluttDato
        },
        borSammen: _newBorSammen,
        annenRelasjonType: _newAnnenRelasjonType,
        annenRelasjonPersonNavn: _newAnnenRelasjonPersonNavn,
        annenRelasjonDato: _newAnnenRelasjonDato
      },
      -1,
      t,
      namespace,
      personName
    )
    setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }

  const onAddNewClicked = () => setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string | null) => {
    if (!key) { return null }
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const setRelasjonType = (e: string, i: number) => {
    if (i < 0) {
      setNewRelasjonType(e)
      resetValidation(namespace + '-relasjontype')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].relasjonType = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setSluttDato = (e: string, i: number) => {
    if (i < 0) {
      setNewSluttDato(e)
      resetValidation(namespace + '-sluttdato')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].periode.sluttdato = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setStartDato = (e: string, i: number) => {
    if (i < 0) {
      setNewStartDato(e)
      resetValidation(namespace + '-startdato')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].periode.startdato = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonType = (e: string, i: number) => {
    if (i < 0) {
      setNewAnnenRelasjonType(e)
      resetValidation(namespace + '-annenrelasjontype')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonType = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonPersonNavn = (e: string, i: number) => {
    if (i < 0) {
      setNewAnnenRelasjonPersonNavn(e)
      resetValidation(namespace + '-annenrelasjonpersonnavn')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonPersonNavn = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonDato = (e: string, i: number) => {
    if (i < 0) {
      setNewAnnenRelasjonDato(e)
      resetValidation(namespace + '-annenrelasjondato')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonDato = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setBorSammen = (e: string, i: number) => {
    if (i < 0) {
      setNewBorSammen(e)
      resetValidation(namespace + '-borsammen')
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].borSammen = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const resetForm = () => {
    setNewRelasjonType('')
    setNewSluttDato('')
    setNewStartDato('')
    setNewAnnenRelasjonType('')
    setNewAnnenRelasjonPersonNavn('')
    setNewAnnenRelasjonDato('')
    setNewBorSammen('')
    setValidation({})
  }

  const onCancel = () => {
    setSeeNewForm(false)
    resetForm()
  }

  const getKey = (f: FamilieRelasjon2): string => {
    return f.relasjonType + '-' + f.periode.startdato
  }

  const onRemove = (i: number) => {
    const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
    const deletedFamilierelasjoner: Array<FamilieRelasjon2> = newFamilieRelasjoner.splice(i, 1)
    if (deletedFamilierelasjoner && deletedFamilierelasjoner.length > 0) {
      removeCandidateForDeletion(getKey(deletedFamilierelasjoner[0]))
    }
    onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
  }

  const onAdd = () => {
    if (performValidation()) {
      let newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      if (_.isNil(newFamilieRelasjoner)) {
        newFamilieRelasjoner = []
      }
      const periode: Periode = {
        startdato: _newStartDato
      }
      if (_newSluttDato) {
        periode.sluttdato = _newSluttDato
      } else {
        periode.aapenPeriodeType = 'åpen_sluttdato'
      }
      newFamilieRelasjoner.push({
        relasjonType: _newRelasjonType,
        relasjonInfo: '',
        periode: periode,
        borSammen: _newBorSammen,
        annenRelasjonType: _newAnnenRelasjonType,
        annenRelasjonPersonNavn: _newAnnenRelasjonPersonNavn,
        annenRelasjonDato: _newAnnenRelasjonDato
      })
      resetForm()
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (familierelasjon: FamilieRelasjon2 | null, i: number) => {
    const key = familierelasjon ? getKey(familierelasjon) : 'new'
    const candidateForDeletion = i < 0 ? false : key && _confirmDelete.indexOf(key) >= 0

    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column data-flex='1.5'>
            <Select
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-relasjontype-select'}
              feil={getErrorFor(i, 'relasjonType')}
              highContrast={highContrast}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-relasjontype-select'}
              label={t('label:type')}
              onChange={(e) => setRelasjonType(e.value, i)}
              options={relasjonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              defaultValue={_.find(relasjonTypeOptions, r => (i < 0 ? r.value === _newRelasjonType : r.value === familierelasjon!.relasjonType))}
              selectedValue={_.find(relasjonTypeOptions, r => (i < 0 ? r.value === _newRelasjonType : r.value === familierelasjon!.relasjonType))}
            />
          </Column>
          <Column data-flex='0.75'>
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-startdato-input'}
              feil={getErrorFor(i, 'startdato')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-startdato-input'}
              label={t('label:start-date')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDato(e.target.value, i)}
              placeholder={t('el:placeholder-date-default')}
              value={i < 0 ? _newStartDato : familierelasjon?.periode.startdato}
            />
          </Column>
          <Column data-flex='0.75'>
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-sluttdato-input'}
              feil={getErrorFor(i, 'sluttdato')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-sluttdato-input'}
              label={t('label:end-date')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSluttDato(e.target.value, i)}
              placeholder={t('el:placeholder-date-default')}
              value={i < 0 ? _newSluttDato : familierelasjon?.periode.sluttdato}
            />
          </Column>
          <Column>
            {candidateForDeletion
              ? (
                <FlexCenterDiv className={classNames('nolabel', 'slideInFromRight')}>
                  <Normaltekst>
                    {t('label:are-you-sure')}
                  </Normaltekst>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => onRemove(i)}
                  >
                    {t('label:yes')}
                  </HighContrastFlatknapp>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => removeCandidateForDeletion(key!)}
                  >
                    {t('label:no')}
                  </HighContrastFlatknapp>
                </FlexCenterDiv>
                )
              : (
                <div className={classNames('nolabel')}>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => i < 0 ? onAdd() : addCandidateForDeletion(key!)}
                  >
                    {i < 0 ? <Add /> : <Trashcan />}
                    <HorizontalSeparatorDiv data-size='0.5' />
                    {i < 0 ? t('el:button-add') : t('el:button-remove')}
                  </HighContrastFlatknapp>
                  {_seeNewForm && i < 0 && (
                    <>
                      <HorizontalSeparatorDiv />
                      <HighContrastFlatknapp
                        mini
                        kompakt
                        onClick={onCancel}
                      >
                        {t('el:button-cancel')}
                      </HighContrastFlatknapp>
                    </>
                  )}
                </div>
                )}
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {(i < 0 ? _newRelasjonType === 'other' : familierelasjon?.relasjonType === 'other') && (
          <>
            <AlignStartRow className={classNames('slideInFromLeft')}>
              <Column data-flex='2'>
                <HighContrastInput
                  data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-annenrelasjontype-input'}
                  feil={getErrorFor(i, 'annenrelasjontype')}
                  id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-annenrelasjontype-input'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnnenRelasjonType(e.target.value, i)}
                  value={i < 0 ? _newAnnenRelasjonType : familierelasjon?.annenRelasjonType}
                  label={t('label:other-relation')}
                  placeholder={t('el:placeholder-input-default')}
                />
              </Column>
              <Column data-flex='2' />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: '0.1s' }}>
              <Column data-flex='2'>
                <HighContrastInput
                  data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-annenrelasjonpersonnavn-input'}
                  feil={getErrorFor(i, 'annenrelasjonpersonnavn')}
                  id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-annenrelasjonpersonnavn-input'}
                  label={t('label:person-name')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnnenRelasjonPersonNavn(e.target.value, i)}
                  placeholder={t('el:placeholder-input-default')}
                  value={i < 0 ? _newAnnenRelasjonPersonNavn : familierelasjon?.annenRelasjonPersonNavn}
                />
              </Column>
              <Column>
                <HighContrastInput
                  data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-annenrelasjondato-input'}
                  feil={getErrorFor(i, 'annenrelasjondato')}
                  id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-annenrelasjondato-input'}
                  label={t('label:date-relation')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnnenRelasjonDato(e.target.value, i)}
                  placeholder={t('el:placeholder-input-default')}
                  value={i < 0 ? _newAnnenRelasjonDato : familierelasjon?.annenRelasjonDato}
                />
              </Column>
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow className={classNames('slideInFromLeft')} style={{ animationDelay: '0.2s' }}>
              <Column data-flex='2'>
                <HighContrastRadioPanelGroup
                  checked={i < 0 ? _newBorSammen : familierelasjon?.borSammen}
                  data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-borsammen-radiogroup'}
                  data-no-border
                  id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-borsammen-radiogroup'}
                  feil={getErrorFor(i, 'borsammen')}
                  legend={t('label:live-together')}
                  name={namespace + (i >= 0 ? '[' + i + ']' : '') + '-borsammen'}
                  radios={[
                    { label: t('label:yes'), value: 'ja' },
                    { label: t('label:no'), value: 'nei' }
                  ]}
                  onChange={(e: any) => setBorSammen(e.target.value, i)}
                />
              </Column>
              <Column data-flex='2' />
            </AlignStartRow>
          </>
        )}
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('el:title-familierelasjon')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {familierelasjoner.map(renderRow)}
      <hr />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onAddNewClicked}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:family-relationship').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Familierelasjon
