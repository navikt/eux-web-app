import * as vedleggActions from 'actions/vedlegg'
import 'components/DocumentSearch/DocumentSearch.css'
import classNames from 'classnames'
import { State } from 'declarations/reducers'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface DocumentSearchSelector {
  gettingDokumenter: boolean;
  dokumenter: any;
  rinadokumentID: any;
  rinasaksnummer: any;
}

export interface DocumentSearchProps {
  className ?: string;
  onDocumentFound? : (dokument: any) => void;
  onRinasaksnummerChanged?: () => void;
  validation: any;
  resetValidation: (k: string) => void;
}

const mapState = (state: State): DocumentSearchSelector => ({
  gettingDokumenter: state.loading.gettingDokumenter,
  dokumenter: state.vedlegg.dokumenter,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  rinadokumentID: state.vedlegg.rinadokumentID
})

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  className, onDocumentFound, onRinasaksnummerChanged, resetValidation, validation
}: DocumentSearchProps): JSX.Element => {
  const { dokumenter, gettingDokumenter, rinasaksnummer, rinadokumentID }: DocumentSearchSelector = useSelector<State, DocumentSearchSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [nyttSok, setNyttSok] = useState(false)
  const [_dokumenter, setDokumenter] = useState(undefined)

  const sokEtterDokumenter = () => {
    if (rinasaksnummer) {
      dispatch(vedleggActions.getDokumenter(rinasaksnummer))
    }
  }

  useEffect(() => {
    if (dokumenter && !_dokumenter) {
      setNyttSok(true)
      setDokumenter(dokumenter)
      if (_.isFunction(onDocumentFound)) {
        onDocumentFound(dokumenter)
      }
    }
  }, [dokumenter, _dokumenter, onDocumentFound])

  const onRinaSaksnummerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDokumenter(undefined)
    dispatch(vedleggActions.set('dokumenter', undefined))
    setNyttSok(false)
    if (_.isFunction(onRinasaksnummerChanged)) {
      onRinasaksnummerChanged()
    }
    resetValidation('rinasaksnummer')
    dispatch(vedleggActions.set('rinasaksnummer', e.target.value))
  }

  const onRinadokumentIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidation('rinadokumentID')
    dispatch(vedleggActions.set('rinadokumentID', e.target.value))
  }

  const yyyMMdd = (dato: any) => moment(dato).format('YYYY-MM-DD')

  return (
    <div className={classNames(className, 'dokumentsok')}>
      <div className='dokumentsok__skjema'>
        <Ui.Nav.Input
          label='RINA saksnummer'
          className='dokumentsok__input'
          name='rinasaksnummer'
          value={rinasaksnummer}
          onChange={onRinaSaksnummerChange}
          feil={validation.rinasaksnummer}
        />
        <Ui.Nav.Knapp className='dokumentsok__knapp' onClick={sokEtterDokumenter} spinner={gettingDokumenter}>
          {t('ui:form-search')}
        </Ui.Nav.Knapp>
      </div>
      <div className='dokumentsok__kort mt-4 mb-4 slideAnimate'>
        <Ui.Nav.Select
          id='id-rinadokument'
          name='rinadokumentID'
          label='Velg SED Type'
          onChange={onRinadokumentIDChange}
          value={rinadokumentID}
          feil={validation.rinadokumentID}
          disabled={!_dokumenter}
        >
          <option value=''>{t('ui:form-choose')}</option>
          {dokumenter ? dokumenter.map((element: any) => (
            <option value={element.rinadokumentID} key={element.rinadokumentID}>{element.kode} =&gt; {yyyMMdd(element.opprettetdato)}</option>)
          ) : null}
        </Ui.Nav.Select>
      </div>
      {(nyttSok && _.isEmpty(dokumenter)) ? <p>Ingen dokumenter funnet</p> : null}
    </div>
  )
}

DocumentSearch.propTypes = {
  className: PT.string,
  onDocumentFound: PT.func,
  onRinasaksnummerChanged: PT.func,
  validation: PT.any
}

export default DocumentSearch
