import { AlignStartRow, FlexDiv, PileDiv } from 'components/StyledComponents'
import { IInntekt, IInntekter } from 'declarations/types'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastLink, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import TableSorter, { Column as TableColumn, Item } from 'tabell'
import { formatterPenger } from 'utils/PengeUtils'

export interface InntektProps {
  highContrast: boolean
  inntekter: IInntekter
  personID: string
}

const ArbeidsgiverDiv = styled(FlexDiv)`
 background-color: whitesmoke;
 justify-content: space-between;
 padding: 1rem;
`
const CustomTableSorter = styled(TableSorter)`
  table-layout: fixed;
  th, tr {
    width: 16.666%;
  }
`
const Inntekt: React.FC<InntektProps> = ({
  highContrast,
  inntekter,
  personID
}:InntektProps) => {
  const { t } = useTranslation()

  return (
    <>
      {inntekter?.map((inntekt: IInntekt, index) => {
        const _items: Array<Item> = [
          { key: '1', col0: ' ', col1: ' ', col2: ' ', col3: ' ', col4: ' ', avg: formatterPenger(inntekt.gjennomsnitt) }
        ]
        const _columns: Array<TableColumn> = [
          { id: 'col0', label: ' ', type: 'string' },
          { id: 'col1', label: ' ', type: 'string' },
          { id: 'col2', label: ' ', type: 'string' },
          { id: 'col3', label: ' ', type: 'string' },
          { id: 'col4', label: ' ', type: 'string' },
          { id: 'avg', label: t('label:gjennomsnitt'), type: 'string' }
        ]

        inntekt.lønn.forEach((lønn, i) => {
          const matchingColumn = 'col' + (5 - inntekt.lønn.length + i)
          const targetColumn = _.find(_columns, (c: TableColumn) => c.id === matchingColumn)
          if (targetColumn) {
            targetColumn.label = lønn.fra
          }
          _items[0][matchingColumn] = formatterPenger(lønn.beloep)
        })

        return (
          <div key={index}>
            <AlignStartRow>
              <Column>
                <ArbeidsgiverDiv>
                  <PileDiv>
                    <Undertittel>
                      {inntekt.arbeidsgiver.navn}
                    </Undertittel>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:orgnr')}</Normaltekst></span>
                    <span><Normaltekst>{inntekt.arbeidsgiver.orgnr}</Normaltekst></span>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:stillingprosent')}</Normaltekst></span>
                    <span><Normaltekst>{inntekt.arbeidsgiver.prosent}</Normaltekst></span>
                  </PileDiv>
                  <PileDiv>
                    <span><Normaltekst>{t('label:siste-lønnsendring')}</Normaltekst></span>
                    <span><Normaltekst>{inntekt.arbeidsgiver.sisteLønn}</Normaltekst></span>
                  </PileDiv>
                </ArbeidsgiverDiv>
                <CustomTableSorter
                  key={personID}
                  highContrast={highContrast}
                  context={{ items: _items }}
                  items={_items}
                  compact
                  searchable={false}
                  sortable={false}
                  striped={false}
                  columns={_columns}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv data-size='0.5' />
            <AlignStartRow>
              <Column>
                <HighContrastLink href='#'>
                  {t('label:gå-til-A-inntekt')}
                </HighContrastLink>
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv data-size='2' />
          </div>
        )
      }
      )}
    </>
  )
}

export default Inntekt
