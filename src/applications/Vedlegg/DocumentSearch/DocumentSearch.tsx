import { BodyLong, Loader, Search, Select } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import * as vedleggActions from 'actions/vedlegg'
import { State } from 'declarations/reducers'
import { Dokument, Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { Column, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

export interface DocumentSearchSelector {
  dokument: Array<Dokument> | null | undefined
  gettingDokument: boolean
  rinadokumentID: string | undefined
  rinasaksnummer: string | undefined
}

export interface DocumentSearchProps {
  className?: string
  parentNamespace: string
  resetValidation: (k: string) => ActionWithPayload
  validation: Validation
}

const mapState = (state: State): DocumentSearchSelector => ({
  dokument: state.vedlegg.dokument,
  gettingDokument: state.loading.gettingDokument,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  rinadokumentID: state.vedlegg.rinadokumentID
})

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  className, parentNamespace, resetValidation, validation = {}
}: DocumentSearchProps): JSX.Element => {
  const { dokument, gettingDokument, rinasaksnummer, rinadokumentID }: DocumentSearchSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const namespace = parentNamespace + '-documentSearch'

  const sokEtterDokument = (): void => {
    if (rinasaksnummer) {
      dispatch(vedleggActions.getDokument(rinasaksnummer))
    }
  }

  const setRinaSaksnummer = (newRinaSaksnummer: string): void => {
    if (!_.isNil(dokument)) {
      dispatch(vedleggActions.propertySet('dokument', undefined))
      if (validation[namespace + '-dokument']) {
        dispatch(resetValidation(namespace + '-dokument'))
      }
    }
    dispatch(vedleggActions.propertySet('rinasaksnummer', newRinaSaksnummer))
    if (validation[namespace + '-rinasaksnummer']) {
      dispatch(resetValidation(namespace + '-rinasaksnummer'))
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
    <>
      <Column className={className}>
        <Search
          label={t('label:rina-saksnummer')}
          /* error={validation[namespace + '-rinasaksnummer']?.feilmelding} */
          data-testid={namespace + '-rinasaksnummer'}
          id={namespace + '-rinasaksnummer'}
          hideLabel={false}
          onChange={setRinaSaksnummer}
          value={rinasaksnummer || ''}
          disabled={gettingDokument}
        >
          <Search.Button onClick={sokEtterDokument}>
            {gettingDokument ? t('message:loading-searching') : t('el:button-search')}
            {gettingDokument && <Loader />}
          </Search.Button>
        </Search>
        {validation[namespace + '-rinasaksnummer']?.feilmelding && (
          <>
            <VerticalSeparatorDiv size='0.5' />
            <span className='navds-error-message navds-error-message--medium'>
              {validation[namespace + '-rinasaksnummer']?.feilmelding}
            </span>
          </>
        )}
        <VerticalSeparatorDiv />
      </Column>
      <Column>
        <div data-testid='dokumentsok__card'>
          <Select
            data-testid={namespace + '-rinadokumentID'}
            id={namespace + '-rinadokumentID'}
            disabled={_.isNil(dokument)}
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
      </Column>
    </>
  )
}

export default DocumentSearch
