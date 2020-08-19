import React from "react";
import "nav-frontend-tabell-style";
import { Inntekt } from "declarations/types";
import InntektsTabellRow from "components/Inntekt/InntektsTabellRow";
//import { Cell } from "components/StyledComponents";
//import styled from "styled-components";
import { css } from "@emotion/core";

interface InntektsTabellProps {
  inntekter: Inntekt[] | undefined;
}

/*
const TableCell = styled(Cell)`
  display: flex;
  background-color: purple;
`;
*/

const pStyle = css({
  backgroundColor: "purple",
  width: "100%",
});

//className="tabell"

const InntektsTabell: React.FunctionComponent<InntektsTabellProps> = ({
  inntekter,
}) => {
  return (
    <div css={pStyle}>
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
    </div>
  );
};
export default InntektsTabell;
