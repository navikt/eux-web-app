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
import {F001Kandidat, F001SakSearchContext, FilteredF001Sak, PersonInfoPDL, Sak, Sed, UtkastF001} from 'declarations/types'
import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'

interface AarligKontrollSelector {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  filteredF001Saks: Array<FilteredF001Sak> | null | undefined
  filteredF001SaksContext: F001SakSearchContext | undefined
  person: PersonInfoPDL | null | undefined
  gettingFilteredF001Saks: boolean
  searchingPerson: boolean
}

const mapState = (state: State): AarligKontrollSelector => ({
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  filteredF001Saks: state.aarligKontroll.filteredF001Saks,
  filteredF001SaksContext: state.aarligKontroll.filteredF001SaksContext,
  person: state.person.person,
  gettingFilteredF001Saks: state.loading.gettingFilteredF001Saks,
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
    filteredF001SaksContext,
    person: storePerson,
    gettingFilteredF001Saks,
    searchingPerson
  } = useAppSelector(mapState)
  const [selectedSedId, setSelectedSedId] = React.useState<string | undefined>(undefined)
  const [showF001List, setShowF001List] = React.useState(false)
  const [copyingF001, setCopyingF001] = React.useState(false)
  const [copyError, setCopyError] = React.useState<string | undefined>(undefined)
  const [resetDone, setResetDone] = React.useState(false)

  /** the store is reset on mount, so ignore leftovers from a previous visit until that has happened */
  const alertMessage = resetDone ? storeAlertMessage : undefined
  const person = resetDone ? storePerson : undefined

  /**
   * a search cannot be cancelled, so a response for an earlier fnr can land after the caseworker has moved on to
   * another person. Only trust the list when it belongs to the fnr currently on screen.
   */
  const f001SaksBelongToPerson = !!person?.fnr && filteredF001SaksContext?.fnr === person.fnr
  const filteredF001Saks = f001SaksBelongToPerson ? storeFilteredF001Saks : undefined

  const f001Kandidater: Array<F001Kandidat> = (filteredF001Saks ?? [])
    .flatMap((filteredF001Sak) => (
      filteredF001Sak.sedListe?.length
        ? [{ sakId: filteredF001Sak.sakId, fagsak: filteredF001Sak.fagsak, sed: filteredF001Sak.sedListe[0] }]
        : []
    ))
    .sort((a, b) => new Date(b.sed.sistEndretDato).getTime() - new Date(a.sed.sistEndretDato).getTime())

  /** derived, so the selection follows the list instead of having to be reset when the list changes */
  const selectedF001 = f001Kandidater.find((kandidat) => kandidat.sed.sedId === selectedSedId) ?? f001Kandidater[0]

  React.useEffect(() => {
    dispatch(personReset())
    dispatch(alertReset())
    dispatch(resetFilteredF001Saks())
    dispatch(resetUtkastF001())
    setResetDone(true)
  }, [])

  /** creates the utkast, verifies that the new sak and sed exist, and returns an error message if not */
  const kopierF001 = async (sakId: string, sedId: string): Promise<string | undefined> => {
    const utkast: UtkastF001 | undefined = (await dispatch(createUtkastF001(sakId, sedId)) as any)?.payload
    if (!utkast) {
      return t('message:error-aarlig-kontroll-utkast')
    }

    const payload: any = (await dispatch(querySaks(String(utkast.sakId), 'refresh')) as any)?.payload
    const sak: Sak | undefined = Array.isArray(payload) ? payload[0] : payload
    if (sak?.sakId !== String(utkast.sakId)) {
      return t('message:error-aarlig-kontroll-sak-not-found')
    }
    if (!sak.sedListe?.some((candidate: Sed) => candidate.sedId === String(utkast.sedId))) {
      return t('message:error-aarlig-kontroll-sed-not-found')
    }

    dispatch(cleanUpSvarSed())
    navigate({
      pathname: `/svarsed/edit/sak/${utkast.sakId}/sed/${utkast.sedId}`
    })
    return undefined
  }

  const onKopierClick = async () => {
    if (!selectedF001) {
      return
    }
    setCopyError(undefined)
    setCopyingF001(true)
    const feilmelding = await kopierF001(selectedF001.sakId, selectedF001.sed.sedId)
    dispatch(resetUtkastF001())
    /** on success we navigate away, so the button is left in its loading state until unmount */
    if (feilmelding) {
      setCopyingF001(false)
      setCopyError(feilmelding)
    }
  }

  const gotoFrontpage = () => {
    dispatch(appReset())
    navigate({
      pathname: '/',
    })
  }

  const selectF001 = (f001Kandidat: F001Kandidat) => {
    setSelectedSedId(f001Kandidat.sed.sedId)
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
                  setSelectedSedId(undefined)
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
              {filteredF001Saks && !gettingFilteredF001Saks && f001Kandidater.length === 0 && (
                <Alert variant="info" size="small">{t('message:info-aarlig-kontroll-no-f001')}</Alert>
              )}
              {selectedF001 && (
                <VStack gap="space-8">
                  <HStack gap="space-16" align="center">
                    <Heading size="small">{t('label:aarlig-kontroll-valgt-f001')}</Heading>
                    <Button variant="tertiary" size="small" onClick={() => setShowF001List(true)}>
                      {t('el:button-aarlig-kontroll-velg-annen-f001')}
                    </Button>
                  </HStack>
                  <SEDPanel
                    sakId={selectedF001.sakId}
                    fagsak={selectedF001.fagsak}
                    sed={selectedF001.sed}
                    mode="selected"
                    copying={copyingF001}
                    onCopy={onKopierClick}
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
                      {f001Kandidater.map((f001Kandidat) => (
                        <SEDPanel
                          key={f001Kandidat.sed.sedId}
                          sakId={f001Kandidat.sakId}
                          fagsak={f001Kandidat.fagsak}
                          sed={f001Kandidat.sed}
                          mode="list"
                          selected={selectedF001?.sed.sedId === f001Kandidat.sed.sedId}
                          onSelect={() => selectF001(f001Kandidat)}
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
