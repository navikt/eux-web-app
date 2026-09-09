import {Alert, Heading, HStack, Link, Loader, Page, Spacer, VStack} from '@navikt/ds-react'
import {resetF001s, searchF001s} from 'actions/aarligKontroll'
import {appReset} from 'actions/app'
import {searchPerson} from 'actions/person'
import * as types from 'constants/actionTypes'
import TopContainer from 'components/TopContainer/TopContainer'
import Modal from 'components/Modal/Modal'
import PersonPanel from 'applications/OpprettSak/PersonPanel/PersonPanel'
import PersonSearch from 'applications/OpprettSak/PersonSearch/PersonSearch'
import SEDPanel from 'applications/SvarSed/Sak/SEDPanel'
import {ModalContent} from 'declarations/components'
import {State} from 'declarations/reducers'
import {PersonInfoPDL, Sed} from 'declarations/types'
import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'

interface AarligKontrollSelector {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  f001s: Array<Sed> | null | undefined
  person: PersonInfoPDL | null | undefined
  searchingF001s: boolean
  searchingPerson: boolean
}

const mapState = (state: State): AarligKontrollSelector => ({
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  f001s: state.aarligKontroll.f001s,
  person: state.person.person,
  searchingF001s: state.loading.searchingF001s,
  searchingPerson: state.loading.searchingPerson
})

export const AarligKontrollPage: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    alertMessage,
    alertType,
    f001s,
    person,
    searchingF001s,
    searchingPerson
  } = useAppSelector(mapState)
  const [selectedF001, setSelectedF001] = React.useState<Sed | undefined>(undefined)
  const [showF001List, setShowF001List] = React.useState(false)

  const sortedF001s = [...(f001s ?? [])]
    .sort((a, b) => new Date(b.sistEndretDato).getTime() - new Date(a.sistEndretDato).getTime())

  React.useEffect(() => {
    setSelectedF001(sortedF001s[0])
  }, [f001s])

  const gotoFrontpage = () => {
    dispatch(appReset())
    navigate({
      pathname: '/',
    })
  }

  const selectF001 = (f001: Sed) => {
    setSelectedF001(f001)
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
                  setSelectedF001(undefined)
                  dispatch(resetF001s())
                }}
                onPersonFound={(foundPerson) => {
                  if (foundPerson.fnr) {
                    dispatch(searchF001s(foundPerson.fnr))
                  }
                }}
                onSearchPerformed={(fnr) => dispatch(searchPerson(fnr))}
              />
              {person === null && (
                <Alert variant="error" size="small">Personen ble ikke funnet.</Alert>
              )}
              {person && <PersonPanel person={person}/>}
              {searchingF001s && <Loader title="Henter aktive F001-er" />}
              {f001s !== undefined && !searchingF001s && sortedF001s.length === 0 && (
                <Alert variant="info" size="small">Personen har ingen aktive F001-er.</Alert>
              )}
              {selectedF001 && (
                <VStack gap="space-8">
                  <Heading size="small">Valgt F001</Heading>
                  <SEDPanel sed={selectedF001} type="aarligKontroll"/>
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
                      {sortedF001s.map((f001) => (
                        <SEDPanel
                          key={f001.sedId}
                          sed={f001}
                          type="aarligKontrollList"
                          selected={selectedF001?.sedId === f001.sedId}
                          onSelect={() => selectF001(f001)}
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
