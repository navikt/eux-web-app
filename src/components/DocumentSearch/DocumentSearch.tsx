import * as vedleggActions from 'actions/vedlegg'
import classNames from 'classnames'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import { State } from 'declarations/reducers'
import { Dokument, Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { Knapp } from 'nav-frontend-knapper'
import { Input, Select } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const Form = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  &.feil {
    align-items: center !important;
  }
`
const Rinasaknummer = styled(Input)`
  flex: 2;
  margin-right: 1rem;
`

export interface DocumentSearchSelector {
  dokument: Array<Dokument> | undefined
  gettingDokument: boolean
  rinadokumentID: string | undefined
  rinasaksnummer: string | undefined
}

export interface DocumentSearchProps {
  className ?: string
  onDocumentFound? : (dokument: Array<Dokument>) => void
  onRinasaksnummerChanged?: () => void
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
  className, onDocumentFound, onRinasaksnummerChanged, resetValidation, validation = {}
}: DocumentSearchProps): JSX.Element => {
  const { dokument, gettingDokument, rinasaksnummer, rinadokumentID }: DocumentSearchSelector = useSelector<State, DocumentSearchSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_dokument, setDokument] = useState<Array<Dokument> | null | undefined>(undefined)

  const sokEtterDokument = (): void => {
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

  const onRinaSaksnummerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDokument(undefined)
    dispatch(vedleggActions.propertySet('dokument', undefined))
    if (_.isFunction(onRinasaksnummerChanged)) {
      onRinasaksnummerChanged()
    }
    resetValidation('rinasaksnummer')
    dispatch(vedleggActions.propertySet('rinasaksnummer', e.target.value))
  }

  const onRinadokumentIDChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('rinadokumentID')
    dispatch(vedleggActions.propertySet('rinadokumentID', e.target.value))
  }

  const yyyMMdd = (dato: string): string => moment(dato).format('YYYY-MM-DD')

  return (
    <div className={className}>
      <Form className={classNames({ feil: !!validation.rinadokumentID })}>
        <Rinasaknummer
          data-test-id='dokumentsok__form__input-id'
          feil={validation.rinasaksnummer}
          label={t('label:rina-saksnummer')}
          onChange={onRinaSaksnummerChange}
          value={rinasaksnummer}
        />
        <Knapp
          onClick={sokEtterDokument}
          spinner={gettingDokument}
        >
          {t('elements:button-search')}
        </Knapp>
      </Form>
      <VerticalSeparatorDiv />
      <div data-test-id='dokumentsok__card slideInFromLeft'>
        <Select
          data-test-id='dokumentsok__card-select-id'
          disabled={!_dokument}
          feil={validation.rinadokumentID}
          label={t('label:rina-document-id')}
          onChange={onRinadokumentIDChange}
          value={rinadokumentID}
        >
          <option value=''>
            {t('label:choose')}
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
        <Normaltekst>
          {t('message:error-noDocumentFound')}
        </Normaltekst>
      )}
    </div>
  )
}

DocumentSearch.propTypes = {
  className: PT.string,
  onDocumentFound: PT.func,
  onRinasaksnummerChanged: PT.func,
  resetValidation: PT.func.isRequired
  // validation: ValidationPropType.isRequired
}

export default DocumentSearch
