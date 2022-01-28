import { BodyLong, Button, Heading, Label, Loader } from '@navikt/ds-react'
import validator from '@navikt/fnrvalidator'
import * as appActions from 'actions/app'
import { fetchPdu1, getFagsaker, getPdu1, resetFagsaker, resetPdu1results } from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { resetAllValidation } from 'actions/validation'
import classNames from 'classnames'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Option, Options } from 'declarations/app'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { FagSak, FagSaker } from 'declarations/types'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import {
  AlignStartRow,
  Column,
  FlexBaseDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  RadioPanelBorder,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { validatePdu1Search, ValidationPdu1SearchProps } from './mainValidation'

const ContainerDiv = styled(PileCenterDiv)`
  width: 780px;
  align-items: center;
`

export interface PDU1SearchSelector {
  fnrParam: string | undefined
  fagsaker: FagSaker | null | undefined
  gettingFagsaker: boolean
  creatingPdu1: boolean
  fetchingPdu1: boolean
  PDU1: PDU1 | null | undefined
  pdu1results: FagSaker | null | undefined
}

const mapState = (state: State): PDU1SearchSelector => ({
  fnrParam: state.app.params.fnr,
  fagsaker: state.pdu1.fagsaker,
  gettingFagsaker: state.loading.gettingFagsaker,
  creatingPdu1: state.loading.creatingPdu1,
  fetchingPdu1: state.loading.fetchingPdu1,
  PDU1: state.pdu1.pdu1,
  pdu1results: state.pdu1.pdu1results
})

export interface PDU1Props {
  changeMode: ChangeModeFunction
}

const PDU1Search: React.FC<PDU1Props> = ({
  changeMode
}: PDU1Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    fnrParam,
    fagsaker,
    gettingFagsaker,
    creatingPdu1,
    fetchingPdu1,
    PDU1,
    pdu1results
  }: PDU1SearchSelector = useSelector<State, PDU1SearchSelector>(mapState)
  const [fnrOrDnr, setFnrOrDnr] = useState<string>(fnrParam ?? '')
  const [fagsak, setFagsak] = useState<string | undefined>(undefined)
  const [tema, setTema] = useState<string | undefined>(undefined)
  const [pdu1Request, setPdu1Request] = useState<boolean>(false)
  const [validFnr, setValidFnr] = useState<boolean>(false)
  const [validMessage, setValidMessage] = useState<string>('')
  const [startingPdu1, setStartingPdu1] = useState<boolean>(false)
  const [searchingPdu1, setSearchingPdu1] = useState<boolean>(false)
  const [validation, resetValidation, performValidation] = useValidation<ValidationPdu1SearchProps>({}, validatePdu1Search)
  const namespace = 'pdu1search'

  const temaOptions: Options = [
    { label: t('tema:GEN'), value: 'GEN' },
    { label: t('tema:AAP'), value: 'AAP' },
    { label: t('tema:BAR'), value: 'BAR' },
    { label: t('tema:DAG'), value: 'DAG' },
    { label: t('tema:FEI'), value: 'FEI' },
    { label: t('tema:FOR'), value: 'FOR' },
    { label: t('tema:GRA'), value: 'GRA' },
    { label: t('tema:KON'), value: 'KON' },
    { label: t('tema:MED'), value: 'MED' },
    { label: t('tema:OMS'), value: 'OMS' },
    { label: t('tema:PEN'), value: 'PEN' },
    { label: t('tema:SYK'), value: 'SYK' },
    { label: t('tema:YRK'), value: 'YRK' },
    { label: t('tema:UFO'), value: 'UFO' },
    { label: t('tema:GRU'), value: 'GRU' },
    { label: t('tema:KTR'), value: 'KTR' },
    { label: t('tema:TRY'), value: 'TRY' },
    { label: t('tema:SUP'), value: 'SUP' },
    { label: t('tema:UFM'), value: 'UFM' }
  ]

  const onFnrDnrChange = (query: string) => {
    dispatch(appActions.cleanData())
    resetValidation(namespace + '-search')
    setFnrOrDnr(query)
    const result = validator.idnr(query)
    if (result.status !== 'valid') {
      setValidFnr(false)
      setValidMessage(t('label:ukjent'))
    } else {
      setValidFnr(true)
      if (result.type === 'fnr') {
        setValidMessage(t('label:valid-fnr'))
      }
      if (result.type === 'dnr') {
        setValidMessage(t('label:valid-dnr'))
      }
    }
  }

  const onTemaChanged = (o: unknown) => {
    if (validation[namespace + '-tema']) {
      dispatch(resetValidation(namespace + '-tema'))
    }
    setTema((o as Option).value)
    dispatch(getFagsaker(fnrOrDnr, 'PD', (o as Option).value))
  }

  const onFagsakerSelected = (f: string) => {
    if (validation[namespace + '-fagsaker']) {
      dispatch(resetValidation(namespace + '-fagsaker'))
    }
    setFagsak(f)
  }

  const onStartPdu1Clicked = () => {
    dispatch(resetPdu1results())
    setSearchingPdu1(false)
    setStartingPdu1(true)
  }

  const onGetPdu1Clicked = () => {
    const valid = performValidation({
      fnrOrDnr: fnrOrDnr,
      fagsak: fagsak,
      namespace: namespace
    })

    if (valid) {
      setPdu1Request(true)
      dispatch(getPdu1(fnrOrDnr, fagsak))
    }
  }

  const onEditingPdu1Clicked = () => {
    const valid = performValidation({
      fnrOrDnr: fnrOrDnr,
      fagsak: fagsak,
      namespace: namespace
    })

    if (valid) {
      setPdu1Request(true)
      dispatch(getPdu1(fnrOrDnr, fagsak))
    }
  }

  const onSearchPdu1Clicked = () => {
    setStartingPdu1(false)
    setSearchingPdu1(true)

    dispatch(resetFagsaker())
    setTema(undefined)
    dispatch(fetchPdu1(fnrOrDnr))
  }

  useEffect(() => {
    if (PDU1 && pdu1Request) {
      setPdu1Request(false)
      dispatch(resetAllValidation())
      changeMode('B', 'forward')
    }
  }, [PDU1])

  useEffect(() => {
    dispatch(startPageStatistic('pdu1-search'))
    return () => {
      dispatch(finishPageStatistic('pdu1-search'))
    }
  }, [])

  return (
    <ContainerDiv>
      <Heading size='medium'>
        {t('app:page-title-pdu1-search')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow
        style={{ width: '100%' }}
        className={classNames('slideInFromLeft', { error: validation[namespace + '-search'] })}
      >
        <Column>
          <PileDiv>
            <Input
              label={t('label:fnr-dnr')}
              error={validation[namespace + '-search']?.feilmelding}
              id='search'
              namespace={namespace}
              onContentChange={onFnrDnrChange}
              required
              value={fnrOrDnr}
            />
            <VerticalSeparatorDiv size='0.5' />
            <BodyLong>
              {validMessage}
            </BodyLong>
          </PileDiv>
        </Column>
        <Column>
          <FlexBaseDiv style={{ marginTop: '2rem' }}>
            <Button
              variant='primary'
              disabled={!validFnr || searchingPdu1}
              onClick={onSearchPdu1Clicked}
            >
              {fetchingPdu1 && <Loader />}
              {fetchingPdu1 ? t('label:searching') : t('el:button-search-for-x', { x: 'PD U1' })}
            </Button>
            <HorizontalSeparatorDiv />
            {t('label:eller')}
            <HorizontalSeparatorDiv />
            <Button
              variant='primary'
              disabled={!validFnr}
              onClick={onStartPdu1Clicked}
            >
              {t('el:button-start-new-x', { x: 'PD U1' })}
            </Button>
          </FlexBaseDiv>
        </Column>
      </AlignStartRow>
      {startingPdu1 && (
        <>
          <VerticalSeparatorDiv />
          <HorizontalLineSeparator />
          <VerticalSeparatorDiv size='2' />
          <Heading size='small'>
            {t('el:button-start-new-x', { x: 'PD U1' })}
          </Heading>
          <VerticalSeparatorDiv size='2' />
          <AlignStartRow>
            <Column>
              <Select
                label={t('label:tema')}
                defaultValue={_.find(temaOptions, { value: tema })}
                error={validation[namespace + '-tema']?.feilmelding}
                key={namespace + '-tema-' + tema}
                id={namespace + '-tema'}
                menuPortalTarget={document.body}
                onChange={onTemaChanged}
                options={temaOptions}
                value={_.find(temaOptions, { value: tema })}
                style={{ minWidth: '300px' }}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv size='2' />
          <div style={{ width: '100%' }}>
            {gettingFagsaker && (
              <WaitingPanel />
            )}
            <RadioPanelGroup
              value={fagsak}
              name={namespace + '-fagsaker'}
              onChange={(e: string) => onFagsakerSelected(e)}
            >
              {fagsaker?.map((f: FagSak) => (
                <div key={f.saksID}>
                  <RadioPanelBorder key={f.saksID} value={f.saksID}>
                    <PileDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:fagsakNr')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.fagsakNr}</BodyLong>
                      </FlexBaseDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:tema')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.temakode}</BodyLong>
                      </FlexBaseDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:saksnummer')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.saksID}</BodyLong>
                      </FlexBaseDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:siste-oppdatert')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.opprettetTidspunkt}</BodyLong>
                      </FlexBaseDiv>
                    </PileDiv>
                  </RadioPanelBorder>
                  <VerticalSeparatorDiv />
                </div>
              ))}
            </RadioPanelGroup>
          </div>
          <VerticalSeparatorDiv size='2' />
          <Button
            variant='primary'
            disabled={!tema || !fagsak || creatingPdu1}
            onClick={onGetPdu1Clicked}
          >
            {creatingPdu1 && <Loader />}
            {creatingPdu1 ? t('label:laster') : t('el:button-create-x', { x: 'PD U1' })}
          </Button>
        </>
      )}
      {searchingPdu1 && (
        <>
          <VerticalSeparatorDiv />
          <HorizontalLineSeparator />
          <VerticalSeparatorDiv size='2' />
          <Heading size='small'>
            {t('el:button-edit-x', { x: 'PD U1' })}
          </Heading>
          <VerticalSeparatorDiv size='2' />
          {fetchingPdu1 && <Loader />}
          <div style={{ width: '100%' }}>
            <RadioPanelGroup
              value={fagsak}
              name={namespace + '-fagsaker'}
              onChange={(e: string) => onFagsakerSelected(e)}
            >
              {pdu1results?.map((f: FagSak) => (
                <div key={f.saksID}>
                  <RadioPanelBorder key={f.saksID} value={f.saksID}>
                    <PileDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:fagsakNr')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.fagsakNr}</BodyLong>
                      </FlexBaseDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:tema')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.temakode}</BodyLong>
                      </FlexBaseDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:saksnummer')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.saksID}</BodyLong>
                      </FlexBaseDiv>
                      <FlexBaseDiv>
                        <Label>{t('label:siste-oppdatert')}:</Label>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>{f.opprettetTidspunkt}</BodyLong>
                      </FlexBaseDiv>
                    </PileDiv>
                  </RadioPanelBorder>
                  <VerticalSeparatorDiv />
                </div>
              ))}
            </RadioPanelGroup>
          </div>
          <VerticalSeparatorDiv size='2' />
          <Button
            variant='primary'
            disabled={!fagsak || creatingPdu1}
            onClick={onEditingPdu1Clicked}
          >
            {creatingPdu1 && <Loader />}
            {creatingPdu1 ? t('label:laster') : t('el:button-edit-x', { x: 'PD U1' })}
          </Button>
        </>
      )}
    </ContainerDiv>
  )
}

export default PDU1Search
