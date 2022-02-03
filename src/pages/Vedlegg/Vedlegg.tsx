import { Alert, Button, HelpText, Link, Loader } from '@navikt/ds-react'
import { resetAllValidation, resetValidation, viewValidation } from 'actions/validation'
import * as vedleggActions from 'actions/vedlegg'
import DocumentSearch from 'applications/Vedlegg/DocumentSearch/DocumentSearch'
import Input from 'components/Forms/Input'
import TopContainer from 'components/TopContainer/TopContainer'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Validation, VedleggSendResponse } from 'declarations/types'
import useGlobalValidation from 'hooks/useGlobalValidation'
import { Container, Content, FlexDiv, HorizontalSeparatorDiv, Margin, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { validateVedlegg, ValidationVedleggProps } from './validation'

export interface VedleggSelector {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  dokumentID: string | undefined
  journalpostID: string | undefined
  rinadokumentID: string | undefined
  rinasaksnummer: string | undefined
  sendingVedlegg: boolean
  vedleggResponse: VedleggSendResponse | undefined
  validation: Validation
}

const mapState = (state: State): VedleggSelector => ({
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  sendingVedlegg: state.loading.sendingVedlegg,
  dokumentID: state.vedlegg.dokumentID,
  journalpostID: state.vedlegg.journalpostID,
  rinadokumentID: state.vedlegg.rinadokumentID,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  vedleggResponse: state.vedlegg.vedleggResponse,
  validation: state.validation.status
})

const Vedlegg: React.FC = (): JSX.Element => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { t } = useTranslation()
  const { alertMessage, alertType, journalpostID, dokumentID, rinasaksnummer, rinadokumentID, sendingVedlegg, vedleggResponse, validation }: VedleggSelector = useSelector<State, VedleggSelector>(mapState)
  const [isRinaNumberValid, setIsRinaNumberValid] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationVedleggProps>(validateVedlegg)
  const namespace = 'vedlegg'

  useEffect(() => {
    const params: URLSearchParams = new URLSearchParams(location.search)
    const rinasaksnummer = params.get('rinasaksnummer')
    if (rinasaksnummer) {
      dispatch(vedleggActions.propertySet('rinasaksnummer', rinasaksnummer))
    }
  }, [])

  const sendSkjema = (): void => {
    const valid = performValidation({
      journalpostID,
      dokumentID,
      rinasaksnummer,
      isRinaNumberValid,
      rinadokumentID,
      namespace
    })
    dispatch(viewValidation())
    if (valid) {
      dispatch(vedleggActions.sendVedlegg({
        journalpostID: journalpostID,
        dokumentID: dokumentID,
        rinasaksnummer: rinasaksnummer,
        rinadokumentID: rinadokumentID,
        rinaNrErSjekket: isRinaNumberValid,
        rinaNrErGyldig: isRinaNumberValid
      }))
      dispatch(resetAllValidation())
    }
  }

  const setJournalpostID = (newJournalpostID: string): void => {
    dispatch(vedleggActions.propertySet('journalpostID', newJournalpostID))
    if (validation[namespace + '-journalpostID']) {
      dispatch(resetValidation(namespace + '-journalpostID'))
    }
  }

  const setDokumentID = (newDokumentID: string): void => {
    dispatch(vedleggActions.propertySet('dokumentID', newDokumentID))
    if (validation[namespace + '-dokumentID']) {
      dispatch(resetValidation(namespace + '-dokumentID'))
    }
  }

  return (
    <TopContainer title={t('app:page-title-vedlegg')}>
      <Container>
        <Margin />
        <Content>
          <VerticalSeparatorDiv />
          <Input
            id='journalpostID'
            data-test-id={namespace + '-journalpostID'}
            namespace={namespace}
            value={journalpostID}
            label={(
              <FlexDiv>
                {t('label:journalpost-id')}
                <HorizontalSeparatorDiv size='0.35' />
                <HelpText id='journalPostID'>
                  {t('message:help-journalpostID')}
                </HelpText>
              </FlexDiv>
            )}
            onChanged={setJournalpostID}
            error={validation[namespace + '-journalpostID']?.feilmelding}
          />
          <VerticalSeparatorDiv />
          <div className='slideInFromLeft' style={{ animationDelay: '0.05s' }}>
            <Input
              id='dokumentID'
              namespace={namespace}
              data-test-id={namespace + '-dokumentID'}
              value={dokumentID}
              label={(
                <FlexDiv>
                  {t('label:dokument-id')}
                  <HorizontalSeparatorDiv size='0.35' />
                  <HelpText id={namespace + '-dokumentID-help'}>
                    {t('message:help-dokumentID')}
                  </HelpText>
                </FlexDiv>
              )}
              onChanged={setDokumentID}
              error={validation[namespace + '-dokumentID']?.feilmelding}
            />
            <VerticalSeparatorDiv />
          </div>
          <div className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <DocumentSearch
              parentNamespace={namespace}
              validation={validation}
              resetValidation={resetValidation}
              onRinaSaksnummerChanged={() => setIsRinaNumberValid(false)}
              onDocumentFound={() => setIsRinaNumberValid(true)}
            />
          </div>
          <VerticalSeparatorDiv size='2' />
          <div className='slideInFromLeft' style={{ animationDelay: '0.15s' }}>
            <Button
              variant='primary'
              onClick={sendSkjema}
              disabled={sendingVedlegg}
            >
              {sendingVedlegg ? t('message:loading-sending-vedlegg') : t('label:send-vedlegg')}
              {sendingVedlegg && <Loader />}
            </Button>
          </div>
          <VerticalSeparatorDiv size='2' />
          {alertMessage && alertType && [types.VEDLEGG_POST_FAILURE].indexOf(alertType) >= 0 && (
            <>
              <Alert variant='warning'>
                {alertMessage}
              </Alert>
              <VerticalSeparatorDiv size='2' />
            </>
          )}
          <ValidationBox heading={t('validation:feiloppsummering')} validation={validation} />
          {vedleggResponse && (
            <>
              <VerticalSeparatorDiv size='2' />
              <Alert variant='success'>
                <div>
                  <div>{t('label:vedlagte')}: {vedleggResponse.filnavn || vedleggResponse.vedleggID}</div>
                  {vedleggResponse.url && (
                    <Link href={vedleggResponse.url} rel='noreferrer' target='_blank'>
                      {t('label:gå-til-rina')}
                    </Link>
                  )}
                </div>
              </Alert>
            </>
          )}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

Vedlegg.propTypes = {
  location: PT.object.isRequired
}

export default Vedlegg
