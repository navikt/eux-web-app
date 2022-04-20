import { AddCircle } from '@navikt/ds-icons'
import { Alert, BodyLong, Button, Select, TextField } from '@navikt/ds-react'
import DateInput from 'components/Forms/DateInput'
import { toDateFormat } from 'components/Forms/PeriodeInput'
import { State } from 'declarations/reducers'
import { Kodeverk, OldFamilieRelasjon, Person } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import useValidation from 'hooks/useValidation'
import { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import _ from 'lodash'
import { Column, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { AbroadPersonFormValidationProps, validateAbroadPersonForm } from './validation'

export interface AbroadPersonFormSelector {
  kjoennList: Array<Kodeverk> | undefined
}

export interface AbroadPersonFormProps {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  alertTypesWatched: Array<string> | undefined
  className?: string
  rolleList: Array<Kodeverk>
  existingFamilyRelationships: Array<OldFamilieRelasjon>
  onAbroadPersonAddedFailure: () => void
  onAbroadPersonAddedSuccess: (r: OldFamilieRelasjon) => void
  person: Person | null | undefined
}

const mapState = (state: State): AbroadPersonFormSelector => ({
  kjoennList: state.app.kjoenn
})

const emptyFamilieRelasjon: OldFamilieRelasjon = {
  fnr: '',
  fdato: '',
  land: null,
  statsborgerskap: null,
  rolle: '',
  kjoenn: '',
  fornavn: '',
  etternavn: ''
}

const AbroadPersonForm: React.FC<AbroadPersonFormProps> = ({
  alertMessage,
  alertType,
  alertTypesWatched = [],
  rolleList,
  existingFamilyRelationships,
  onAbroadPersonAddedFailure,
  onAbroadPersonAddedSuccess,
  person
}: AbroadPersonFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { kjoennList }: AbroadPersonFormSelector = useSelector<State, AbroadPersonFormSelector>(mapState)
  const [_relation, setRelation] = useState<OldFamilieRelasjon>(emptyFamilieRelasjon)
  const [_validation, resetValidation, performValidation] = useValidation<AbroadPersonFormValidationProps>({}, validateAbroadPersonForm)
  const namespace = 'familierelasjoner'

  useEffect(() => {
    setRelation(emptyFamilieRelasjon)
    resetValidation()
  }, [person])

  const updateCountry = (felt: string, value: string): void =>
    setRelation({
      ..._relation,
      [felt]: value
    })

  const updateRelation = (
    felt: string,
    value: string
  ): void => setRelation({
    ..._relation,
    [felt]: value ?? ''
  })

  const trimFamilyRelation = (relation: OldFamilieRelasjon): OldFamilieRelasjon => ({
    fnr: relation.fnr ? relation.fnr.trim() : '',
    fdato: relation.fdato ? relation.fdato.trim() : '',
    fornavn: relation.fornavn ? relation.fornavn.trim() : '',
    etternavn: relation.etternavn ? relation.etternavn.trim() : '',
    kjoenn: relation.kjoenn ? relation.kjoenn.trim() : '',
    relasjoner: relation.relasjoner,
    land: relation.land,
    statsborgerskap: relation.statsborgerskap,
    rolle: relation.rolle
  } as OldFamilieRelasjon)

  const canAddRelation = (): boolean => (
    !_.isEmpty(_relation.fnr) &&
    !_.isEmpty(_relation.rolle) &&
    !_.isEmpty(_relation.land) &&
    !_.isEmpty(_relation.statsborgerskap) &&
    !_.isEmpty(_relation.kjoenn) &&
    !_.isEmpty(_relation.fornavn) &&
    !_.isEmpty(_relation.etternavn) &&
    !_.isEmpty(_relation.fdato) &&
    _relation.fdato?.match(/\d{4}-\d{2}-\d{2}/) !== null
  )

  const conflictingPerson = (): boolean => {
    if (_.find(existingFamilyRelationships, (f) => f.fnr === _relation.fnr) !== undefined) {
      onAbroadPersonAddedFailure()
      return true
    }
    return false
  }

  const addRelation = (): void => {
    const valid = performValidation({
      namespace,
      relation: _relation
    })
    if (valid) {
      if (canAddRelation() && !conflictingPerson()) {
        setRelation(emptyFamilieRelasjon)
        onAbroadPersonAddedSuccess(trimFamilyRelation(_relation))
      }
    }
  }

  return (
    <>
      <BodyLong>{t('label:family-utland-add-form')}</BodyLong>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <TextField
            id={namespace + '-fnr'}
            data-testid={namespace + '-fnr'}
            error={_validation[namespace + '-fnr']?.feilmelding}
            label={t('label:utenlandsk-id')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateRelation('fnr', e.currentTarget.value)
              resetValidation('fnr')
            }}
            value={_relation.fnr}
          />
        </Column>
        <Column>
          <CountrySelect
            id={namespace + '-land'}
            data-testid={namespace + '-land'}
            error={_validation[namespace + '-land']?.feilmelding}
            label={t('label:land')}
            key={namespace + '-land-' + _relation.land}
            menuPortalTarget={document.body}
            includeList={CountryFilter.STANDARD({})}
            onOptionSelected={(e: Country) => {
              updateCountry('land', e.value)
              resetValidation('land')
            }}
            values={_relation.land}
          />
        </Column>
        <Column>
          <CountrySelect
            id={namespace + '-statsborgerskap'}
            data-testid={namespace + '-statsborgerskap'}
            error={_validation[namespace + '-statsborgerskap']?.feilmelding}
            includeList={CountryFilter.STANDARD({})}
            label={t('label:statsborgerskap')}
            key={namespace + '-statsborgerskap-' + _relation.statsborgerskap}
            menuPortalTarget={document.body}
            onOptionSelected={(e: Country) => {
              updateCountry('statsborgerskap', e.value)
              resetValidation('statsborgerskap')
            }}
            values={_relation.statsborgerskap}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <TextField
            id={namespace + '-fornavn'}
            data-testid={namespace + '-fornavn'}
            error={_validation[namespace + '-fornavn']?.feilmelding}
            label={t('label:fornavn')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateRelation('fornavn', e.currentTarget.value)
              resetValidation('fornavn')
            }}
            value={_relation.fornavn}
          />
        </Column>
        <Column>
          <TextField
            id={namespace + '-etternavn'}
            data-testid={namespace + '-etternavn'}
            error={_validation[namespace + '-etternavn']?.feilmelding}
            label={t('label:etternavn')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateRelation('etternavn', e.currentTarget.value)
              resetValidation('etternavn')
            }}
            value={_relation.etternavn}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <Select
            id={namespace + '-kjoenn'}
            data-testid={namespace + '-kjoenn'}
            error={_validation[namespace + '-kjoenn']?.feilmelding}
            label={t('label:kjønn')}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              updateRelation('kjoenn', e.currentTarget.value)
              resetValidation('kjoenn')
            }}
            value={_relation.kjoenn}
          >
            <option value='' disabled>
              {t('el:placeholder-select-default')}
            </option>
            {kjoennList &&
                kjoennList.map((element: Kodeverk) => (
                  <option value={element.kode} key={element.kode}>
                    {element.term}
                  </option>
                ))}
          </Select>
        </Column>
        <Column>
          <DateInput
            id='fdato'
            data-testid={namespace + '-fdato'}
            key={namespace + '-fdato-' + _relation.fdato}
            namespace={namespace}
            error={_validation[namespace + '-fdato']?.feilmelding}
            label={t('label:fødselsdato') + ' (' + t('el:placeholder-date-default') + ')'}
            onChanged={(date: string) => {
              updateRelation('fdato', date)
              resetValidation('fdato')
            }}
            value={toDateFormat(_relation.fdato, 'DD.MM.YYYY')}
          />
          <VerticalSeparatorDiv />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <Select
            id={namespace + 'familierelasjon'}
            data-testid={namespace + '-familierelasjon'}
            error={_validation[namespace + '-familierelasjon']?.feilmelding}
            label={t('label:familierelasjon')}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              updateRelation('rolle', e.currentTarget.value)
              resetValidation('rolle')
            }}
            value={_relation.rolle}
          >
            <option value='' disabled>
              {t('el:placeholder-select-default')}
            </option>
            {rolleList.map((element: Kodeverk) => (
              <option value={element.kode} key={element.kode}>
                {element.term}
              </option>
            ))}
          </Select>
        </Column>
        <Column style={{ marginTop: '2rem' }}>
          <Button
            variant='secondary'
            onClick={addRelation}
            className='relasjon familierelasjoner__knapp'
          >
            <AddCircle />
            {t('el:button-add')}
          </Button>
        </Column>
        {alertMessage && alertType && alertTypesWatched.indexOf(alertType) >= 0 && (
          <Alert variant='warning'>
            {alertMessage}
          </Alert>
        )}
      </Row>
    </>
  )
}

AbroadPersonForm.propTypes = {
  className: PT.string,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired).isRequired
}

export default AbroadPersonForm
