import {Alert, Button, Heading, HStack, Loader, Page, Spacer, VStack} from '@navikt/ds-react'
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
    alertMessage: storeAlertMessage,
    alertType,
    filteredF001Saks: storeFilteredF001Saks,
    utkastF001,
    currentSak,
    person: storePerson,
    gettingFilteredF001Saks,
    creatingUtkastF001,
    queryingSaks,
    searchingPerson
  } = useAppSelector(mapState)
  const [selectedF001Sak, setSelectedF001Sak] = React.useState<FilteredF001Sak | undefined>(undefined)
  const [showF001List, setShowF001List] = React.useState(false)
  const [copyStep, setCopyStep] = React.useState<'idle' | 'fetchingSak'>('idle')
  const [copyError, setCopyError] = React.useState<string | undefined>(undefined)
  const [resetDone, setResetDone] = React.useState(false)
  const copyingF001 = creatingUtkastF001 || copyStep !== 'idle'
  const resetCopyWorkflow = (errorMessage?: string) => {
    setCopyStep('idle')
    setCopyError(errorMessage)
    dispatch(resetUtkastF001())
  }

  /** the store is reset on mount, so ignore leftovers from a previous visit until that has happened */
  const alertMessage = resetDone ? storeAlertMessage : undefined
  const person = resetDone ? storePerson : undefined
  const filteredF001Saks = resetDone ? storeFilteredF001Saks : undefined

  const sortedFilteredF001Saks = (filteredF001Saks ?? [])
    .filter((filteredF001Sak) => !!filteredF001Sak.sedListe?.length)
    .sort((a, b) => new Date(b.sedListe[0].sistEndretDato).getTime() - new Date(a.sedListe[0].sistEndretDato).getTime())

  React.useEffect(() => {
    dispatch(personReset())
    dispatch(alertReset())
    dispatch(resetFilteredF001Saks())
    dispatch(resetUtkastF001())
    setResetDone(true)
  }, [])

  React.useEffect(() => {
    setSelectedF001Sak(sortedFilteredF001Saks[0])
  }, [filteredF001Saks])

  React.useEffect(() => {
    if (!resetDone) {
      return
    }
    if (utkastF001 === null) {
      resetCopyWorkflow(t('message:error-aarlig-kontroll-utkast'))
      return
    }
    if (utkastF001 && copyStep === 'idle') {
      setCopyStep('fetchingSak')
      dispatch(querySaks(String(utkastF001.sakId), 'refresh'))
    }
  }, [resetDone, utkastF001])

  React.useEffect(() => {
    if (copyStep !== 'fetchingSak' || !utkastF001 || queryingSaks) {
      return
    }

    if (currentSak?.sakId !== String(utkastF001.sakId)) {
      resetCopyWorkflow(t('message:error-aarlig-kontroll-sak-not-found'))
      return
    }

    const sed = currentSak.sedListe.find((candidate: Sed) => candidate.sedId === String(utkastF001.sedId))
    if (!sed) {
      resetCopyWorkflow(t('message:error-aarlig-kontroll-sed-not-found'))
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
              {gettingFilteredF001Saks && <Loader title={t('message:loading-aarlig-kontroll-f001')} />}
              {filteredF001Saks === null && !gettingFilteredF001Saks && (
                <Alert variant="error" size="small">{t('message:error-aarlig-kontroll-f001-list')}</Alert>
              )}
              {filteredF001Saks && !gettingFilteredF001Saks && sortedFilteredF001Saks.length === 0 && (
                <Alert variant="info" size="small">{t('message:info-aarlig-kontroll-no-f001')}</Alert>
              )}
              {selectedF001Sak && (
                <VStack gap="space-8">
                  <HStack gap="space-16" align="center">
                    <Heading size="small">{t('label:aarlig-kontroll-valgt-f001')}</Heading>
                    <Button variant="tertiary" size="small" onClick={() => setShowF001List(true)}>
                      {t('el:button-aarlig-kontroll-velg-annen-f001')}
                    </Button>
                  </HStack>
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
                </VStack>
              )}
              <Modal
                open={showF001List}
                width="900px"
                onModalClose={() => setShowF001List(false)}
                modal={{
                  modalTitle: t('label:aarlig-kontroll-velg-f001'),
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
