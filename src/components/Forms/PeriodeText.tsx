import { BodyLong } from '@navikt/ds-react'
import { HorizontalSeparatorDiv, FlexCenterDiv, PileDiv } from '@navikt/hoykontrast'
import ErrorLabel from 'components/Forms/ErrorLabel'
import { Periode } from 'declarations/sed'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface PeriodeTextProps {
  periode: Periode | null | undefined
  namespace: string
  error: {
    startdato: string | undefined
    sluttdato: string | undefined
  }
}

const PeriodeText = ({
  periode,
  namespace,
  error
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
            ? periode!.startdato
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
            ? periode?.sluttdato
            : periode?.aapenPeriodeType === 'åpen_sluttdato'
              ? t('label:åpen_sluttdato')
              : t('label:ukjent_sluttdato')}
        </BodyLong>
        <ErrorLabel error={error?.sluttdato} />
      </PileDiv>
    </FlexCenterDiv>
  )
}

export default PeriodeText
