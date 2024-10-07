import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, BodyLong, Button, Select, TextField } from '@navikt/ds-react'
import DateField  from 'components/DateField/DateField'
import { State } from 'declarations/reducers'
import { Kodeverk, OldFamilieRelasjon, Person } from 'declarations/types'
import { KodeverkPropType } from 'declarations/types.pt'
import useLocalValidation from 'hooks/useLocalValidation'
import { Country } from '@navikt/land-verktoy'
import _ from 'lodash'
import {Column, Row, VerticalSeparatorDiv} from '@navikt/hoykontrast'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'store'
import { AbroadPersonFormValidationProps, validateAbroadPersonForm } from './validation'
import styled from "styled-components";
import useUnmount from "../../../hooks/useUnmount";
import CountryDropdown from "../../../components/CountryDropdown/CountryDropdown";

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
  disableAll?: boolean
  closeAndOpen?: () => void
  setOpenAgain?: (s: any) => void
  flashBackground?: boolean | null
}

const mapState = (state: State): AbroadPersonFormSelector => ({
  kjoennList: state.app.kjoenn,
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

type StyleTypes = {
  flashBackground?: boolean | null
}

const FlashDiv = styled.div<StyleTypes>`
  background: #ffffff;
  animation: ${props => props.flashBackground ? 'fadeBackground 1s' : ''};

  @keyframes fadeBackground {
    from { background-color: #ffffff; }
    to { background-color: #FCE97F; }
  }
`

const AbroadPersonForm: React.FC<AbroadPersonFormProps> = ({
  alertMessage,
  alertType,
  alertTypesWatched = [],
  rolleList,
  existingFamilyRelationships,
  onAbroadPersonAddedFailure,
  onAbroadPersonAddedSuccess,
  person,
  disableAll,
  closeAndOpen,
  setOpenAgain,
  flashBackground
}: AbroadPersonFormProps): JSX.Element => {
  const { t } = useTranslation()
  const namespace = 'familierelasjoner'
  const { kjoennList }: AbroadPersonFormSelector = useAppSelector(mapState)
  const [_relation, setRelation] = useState<OldFamilieRelasjon>(emptyFamilieRelasjon)
  const [_validation, resetValidation, performValidation] = useLocalValidation<AbroadPersonFormValidationProps>(validateAbroadPersonForm, namespace)

  useUnmount(() => {
    if(setOpenAgain) setOpenAgain(null)
  })

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

  const onDatoChanged = (date: string) => {
    updateRelation('fdato', date)
    resetValidation('fdato')
  }


  const trimFamilyRelation = (relation: OldFamilieRelasjon): OldFamilieRelasjon => ({
    fnr: relation.fnr ? relation.fnr.trim() : '',
    fdato: relation.fdato ? relation.fdato.trim() : '',
    fornavn: relation.fornavn ? relation.fornavn.trim() : '',
    etternavn: relation.etternavn ? relation.etternavn.trim() : '',
    kjoenn: relation.kjoenn ? relation.kjoenn.trim() : '',
    relasjoner: relation?.relasjoner,
    land: relation.land,
    statsborgerskap: relation.statsborgerskap,
    rolle: relation.rolle
  } as OldFamilieRelasjon)

  const canAddRelation = (): boolean => (
    !_.isEmpty(_relation.fnr) &&
    !_.isEmpty(_relation.rolle) &&
    !_.isEmpty(_relation.land) &&
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
        if(closeAndOpen) closeAndOpen()
      }
    }
  }

  return (
    <FlashDiv flashBackground={flashBackground}>
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
            disabled={disableAll}
          />
        </Column>
        <Column>
          <CountryDropdown
            id={namespace + '-land'}
            data-testid={namespace + '-land'}
            error={_validation[namespace + '-land']?.feilmelding}
            label={t('label:land')}
            countryCodeListName="euEftaLand"
            excludeNorway={true}
            onOptionSelected={(e: Country) => {
              updateCountry('land', e.value)
              resetValidation('land')
            }}
            values={_relation.land}
            isDisabled={disableAll}
          />
        </Column>
        <Column>
          <CountryDropdown
            id={namespace + '-statsborgerskap'}
            data-testid={namespace + '-statsborgerskap'}
            error={_validation[namespace + '-statsborgerskap']?.feilmelding}
            countryCodeListName="statsborgerskap"
            label={t('label:statsborgerskap')}
            onOptionSelected={(e: Country) => {
              updateCountry('statsborgerskap', e.value)
              resetValidation('statsborgerskap')
            }}
            values={_relation.statsborgerskap}
            isDisabled={disableAll}
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
            disabled={disableAll}
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
            disabled={disableAll}
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
            disabled={disableAll}
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
          <DateField
            error={_validation[namespace + '-fdato']?.feilmelding}
            id='fdato'
            namespace={namespace}
            label={t('label:fødselsdato')}
            onChanged={onDatoChanged}
            dateValue={_relation.fdato}
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
            disabled={disableAll}
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
            disabled={disableAll}
            icon={<PlusCircleIcon/>}
          >
            {t('el:button-add')}
          </Button>
        </Column>
        {alertMessage && alertType && alertTypesWatched.indexOf(alertType) >= 0 && (
          <Alert variant='warning'>
            {alertMessage}
          </Alert>
        )}
      </Row>
    </FlashDiv>
  )
}

AbroadPersonForm.propTypes = {
  className: PT.string,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired).isRequired
}

export default AbroadPersonForm
