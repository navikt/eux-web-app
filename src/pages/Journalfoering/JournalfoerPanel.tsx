import React, {useEffect, useState} from "react";
import {
  JournalfoeringFagSak,
  JournalfoeringFagSaker, JournalfoeringLogg,
  Kodemaps,
  Kodeverk,
  Person,
  Sak,
  Tema
} from "../../declarations/types";
import {Row, Column, VerticalSeparatorDiv, HorizontalSeparatorDiv} from "@navikt/hoykontrast";
import {Button, Heading, Panel, Select, TextField} from "@navikt/ds-react";
import {HorizontalLineSeparator} from "../../components/StyledComponents";
import {useTranslation} from "react-i18next";
import {
  journalfoeringReset,
  searchJournalfoeringPerson,
  getJournalfoeringFagsaker,
  setJournalfoeringFagsak,
  resetJournalfoeringFagsaker, journalfoer
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


const ImgContainer = styled.span`
  position: relative;
  top: 5px;
`

export interface JournalfoerPanelProps {
  sak: Sak,
  gotoSak: () => void
  gotoFrontpage: () => void
}

interface JournalfoerPanelSelector {
  person: Person | null | undefined
  searchingPerson: boolean
  gettingFagsaker: boolean
  isJournalfoering: boolean
  kodemaps: Kodemaps | undefined
  tema: Tema | undefined
  fagsaker: JournalfoeringFagSaker | undefined | null
  fagsak: JournalfoeringFagSak | undefined | null
  journalfoeringLogg: JournalfoeringLogg | undefined | null
}

const mapState = (state: State) => ({
  person: state.journalfoering.person,
  searchingPerson: state.loading.searchingPerson,
  gettingFagsaker: state.loading.gettingFagsaker,
  isJournalfoering: state.loading.isJournalfoering,
  kodemaps: state.app.kodemaps,
  tema: state.app.tema,
  fagsaker: state.journalfoering.fagsaker,
  fagsak: state.journalfoering.fagsak,
  journalfoeringLogg: state.journalfoering.journalfoeringLogg
})

export const JournalfoerPanel = ({ sak, gotoSak, gotoFrontpage }: JournalfoerPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { person, searchingPerson, gettingFagsaker, isJournalfoering, kodemaps, tema, fagsaker, fagsak, journalfoeringLogg }: JournalfoerPanelSelector = useAppSelector(mapState)
  const [localValidation, setLocalValidation] = useState<string | undefined>(undefined)
  const [_fnr, setfnr] = useState<string>()
  const [isFnrValid, setIsFnrValid] = useState<boolean>(false)
  const [_tema, setTema] = useState<string>()
  const [_journalfoerModal, setJournalfoerModal] = useState<boolean>(false)

  const [kind, setKind] = useState<string>('nav-unknown-icon')
  const [src, setSrc] = useState<string>(ukjent)

  let sektor = sak.sakType.split('_')[0]
  sektor = buctypeToSektor[sektor]

  const temaer: Array<Kodeverk> = !kodemaps ? [] : !sektor ? [] : !tema ? [] : tema[kodemaps.SEKTOR2FAGSAK[sektor] as keyof Tema].filter((k:Kodeverk) => {
    return k.kode !== "GEN"
  })

  const showFagsaker: boolean = !_.isEmpty(tema) && !_.isEmpty(fagsaker)

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

  const onSearch = () => {
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
    const fnr = e.target.value
    setLocalValidation(undefined)
    const newFnr = fnr.trim()
    setfnr(newFnr)
    if (isFnrValid) {
      setIsFnrValid(false)
      setTema("");
      (document.getElementById("mySelect") as HTMLSelectElement)!.selectedIndex = 0
      dispatch(journalfoeringReset()) // reset all
    }
  }

  const onTemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(resetJournalfoeringFagsaker())
    setTema(e.target.value)
  }

  const onGetFagsaker = () => {
    dispatch(getJournalfoeringFagsaker(_fnr!, _tema!))
  }

  const onFagsakChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fagsakId = e.target.value
    const fagsak: JournalfoeringFagSak | undefined = _.find(fagsaker, (fagsak) => {return fagsak.id === fagsakId})
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
  const modalTitle =  alleSedJournalfoert ? t('label:sed-er-journalfoert') : t('label:journalposter-ble-ikke-journalfoert')

  const getListOfJournalPostIds = (journalPostList: Array<string>) => {
    let items: JSX.Element[] = [];
    journalPostList.forEach((id: string, index: number) => {
      items.push(<li key={id + "_" + index}>{id}</li>)
    })
    return items
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
            <TextField label={t("label:fnr-dnr")} onChange={onFnrChange} error={localValidation}/>
          </Column>
          <Column flex={0.5}>
            <Button variant="secondary" onClick={onSearch} loading={searchingPerson} className='nolabel'>
              {t("el:button-search-i-x", {x: "PDL"})}
            </Button>
          </Column>
          <Column flex={1}>
            {person &&
              <div className='nolabel'>
                <ImgContainer><img alt={kind} width={25} height={25} src={src}/></ImgContainer>
                <HorizontalSeparatorDiv />
                {person.etternavn}, {person.fornavn}
              </div>
            }
          </Column>
          <Column/>
        </Row>
        <VerticalSeparatorDiv />
        <Row>
          <Column flex={1}>
            <Select label={t('label:velg-tema')} onChange={onTemaChange} disabled={_.isEmpty(person)} id="mySelect">
              <option value=''>
                {t('label:velg')}
              </option>)
              {temaer && temaer.map((k: Kodeverk) => (
                <option value={k.kode} key={k.kode}>
                  {k.term}
                </option>
              ))}
            </Select>
          </Column>
          <Column flex={0.5}>
            <Button variant="secondary" onClick={onGetFagsaker} loading={gettingFagsaker} className='nolabel' disabled={_.isEmpty(person) || !_tema}>
              {t("el:button-finn-x", {x: "fagsaker"})}
            </Button>
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
                  _.orderBy(fagsaker, 'nr').map((f: JournalfoeringFagSak) => (
                    <option value={f.id} key={f.id}>
                      {f.nr || f.id}
                    </option>
                  ))}
              </Select>
            }
          </Column>
          <Column/>
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