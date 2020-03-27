import * as vedleggActions from 'actions/vedlegg'

import DocumentSearch from 'components/DocumentSearch/DocumentSearch'
import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import { Validation } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import './Vedlegg.css'

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
    <TopContainer className='vedlegg'>
      <Ui.Nav.Row className='m-0'>
        <div className='col-sm-2' />
        <div className='col-sm-8 m-4'>
          <Ui.Nav.Systemtittel className='mt-4 mb-4'>Vedleggs informasjon</Ui.Nav.Systemtittel>
          <div className='slideAnimate'>
            <Ui.Nav.Hjelpetekst id='journalPostID' type='hoyre'>
              {t('ui:form-journalpostID')}
            </Ui.Nav.Hjelpetekst>
            <Ui.Nav.Input
              className='mb-4'
              label={t('ui:label-journalpostID')}
              onChange={onjournalpostIDChange}
              feil={validation.journalpostID}
            />
          </div>
          <div className='slideAnimate' style={{ animationDelay: '0.15s' }}>
            <Ui.Nav.Hjelpetekst id='dokumentID' type='under'>
              {t('ui:form-dokumentID')}
            </Ui.Nav.Hjelpetekst>
            <Ui.Nav.Input
              className='mb-4'
              label={t('ui:label-dokumentID')}
              onChange={onDokumentIDChange}
              feil={validation.dokumentID}
            />
          </div>
          <div className='slideAnimate' style={{ animationDelay: '0.3s' }}>
            <DocumentSearch
              className='mb-4'
              validation={validation}
              resetValidation={resetValidation}
              onRinasaksnummerChanged={() => setIsRinaNumberValid(false)}
              onDocumentFound={() => setIsRinaNumberValid(true)}
            />
          </div>
          <div className='vedlegg__submmit slideAnimate' style={{ animationDelay: '0.45s' }}>
            <Ui.Nav.Hovedknapp
              onClick={sendSkjema}
              disabled={sendingVedlegg}
              spinner={sendingVedlegg}
            >
              {sendingVedlegg ? t('ui:label-sendingVedlegg') : t('ui:label-sendVedlegg')}
            </Ui.Nav.Hovedknapp>
            {vedlegg ? (
              <Ui.Nav.AlertStripe className='mt-4' type='suksess'>
                <div>
                  <div>Vedlegget: {vedlegg.vedleggID}</div>
                  {vedlegg.url ? (
                    <Ui.Nav.Lenke href={vedlegg.url} target='_blank' className='vedlegg__lenke'>
                      Gå direkte til Rina.
                    </Ui.Nav.Lenke>
                  ) : null}
                </div>
              </Ui.Nav.AlertStripe>
            ) : null}
          </div>
        </div>
        <div className='col-sm-2' />
      </Ui.Nav.Row>
    </TopContainer>
  )
}

Vedlegg.propTypes = {
  location: PT.object.isRequired
}

export default Vedlegg
