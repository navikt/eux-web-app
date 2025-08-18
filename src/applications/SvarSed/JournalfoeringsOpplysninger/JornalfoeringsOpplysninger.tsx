import React, {useEffect, useState} from 'react'
import {Box, Button, Heading, HStack, Loader, Modal, Select, Spacer, TextField, VStack} from '@navikt/ds-react'
import { Dd, Dl, Dt, HorizontalLineSeparator } from 'components/StyledComponents'
import {Fagsak, Fagsaker, Kodemaps, Kodeverk, PersonInfoPDL, Sak, Tema} from 'declarations/types'
import { useTranslation } from 'react-i18next'
import {useAppDispatch, useAppSelector} from "../../../store";
import {State} from "../../../declarations/reducers";
import { useRef } from "react";
import {getFagsaker} from "../../../actions/sak";
import * as types from "../../../constants/actionTypes";
import PersonSearch from "../../OpprettSak/PersonSearch/PersonSearch";
import {searchPerson} from "../../../actions/person";
import PersonPanel from "../../OpprettSak/PersonPanel/PersonPanel";


interface JournalfoeringsOpplysningerProps {
  sak: Sak
}

interface ChangeTemaFagsakModalSelector {
  kodemaps: Kodemaps | undefined
  tema: Tema | undefined
  gettingFagsaker: boolean
  fagsaker: Fagsaker | undefined | null

  person: PersonInfoPDL | null | undefined
  searchingPerson: boolean
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
}

const mapState = (state: State): ChangeTemaFagsakModalSelector => ({
  kodemaps: state.app.kodemaps,
  tema: state.app.tema,
  gettingFagsaker: state.loading.gettingFagsaker,
  fagsaker: state.sak.fagsaker,

  person: state.person.person,
  searchingPerson: state.loading.searchingPerson,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type
})

const JournalfoeringsOpplysninger = ({ sak }: JournalfoeringsOpplysningerProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const ref = useRef<HTMLDialogElement>(null);
  const { kodemaps, tema, fagsaker, gettingFagsaker, alertMessage, alertType, searchingPerson, person }: ChangeTemaFagsakModalSelector = useAppSelector(mapState)

  const [currentFagsak, setCurrentFagsak] = useState<any>(sak.fagsak)
  const [validFnr, setValidFnr] = useState<boolean>(false)

  const namespace = 'changetemafagsak'
  let sektor = sak.sakType.split("_")[0]
  if (sektor === 'H') { sektor = 'HZ' }

  const currentYear = new Date().getFullYear()
  const [fagsakDagpengerYear, setFagsakDagpengerYear] = useState<any>(currentYear)

  const temaer: Array<Kodeverk> = !kodemaps ? [] : !sektor ? [] : !tema ? [] : tema[kodemaps.SEKTOR2FAGSAK[sektor] as keyof Tema]?.filter((k:Kodeverk) => {
    return k.kode !== "GEN"
  })

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
      id: "",
      nr: ""
    }
    setCurrentFagsak(fagsak)

    if (value && currentFagsak?.fnr) {
      dispatch(getFagsaker(currentFagsak?.fnr, sektor, value))
    }
  }

  const onFagsakChange = (value: string) => {
    const fSak: Fagsak | undefined = fagsaker?.find((f) => f.id === value)
    const fagsak = {
      ...currentFagsak,
      id: fSak ? fSak.id : "",
      nr: fSak ? fSak.nr : ""
    }
    setCurrentFagsak(fagsak)
  }

  useEffect(() => {
    dispatch(getFagsaker(currentFagsak?.fnr, sektor, currentFagsak?.tema))
    dispatch(searchPerson(currentFagsak?.fnr))
  }, [])

  const onModalClose = () => {
    setCurrentFagsak(sak.fagsak)
    dispatch(getFagsaker(sak.fagsak?.fnr!, sektor, sak.fagsak?.tema!))
    dispatch(searchPerson(sak.fagsak?.fnr!))
  }

  const onUpdateButtonClick = () => {
    console.log(currentFagsak)
  }

  return (
    <>
      <Modal ref={ref} header={{ heading: t('label:endre-tema-fagsak') }} width="medium" onClose={onModalClose}>
        <Modal.Body>
          <VStack gap="4" padding="4">
            <PersonSearch
              key={namespace + '-fnr'}
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
              }}
              onSearchPerformed={(fnr: string) => {
                dispatch(searchPerson(fnr))
              }}
              person={person}
            />
            {person &&
              <PersonPanel className='neutral' person={person}/>
            }
            <HStack gap="4" align="center">
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
              {!gettingFagsaker &&
                <Select
                  id={namespace + '-nr'}
                  label={t('label:velg-fagsak')}
                  onChange={(e)=> onFagsakChange(e.target.value)}
                  value={currentFagsak?.id ?? ''}
                >
                  <option value=''>
                    {t('label:velg')}
                  </option>
                  {fagsaker &&
                    fagsaker.map((f: Fagsak) => (
                      <option value={f.id} key={f.id}>
                        {f.nr || f.id}
                      </option>
                    ))
                  }
                </Select>
              }
            </HStack>
            <Button
              variant='primary'
              disabled={!person || !validFnr || searchingPerson || gettingFagsaker || !(currentFagsak.tema && currentFagsak.id && currentFagsak.fnr)}
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

      <Box borderWidth="1" borderRadius="small" padding="4" background="surface-default">
        <VStack gap="4">
          <Heading size='small'>
            {t('label:journalfoering')}
          </Heading>
          <HorizontalLineSeparator />
        </VStack>
        <VStack gap="4">
          <Dl>
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
              {sak.fagsak?.nr ? sak.fagsak?.nr : sak.fagsak?.id}
            </Dd>
            <Dt>
              {t('label:journalfoert-paa')}:
            </Dt>
            <Dd>
              {sak.fagsak?.fnr ? sak.fagsak?.fnr : ""}
            </Dd>
          </Dl>
          <Button
            variant='secondary'
            onClick={() => ref.current?.showModal()}
          >
            {t('el:button-change-tema-fagsak')}
          </Button>
        </VStack>
      </Box>
    </>
  )
}

export default JournalfoeringsOpplysninger
