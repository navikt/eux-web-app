import {Alert, Heading, HStack, Link, Loader, Page, Spacer, VStack} from '@navikt/ds-react'
import {createUtkastF001, getFilteredF001Saks, resetFilteredF001Saks, resetUtkastF001} from 'actions/aarligKontroll'
import {alertReset} from 'actions/alert'
import {appReset} from 'actions/app'
import {personReset, searchPerson} from 'actions/person'
import {cleanUpSvarSed, querySaks} from 'actions/svarsed'
import * as types from 'constants/actionTypes'
import TopContainer from 'components/TopContainer/TopContainer'
import Modal from 'components/Modal/Modal'
import PersonPanel from 'applications/OpprettSak/PersonPanel/PersonPanel'
import PersonSearch from 'applications/OpprettSak/PersonSearch/PersonSearch'
import SEDPanel from 'applications/SvarSed/Sak/AarligKontrollSEDPanel'
import {ModalContent} from 'declarations/components'
import {State} from 'declarations/reducers'
import {FilteredF001Sak, PersonInfoPDL, Sak, Sed, UtkastF001} from 'declarations/types'
import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'

interface AarligKontrollSelector {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  filteredF001Saks: Array<FilteredF001Sak> | null | undefined
  utkastF001: UtkastF001 | null | undefined
  currentSak: Sak | undefined
  person: PersonInfoPDL | null | undefined
  gettingFilteredF001Saks: boolean
  creatingUtkastF001: boolean
  queryingSaks: boolean
  searchingPerson: boolean
}

const mapState = (state: State): AarligKontrollSelector => ({
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  filteredF001Saks: state.aarligKontroll.filteredF001Saks,
  utkastF001: state.aarligKontroll.utkastF001,
  currentSak: state.svarsed.currentSak,
  person: state.person.person,
  gettingFilteredF001Saks: state.loading.gettingFilteredF001Saks,
  creatingUtkastF001: state.loading.creatingUtkastF001,
  queryingSaks: state.loading.queryingSaks,
  searchingPerson: state.loading.searchingPerson
})

export const AarligKontrollPage: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    alertMessage,
    alertType,
    filteredF001Saks,
    utkastF001,
    currentSak,
    person,
    gettingFilteredF001Saks,
    creatingUtkastF001,
    queryingSaks,
    searchingPerson
  } = useAppSelector(mapState)
  const [selectedF001Sak, setSelectedF001Sak] = React.useState<FilteredF001Sak | undefined>(undefined)
  const [showF001List, setShowF001List] = React.useState(false)
  const [copyStep, setCopyStep] = React.useState<'idle' | 'fetchingSak'>('idle')
  const [copyError, setCopyError] = React.useState<string | undefined>(undefined)
  const copyingF001 = creatingUtkastF001 || copyStep !== 'idle'
  const resetCopyWorkflow = (errorMessage?: string) => {
    setCopyStep('idle')
    setCopyError(errorMessage)
    dispatch(resetUtkastF001())
  }

  const sortedFilteredF001Saks = (filteredF001Saks ?? [])
    .filter((filteredF001Sak) => !!filteredF001Sak.sedListe?.length)
    .sort((a, b) => new Date(b.sedListe[0].sistEndretDato).getTime() - new Date(a.sedListe[0].sistEndretDato).getTime())

  React.useEffect(() => {
    dispatch(personReset())
    dispatch(alertReset())
    dispatch(resetFilteredF001Saks())
  }, [])

  React.useEffect(() => {
    setSelectedF001Sak(sortedFilteredF001Saks[0])
  }, [filteredF001Saks])

  React.useEffect(() => {
    if (utkastF001 === null) {
      resetCopyWorkflow('Kunne ikke opprette et utkast av den valgte F001-en. Prøv igjen.')
      return
    }
    if (utkastF001 && copyStep === 'idle') {
      setCopyStep('fetchingSak')
      dispatch(querySaks(String(utkastF001.sakId), 'refresh'))
    }
  }, [utkastF001])

  React.useEffect(() => {
    if (copyStep !== 'fetchingSak' || !utkastF001 || queryingSaks) {
      return
    }

    if (currentSak?.sakId !== String(utkastF001.sakId)) {
      resetCopyWorkflow('Fant ikke den nye saken som ble opprettet. Prøv igjen.')
      return
    }

    const sed = currentSak.sedListe.find((candidate: Sed) => candidate.sedId === String(utkastF001.sedId))
    if (!sed) {
      resetCopyWorkflow('Fant ikke den nye F001-en i den opprettede saken. Prøv igjen.')
      return
    }

    dispatch(resetUtkastF001())
    dispatch(cleanUpSvarSed())
    navigate({
      pathname: `/svarsed/edit/sak/${utkastF001.sakId}/sed/${utkastF001.sedId}`
    })
  }, [copyStep, currentSak, queryingSaks, utkastF001])

  const gotoFrontpage = () => {
    dispatch(appReset())
    navigate({
      pathname: '/',
    })
  }

  const selectF001Sak = (filteredF001Sak: FilteredF001Sak) => {
    setSelectedF001Sak(filteredF001Sak)
    setCopyError(undefined)
    setShowF001List(false)
  }

  return (
    <Page>
      <TopContainer
        onGoBackClick={gotoFrontpage}
        title={t('app:page-title-aarlig-kontroll')}
      >
        <Page.Block width="2xl" gutters as="main">
          <HStack padding="space-48" width="100%">
            <Spacer/>
            <VStack width="780px" gap="space-16">
              <Heading size="medium">{t('app:page-title-aarlig-kontroll')}</Heading>
              <PersonSearch
                alertMessage={alertMessage}
                alertType={alertType}
                alertTypesWatched={[types.PERSON_SEARCH_FAILURE]}
                error={undefined}
                initialFnr=""
                parentNamespace="aarligKontroll"
                searchingPerson={searchingPerson}
                person={person}
                value=""
                onFnrChange={() => {
                  setSelectedF001Sak(undefined)
                  setCopyError(undefined)
                  dispatch(resetFilteredF001Saks())
                }}
                onPersonFound={(foundPerson) => {
                  if (foundPerson.fnr) {
                    dispatch(getFilteredF001Saks(foundPerson.fnr))
                  }
                }}
                onSearchPerformed={(fnr) => dispatch(searchPerson(fnr))}
              />
              {person && <PersonPanel person={person}/>}
              {gettingFilteredF001Saks && <Loader title="Henter aktive F001-er" />}
              {filteredF001Saks === null && !gettingFilteredF001Saks && (
                <Alert variant="error" size="small">Kunne ikke hente F001-er for personen. Prøv igjen.</Alert>
              )}
              {filteredF001Saks && !gettingFilteredF001Saks && sortedFilteredF001Saks.length === 0 && (
                <Alert variant="info" size="small">Personen har ingen aktive F001-er.</Alert>
              )}
              {selectedF001Sak && (
                <VStack gap="space-8">
                  <Heading size="small">Valgt F001</Heading>
                  <SEDPanel
                    f001Sak={selectedF001Sak}
                    mode="selected"
                    copying={copyingF001}
                    onCopy={() => {
                      setCopyError(undefined)
                      dispatch(createUtkastF001(selectedF001Sak))
                    }}
                  />
                  {copyError && <Alert variant="error" size="small">{copyError}</Alert>}
                  <Link
                    href="#alle-f001"
                    onClick={(event) => {
                      event.preventDefault()
                      setShowF001List(true)
                    }}
                  >
                    Velg en annen F001
                  </Link>
                </VStack>
              )}
              <Modal
                open={showF001List}
                width="900px"
                onModalClose={() => setShowF001List(false)}
                modal={{
                  modalTitle: 'Velg F001',
                  modalContent: (
                    <VStack gap="space-8">
                      {sortedFilteredF001Saks.map((filteredF001Sak) => (
                        <SEDPanel
                          key={filteredF001Sak.sedListe[0].sedId}
                          f001Sak={filteredF001Sak}
                          mode="list"
                          selected={selectedF001Sak?.sedListe[0].sedId === filteredF001Sak.sedListe[0].sedId}
                          onSelect={() => selectF001Sak(filteredF001Sak)}
                        />
                      ))}
                    </VStack>
                  )
                } as ModalContent}
              />
            </VStack>
            <Spacer/>
          </HStack>
        </Page.Block>
      </TopContainer>
    </Page>
  )
}

export default AarligKontrollPage
