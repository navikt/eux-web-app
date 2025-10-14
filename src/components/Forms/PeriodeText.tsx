import {BodyLong, HStack, VStack} from '@navikt/ds-react'
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
    <VStack>
      <HStack align="center" gap="4">
        <div id={namespace + '-startdato'}>
          <BodyLong>
            {!_.isEmpty(periode?.startdato)
              ? toDateFormat(periode!.startdato, uiFormat)
              : t('label:ukjent_startdato')}
          </BodyLong>
        </div>
        —
        <div id={namespace + '-sluttdato'}>
          <BodyLong>
            {!_.isEmpty(periode?.sluttdato)
              ? toDateFormat(periode!.sluttdato, uiFormat)
              : periode?.aapenPeriodeType ? t('label:' + periode?.aapenPeriodeType) : t('label:ukjent_sluttdato')
            }
          </BodyLong>
        </div>
      </HStack>
      <ErrorLabel error={error?.startdato} />
      <ErrorLabel error={error?.sluttdato} />
    </VStack>
  )
}

export default PeriodeText
