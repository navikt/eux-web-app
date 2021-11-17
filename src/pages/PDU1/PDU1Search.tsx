import validator from '@navikt/fnrvalidator'
import * as appActions from 'actions/app'
import { createPdu1, getFagsaker } from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { resetAllValidation } from 'actions/validation'
import classNames from 'classnames'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Option, Options } from 'declarations/app'
import { ReplyPdu1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { FagSak, FagSaker } from 'declarations/types'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column, FlexStartDiv,
  HighContrastHovedknapp,
  HorizontalSeparatorDiv,
  PileCenterDiv, PileDiv,
  RadioElementBorder,
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
  highContrast: boolean
  fagsaker: FagSaker | null | undefined
  gettingFagsaker: boolean
  creatingPdu1: boolean
  replyPdu1: ReplyPdu1 | null | undefined
}

const mapState = (state: State): PDU1SearchSelector => ({
  fnrParam: state.app.params.fnr,
  highContrast: state.ui.highContrast,
  fagsaker: state.pdu1.fagsaker,
  gettingFagsaker: state.loading.gettingFagsaker,
  creatingPdu1: state.loading.creatingPdu1,
  replyPdu1: state.pdu1.replyPdu1
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
    highContrast,
    fagsaker,
    gettingFagsaker,
    creatingPdu1,
    replyPdu1
  }: PDU1SearchSelector = useSelector<State, PDU1SearchSelector>(mapState)
  const [fnrOrDnr, setFnrOrDnr] = useState<string>(fnrParam ?? '')
  const [fagsak, setFagsak] = useState<string | undefined>(undefined)
  const [tema, setTema] = useState<string | undefined>(undefined)
  const [pdu1Request, setPdu1Request] = useState<boolean>(false)
  const [validFnr, setValidFnr] = useState<boolean>(false)
  const [validMessage, setValidMessage] = useState<string>('')
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
      setValidMessage(t('label:unknown'))
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

  const onTemaChanged = (o: Option) => {
    if (validation[namespace + '-tema']) {
      dispatch(resetValidation(namespace + '-tema'))
    }
    setTema(o.value)
    dispatch(getFagsaker(fnrOrDnr, 'PD', o.value))
  }

  const onFagsakerSelected = (f: string) => {
    if (validation[namespace + '-fagsaker']) {
      dispatch(resetValidation(namespace + '-fagsaker'))
    }
    setFagsak(f)
  }

  const onCreatePdu1Clicked = () => {
    const valid = performValidation({
      fnrOrDnr: fnrOrDnr,
      fagsak: fagsak,
      namespace: namespace
    })

    if (valid) {
      setPdu1Request(true)
      dispatch(createPdu1(fnrOrDnr, fagsak))
    }
  }

  useEffect(() => {
    if (replyPdu1 && pdu1Request) {
      setPdu1Request(false)
      dispatch(resetAllValidation())
      changeMode('B', 'forward')
    }
  }, [replyPdu1])

  useEffect(() => {
    dispatch(startPageStatistic('pdu1-search'))
    return () => {
      dispatch(finishPageStatistic('pdu1-search'))
    }
  }, [])

  return (
    <ContainerDiv>
      <Systemtittel>
        {t('app:page-title-pdu1-search')}
      </Systemtittel>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow
        className={classNames('slideInFromLeft', { feil: validation[namespace + '-search'] })}
      >
        <HorizontalSeparatorDiv size='0.2' />
        <Column>
          <PileDiv>
            <FlexStartDiv>
              <Input
                label={t('label:fnr-dnr')}
                feil={validation[namespace + '-search']?.feilmelding}
                id='search'
                namespace={namespace}
                onContentChange={onFnrDnrChange}
                required
                value={fnrOrDnr}
              />
            </FlexStartDiv>
            <VerticalSeparatorDiv size='0.5' />
            <Normaltekst>
              {validMessage}
            </Normaltekst>
          </PileDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {validFnr && (
        <>
          <AlignStartRow>
            <Column>
              <Select
                defaultValue={_.find(temaOptions, { value: tema })}
                feil={validation[namespace + '-tema']?.feilmelding}
                highContrast={highContrast}
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
            {fagsaker?.map((f: FagSak) => (
              <div key={f.saksID}>
                <AlignStartRow>
                  <Column>
                    <RadioElementBorder
                      ariaLabel={f.temakode + '-' + f.saksID}
                      ariaChecked={fagsak === f.saksID}
                      checked={fagsak === f.saksID}
                      className='slideInFromLeft'
                      label={(
                        <Undertittel>
                          {f.temakode + '-' + f.saksID}
                        </Undertittel>
                    )}
                      name={namespace + '-fagsaker'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFagsakerSelected(e.target.value)}
                      value={f.saksID}
                    />

                  </Column>
                </AlignStartRow>
                <VerticalSeparatorDiv />
              </div>
            ))}
          </div>
          <VerticalSeparatorDiv size='2' />
          <HighContrastHovedknapp
            spinner={creatingPdu1}
            disabled={!tema || !fagsak || creatingPdu1}
            onClick={onCreatePdu1Clicked}
          >
            {creatingPdu1 ? t('message:loading') : t('el:button-create-x', { x: 'PD U1' })}
          </HighContrastHovedknapp>
        </>
      )}
    </ContainerDiv>
  )
}

export default PDU1Search
