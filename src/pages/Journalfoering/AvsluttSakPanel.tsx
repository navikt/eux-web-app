import React from "react";
import {Sak} from "../../declarations/types";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {Heading, Panel} from "@navikt/ds-react";
import {HorizontalLineSeparator} from "../../components/StyledComponents";
import {useTranslation} from "react-i18next";

export interface AvsluttSakPanelProps {
  sak: Sak
}

export const AvsluttSakPanel = ({ sak }: AvsluttSakPanelProps) => {
  const { t } = useTranslation()

  return (
    <Panel border>
      <Heading size='small'>
        {t('label:avslutt-sak')}
      </Heading>
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
    </Panel>
  )
}

export default AvsluttSakPanel
