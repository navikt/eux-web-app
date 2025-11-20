import React, {useEffect, useState} from 'react'
import {Box, Button, Heading, HGrid, Loader, Modal, Select, VStack} from '@navikt/ds-react'
import { Dd, Dl, Dt, HorizontalLineSeparator } from 'components/StyledComponents'
import {Enhet, Enheter, Fagsak, Fagsaker, Kodemaps, Kodeverk, NavRinasak, PersonInfoPDL, Sak, Tema} from 'declarations/types'
import { useTranslation } from 'react-i18next'
import {useAppDispatch, useAppSelector} from "../../../store";
import {State} from "../../../declarations/reducers";
import { useRef } from "react";
import {createFagsakDagpenger, createFagsakGenerell, getFagsaker} from "../../../actions/sak";
import * as types from "../../../constants/actionTypes";
import PersonSearch from "../../OpprettSak/PersonSearch/PersonSearch";
import PersonPanel from "../../OpprettSak/PersonPanel/PersonPanel";
import {updateFagsak} from "../../../actions/svarsed";
import * as sakActions from "../../../actions/sak";
import {getAlleEnheter} from "../../../actions/app";
import {getFagsakTema} from "../../../actions/sak";
import {searchJournalfoeringPerson} from "../../../actions/journalfoering";
import {SakState} from "../../../reducers/sak";


interface JournalfoeringsOpplysningerProps {
  sak: Sak
  sakState: SakState
}

interface ChangeTemaFagsakModalSelector {
  kodemaps: Kodemaps | undefined
  tema: Tema | undefined
  gettingFagsaker: boolean
  creatingFagsak: boolean
  fagsaker: Fagsaker | undefined | null
  fagsakUpdated: boolean | undefined
  createdFagsakId: string | undefined

  person: PersonInfoPDL | null | undefined
  searchingPerson: boolean
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  alleEnheter: Enheter | undefined | null
  otherFagsakTema: NavRinasak | undefined | null
}

const mapState = (state: State): ChangeTemaFagsakModalSelector => ({
  kodemaps: state.app.kodemaps,
  tema: state.app.tema,
  gettingFagsaker: state.loading.gettingFagsaker,
  creatingFagsak: state.loading.creatingFagsak,
  fagsaker: state.sak.fagsaker,
  fagsakUpdated: state.svarsed.fagsakUpdated,
  createdFagsakId: state.sak.saksId,

  person: state.journalfoering.person,
  searchingPerson: state.loading.searchingPerson,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  alleEnheter: state.app.alleEnheter,
  otherFagsakTema: state.sak.fagsakTema
})

const JournalfoeringsOpplysninger = ({ sak, sakState }: JournalfoeringsOpplysningerProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const ref = useRef<HTMLDialogElement>(null);
  const { kodemaps, tema, fagsaker, createdFagsakId, fagsakUpdated, gettingFagsaker, creatingFagsak, alertMessage, alertType, searchingPerson, person, alleEnheter, otherFagsakTema }: ChangeTemaFagsakModalSelector = useAppSelector(mapState)
  const [currentFagsak, setCurrentFagsak] = useState<any>(sak.fagsak)
  const [fagsakTema, setFagsakTema] = useState<NavRinasak | undefined | null>(sakState.fagsakTema)
  const [validFnr, setValidFnr] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const namespace = 'changetemafagsak'
  let sektor = sak.sakType.split("_")[0]
  if (sektor === 'H') { sektor = 'HZ' }
  if (sektor === 'M') { sektor = 'MI' }
  if (sektor === 'P') { sektor = 'PE' }
  if (sektor === 'R') { sektor = 'RE' }
  if (sektor === 'S') { sektor = 'SI' }

  const currentYear = new Date().getFullYear()
  const [fagsakDagpengerYear, setFagsakDagpengerYear] = useState<any>(currentYear)

  const temaer: Array<Kodeverk> = !kodemaps ? [] : !sektor ? [] : !tema ? [] : tema[kodemaps.SEKTOR2FAGSAK[sektor] as keyof Tema]?.filter((k:Kodeverk) => {
    return k.kode !== "GEN"
  })

  useEffect(() => {
    if(currentFagsak?.fnr){
      dispatch(getFagsaker(currentFagsak?.fnr, sektor, currentFagsak?.tema))
      dispatch(searchJournalfoeringPerson(currentFagsak?.fnr))
      dispatch(getAlleEnheter())
    }
    dispatch(getFagsakTema(sak.sakId))
  }, [])

  useEffect(() => {
    if(fagsakUpdated){
      ref.current?.close()
    }
  }, [fagsakUpdated])

  useEffect(() => {
    console.log("Fagsaktema " + fagsakTema)
    console.log("Other fagsaktema " + otherFagsakTema)
  }, [fagsakTema, otherFagsakTema])

  const setFagsakProp = (prop: string, value: string): void => {
    const fagsak = {
      ...currentFagsak,
      [prop]: value
    }
    setCurrentFagsak(fagsak)
  }

  const onTemaChange = (value: string) => {
    const fagsak = {
      ...currentFagsak,
      tema: value,
      _id: "",
      nr: ""
    }
    setCurrentFagsak(fagsak)

    if (value && currentFagsak?.fnr) {
      dispatch(getFagsaker(currentFagsak?.fnr, sektor, value))
    }
  }

  const onFagsakChange = (value: string) => {
    if(!value || value === "") return
    const currentEnhet = currentFagsak?.overstyrtEnhetsnummer
    const fSak: Fagsak | undefined = fagsaker?.find((f) => f._id === value)
    if (fSak)
      fSak.overstyrtEnhetsnummer = currentEnhet
    setCurrentFagsak(fSak)
  }

  const onOverstyrtEnhetChange = (value: string) => {
    const fagsak = {
      ...currentFagsak,
      overstyrtEnhetsnummer: value
    }
    setCurrentFagsak(fagsak)
  }

  const onCreateFagsak = () => {
    if (currentFagsak?.fnr && currentFagsak?.tema) {
      dispatch(createFagsakGenerell(currentFagsak?.fnr, currentFagsak?.tema))
    }
  }

  const onCreateFagsakDagpenger = () => {
    if (currentFagsak?.fnr) {
      dispatch(createFagsakDagpenger(currentFagsak?.fnr, {aar: fagsakDagpengerYear}))
    }
  }


  const onModalClose = () => {
    setIsModalOpen(false)
    setCurrentFagsak(sak.fagsak)
    if(sak.fagsak?.fnr){
      dispatch(getFagsaker(sak.fagsak?.fnr, sektor, sak.fagsak?.tema!))
      dispatch(searchJournalfoeringPerson(sak.fagsak?.fnr))
    }
    dispatch(sakActions.setProperty('saksId', ""))
  }

  const onUpdateButtonClick = () => {
    dispatch(updateFagsak(sak.sakId, currentFagsak))
    const newFagsakTema = {
      ...fagsakTema,
      overstyrtEnhetsnummer: currentFagsak.overstyrtEnhetsnummer
    }
    setFagsakTema(newFagsakTema)
  }

  useEffect(() => {
    if(fagsaker && fagsaker.length === 1){
      dispatch(sakActions.setProperty('saksId', fagsaker[0]._id))
      onFagsakChange(fagsaker[0]._id!)
    }

    if(sektor === "UB" && fagsaker && fagsaker.length > 1 && createdFagsakId){
      onFagsakChange(createdFagsakId)
    }
  }, [fagsaker])

  return (
    <>
      <Modal ref={ref} header={{ heading: t('label:endre-tema-fagsak') }} width="medium" onClose={onModalClose}>
        <Modal.Body>
          <VStack gap="4" padding="4">
            <PersonSearch
              label={t('label:person')}
              key={`${namespace}-fnr-${currentFagsak?.fnr || 'empty'}-${isModalOpen ? 'open' : 'closed'}`}
              error={undefined}
              alertMessage={alertMessage}
              alertType={alertType}
              alertTypesWatched={[types.PERSON_SEARCH_FAILURE]}
              data-testid={namespace + '-fnr'}
              searchingPerson={searchingPerson}
              id={namespace + '-fnr'}
              initialFnr=''
              value={currentFagsak?.fnr ?? ''}
              parentNamespace={namespace}
              onFnrChange={() => {
                if (validFnr) {
                  setValidFnr(false)
                }
              }}
              onPersonFound={() => {
                setValidFnr(true)
                setFagsakProp("fnr", person?.fnr!)
                if(currentFagsak?.tema) {
                  dispatch(getFagsaker(person?.fnr!, sektor, currentFagsak?.tema))
                }
              }}
              onSearchPerformed={(fnr: string) => {
                if(fnr){
                  dispatch(searchJournalfoeringPerson(fnr))
                }
              }}
              person={person}
            />
            {person &&
              <PersonPanel className='neutral' person={person}/>
            }
            {!gettingFagsaker && sektor === "UB" && fagsaker && fagsaker.length >= 0 &&
              <HGrid gap="4" align="end" columns={2}>
                <Select label="År" hideLabel={true} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFagsakDagpengerYear(e.currentTarget.value)}>
                  <option value={currentYear}>{currentYear}</option>
                  <option value={currentYear - 1}>{currentYear - 1}</option>
                  <option value={currentYear - 2}>{currentYear - 2}</option>
                  <option value={currentYear - 3}>{currentYear - 3}</option>
                  <option value={currentYear - 4}>{currentYear - 4}</option>
                </Select>
                <Button variant="secondary" onClick={onCreateFagsakDagpenger} loading={creatingFagsak}>
                  {t("el:button-create-x", {x: "fagsak"})}
                </Button>
              </HGrid>
            }
            <HGrid gap="4" align="center" columns={2}>
              <Select
                id={namespace + '-tema'}
                label={t('label:velg-tema')}
                onChange={(e) => onTemaChange(e.target.value)}
                value={currentFagsak?.tema ?? ''}
              >
                <option value=''>
                  {t('label:velg')}
                </option>)
                {temaer && temaer.map((k: Kodeverk) => (
                  <option value={k.kode} key={k.kode}>
                    {k.term}
                  </option>
                ))}
              </Select>
              {gettingFagsaker && <Loader/>}
              {!gettingFagsaker && fagsaker && fagsaker.length > 0 &&
                <Select
                  id={namespace + '-nr'}
                  label={t('label:velg-fagsak')}
                  onChange={(e)=> onFagsakChange(e.target.value)}
                  value={currentFagsak?._id ?? ''}
                >
                  <option value=''>
                    {t('label:velg')}
                  </option>
                  {fagsaker &&
                    fagsaker.map((f: Fagsak) => (
                      <option value={f._id} key={f._id}>
                        {f.nr || "GENERELL SAK"}
                      </option>
                    ))
                  }
                </Select>
              }
              {!gettingFagsaker && sektor !== "UB" && fagsaker && fagsaker.length === 0 &&
                <Button variant="secondary" onClick={onCreateFagsak} loading={creatingFagsak} className='nolabel'>
                  {t("el:button-create-x", {x: "fagsak"})}
                </Button>
              }
            </HGrid>
            <HGrid gap="4" align="center" columns={2}>
              <Select
                id={namespace + '-overstyrt-enhet'}
                label={t('label:velg-overstyrt-enhet')}
                onChange={(e) => onOverstyrtEnhetChange(e.target.value)}
                value={currentFagsak?.overstyrtEnhetsnummer
                  ? currentFagsak.overstyrtEnhetsnummer
                  : otherFagsakTema?.overstyrtEnhetsnummer ?? ''}
              >
                <option value=''>
                  {t('label:velg')}
                </option>)
                {alleEnheter && alleEnheter.map((e: Enhet) => (
                  <option value={e.enhetNr} key={e.enhetNr}>
                    {e.enhetNr + " - " + e.navn}
                  </option>
                ))}
              </Select>
            </HGrid>
            <Button
              variant='primary'
              disabled={!person || !validFnr || searchingPerson || gettingFagsaker || !(currentFagsak?.tema && currentFagsak?._id && currentFagsak?.fnr)}
              loading={false}
              onClick={onUpdateButtonClick}
            >
              Oppdater tema/fagsak
            </Button>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      <Box borderWidth="1" borderRadius="small" borderColor="border-default" padding="4" background="surface-default">
        <VStack gap="4">
          <Heading size='small'>
            {t('label:journalfoeres-paa')}
          </Heading>
          <HorizontalLineSeparator />
        </VStack>
        <VStack gap="4">
          <Dl>
            <Dt>
              {t('label:person')}:
            </Dt>
            <Dd>
              {sak.fagsak?.fnr ? sak.fagsak?.fnr : ""}
            </Dd>
            <Dt>
              {t('label:tema')}:
            </Dt>
            <Dd>
              {sak.fagsak?.tema ? t('tema:' + sak.fagsak.tema) : ""}
            </Dd>
            <Dt>
              {t('label:fagsak')}:
            </Dt>
            <Dd>
              {sak.fagsak?.nr ? sak.fagsak?.nr : sak.fagsak?.type ? t('journalfoering:' + sak.fagsak?.type) : ""}
            </Dd>
            <Dt>
              {t('label:overstyrt-enhet')}:
            </Dt>
            <Dd>
              { otherFagsakTema?.overstyrtEnhetsnummer
                ? otherFagsakTema.overstyrtEnhetsnummer
                : '' }
            </Dd>
          </Dl>
          <Button
            variant='secondary'
            onClick={() => {
              setIsModalOpen(true)
              ref.current?.showModal()
            }}
          >
            {t('el:button-change-tema-fagsak')}
          </Button>
        </VStack>
      </Box>
    </>
  )
}

export default JournalfoeringsOpplysninger
