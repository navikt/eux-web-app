import * as vedleggActions from '../../actions/vedlegg'
import classNames from 'classnames'
import { VerticalSeparatorDiv } from '../../components/StyledComponents'
import { State } from '../../declarations/reducers'
import { Dokument, Validation } from '../../declarations/types'
import { ValidationPropType } from '../../declarations/types.pt'
import _ from 'lodash'
import moment from 'moment'
import { Knapp } from 'nav-frontend-knapper'
import { Input, Select } from 'nav-frontend-skjema'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

export interface DocumentSearchSelector {
  gettingDokument: boolean;
  dokument: Array<Dokument> | undefined;
  rinadokumentID: string | undefined;
  rinasaksnummer: string | undefined;
}

export interface DocumentSearchProps {
  className ?: string;
  onDocumentFound? : (dokument: Array<Dokument>) => void;
  onRinasaksnummerChanged?: () => void;
  resetValidation: (k: string) => void;
  validation: Validation;
}

const mapState = (state: State): DocumentSearchSelector => ({
  gettingDokument: state.loading.gettingDokument,
  dokument: state.vedlegg.dokument,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  rinadokumentID: state.vedlegg.rinadokumentID
})

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

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  className, onDocumentFound, onRinasaksnummerChanged, resetValidation, validation
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
    dispatch(vedleggActions.set('dokument', undefined))
    if (_.isFunction(onRinasaksnummerChanged)) {
      onRinasaksnummerChanged()
    }
    resetValidation('rinasaksnummer')
    dispatch(vedleggActions.set('rinasaksnummer', e.target.value))
  }

  const onRinadokumentIDChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    resetValidation('rinadokumentID')
    dispatch(vedleggActions.set('rinadokumentID', e.target.value))
  }

  const yyyMMdd = (dato: string): string => moment(dato).format('YYYY-MM-DD')

  return (
    <div className={className}>
      <Form className={classNames({ feil: !!validation.rinadokumentID })}>
        <Rinasaknummer
          label={t('ui:label-rinasaksnummer')}
          data-testid='dokumentsok__form__input-id'
          value={rinasaksnummer}
          onChange={onRinaSaksnummerChange}
          feil={validation.rinasaksnummer}
        />
        <Knapp
          onClick={sokEtterDokument}
          spinner={gettingDokument}
        >
          {t('ui:form-search')}
        </Knapp>
      </Form>
      <VerticalSeparatorDiv />
      <div data-testid='dokumentsok__card slideAnimate'>
        <Select
          data-testid='dokumentsok__card-select-id'
          label={t('ui:label-rinadokumentID')}
          onChange={onRinadokumentIDChange}
          value={rinadokumentID}
          feil={validation.rinadokumentID}
          disabled={!_dokument}
        >
          <option value=''>
            {t('ui:form-choose')}
          </option>
          {dokument?.map((element: Dokument) => (
            <option value={element.rinadokumentID} key={element.rinadokumentID}>
              {element.kode + (element.opprettetdato ? ' (' + yyyMMdd(element.opprettetdato) + ')' : '')}
            </option>)
          )}
        </Select>
      </div>
      <VerticalSeparatorDiv />
      {dokument === null || dokument?.length === 0 ? <p>{t('ui:error-noDocumentFound')}</p> : null}
    </div>
  )
}

DocumentSearch.propTypes = {
  className: PT.string,
  onDocumentFound: PT.func,
  onRinasaksnummerChanged: PT.func,
  resetValidation: PT.func.isRequired,
  validation: ValidationPropType.isRequired
}

export default DocumentSearch
