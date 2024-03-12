import React, {useEffect, useState} from "react";
import {
  Fagsak,
  Fagsaker,
  JournalfoeringLogg,
  Kodemaps,
  Kodeverk,
  Person,
  Sak,
  Tema
} from "../../declarations/types";
import {Row, Column, VerticalSeparatorDiv, HorizontalSeparatorDiv} from "@navikt/hoykontrast";
import {Alert, Button, Heading, Loader, Panel, Select, TextField} from "@navikt/ds-react";
import {HorizontalLineSeparator} from "../../components/StyledComponents";
import {useTranslation} from "react-i18next";
import {
  journalfoeringReset,
  searchJournalfoeringPerson,
  getJournalfoeringFagsaker,
  setJournalfoeringFagsak,
  resetJournalfoeringFagsaker,
  journalfoer,
  createJournalfoeringFagsak,
  createJournalfoeringFagsakDagpenger
} from "../../actions/journalfoering";

import {useAppDispatch, useAppSelector} from "../../store";
import {State} from "../../declarations/reducers";
import {buctypeToSektor} from "../../utils/sektorUtils";
import _ from "lodash";
import kvinne from 'assets/icons/Woman.png'
import mann from 'assets/icons/Man.png'
import ukjent from 'assets/icons/Unknown.png'
import styled from "styled-components";
import Modal from "../../components/Modal/Modal";
import {alertReset} from "../../actions/alert";
import * as types from "../../constants/actionTypes";

const ImgContainer = styled.span`
  position: relative;
  top: 5px;
`

const FullWidthButton = styled(Button)`
  display: block;
  width: 100%
`

export interface JournalfoerPanelProps {
  sak: Sak,
  gotoSak: () => void
  gotoFrontpage: () => void
}

interface JournalfoerPanelSelector {
  person: Person | null | undefined
  searchingJournalfoeringPerson: boolean
  gettingFagsaker: boolean
  creatingFagsak: boolean
  isJournalfoering: boolean
  kodemaps: Kodemaps | undefined
  tema: Tema | undefined
  fagsaker: Fagsaker | undefined | null
  fagsak: Fagsak | undefined | null
  journalfoeringLogg: JournalfoeringLogg | undefined | null
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
}

const mapState = (state: State) => ({
  person: state.journalfoering.person,
  searchingJournalfoeringPerson: state.loading.searchingJournalfoeringPerson,
  gettingFagsaker: state.loading.gettingFagsaker,
  creatingFagsak: state.loading.creatingFagsak,
  isJournalfoering: state.loading.isJournalfoering,
  kodemaps: state.app.kodemaps,
  tema: state.app.tema,
  fagsaker: state.journalfoering.fagsaker,
  fagsak: state.journalfoering.fagsak,
  journalfoeringLogg: state.journalfoering.journalfoeringLogg,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type
})

export const JournalfoerPanel = ({ sak, gotoSak, gotoFrontpage }: JournalfoerPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const currentYear = new Date().getFullYear()
  const { person, searchingJournalfoeringPerson, gettingFagsaker, creatingFagsak, isJournalfoering, kodemaps, tema, fagsaker, fagsak, journalfoeringLogg, alertMessage, alertType }: JournalfoerPanelSelector = useAppSelector(mapState)
  const [localValidation, setLocalValidation] = useState<string | undefined>(undefined)
  const [_fnr, setfnr] = useState<string | undefined>(sak.fagsak && sak.fagsak.fnr ? sak.fagsak.fnr : undefined)
  const [isFnrValid, setIsFnrValid] = useState<boolean>(false)
  const [_tema, setTema] = useState<string | undefined>(sak.fagsak && sak.fagsak.tema ? sak.fagsak.tema : undefined)
  const [_journalfoerModal, setJournalfoerModal] = useState<boolean>(false)
  const [_isLoading, setIsLoading] = useState(false)
  const [_fagsakSelected, setFagsakSelected] = useState(false)
  const [fagsakDagpengerYear, setFagsakDagpengerYear] = useState<any>(currentYear)

  const [kind, setKind] = useState<string>('nav-unknown-icon')
  const [src, setSrc] = useState<string>(ukjent)

  let sektor = sak.sakType.split('_')[0]
  sektor = buctypeToSektor[sektor]

  const temaer: Array<Kodeverk> = !kodemaps ? [] : !sektor ? [] : !tema ? [] : tema[kodemaps.SEKTOR2FAGSAK[sektor] as keyof Tema].filter((k:Kodeverk) => {
    return k.kode !== "GEN"
  })

  const showFagsaker: false | undefined | null | boolean = !_.isEmpty(tema) && (!_.isEmpty(fagsaker) || (sektor === "UB" && fagsaker && fagsaker.length >= 0))

  useEffect(() => {
    dispatch(journalfoeringReset())
  }, [])

  useEffect(() => {
    if (person) {
      setIsFnrValid(true)
      if (person.kjoenn === 'K') {
        setKind('nav-woman-icon')
        setSrc(kvinne)
      } else if (person.kjoenn === 'M') {
        setKind('nav-man-icon')
        setSrc(mann)
      }
    }
  }, [person])

  useEffect(() => {
    if(journalfoeringLogg){
      setJournalfoerModal(true)
    }
  }, [journalfoeringLogg])

  useEffect(() => {
    if(sak.fagsak && sak.fagsak.fnr && sak.fagsak.tema){
      setIsLoading(true)
      setFagsakSelected(true)
      dispatch(searchJournalfoeringPerson(sak.fagsak.fnr))
      dispatch(getJournalfoeringFagsaker(sak.fagsak.fnr, sak.fagsak.tema))
      dispatch(setJournalfoeringFagsak(sak.fagsak))
    }
  }, [])

  useEffect(() => {
    if(fagsak){
      setFagsakSelected(true)
    }
  }, [fagsak])

  useEffect(() => {
    if(fagsaker && fagsaker.length === 1){
      dispatch(setJournalfoeringFagsak(fagsaker[0]))
    }
  }, [fagsaker])

  useEffect(() => {
    if(!gettingFagsaker && !searchingJournalfoeringPerson && _isLoading){
      setIsLoading(false)
    }
  }, [gettingFagsaker, searchingJournalfoeringPerson])

  const onSearch = () => {
    dispatch(alertReset())
    if (!_fnr) {
      setLocalValidation(t('validation:noFnr'))
      return
    }
    const fnrPattern = /^[0-9]{11}$/
    if (_fnr && !fnrPattern.test('' + _fnr)) {
      setLocalValidation(t('validation:invalidFnr'))
      return
    }
    setLocalValidation(undefined)
    dispatch(searchJournalfoeringPerson(_fnr))
  }

  const onFnrChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(alertReset())
    const fnr = e.target.value
    setLocalValidation(undefined)
    const newFnr = fnr.trim()
    setfnr(newFnr)
    if (isFnrValid) {
      setIsFnrValid(false)
      setTema("")
      setFagsakDagpengerYear(currentYear);

      (document.getElementById("mySelect") as HTMLSelectElement)!.selectedIndex = 0
      dispatch(journalfoeringReset()) // reset all
    }
  }

  const onTemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(resetJournalfoeringFagsaker())
    setTema(e.target.value)
  }

  const onGetFagsaker = () => {
    setFagsakSelected(false)
    setFagsakDagpengerYear(currentYear);
    dispatch(getJournalfoeringFagsaker(_fnr!, _tema!))
  }

  const onCreateFagsak = () => {
    dispatch(createJournalfoeringFagsak(_fnr!, _tema!))
  }

  const onCreateFagsakDagpenger = () => {
    dispatch(createJournalfoeringFagsakDagpenger(_fnr!, {aar: fagsakDagpengerYear}))
  }

  const onFagsakChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fagsakId = e.target.value
    const fagsak: Fagsak | undefined = _.find(fagsaker, (fagsak) => {return fagsak.id === fagsakId})
    dispatch(setJournalfoeringFagsak(fagsak))
  }

  const onJournalfoerClick = () => {
    dispatch(journalfoer(sak.sakId, fagsak!))
  }

  const onJournalfoerModalClose = () => {
    dispatch(journalfoeringReset())
    setJournalfoerModal(false)
  }

  const hasIkkeJournalfoert = journalfoeringLogg && journalfoeringLogg.ikkeJournalfoert && journalfoeringLogg.ikkeJournalfoert.length > 0
  const hasVarJournalfoertFeil = journalfoeringLogg && journalfoeringLogg.varJournalfoertFeil && journalfoeringLogg.varJournalfoertFeil.length > 0
  const hasJournalfoert =  journalfoeringLogg && journalfoeringLogg.journalfoert && journalfoeringLogg.journalfoert.length > 0
  const alleSedJournalfoert = hasJournalfoert && !hasVarJournalfoertFeil && !hasIkkeJournalfoert
  const allListsEmpty = !hasIkkeJournalfoert && ! hasVarJournalfoertFeil && !hasJournalfoert
  const tilknyttedeOppgaver = journalfoeringLogg && journalfoeringLogg.tilknyttedeOppgaver
  const oppgaverFerdigstilt = tilknyttedeOppgaver && tilknyttedeOppgaver.filter((to) => to.status === "OPPGAVE_FERDIGSTILT")
  const ferdigstillingFeilet = tilknyttedeOppgaver && tilknyttedeOppgaver.filter((to) => to.status === "FERDIGSTILLING_FEILET")
  const modalTitle =  alleSedJournalfoert ? t('label:sed-er-journalfoert') : t('label:journalposter-ble-ikke-journalfoert')

  const getListOfJournalPostIds = (journalPostList: Array<string>) => {
    let items: JSX.Element[] = [];
    journalPostList.forEach((id: string, index: number) => {
      items.push(<li key={id + "_" + index}>{id}</li>)
    })
    return items
  }

  if(_isLoading){
    return(
      <Panel border>
        <Heading size='small'>
          {t('label:journalfoer')}
        </Heading>
        <VerticalSeparatorDiv />
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
        <Loader/>
      </Panel>
    )
  }


  return (
    <>
      <Modal
        open={_journalfoerModal}
        onModalClose={onJournalfoerModalClose}
        appElementId="root"
        modal={{
          closeButton: false,
          modalTitle: modalTitle,
          modalContent: (
            <>
              {!alleSedJournalfoert &&
                <>
                  { !allListsEmpty ? t('label:journalposter-ble-ikke-journalfoert-og-maa-behandles-manuelt') : ""}
                  <ul>
                    {journalfoeringLogg && journalfoeringLogg.ikkeJournalfoert && getListOfJournalPostIds(journalfoeringLogg?.ikkeJournalfoert)}
                    {journalfoeringLogg && journalfoeringLogg.varJournalfoertFeil && getListOfJournalPostIds(journalfoeringLogg?.varJournalfoertFeil)}
                  </ul>
                </>
              }
              {oppgaverFerdigstilt && oppgaverFerdigstilt.length > 0 &&
                <>
                  <Heading size="small">{t('label:tilhorende-oppgaver-ferdigstilt', {NO_OF_OPPGAVE: oppgaverFerdigstilt.length})}</Heading>
                  <VerticalSeparatorDiv size='1' />
                </>
              }
              {ferdigstillingFeilet && ferdigstillingFeilet.length > 0 &&
                <>
                  <Heading size="small">{t('label:ferdigstilling-av-tilhorende-oppgave-feilet', {NO_OF_OPPGAVE: ferdigstillingFeilet.length})}</Heading>
                  {t('label:oppgavene-maa-lukkes-i-gosys')}
                </>
              }
            </>
          ),
          modalButtons: [
            {
              text: t('el:button-gaa-tilbake-til-saken'),
              onClick: gotoSak
            },
            {
              text: t('el:button-gaa-til-forsiden'),
              onClick: gotoFrontpage
            }]
        }}
      />
      <Panel border>
        <Heading size='small'>
          {t('label:journalfoer')}
        </Heading>
        <VerticalSeparatorDiv />
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv />
        <Row>
          <Column flex={1}>
            <TextField label={t("label:fnr-dnr")} onChange={onFnrChange} error={localValidation} defaultValue={sak.fagsak &&  sak.fagsak.fnr ? sak.fagsak.fnr : ""}/>
          </Column>
          <Column flex={1}>
            <FullWidthButton variant="secondary" onClick={onSearch} loading={searchingJournalfoeringPerson} className='nolabel'>
              {t("el:button-search-i-x", {x: "PDL"})}
            </FullWidthButton>
          </Column>
          <Column flex={1}>
            {person &&
              <div className='nolabel'>
                <ImgContainer><img alt={kind} width={25} height={25} src={src}/></ImgContainer>
                <HorizontalSeparatorDiv />
                {person.etternavn}, {person.fornavn}
              </div>
            }
            {alertMessage && alertType && [types.JOURNALFOERING_PERSON_SEARCH_FAILURE].indexOf(alertType) >= 0 &&
              <div className='nolabel'><Alert variant={"error"}>{alertMessage}</Alert></div>
            }
          </Column>
        </Row>
        <VerticalSeparatorDiv />
        <Row>
          <Column flex={1}>
            <Select label={t('label:velg-tema')} onChange={onTemaChange} disabled={_.isEmpty(person)} id="mySelect">
              <option value=''>
                {t('label:velg')}
              </option>)
              {temaer && temaer.map((k: Kodeverk) => (
                <option value={k.kode} key={k.kode} selected={k.kode === _tema}>
                  {k.term}
                </option>
              ))}
            </Select>
          </Column>
          <Column flex={1}>
            <FullWidthButton variant="secondary" onClick={onGetFagsaker} loading={gettingFagsaker} className='nolabel' disabled={_.isEmpty(person) || !_tema}>
              {t("el:button-finn-x", {x: "fagsaker"})}
            </FullWidthButton>
          </Column>
          <Column flex={1}>
            {showFagsaker &&
              <Select
                label={t('label:velg-fagsak')}
                onChange={onFagsakChange}
              >
                <option value=''>
                  {t('label:velg')}
                </option>
                {fagsaker &&
                  fagsaker.map((f: Fagsak) => (
                    <option value={f.id} key={f.id} selected={f.id === fagsak?.id && _fagsakSelected}>
                      {f.nr || f.id}
                    </option>
                  ))}
              </Select>
            }
            {sektor !== "UB" && fagsaker && fagsaker.length === 0 &&
              <Button variant="secondary" onClick={onCreateFagsak} loading={creatingFagsak} className='nolabel'>
                {t("el:button-create-x", {x: "fagsak"})}
              </Button>
            }

            {sektor === "UB" && fagsaker && fagsaker.length >= 0 &&
              <>
                <VerticalSeparatorDiv/>
                <FullWidthButton variant="secondary" onClick={onCreateFagsakDagpenger} loading={creatingFagsak}>
                  {t("el:button-create-x", {x: "fagsak"})}
                </FullWidthButton>
                <VerticalSeparatorDiv size={0.2}/>
                <Select label="År" hideLabel={true} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFagsakDagpengerYear(e.currentTarget.value)}>
                  <option value={currentYear}>{currentYear}</option>
                  <option value={currentYear - 1}>{currentYear - 1}</option>
                  <option value={currentYear - 2}>{currentYear - 2}</option>
                  <option value={currentYear - 3}>{currentYear - 3}</option>
                  <option value={currentYear - 4}>{currentYear - 4}</option>
                </Select>
              </>
            }
            </Column>
        </Row>
        <Row>
          <Column>
            <Button variant="primary" onClick={onJournalfoerClick} loading={isJournalfoering} className='nolabel' disabled={!(!journalfoeringLogg && fagsak)}>
              {t("el:button-journalfoer")}
            </Button>
          </Column>
        </Row>
      </Panel>
    </>
  )
}

export default JournalfoerPanel
