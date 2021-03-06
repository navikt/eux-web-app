import * as vedleggActions from 'actions/vedlegg'
import DocumentSearch from 'components/DocumentSearch/DocumentSearch'
import { Container, Content, Margin, VerticalSeparatorDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import AlertStripe from 'nav-frontend-alertstriper'
import Hjelpetekst from 'nav-frontend-hjelpetekst'
import { Hovedknapp } from 'nav-frontend-knapper'
import Lenke from 'nav-frontend-lenker'
import { Input } from 'nav-frontend-skjema'
import { Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

export interface VedleggSelector {
  vedlegg: any;
  rinasaksnummer: any;
  journalpostID: any;
  rinadokumentID: any;
  dokumentID: any;
  sendingVedlegg: boolean;
}

export interface VedleggProps {
  location: any;
}

const mapState = (state: State): VedleggSelector => ({
  vedlegg: state.vedlegg.vedlegg,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  journalpostID: state.vedlegg.journalpostID,
  rinadokumentID: state.vedlegg.rinadokumentID,
  dokumentID: state.vedlegg.dokumentID,
  sendingVedlegg: state.loading.sendingVedlegg
})

const Link = styled(Lenke)`
  margin-top: 2em;
`

const Vedlegg: React.FC<VedleggProps> = ({ location }: VedleggProps): JSX.Element => {
  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { journalpostID, dokumentID, rinasaksnummer, rinadokumentID, sendingVedlegg, vedlegg }: VedleggSelector = useSelector<State, VedleggSelector>(mapState)
  const [validation, setValidation] = useState<Validation>({})
  const [isRinaNumberValid, setIsRinaNumberValid] = useState<boolean>(false)

  useEffect(() => {
    if (!mounted) {
      const params: URLSearchParams = new URLSearchParams(location.search)
      const rinasaksnummer = params.get('rinasaksnummer')
      if (rinasaksnummer) {
        dispatch(vedleggActions.set('rinasaksnummer', rinasaksnummer))
      }
      setMounted(true)
    }
  }, [mounted, dispatch, location])

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), e => e !== null) === undefined
  }

  const validate = (): Validation => {
    const validation = {
      journalpostID: !journalpostID ? t('ui:validation-noJournalpostID') : null,
      dokumentID: !dokumentID ? t('ui:validation-noDokumentID') : null,
      rinasaksnummer: !rinasaksnummer ? t('ui:validation-noSaksnummer') : (!isRinaNumberValid ? t('ui:validation-unverifiedSaksnummer') : null),
      rinadokumentID: !rinadokumentID ? t('ui:validation-noRinadokumentID') : null
    }
    setValidation(validation)
    return validation
  }

  const resetValidation = (key: string): void => {
    setValidation({
      ...validation,
      [key]: null
    })
  }

  const sendSkjema = (): void => {
    if (isValid(validate()) && isRinaNumberValid) {
      dispatch(vedleggActions.sendVedlegg({
        journalpostID: journalpostID,
        dokumentID: dokumentID,
        rinasaksnummer: rinasaksnummer,
        rinadokumentID: rinadokumentID,
        rinaNrErSjekket: isRinaNumberValid,
        rinaNrErGyldig: isRinaNumberValid
      }))
    }
  }

  const onjournalpostIDChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    resetValidation('journalpostID')
    dispatch(vedleggActions.set('journalpostID', e.target.value))
  }

  const onDokumentIDChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    resetValidation('dokumentID')
    dispatch(vedleggActions.set('dokumentID', e.target.value))
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
              data-testid='vedlegg-journalpostID-id'
              label={(
                <div>
                  {t('ui:label-journalpostID')}
                  <Hjelpetekst id='journalPostID'>
                    {t('ui:help-journalpostID')}
                  </Hjelpetekst>
                </div>
              )}
              onChange={onjournalpostIDChange}
              feil={validation.journalpostID}
            />
          </div>
          <VerticalSeparatorDiv />
          <div className='noSlideAnimate' style={{ animationDelay: '0.15s' }}>
            <Input
              data-testid='vedlegg-dokumentID-id'
              label={(
                <div>
                  {t('ui:label-dokumentID')}
                  <Hjelpetekst id='dokumentID'>
                    {t('ui:help-dokumentID')}
                  </Hjelpetekst>
                </div>
              )}
              onChange={onDokumentIDChange}
              feil={validation.dokumentID}
            />
            <VerticalSeparatorDiv />
          </div>
          <div className='noSlideAnimate' style={{ animationDelay: '0.0s' }}>
            <DocumentSearch
              validation={validation}
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
                    <div>Vedlegget: {vedlegg.filnavn || vedlegg.vedleggID}</div>
                    {vedlegg.url && (
                      <Link href={vedlegg.url} target='_blank'>
                        Gå direkte til Rina.
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
