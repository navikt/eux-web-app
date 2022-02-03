import { Search } from '@navikt/ds-icons'
import { BodyLong, Loader, SearchField, Select } from '@navikt/ds-react'
import * as vedleggActions from 'actions/vedlegg'
import { State } from 'declarations/reducers'
import { Dokument, Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface DocumentSearchSelector {
  dokument: Array<Dokument> | undefined
  gettingDokument: boolean
  rinadokumentID: string | undefined
  rinasaksnummer: string | undefined
}

export interface DocumentSearchProps {
  className?: string
  onDocumentFound?: (dokument: Array<Dokument>) => void
  onRinaSaksnummerChanged?: () => void
  parentNamespace: string
  resetValidation: (k: string) => void
  validation: Validation
}

const mapState = (state: State): DocumentSearchSelector => ({
  dokument: state.vedlegg.dokument,
  gettingDokument: state.loading.gettingDokument,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  rinadokumentID: state.vedlegg.rinadokumentID
})

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  className, onDocumentFound, parentNamespace, onRinaSaksnummerChanged, resetValidation, validation = {}
}: DocumentSearchProps): JSX.Element => {
  const { dokument, gettingDokument, rinasaksnummer, rinadokumentID }: DocumentSearchSelector = useSelector<State, DocumentSearchSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const namespace = parentNamespace + '-documentSearch'
  const [_dokument, setDokument] = useState<Array<Dokument> | null | undefined>(undefined)

  useEffect(() => {
    if (dokument !== undefined && _dokument === undefined) {
      setDokument(dokument)
      if (_.isFunction(onDocumentFound)) {
        onDocumentFound(dokument)
      }
    }
  }, [dokument, _dokument, onDocumentFound])

  const sokEtterDokument = (): void => {
    if (rinasaksnummer) {
      dispatch(vedleggActions.getDokument(rinasaksnummer))
    }
  }

  const setRinaSaksnummer = (newRinaSaksnummer: string): void => {
    if (!_.isNil(document)) {
      setDokument(undefined)
      dispatch(vedleggActions.propertySet('dokument', undefined))
      if (validation[namespace + '-dokument']) {
        dispatch(resetValidation(namespace + '-dokument'))
      }
    }

    dispatch(vedleggActions.propertySet('rinasaksnummer', newRinaSaksnummer))
    if (validation[namespace + '-rinasaksnummer']) {
      dispatch(resetValidation(namespace + '-rinasaksnummer'))
    }

    if (_.isFunction(onRinaSaksnummerChanged)) {
      onRinaSaksnummerChanged()
    }
  }

  const setRinaDokumentID = (newRinaDokumentID: string): void => {
    dispatch(vedleggActions.propertySet('rinadokumentID', newRinaDokumentID))
    if (validation[namespace + '-rinadokumentID']) {
      dispatch(resetValidation(namespace + '-rinadokumentID'))
    }
  }

  const yyyMMdd = (dato: string): string => moment(dato).format('YYYY-MM-DD')

  return (
    <div className={className}>
      <SearchField
        label={t('label:rina-saksnummer')}
        error={validation[namespace + '-rinasaksnummer']?.feilmelding}
      >
        <SearchField.Input
          data-test-id={namespace + '-rinasaksnummer'}
          id={namespace + '-rinasaksnummer'}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRinaSaksnummer(e.target.value)}
          value={rinasaksnummer}
        />
        <SearchField.Button onClick={sokEtterDokument}>
          <Search />
          {t('el:button-search')}
          {gettingDokument && <Loader />}
        </SearchField.Button>
      </SearchField>
      <VerticalSeparatorDiv />
      <div data-test-id='dokumentsok__card slideInFromLeft'>
        <Select
          data-test-id={namespace + '-rinadokumentID'}
          id={namespace + '-rinadokumentID'}
          disabled={!_dokument}
          error={validation[namespace + '-rinadokumentID']?.feilmelding}
          label={t('label:rina-dokument-id')}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRinaDokumentID(e.target.value)}
          value={rinadokumentID}
        >
          <option value=''>
            {t('el:placeholder-select-default')}
          </option>
          {dokument?.map((element: Dokument) => (
            <option value={element.rinadokumentID} key={element.rinadokumentID}>
              {element.kode + (element.opprettetdato ? ' (' + yyyMMdd(element.opprettetdato) + ')' : '')}
            </option>)
          )}
        </Select>
      </div>
      <VerticalSeparatorDiv />
      {(dokument === null || dokument?.length === 0) && (
        <BodyLong>
          {t('message:error-noDocumentFound')}
        </BodyLong>
      )}
    </div>
  )
}

DocumentSearch.propTypes = {
  className: PT.string,
  onDocumentFound: PT.func,
  onRinaSaksnummerChanged: PT.func,
  resetValidation: PT.func.isRequired,
  parentNamespace: PT.string.isRequired
//  validation: ValidationPropType.isRequired
}

export default DocumentSearch
