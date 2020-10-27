import { Normaltekst } from 'nav-frontend-typografi'
import React from 'react'
import { Inntekt } from '../../declarations/types'
import TableSorter, { Item } from 'tabell'

interface InntektsTabellProps {
  inntekter: Inntekt[] | undefined;
  onSelectedInntekt: (items: Array<Item>) => void;
}

const InntektsTabell: React.FunctionComponent<InntektsTabellProps> = ({
  inntekter,
  onSelectedInntekt
}) => {
  const formatterPenger = (penger: number) =>
    `${new Intl.NumberFormat('nb-NO', {
      style: 'decimal',
      maximumFractionDigits: 2
    }).format(penger)} kr`

  const mapInntektTilItem = (inntekt: Inntekt, index: number): Item => {
    return {
      key: index.toString(),
      ...inntekt
    } as Item
  }

  return (
    <div>
      <TableSorter
        items={
          inntekter
            ? inntekter.map((inntekt: Inntekt, index: number) =>
              mapInntektTilItem(inntekt, index)
            )
            : []
        }
        itemsPerPage={10}
        loading={false}
        animatable
        searchable
        selectable
        sortable
        compact={false}
        onRowSelectChange={onSelectedInntekt}
        columns={[
          { id: 'fraDato', label: 'Fra Dato', type: 'date', filterText: '' },
          { id: 'tilDato', label: 'Til Dato', type: 'date', filterText: '' },
          {
            id: 'beloep',
            label: 'Beløp',
            type: 'object',
            filterText: '',
            renderCell: (item) => (
              <Normaltekst>
                {formatterPenger(Number.parseInt(item.beloep, 10))}
              </Normaltekst>
            )
          },
          {
            id: 'type',
            label: 'Type',
            type: 'string',
            filterText: ''
          }
        ]}
      />
    </div>
  )
}
export default InntektsTabell
