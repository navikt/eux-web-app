import * as vedleggActions from 'actions/vedlegg'
import DocumentSearch from 'components/DocumentSearch/DocumentSearch'
import { Container, Content, HorizontalSeparatorDiv, Margin, VerticalSeparatorDiv } from 'nav-hoykontrast'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { Validation, VedleggSendResponse } from 'declarations/types'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import Hjelpetekst from 'nav-frontend-hjelpetekst'
import { Hovedknapp } from 'nav-frontend-knapper'
import Lenke from 'nav-frontend-lenker'
import { FeiloppsummeringFeil, Input } from 'nav-frontend-skjema'
import { Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const Link = styled(Lenke)`
  margin-top: 2em;
`
const FlexDiv = styled.div`
  display: flex;
`

export interface VedleggSelector {
  vedlegg: VedleggSendResponse | undefined
  rinasaksnummer: string | undefined
  journalpostID: string | undefined
  rinadokumentID: string | undefined
  dokumentID: string | undefined
  sendingVedlegg: boolean
}

export interface VedleggProps {
  location: any
}

const mapState = (state: State): VedleggSelector => ({
  vedlegg: state.vedlegg.vedlegg,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  journalpostID: state.vedlegg.journalpostID,
  rinadokumentID: state.vedlegg.rinadokumentID,
  dokumentID: state.vedlegg.dokumentID,
  sendingVedlegg: state.loading.sendingVedlegg
})

const Vedlegg: React.FC<VedleggProps> = ({ location }: VedleggProps): JSX.Element => {
  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { journalpostID, dokumentID, rinasaksnummer, rinadokumentID, sendingVedlegg, vedlegg }: VedleggSelector = useSelector<State, VedleggSelector>(mapState)
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
          feilmelding: t('ui:validation-noJournalpostID'),
          skjemaelementId: 'vedlegg-journalpostID-id'
        } as FeiloppsummeringFeil
        : undefined,
      dokumentID: !dokumentID
        ? {
          feilmelding: t('ui:validation-noDokumentID'),
          skjemaelementId: 'vedlegg-dokumentID-id'
        } as FeiloppsummeringFeil
        : undefined,
      rinasaksnummer: !rinasaksnummer
        ? {
          feilmelding: t('ui:validation-noSaksnummer'),
          skjemaelementId: ''
        } as FeiloppsummeringFeil
        : (!_isRinaNumberValid
            ? {
                feilmelding: t('ui:validation-unverifiedSaksnummer'),
                skjemaelementId: ''
              }
            : undefined
          ),
      rinadokumentID: !rinadokumentID
        ? {
          feilmelding: t('ui:validation-noRinadokumentID'),
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
    <TopContainer>
      <Container>
        <Margin />
        <Content>
          <VerticalSeparatorDiv />
          <Systemtittel>
            {t('ui:title-vedlegg')}
          </Systemtittel>
          <VerticalSeparatorDiv />
          <div className='noSlideAnimate'>
            <Input
              id='vedlegg-journalpostID'
              data-test-id='vedlegg-journalpostID'
              label={(
                <FlexDiv>
                  {t('ui:label-journalpostID')}
                  <HorizontalSeparatorDiv data-size='0.35' />
                  <Hjelpetekst id='journalPostID'>
                    {t('ui:help-journalpostID')}
                  </Hjelpetekst>
                </FlexDiv>
              )}
              onChange={onjournalpostIDChange}
              feil={_validation.journalpostID ? _validation.journalpostID.feilmelding : undefined}
            />
          </div>
          <VerticalSeparatorDiv />
          <div className='noSlideAnimate' style={{ animationDelay: '0.15s' }}>
            <Input
              id='vedlegg-dokumentID'
              data-test-id='vedlegg-dokumentID'
              label={(
                <FlexDiv>
                  {t('ui:label-dokumentID')}
                  <HorizontalSeparatorDiv data-size='0.35' />
                  <Hjelpetekst id='dokumentID'>
                    {t('ui:help-dokumentID')}
                  </Hjelpetekst>
                </FlexDiv>
              )}
              onChange={onDokumentIDChange}
              feil={_validation.dokumentID ? _validation.dokumentID.feilmelding : undefined}
            />
            <VerticalSeparatorDiv />
          </div>
          <div className='noSlideAnimate' style={{ animationDelay: '0.3s' }}>
            <DocumentSearch
              validation={_validation}
              resetValidation={resetValidation}
              onRinasaksnummerChanged={() => setIsRinaNumberValid(false)}
              onDocumentFound={() => setIsRinaNumberValid(true)}
            />
            <VerticalSeparatorDiv />
          </div>
          <div className='slideAnimate' style={{ animationDelay: '0.45s' }}>
            <Hovedknapp
              onClick={sendSkjema}
              disabled={sendingVedlegg}
              spinner={sendingVedlegg}
            >
              {sendingVedlegg ? t('ui:label-sendingVedlegg') : t('ui:label-sendVedlegg')}
            </Hovedknapp>
            {vedlegg && (
              <>
                <VerticalSeparatorDiv />
                <AlertStripe type='suksess'>
                  <div>
                    <div>{t('ui:attached')}: {vedlegg.filnavn || vedlegg.vedleggID}</div>
                    {vedlegg.url && (
                      <Link href={vedlegg.url} rel='noreferrer' target='_blank'>
                        {t('ui:form-goToRina')}
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
