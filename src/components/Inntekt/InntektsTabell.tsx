import React, { useEffect } from "react";
import { Inntekt } from "declarations/types";
import InntektsTabellRow from "components/Inntekt/InntektsTabellRow";
import TableSorter from "tabell";
import { Item } from "../../../node_modules/tabell/lib/index";
//import EtikettLiten from "./EtikettLiten";

interface InntektsTabellProps {
  inntekter: Inntekt[] | undefined;
}

const InntektsTabell: React.FunctionComponent<InntektsTabellProps> = ({
  inntekter,
}) => {
  const mapInntektTilItem = (inntekt: Inntekt, index: number): Item => {
    return {
      key: index.toString(),
      ...inntekt,
    } as Item;
  };

  useEffect(() => {
    if (inntekter !== undefined) {
      inntekter.forEach((value: any, index: number) => {
        mapInntektTilItem(value, index);
      });
    } else console.log("inntekter useEffect", inntekter);
  }, [inntekter]);

  return (
    <div>
      <table className="tabell">
        <thead>
          <tr>
            <th>Fra Dato</th>
            <th>Til Dato</th>
            <th>Beløp</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {inntekter?.map((inntekt: Inntekt) => (
            <InntektsTabellRow
              fraDato={inntekt.fraDato}
              tilDato={inntekt.tilDato}
              beloep={inntekt.beloep}
              type={inntekt.type}
            />
          ))}
        </tbody>
      </table>
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
        columns={[
          { id: "fraDato", label: "Fra Dato", type: "date", filterText: "" },
          { id: "tilDato", label: "Til Dato", type: "date", filterText: "" },
          { id: "beloep", label: "Beløp", type: "number", filterText: "" },
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
