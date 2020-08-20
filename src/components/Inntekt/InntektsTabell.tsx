import React from "react";
import { Inntekt } from "declarations/types";
import InntektsTabellRow from "components/Inntekt/InntektsTabellRow";

interface InntektsTabellProps {
  inntekter: Inntekt[] | undefined;
}

const InntektsTabell: React.FunctionComponent<InntektsTabellProps> = ({
  inntekter,
}) => {
  return (
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
  );
};
export default InntektsTabell;
