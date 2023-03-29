import React from "react";
import {Sak} from "../../declarations/types";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {Heading, Panel} from "@navikt/ds-react";
import {HorizontalLineSeparator} from "../../components/StyledComponents";
import {useTranslation} from "react-i18next";

export interface InnhentMerInfoPanelProps {
  sak: Sak
}

export const InnhentMerInfoPanel = ({ sak }: InnhentMerInfoPanelProps) => {
  const { t } = useTranslation()

  return (
    <Panel border>
      <Heading size='small'>
        {t('label:innhent-mer-info') + " " + sak.sakId}
      </Heading>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
    </Panel>
  )
}

export default InnhentMerInfoPanel
