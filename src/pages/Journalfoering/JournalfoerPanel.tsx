import React, {useEffect, useState} from "react";
import {
  JournalfoeringFagSak,
  JournalfoeringFagSaker,
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
  resetJournalfoeringFagsaker
} from "../../actions/journalfoering";

import {useAppDispatch, useAppSelector} from "../../store";
import {State} from "../../declarations/reducers";
import {buctypeToSektor} from "../../utils/sektorUtils";
import _ from "lodash";
import kvinne from 'assets/icons/Woman.png'
import mann from 'assets/icons/Man.png'
import ukjent from 'assets/icons/Unknown.png'
import styled from "styled-components";


const ImgContainer = styled.span`
  position: relative;
  top: 5px;
`

export interface JournalfoerPanelProps {
  sak: Sak
}

interface JournalfoerPanelSelector {
  person: Person | null | undefined
  searchingPerson: boolean
  gettingFagsaker: boolean
  kodemaps: Kodemaps | undefined
  tema: Tema | undefined
  fagsaker: JournalfoeringFagSaker | undefined | null
  fagsak: JournalfoeringFagSak | undefined | null
}

const mapState = (state: State) => ({
  person: state.journalfoering.person,
  searchingPerson: state.loading.searchingPerson,
  gettingFagsaker: state.loading.gettingFagsaker,
  kodemaps: state.app.kodemaps,
  tema: state.app.tema,
  fagsaker: state.journalfoering.fagsaker,
  fagsak: state.journalfoering.fagsak
})

export const JournalfoerPanel = ({ sak }: JournalfoerPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { person, searchingPerson, gettingFagsaker, kodemaps, tema, fagsaker, fagsak }: JournalfoerPanelSelector = useAppSelector(mapState)
  const [localValidation, setLocalValidation] = useState<string | undefined>(undefined)
  const [_fnr, setfnr] = useState<string>()
  const [isFnrValid, setIsFnrValid] = useState<boolean>(false)
  const [_tema, setTema] = useState<string>()

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

  return (
    <Panel border>
      <Heading size='small'>
        {t('label:journalfoer') + " " + sak.sakId}
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
          <Button variant="primary" onClick={()=>{}} loading={false} className='nolabel' disabled={fagsak ? false : true}>
            {t("el:button-journalfoer")}
          </Button>
        </Column>
      </Row>
    </Panel>
  )
}

export default JournalfoerPanel
