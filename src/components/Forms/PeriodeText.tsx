import { BodyLong, Label } from '@navikt/ds-react'
import { HorizontalSeparatorDiv, Column, FlexCenterDiv, PileDiv } from '@navikt/hoykontrast'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

const PeriodeText = ({
  periode,
  error
}: any) => {
  const { t } = useTranslation()
  return (
    <Column>
      <FlexCenterDiv>
        <PileDiv>
          <BodyLong id={error?.startdato?.skjemaelementId}>
            {periode?.startdato}
          </BodyLong>
          {error?.startdato?.feilmelding && (
            <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
              {error.startdato.feilmelding}
            </Label>
          )}
        </PileDiv>
        <HorizontalSeparatorDiv />-
        <HorizontalSeparatorDiv />
        <PileDiv>
          <BodyLong id={error?.sluttdato?.skjemaelementId}>
            {!_.isUndefined(periode?.sluttdato)
              ? periode.sluttdato
              : periode.aapenPeriodeType === 'åpen_sluttdato'
                ? t('label:åpen_sluttdato')
                : t('label:ukjent_sluttdato')}
          </BodyLong>
          {error?.sluttdato?.feilmelding && (
            <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
              {error.sluttdato.feilmelding}
            </Label>
          )}
        </PileDiv>
      </FlexCenterDiv>
    </Column>
  )
}

export default PeriodeText
