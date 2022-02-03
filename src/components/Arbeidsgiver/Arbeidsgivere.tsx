import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import { PeriodeMedForsikring } from 'declarations/sed'
import { Arbeidsgiver, Arbeidsperioder } from 'declarations/types.d'
import _ from 'lodash'
import { BodyLong } from '@navikt/ds-react'
import { Column, Row } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { arbeidsgiverToPeriodeMedForsikring } from 'utils/arbeidsgiver'
import ArbeidsgiverBox, { Editable } from './ArbeidsgiverBox'

export interface ArbeidsgivereProps {
  arbeidsperioder: Arbeidsperioder | null | undefined
  editable?: Editable
  fnr: string | undefined
  namespace: string
  personFnr?: string
  onArbeidsgiverSelect: (a: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverEdit?: (a: PeriodeMedForsikring, old: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverDelete?: (a: PeriodeMedForsikring) => void
  searchable?: boolean
  valgteArbeidsgivere: Array<Arbeidsgiver>
}

const Arbeidsgivere: React.FC<ArbeidsgivereProps> = ({
  arbeidsperioder,
  editable = 'no',
  fnr,
  namespace,
  personFnr,
  onArbeidsgiverSelect,
  onArbeidsgiverEdit = () => {},
  onArbeidsgiverDelete = () => {},
  searchable = false,
  valgteArbeidsgivere
}: ArbeidsgivereProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Row>
      <Column className='arbeidsgiver'>
        {searchable && !arbeidsperioder && (
          <Row>
            <Column>
              <ArbeidsgiverSøk
                fnr={fnr}
                namespace={namespace}
              />
            </Column>
          </Row>
        )}
        {arbeidsperioder && arbeidsperioder.arbeidsperioder?.map(
          (arbeidsgiver: Arbeidsgiver) => {
            const selected: boolean = valgteArbeidsgivere
              ? valgteArbeidsgivere.find((item: Arbeidsgiver) => item.arbeidsgiversOrgnr === arbeidsgiver.arbeidsgiversOrgnr) !== undefined
              : false
            const arbeidsgiverAsPeriodeMedForsikring = arbeidsgiverToPeriodeMedForsikring(arbeidsgiver)
            return (
              <ArbeidsgiverBox
                arbeidsgiver={arbeidsgiverAsPeriodeMedForsikring}
                editable={editable}
                selected={selected}
                key={arbeidsgiver.arbeidsgiversOrgnr}
                onArbeidsgiverSelect={onArbeidsgiverSelect}
                onArbeidsgiverDelete={onArbeidsgiverDelete}
                onArbeidsgiverEdit={onArbeidsgiverEdit}
                namespace={namespace}
                personFnr={personFnr}
              />
            )
          }

        ).filter(e => e !== undefined)}
        {arbeidsperioder && _.isEmpty(arbeidsperioder) && (
          <BodyLong>
            {t('message:warning-no-arbeidsgiver-found')}
          </BodyLong>
        )}

      </Column>
    </Row>
  )
}

export default Arbeidsgivere
