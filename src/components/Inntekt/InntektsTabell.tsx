import { Normaltekst } from 'nav-frontend-typografi'
import React from "react";
import { Inntekt } from "declarations/types";
//import InntektsTabellRow from "components/Inntekt/InntektsTabellRow";
import TableSorter, { Item } from "tabell";
//import EtikettLiten from "./EtikettLiten";

interface InntektsTabellProps {
  inntekter: Inntekt[] | undefined;
  onSelectedInntekt: (items: Array<Item>) => void;
}

const InntektsTabell: React.FunctionComponent<InntektsTabellProps> = ({
  inntekter,
  onSelectedInntekt,
}) => {
  const formatterPenger = (penger: number) =>
    `${new Intl.NumberFormat("nb-NO", {
      style: "decimal",
      maximumFractionDigits: 2,
    }).format(penger)} kr`;

  const mapInntektTilItem = (inntekt: Inntekt, index: number): Item => {
    return {
      key: index.toString(),
      ...inntekt,
    } as Item;
  };

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
        animatable={true}
        searchable={true}
        selectable={true}
        sortable={true}
        compact={false}
        onRowSelectChange={onSelectedInntekt}
        columns={[
          { id: "fraDato", label: "Fra Dato", type: "date", filterText: "" },
          { id: "tilDato", label: "Til Dato", type: "date", filterText: "" },
          { id: "beloep", label: "Beløp", type: "object", filterText: "" ,
          renderCell: (item, value) => (
            <Normaltekst>{
              formatterPenger(Number.parseInt(item.beloep, 10))
            }</Normaltekst>
          )
          },
          {
            id: "type",
            label: "Type",
            type: "string",
            filterText: "",
            //renderCell: (item, value) => <EtikettLiten>{value}</EtikettLiten>,
          },
        ]}
      />
    </div>
  );
};
export default InntektsTabell;
