import React, {useEffect, useState} from "react";
import {Alert, HGrid, Loader, Search, VStack} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import {State} from "../../../declarations/reducers";
import {useAppDispatch, useAppSelector} from "../../../store";
import {FadingLineSeparator} from "../../../components/StyledComponents";
import PersonPanel from "../PersonPanel/PersonPanel";
import {Kodeverk, PersonInfoPDL, PersonInfoUtland, PersonMedFamilie} from "../../../declarations/types";
import {personRelatertReset, searchPersonRelatert} from "../../../actions/person";
import _ from "lodash";

export interface SearchPersonRelatertProps{
  parentNamespace: string
  rolleList?: Array<Kodeverk>,
  onAddClick?: (p: PersonInfoPDL | PersonInfoUtland) => void
  valgteFamilieRelasjonerPDL: Array<PersonInfoPDL>
  familieRelasjonerPDL: Array<PersonInfoPDL>
}

export interface SearchPersonRelatertSelector {
  searchingPersonRelatert: boolean
  personRelatert: PersonInfoPDL | undefined | null
  personMedFamilie: PersonMedFamilie | null | undefined
}

const mapState = (state: State): SearchPersonRelatertSelector => ({
  searchingPersonRelatert: state.loading.searchingPersonRelatert,
  personRelatert: state.person.personRelatert,
  personMedFamilie: state.person.personMedFamilie
})


const SearchPersonRelatert: React.FC<SearchPersonRelatertProps> = ({
  parentNamespace, rolleList, onAddClick, valgteFamilieRelasjonerPDL, familieRelasjonerPDL
}: SearchPersonRelatertProps): JSX.Element => {
  const {searchingPersonRelatert, personRelatert, personMedFamilie}: SearchPersonRelatertSelector = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = parentNamespace + '-search-person-relatert'

  const [_personRelatert, setPersonRelatert] = useState<PersonInfoPDL | undefined>(undefined)
  const [_query, setQuery] = useState<string>('')
  const [_error, setError] = useState<string | undefined>(undefined)
  const [_alert, setAlert] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (personRelatert && !_personRelatert) {
      setPersonRelatert(personRelatert)
    }
  }, [personRelatert])

  const searchPerson = () => {
    setPersonRelatert(undefined)
    if(!_query){
      setError(t('validation:noFnr'))
      return
    }
    if(personMedFamilie?.fnr === _query){
      setError(t('message:error-fnr-is-user', {sok: _query}))
      return
    }
    if (_.find(familieRelasjonerPDL, (p) => p.fnr === _query) !== undefined) {
      setError(t('message:error-fnr-is-in-existing-relation', {sok: _query}))
      return
    }
    dispatch(searchPersonRelatert(_query))
  }

  const updateQuery = (q: string) => {
    setError(undefined)
    setPersonRelatert(undefined)
    setAlert(undefined)
    setQuery(q)
  }

  const onAddPerson = (p: PersonInfoPDL | PersonInfoUtland) => {
    if (_.find(valgteFamilieRelasjonerPDL, (p) => p.fnr === _personRelatert?.fnr) !== undefined) {
      setAlert(t('message:error-fnr-already-added'))
    } else {
      setQuery("")
      setPersonRelatert(undefined)
      setAlert(undefined)
      dispatch(personRelatertReset())
      if(onAddClick){
        onAddClick(p)
      }
    }

  }

  return (
    <HGrid gap="4" columns={'minmax(450px, auto) 21px minmax(450px, auto)'}>
      <VStack gap="1">
        <Search
          label={t('label:fnr-dnr')}
          id={namespace + '-fnr-dnr'}
          onChange={updateQuery}
          hideLabel={false}
          value={_query}
          disabled={searchingPersonRelatert}
        >
          <Search.Button onClick={searchPerson}>
            {searchingPersonRelatert ? t('message:loading-searching') : t('el:button-search')}
            {searchingPersonRelatert && <Loader />}
          </Search.Button>
        </Search>
        {_error &&
          <span className='navds-error-message navds-error-message--medium'>
            {_error}
          </span>
        }
      </VStack>
      <FadingLineSeparator style={{marginLeft: '10px', marginRight: '10px'}} className='fadeIn'>
        &nbsp;
      </FadingLineSeparator>
      <VStack gap="4">
        {_personRelatert &&
          <PersonPanel
            person={_personRelatert}
            rolleList={rolleList}
            onAddClick={onAddPerson}
          />
        }
        {_alert && (
          <Alert variant='error'>
            {_alert}
          </Alert>
        )}
      </VStack>
    </HGrid>

  )
}

export default SearchPersonRelatert
