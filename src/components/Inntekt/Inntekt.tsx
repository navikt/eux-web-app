import * as svarpasedActions from "actions/svarpased";
import { Inntekter, Validation } from "declarations/types";
import { Knapp } from "nav-frontend-knapper";
import { Input, Select } from "nav-frontend-skjema";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  Cell,
  Row,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv,
} from "components/StyledComponents";
import styled from "styled-components";
import _ from "lodash";
import { vaskInputDato } from "utils/dato";
import "nav-frontend-tabell-style";
import InntektsTabell from "components/Inntekt/InntektsTabell";
import { css } from "@emotion/core";

interface InntektProps {
  fnr: string;
  inntekter: Inntekter | undefined;
  onInntektChange: () => void;
}

const AlignCenterCell = styled(Cell)`
  display: flex;
  align-items: center;
`;

const pStyle = css({
  backgroundColor: "purple",
  width: "100%",
});

interface IncomeSearch {
  fraDato: string;
  tilDato: string;
  tema: string;
}

const emptyIncomeSearch = {
  fraDato: "",
  tilDato: "",
  tema: "",
};

const Inntekt: React.FC<InntektProps> = ({
  fnr,
  inntekter,
  onInntektChange,
}: InntektProps) => {
  const { t } = useTranslation();
  const [inntektSøk, setInntektSøk] = useState<IncomeSearch>(emptyIncomeSearch);
  const [validation, setValidation] = useState<{ [k: string]: any }>({});

  const dispatch = useDispatch();

  const fetchInntekt = () => {
    dispatch(
      svarpasedActions.fetchInntekt({
        fnr: fnr,
        fraDato: inntektSøk.fraDato,
        tilDato: inntektSøk.tilDato,
        tema: inntektSøk.tema,
      })
    );
  };

  const updateIncomeSearch = (
    felt: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const value = event.currentTarget.value;
    console.log("updateIncomeSearch", value);
    setInntektSøk({
      ...inntektSøk,
      [felt]: value || "",
    });
  };

  const resetValidation = (key: Array<string> | string): void => {
    const newValidation = _.cloneDeep(validation);
    if (_.isString(key)) {
      newValidation[key] = null;
    }
    if (_.isArray(key)) {
      key.forEach((k) => {
        newValidation[k] = null;
      });
    }
    setValidation(newValidation);
  };

  const updateTema = (felt: string, value: string): void => {
    console.log("update value", value);
    setInntektSøk({
      ...inntektSøk,
      [felt]: value,
    });
  };

  const updateDate = (
    felt: string,
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const nyDato = vaskInputDato(event.currentTarget.value) || "";
    setInntektSøk({
      ...inntektSøk,
      [felt]: nyDato,
    });
  };

  const validate = (): Validation => {
    const validation: Validation = {
      fraDato: inntektSøk.fraDato ? null : "Velg en gyldig dato",
      tilDato: inntektSøk.tilDato ? null : "Velg en gyldig dato",
      tema: inntektSøk.tema ? null : "Du må velge et tema",
    };
    setValidation(validation);
    return validation;
  };

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), (e) => e !== null) === undefined;
  };

  const addSearch = (): void => {
    console.log("addSearch inntektSøk", inntektSøk);
    if (isValid(validate())) {
      console.log("Every thing ready for sending" + validate());
      fetchInntekt();
    }
  };

  return (
    <>
      <Row>
        <Cell className="slideAnimate">
          <Input
            label={t("ui:label-fraDato")}
            feil={validation.fraDato}
            value={inntektSøk.fraDato}
            placeholder="DD.MM.ÅÅÅÅ"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateIncomeSearch("fraDato", e);
              resetValidation("fraDato");
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
              updateDate("fraDato", e)
            }
          />
          <VerticalSeparatorDiv />
        </Cell>
        <HorizontalSeparatorDiv />
        <Cell className="slideAnimate" style={{ animationDelay: "0.4s" }}>
          <Input
            label={t("ui:label-tilDato")}
            feil={validation.tilDato}
            value={inntektSøk.tilDato}
            placeholder="DD.MM.ÅÅÅÅ"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateIncomeSearch("tilDato", e);
              resetValidation("tilDato");
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
              updateDate("tilDato", e)
            }
          />
          <VerticalSeparatorDiv />
        </Cell>
        <HorizontalSeparatorDiv />
        <Cell className="slideAnimate" style={{ animationDelay: "0.5s" }}>
          <Select
            label={t("ui:label-tema")}
            feil={validation.tema}
            value={inntektSøk.tema}
            onChange={(e: any) => {
              updateTema("tema", e.target.value);
              resetValidation("tema");
            }}
          >
            <option value="">{t("ui:form-choose")}</option>
            <option value="BAR" key="BAR">
              Barnetrygd
            </option>
            <option value="KON" key="KON">
              Kontantstøtte
            </option>
          </Select>
          <VerticalSeparatorDiv />
        </Cell>
        <HorizontalSeparatorDiv />
        <AlignCenterCell
          className="slideAnimate"
          style={{ animationDelay: "0.6s" }}
        >
          <Knapp onClick={() => addSearch()}>Søk</Knapp>
          <VerticalSeparatorDiv />
        </AlignCenterCell>
      </Row>
      {!_.isNil(inntekter) && (
        <div>
          <InntektsTabell inntekter={inntekter} css={pStyle}></InntektsTabell>
        </div>
      )}

      {/*inntekter?.map((inntekt: IInntekt) => (
        <>{JSON.stringify(inntekt)}</>
      ))*/}
    </>
  );
};

export default Inntekt;
