import { Alert, Button, Checkbox, HelpText, Link, Loader } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  Container,
  Content,
  FlexDiv,
  HorizontalSeparatorDiv,
  Margin,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import * as vedleggActions from 'actions/vedlegg'
import DocumentSearch from 'applications/Vedlegg/DocumentSearch/DocumentSearch'
import Input from 'components/Forms/Input'
import TopContainer from 'components/TopContainer/TopContainer'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Validation, VedleggPayload, VedleggSendResponse } from 'declarations/types'
import _ from 'lodash'
import performValidation from 'utils/performValidation'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import { validateVedlegg, ValidationVedleggProps } from './validation'

export interface VedleggSelector {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  dokumentID: string | undefined
  journalpostID: string | undefined
  rinadokumentID: string | undefined
  rinasaksnummer: string | undefined
  sensitivt: boolean
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
  sensitivt: state.vedlegg.sensitivt,
  vedleggResponse: state.vedlegg.vedleggResponse,
  validation: state.validation.status
})

export const MyContent = styled(Content)`
  @media (min-width: 768px) {
   min-width: 600px;
   maxWidth: 800px;
 }
  align-items: center;
`

const Vedlegg: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const namespace = 'vedlegg'
  const { t } = useTranslation()
  const { alertMessage, alertType, journalpostID, dokumentID, rinasaksnummer, rinadokumentID, sendingVedlegg, sensitivt, vedleggResponse, validation }: VedleggSelector = useAppSelector(mapState)

  useEffect(() => {
    const params: URLSearchParams = new URLSearchParams(window.location.search)
    const rinasaksnummer = params.get('rinasaksnummer')
    if (rinasaksnummer) {
      dispatch(vedleggActions.propertySet('rinasaksnummer', rinasaksnummer))
    }
  }, [])

  const sendSkjema = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationVedleggProps>(clonedValidation, namespace, validateVedlegg, {
      journalpostID,
      dokumentID,
      rinasaksnummer,
      rinadokumentID
    })
    dispatch(setValidation(clonedValidation))
    if (!hasErrors) {
      dispatch(vedleggActions.sendVedlegg({
        journalpostID,
        dokumentID,
        rinasaksnummer,
        rinadokumentID,
        sensitivt
      } as VedleggPayload))
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

  const setSensitivt = (newSensitivt: boolean): void => {
    dispatch(vedleggActions.propertySet('sensitivt', newSensitivt))
    if (validation[namespace + '-sensitivt']) {
      dispatch(resetValidation(namespace + '-sensitivt'))
    }
  }

  return (
    <TopContainer title={t('app:page-title-vedlegg')}>
      <Container>
        <Margin />
        <MyContent>
          <AlignStartRow>
            <Column>
              <Input
                id='journalpostID'
                data-testid={namespace + '-journalpostID'}
                namespace={namespace}
                value={journalpostID}
                label={(
                  <FlexDiv>
                    {t('label:journalpost-id') + ' *'}
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
            </Column>
            <Column>
              <Input
                id='dokumentID'
                namespace={namespace}
                data-testid={namespace + '-dokumentID'}
                value={dokumentID}
                label={(
                  <FlexDiv>
                    {t('label:dokument-id') + ' *'}
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
            </Column>
          </AlignStartRow>
          <AlignStartRow>
            <Column>
              <Checkbox
                checked={sensitivt}
                data-testid={namespace + '-sensitivt'}
                error={!!validation[namespace + '-sensitivt']?.feilmelding}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSensitivt(e.target.checked)}
              >
                {t('label:sensitivt')}
              </Checkbox>
              <VerticalSeparatorDiv />
            </Column>
          </AlignStartRow>
          <AlignStartRow>
            <DocumentSearch
              parentNamespace={namespace}
              validation={validation}
              resetValidation={resetValidation}
            />
          </AlignStartRow>
          <VerticalSeparatorDiv size='2' />
          <AlignStartRow>
            <Column>
              <Button
                variant='primary'
                onClick={sendSkjema}
                disabled={sendingVedlegg}
              >
                {sendingVedlegg ? t('message:loading-sending-vedlegg') : t('label:send-vedlegg')}
                {sendingVedlegg && <Loader />}
              </Button>
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv size='2' />
          {alertMessage && alertType && [types.VEDLEGG_POST_FAILURE].indexOf(alertType) >= 0 && (
            <>
              <Alert variant='warning'>
                {alertMessage}
              </Alert>
              <VerticalSeparatorDiv size='2' />
            </>
          )}
          <ValidationBox
            heading={t('validation:feiloppsummering')}
            validation={validation}
          />
          <VerticalSeparatorDiv size='2' />
          {vedleggResponse && (
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
          )}
        </MyContent>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default Vedlegg
