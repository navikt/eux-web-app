import * as vedleggActions from 'actions/vedlegg'
import DocumentSearch from 'applications/Vedlegg/DocumentSearch/DocumentSearch'
import TopContainer from 'components/TopContainer/TopContainer'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Validation, VedleggSendResponse } from 'declarations/types'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import Hjelpetekst from 'nav-frontend-hjelpetekst'
import Lenke from 'nav-frontend-lenker'
import { FeiloppsummeringFeil, Input } from 'nav-frontend-skjema'
import {
  Container,
  Content,
  HighContrastHovedknapp,
  HorizontalSeparatorDiv,
  Margin,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

const Link = styled(Lenke)`
  margin-top: 2em;
`
const FlexDiv = styled.div`
  display: flex;
`

export interface VedleggSelector {
  alertMessage: JSX.Element | string | undefined
  alertType: string | undefined
  vedlegg: VedleggSendResponse | undefined
  rinasaksnummer: string | undefined
  journalpostID: string | undefined
  rinadokumentID: string | undefined
  dokumentID: string | undefined
  sendingVedlegg: boolean
}

const mapState = (state: State): VedleggSelector => ({
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  vedlegg: state.vedlegg.vedlegg,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  journalpostID: state.vedlegg.journalpostID,
  rinadokumentID: state.vedlegg.rinadokumentID,
  dokumentID: state.vedlegg.dokumentID,
  sendingVedlegg: state.loading.sendingVedlegg
})

const Vedlegg: React.FC = (): JSX.Element => {
  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const { t } = useTranslation()
  const { alertMessage, alertType, journalpostID, dokumentID, rinasaksnummer, rinadokumentID, sendingVedlegg, vedlegg }: VedleggSelector = useSelector<State, VedleggSelector>(mapState)
  const [_isRinaNumberValid, setIsRinaNumberValid] = useState<boolean>(false)
  const [_validation, setValidation] = useState<Validation>({})

  useEffect(() => {
    if (!mounted) {
      const params: URLSearchParams = new URLSearchParams(location.search)
      const rinasaksnummer = params.get('rinasaksnummer')
      if (rinasaksnummer) {
        dispatch(vedleggActions.propertySet('rinasaksnummer', rinasaksnummer))
      }
      setMounted(true)
    }
  }, [mounted, dispatch, location])

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), e => e !== undefined) === undefined
  }

  const validate = (): Validation => {
    const validation = {
      journalpostID: !journalpostID
        ? {
          feilmelding: t('validation:noJournalpostID'),
          skjemaelementId: 'vedlegg-journalpostID-id'
        } as FeiloppsummeringFeil
        : undefined,
      dokumentID: !dokumentID
        ? {
          feilmelding: t('validation:noDokumentID'),
          skjemaelementId: 'vedlegg-dokumentID-id'
        } as FeiloppsummeringFeil
        : undefined,
      rinasaksnummer: !rinasaksnummer
        ? {
          feilmelding: t('validation:noSaksnummer'),
          skjemaelementId: ''
        } as FeiloppsummeringFeil
        : (!_isRinaNumberValid
            ? {
                feilmelding: t('validation:unverifiedSaksnummer'),
                skjemaelementId: ''
              }
            : undefined
          ),
      rinadokumentID: !rinadokumentID
        ? {
          feilmelding: t('validation:noRinadokumentID'),
          skjemaelementId: ''
        } as FeiloppsummeringFeil
        : undefined
    }
    setValidation(validation)
    return validation
  }

  const resetValidation = (key: string): void => {
    setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const sendSkjema = (): void => {
    if (isValid(validate()) && _isRinaNumberValid) {
      dispatch(vedleggActions.sendVedlegg({
        journalpostID: journalpostID,
        dokumentID: dokumentID,
        rinasaksnummer: rinasaksnummer,
        rinadokumentID: rinadokumentID,
        rinaNrErSjekket: _isRinaNumberValid,
        rinaNrErGyldig: _isRinaNumberValid
      }))
    }
  }

  const onjournalpostIDChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    resetValidation('journalpostID')
    dispatch(vedleggActions.propertySet('journalpostID', e.target.value))
  }

  const onDokumentIDChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    resetValidation('dokumentID')
    dispatch(vedleggActions.propertySet('dokumentID', e.target.value))
  }

  return (
    <TopContainer title={t('app:page-title-vedlegg')}>
      <Container>
        <Margin />
        <Content>
          <VerticalSeparatorDiv />
          <div className='noslideInFromLeft'>
            <Input
              id='vedlegg-journalpostID'
              data-test-id='vedlegg-journalpostID'
              label={(
                <FlexDiv>
                  {t('label:journalpost-id')}
                  <HorizontalSeparatorDiv size='0.35' />
                  <Hjelpetekst id='journalPostID'>
                    {t('message:help-journalpostID')}
                  </Hjelpetekst>
                </FlexDiv>
              )}
              onChange={onjournalpostIDChange}
              feil={_validation.journalpostID ? _validation.journalpostID.feilmelding : undefined}
            />
          </div>
          <VerticalSeparatorDiv />
          <div className='noslideInFromLeft' style={{ animationDelay: '0.15s' }}>
            <Input
              id='vedlegg-dokumentID'
              data-test-id='vedlegg-dokumentID'
              label={(
                <FlexDiv>
                  {t('label:dokument-id')}
                  <HorizontalSeparatorDiv size='0.35' />
                  <Hjelpetekst id='dokumentID'>
                    {t('message:help-dokumentID')}
                  </Hjelpetekst>
                </FlexDiv>
              )}
              onChange={onDokumentIDChange}
              feil={_validation.dokumentID ? _validation.dokumentID.feilmelding : undefined}
            />
            <VerticalSeparatorDiv />
          </div>
          <div className='noslideInFromLeft' style={{ animationDelay: '0.3s' }}>
            <DocumentSearch
              validation={_validation}
              resetValidation={resetValidation}
              onRinasaksnummerChanged={() => setIsRinaNumberValid(false)}
              onDocumentFound={() => setIsRinaNumberValid(true)}
            />
            <VerticalSeparatorDiv />
          </div>
          <div className='slideInFromLeft' style={{ animationDelay: '0.45s' }}>
            <HighContrastHovedknapp
              onClick={sendSkjema}
              disabled={sendingVedlegg}
              spinner={sendingVedlegg}
            >
              {sendingVedlegg ? t('message:loading-sending-vedlegg') : t('label:send-vedlegg')}
            </HighContrastHovedknapp>
            {alertMessage && alertType && [types.VEDLEGG_POST_FAILURE].indexOf(alertType) >= 0 && (
              <>
                <VerticalSeparatorDiv />
                <AlertStripe type='advarsel'>
                  {alertMessage}
                </AlertStripe>
                <VerticalSeparatorDiv />
              </>
            )}
            {vedlegg && (
              <>
                <VerticalSeparatorDiv />
                <AlertStripe type='suksess'>
                  <div>
                    <div>{t('label:vedlagte')}: {vedlegg.filnavn || vedlegg.vedleggID}</div>
                    {vedlegg.url && (
                      <Link href={vedlegg.url} rel='noreferrer' target='_blank'>
                        {t('label:gå-til-rina')}
                      </Link>
                    )}
                  </div>
                </AlertStripe>
              </>
            )}
          </div>
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
