import * as vedleggActions from 'actions/vedlegg'
import 'components/DocumentSearch/DocumentSearch.css'
import classNames from 'classnames'
import { State } from 'declarations/reducers'
import { Dokument, Validation } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface DocumentSearchSelector {
  gettingDokument: boolean;
  dokument: Array<Dokument> | undefined;
  rinadokumentID: string;
  rinasaksnummer: string;
}

export interface DocumentSearchProps {
  className ?: string;
  onDocumentFound? : (dokument: Array<Dokument>) => void;
  onRinasaksnummerChanged?: () => void;
  validation: Validation;
  resetValidation: (k: string) => void;
}

const mapState = (state: State): DocumentSearchSelector => ({
  gettingDokument: state.loading.gettingDokument,
  dokument: state.vedlegg.dokument,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  rinadokumentID: state.vedlegg.rinadokumentID
})

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  className, onDocumentFound, onRinasaksnummerChanged, resetValidation, validation
}: DocumentSearchProps): JSX.Element => {
  const { dokument, gettingDokument, rinasaksnummer, rinadokumentID }: DocumentSearchSelector = useSelector<State, DocumentSearchSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_dokument, setDokument] = useState<Array<Dokument> | null | undefined>(undefined)

  const sokEtterDokument = () => {
    if (rinasaksnummer) {
      dispatch(vedleggActions.getDokument(rinasaksnummer))
    }
  }

  useEffect(() => {
    if (dokument !== undefined && _dokument === undefined) {
      setDokument(dokument)
      if (_.isFunction(onDocumentFound)) {
        onDocumentFound(dokument)
      }
    }
  }, [dokument, _dokument, onDocumentFound])

  const onRinaSaksnummerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDokument(undefined)
    dispatch(vedleggActions.set('dokument', undefined))
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

  console.log(dokument, _dokument)
  return (
    <div className={classNames(className, 'dokumentsok')}>
      <div className='dokumentsok__skjema'>
        <Ui.Nav.Input
          label={t('ui:label-rinasaksnummer')}
          className='dokumentsok__input'
          value={rinasaksnummer}
          onChange={onRinaSaksnummerChange}
          feil={validation.rinasaksnummer}
        />
        <Ui.Nav.Knapp
          className='dokumentsok__knapp'
          onClick={sokEtterDokument}
          spinner={gettingDokument}
        >
          {t('ui:form-search')}
        </Ui.Nav.Knapp>
      </div>
      <div className='dokumentsok__kort mt-4 mb-4 slideAnimate'>
        <Ui.Nav.Select
          id='id-rinadokument'
          label={t('ui:label-rinadokumentID')}
          onChange={onRinadokumentIDChange}
          value={rinadokumentID}
          feil={validation.rinadokumentID}
          disabled={!_dokument}
        >
          <option value=''>{t('ui:form-choose')}</option>
          {dokument?.map((element: Dokument) => (
            <option value={element.rinadokumentID} key={element.rinadokumentID}>
              {element.kode + (element.opprettetdato ? ' (' + yyyMMdd(element.opprettetdato) + ')' : '')}
            </option>)
          )}
        </Ui.Nav.Select>
      </div>
      {dokument === null || dokument?.length === 0 ? <p>{t('ui:error-noDocumentFound')}</p> : null}
    </div>
  )
}

DocumentSearch.propTypes = {
  className: PT.string,
  onDocumentFound: PT.func,
  onRinasaksnummerChanged: PT.func,
  validation: ValidationPropType.isRequired,
  resetValidation: PT.func.isRequired
}

export default DocumentSearch
