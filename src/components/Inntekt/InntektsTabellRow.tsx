import React from "react";
import { Inntekt } from "declarations/types";

const InnTektsTabellRow: React.StatelessComponent<Inntekt> = ({
  fraDato,
  tilDato,
  beloep,
  type,
}) => {
  return (
    <tr>
      <td>{fraDato}</td>
      <td>{tilDato}</td>
      <td>{beloep}</td>
      <td>{type}</td>
    </tr>
  );
};
export default InnTektsTabellRow;
