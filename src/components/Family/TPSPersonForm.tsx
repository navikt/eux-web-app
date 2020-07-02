import classNames from "classnames";
import PersonCard from "components/PersonCard/PersonCard";
import * as types from "constants/actionTypes";
import { FamilieRelasjon, Kodeverk, Person } from "declarations/types";
import { KodeverkPropType } from "declarations/types.pt";
import Ui from "eessi-pensjon-ui";
import _ from "lodash";
import PT from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./TPSPersonForm.css";

export interface TPSPersonFormProps {
  alertStatus: string | undefined;
  alertMessage: string | undefined;
  alertType: string | undefined;
  className?: string;
  onAddFailure: () => void;
  onAlertClose: () => void;
  onAddSuccess: (e: any) => void;
  onResetPersonRelatert: () => void;
  personRelatert: Person | undefined;
  person: Person;
  rolleList: Array<Kodeverk>;
  existingFamilyRelationships: Array<FamilieRelasjon>;
}

const TPSPersonForm: React.FC<TPSPersonFormProps> = ({
  alertStatus,
  alertMessage,
  alertType,
  className,
  onAddFailure,
  onAddSuccess,
  onAlertClose,
  onResetPersonRelatert,
  personRelatert,
  person,
  rolleList,
  existingFamilyRelationships,
}: TPSPersonFormProps): JSX.Element => {
  const [sok, setSok] = useState("");
  const [_personRelatert, setPersonRelatert] = useState<
    FamilieRelasjon | undefined
  >(undefined);
  const [tpsperson, setTpsPerson] = useState<FamilieRelasjon | undefined>(
    undefined
  );

  const { t } = useTranslation();

  const sokEtterFnr = () => {
    //dispatch(sakActions.resetPersonRelatert())
    setPersonRelatert(undefined);
    setTpsPerson(undefined);
    //dispatch(sakActions.getPersonRelated(sok))
  };

  useEffect(() => {
    if (personRelatert && !_personRelatert) {
      // Fjern relasjoner array, NOTE! det er kun relasjoner som har rolle.
      const person = _.omit(personRelatert, "relasjoner");
      const tpsperson =
        personRelatert && personRelatert.relasjoner
          ? personRelatert.relasjoner.find(
              (elem: FamilieRelasjon) => elem.fnr === person.fnr
            )
          : undefined;
      setTpsPerson(tpsperson);
      if (!tpsperson) {
        setPersonRelatert(person);
      } else {
        if (onResetPersonRelatert) {
          onResetPersonRelatert()
        }
        setPersonRelatert(undefined);
      }
    }
  }, [personRelatert, _personRelatert]);

  const updateSok = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSok(e.target.value);
    setPersonRelatert(undefined);
    if (onResetPersonRelatert) {
      onResetPersonRelatert()
    }
  };

  const conflictingPerson = (): boolean => {
    const { fnr } = _personRelatert!;
    if (
      _.find(existingFamilyRelationships, (f) => f.fnr === fnr) !== undefined
    ) {
       if (onAddFailure) {
         onAddFailure()
       }
      return true;
    }
    return false;
  };

  const leggTilPersonOgRolle = (person: FamilieRelasjon) => {
    if (!conflictingPerson()) {
      setSok("");
      setPersonRelatert(undefined);
      setTpsPerson(undefined);
      if (onResetPersonRelatert) {
        onResetPersonRelatert()
      }
      /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
      if (onAddSuccess) {
        onAddSuccess({
          ...person,
          nasjonalitet: "NO",
        })
      }
    }
  };

  return (
    <div className="mt-4 mb-4">
      <div
        className={classNames(className, "c-TPSPersonForm", "slideAnimate", {
          feil: !!alertMessage,
        })}
      >
        <div className="w-50 mr-3">
          <Ui.Nav.Input
            id="c-TPSPersonForm__input-fnr-or-dnr-id"
            label={t("ui:label-fnr-or-dnr")}
            placeholder={t("ui:label-fnr-or-dnr")}
            value={sok}
            onChange={updateSok}
          />
        </div>
        <div className="w-50">
          <Ui.Nav.Knapp
            disabled={person.fnr === sok}
            className="annenpersonsok__knapp"
            onClick={sokEtterFnr}
          >
            {t("ui:form-search")}
          </Ui.Nav.Knapp>
        </div>
      </div>
      {person.fnr === sok ? (
        <div className="m-2">
          <Ui.Nav.AlertStripe className="w-50 mt-4 mb-4" type="advarsel">
            {t("ui:error-fnr-is-user", { sok: sok })}
          </Ui.Nav.AlertStripe>
        </div>
      ) : null}
      {tpsperson ? (
        <div className="m-2">
          <Ui.Nav.AlertStripe className="mt-4 mb-4" type="advarsel">
            {t("ui:error-relation-already-in-tps")}
          </Ui.Nav.AlertStripe>
        </div>
      ) : null}
      {alertMessage &&
        (alertType === types.SAK_PERSON_RELATERT_GET_FAILURE ||
          alertType === types.FORM_TPSPERSON_ADD_FAILURE) && (
          <div className="m-2">
            <Ui.Alert
              className="mt-4 mb-4 w-50"
              type="client"
              fixed={false}
              message={t(alertMessage)}
              status={alertStatus}
              onClose={onAlertClose}
            />
          </div>
        )}
      {_personRelatert ? (
        <div className="m-2">
          <PersonCard
            person={_personRelatert}
            onAddClick={leggTilPersonOgRolle}
            rolleList={rolleList}
          />
        </div>
      ) : null}
    </div>
  );
};

TPSPersonForm.propTypes = {
  className: PT.string,
  rolleList: PT.arrayOf(KodeverkPropType.isRequired).isRequired,
};

export default TPSPersonForm;
