import { BodyLong } from '@navikt/ds-react'
import { HorizontalSeparatorDiv, FlexCenterDiv, PileDiv } from '@navikt/hoykontrast'
import ErrorLabel from 'components/Forms/ErrorLabel'
import { Periode } from 'declarations/sed'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toDateFormat } from 'components/DateField/DateField'

export interface PeriodeTextProps {
  periode: Periode | null | undefined
  namespace: string
  error: {
    startdato: string | undefined
    sluttdato: string | undefined
  }
  uiFormat?: string
}

const PeriodeText = ({
  periode,
  namespace,
  error,
  uiFormat = 'DD.MM.YYYY'
}: PeriodeTextProps) => {
  const { t } = useTranslation()
  return (
    <FlexCenterDiv>
      <PileDiv
        tabIndex={0}
        id={namespace + '-startdato'}
      >
        <BodyLong>
          {!_.isEmpty(periode?.startdato)
            ? toDateFormat(periode!.startdato, uiFormat)
            : t('label:ukjent_startdato')}
        </BodyLong>
        <ErrorLabel error={error?.startdato} />
      </PileDiv>
      <HorizontalSeparatorDiv size='0.5' />—
      <HorizontalSeparatorDiv size='0.5' />
      <PileDiv
        tabIndex={0}
        id={namespace + '-sluttdato'}
      >
        <BodyLong>
          {!_.isEmpty(periode?.sluttdato)
            ? toDateFormat(periode!.sluttdato, uiFormat)
            : t('label:' + periode?.aapenPeriodeType)}
        </BodyLong>
        <ErrorLabel error={error?.sluttdato} />
      </PileDiv>
    </FlexCenterDiv>
  )
}

export default PeriodeText
