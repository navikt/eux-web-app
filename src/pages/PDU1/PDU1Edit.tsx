import {BodyLong, Box, Button, Loader, VStack} from '@navikt/ds-react'
import { getPdu1Template, getStoredPdu1AsJSON, jornalførePdu1, resetJornalførePdu1, setPdu1, updatePdu1 } from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { setValidation } from 'actions/validation'
import CoverLetter from 'applications/PDU1/CoverLetter/CoverLetter'
import Dagpenger from 'applications/PDU1/Dagpenger/Dagpenger'
import Perioder from 'applications/PDU1/Perioder/Perioder'
import Person from 'applications/PDU1/Person/Person'
import PreviewPDU1 from 'applications/PDU1/PreviewPDU1/PreviewPDU1'
import RettTilDagpenger from 'applications/PDU1/RettTilDagpenger/RettTilDagpenger'
import OppsigelsesGrunn from 'applications/PDU1/OppsigelsesGrunn/OppsigelsesGrunn'
import Etterbetalinger from 'applications/PDU1/Etterbetalinger/Etterbetalinger'
import MainForm from 'applications/SvarSed/MainForm'
import Modal from 'components/Modal/Modal'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import AvsenderFC from "applications/PDU1/Avsender/AvsenderFC"
import {Avsender, PDU1, Pdu1Person} from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {useNavigate, useParams} from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validatePDU1Edit, ValidationPDU1EditProps } from './mainValidation'
import moment from "moment/moment";

export interface PDU1EditSelector {
  completingPdu1: boolean
  pdu1Initialized: boolean
  pdu1: PDU1 | null | undefined
  savingPdu1: boolean
  jornalførePdu1Response: any
  validation: Validation
  saksbehandlerNavn: string | undefined
  countryCodeMap: {key?: string} | null | undefined
}

export interface PDU1EditProps {
  type: 'create' | 'edit'
}

const mapState = (state: State): any => ({
  completingPdu1: state.loading.completingPdu1,
  pdu1Initialized: state.pdu1.pdu1Initialized,
  pdu1: state.pdu1.pdu1,
  jornalførePdu1Response: state.pdu1.jornalførePdu1Response,
  validation: state.validation.status,
  saksbehandlerNavn: state.app.navn,
  countryCodeMap: state.app.countryCodeMap
})

const PDU1Edit: React.FC<PDU1EditProps> = ({
  type
}: PDU1EditProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const {
    completingPdu1,
    pdu1Initialized,
    pdu1,
    jornalførePdu1Response,
    validation,
    saksbehandlerNavn,
    countryCodeMap
  }: PDU1EditSelector = useAppSelector(mapState)
  const namespace = 'pdu1'
  const [completeModal, setCompleteModal] = useState<boolean>(false)

  const jornalførePdu1Clicked = (e: any): void => {
    if (pdu1) {
      let newPdu1: PDU1 = _.cloneDeep(pdu1)
      const avsender: Avsender = newPdu1.avsender
      const bruker: Pdu1Person = newPdu1.bruker
      const clonedValidation = _.cloneDeep(validation)
      const hasErrors = performValidation<ValidationPDU1EditProps>(clonedValidation, namespace, validatePDU1Edit, {
        pdu1: newPdu1
      })
      dispatch(setValidation(clonedValidation))
      if (!hasErrors) {
        // clean up PDU1 before sending it
        if (!_.isEmpty(newPdu1.etterbetalinger)) {
          delete newPdu1.etterbetalinger._utbetalingEtterEndtArbeidsforholdCheckbox
          delete newPdu1.etterbetalinger._kompensasjonForEndtArbeidsforholdCheckbox
          delete newPdu1.etterbetalinger._kompensasjonForFeriedagerCheckbox
          delete newPdu1.etterbetalinger._avkallKompensasjonBegrunnelseCheckbox
          delete newPdu1.etterbetalinger._andreYtelserSomMottasForTidenCheckbox
        }
        delete newPdu1.__journalpostId
        delete newPdu1.__dokumentId
        delete newPdu1.__fagsak
        delete newPdu1.__fnr

        newPdu1 = {
          ...newPdu1,
          bruker : {
            ...bruker,
            adresse: {
              ...bruker.adresse,
              landnavn: countryCodeMap && bruker.adresse?.landkode ? countryCodeMap[bruker.adresse?.landkode as keyof typeof countryCodeMap] : bruker.adresse?.landkode
            }
          },
          avsender: {
            ...avsender,
            adresse :{
              ...avsender.adresse,
              landnavn: countryCodeMap && avsender.adresse?.landkode ? countryCodeMap[avsender.adresse?.landkode as keyof typeof countryCodeMap] : avsender.adresse?.landkode
            }
          }
        }

        dispatch(jornalførePdu1(newPdu1))
      }
    }
  }


  const goToSearchPage = () => {
    navigate({
      pathname: '/pdu1/search',
      search: window.location.search
    })
  }

  const resetComplete = () => {
    dispatch(resetJornalførePdu1())
    setCompleteModal(false)
    goToSearchPage()
  }

  useEffect(() => {
    if (type === 'create' && params.fnr && params.fagsak && params.saksreferanse) {
      dispatch(getPdu1Template(params.fnr, params.fagsak, params.saksreferanse))
    }
    if (type === 'edit' && params.journalpostId && params.dokumentInfoId && params.fagsak) {
      dispatch(getStoredPdu1AsJSON(params.journalpostId, params.dokumentInfoId, params.fagsak))
    }
  }, [])

  useEffect(() => {
    if(pdu1Initialized && saksbehandlerNavn){
      dispatch(updatePdu1("nav.saksbehandler.navn", saksbehandlerNavn.trim()))
      dispatch(updatePdu1("dato", moment(new Date()).format('DD.MM.YYYY')))
    }
  }, [pdu1Initialized])


  useEffect(() => {
    if (!completeModal && !_.isNil(jornalførePdu1Response)) {
      setCompleteModal(true)
    }
  }, [jornalførePdu1Response])

  useEffect(() => {
    dispatch(startPageStatistic('pdu1editor'))
    return () => {
      dispatch(finishPageStatistic('pdu1editor'))
    }
  }, [])

  if (_.isUndefined(pdu1)) {
    return <WaitingPanel />
  }

  return (
    <VStack gap="4">
      {jornalførePdu1Response && (
        <Modal
          open={completeModal}
          modal={{
            closeButton: true,
            modalTitle: t('message:success-complete-pdu1'),
            modalContent: (
              <div style={{ textAlign: 'center', display: 'block', minWidth: '400px', minHeight: '100px' }}>
                <VStack>
                  <BodyLong>{jornalførePdu1Response.melding}</BodyLong>
                  <BodyLong>journalpostId: {jornalførePdu1Response.journalpostId}</BodyLong>
                  <BodyLong>journalstatus: {jornalførePdu1Response.journalstatus}</BodyLong>
                </VStack>
              </div>
            ),
            modalButtons: [{
              main: true,
              text: 'OK',
              onClick: resetComplete
            }]
          }}
          onModalClose={resetComplete}
        />
      )}
      <MainForm<PDU1>
        type='onelevel'
        namespace={namespace}
        loggingNamespace='personmanager'
        firstForm='person'
        forms={[
          { label: t('el:option-mainform-person'), value: 'person', component: Person, type: 'PD' },
          { label: t('el:option-mainform-perioder'), value: 'perioder', component: Perioder, type: 'PD' },
          {
            label: t('el:option-mainform-arsak-til-avsluttet'),
            value: 'oppsigelsesgrunn',
            component: OppsigelsesGrunn,
            type: 'PD'
          },
          { label: t('el:option-mainform-utbetaling'), value: 'etterbetalinger', component: Etterbetalinger, type: 'PD' },
          { label: t('el:option-mainform-dagpenger'), value: 'dagpenger', component: Dagpenger, type: 'PD' },
          {
            label: t('el:option-mainform-retttildagpenger'),
            value: 'retttildagpenger',
            component: RettTilDagpenger,
            type: 'PD'
          },
          { label: t('el:option-mainform-avsender'), value: 'avsender', component: AvsenderFC, type: 'PD' },
          { label: t('el:option-mainform-coverletter'), value: 'coverletter', component: CoverLetter, type: 'PD' }
        ]}
        replySed={pdu1}
        setReplySed={setPdu1}
        updateReplySed={updatePdu1}
      />
      <Box borderWidth="1" padding="4" background="bg-default">
        <VStack gap="4">
          <PreviewPDU1 validation={validation} namespace={namespace} />
          <ValidationBox heading={t('validation:feiloppsummering')} validation={validation} />
          <Box>
            <Button
              variant='primary'
              onClick={jornalførePdu1Clicked}
              disabled={completingPdu1 || !_.isEmpty(jornalførePdu1Response)}
            >
              {completingPdu1
                ? t('message:loading-opprette-pdu1')
                : t('label:opprett-pdu1')}
              {completingPdu1 && <Loader />}
            </Button>
          </Box>
        </VStack>
      </Box>
    </VStack>
  )
}

export default PDU1Edit
