import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import { PeriodeMedForsikring } from 'declarations/sed'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA } from 'declarations/types.d'
import _ from 'lodash'
import { BodyLong } from '@navikt/ds-react'
import { Column, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { arbeidsperioderFraAAToPeriodeMedForsikring, getOrgnr } from 'utils/arbeidsperioder'
import ArbeidsperioderBox, { Editable } from './ArbeidsperioderBox'

export interface ArbeidsperioderListProps {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
  editable?: Editable
  fnr: string | undefined
  namespace: string
  onArbeidsgiverSelect: (a: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverEdit?: (a: PeriodeMedForsikring, old: PeriodeMedForsikring) => void
  onArbeidsgiverDelete?: (a: PeriodeMedForsikring) => void
  searchable?: boolean
  valgteArbeidsperioder: Array<ArbeidsperiodeFraAA>
}

const ArbeidsperioderList: React.FC<ArbeidsperioderListProps> = ({
  arbeidsperioder,
  editable = 'no',
  fnr,
  namespace,
  onArbeidsgiverSelect,
  onArbeidsgiverEdit = () => {},
  onArbeidsgiverDelete = () => {},
  searchable = false,
  valgteArbeidsperioder
}: ArbeidsperioderListProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Row>
      <Column>
        {searchable && (
          <Row>
            <Column>
              <ArbeidsperioderSøk
                fnr={fnr}
                namespace={namespace}
              />
            </Column>
          </Row>
        )}
        {!_.isEmpty(arbeidsperioder) && <VerticalSeparatorDiv size='2' />}
        {arbeidsperioder && arbeidsperioder.arbeidsperioder?.map(
          (arbeidsperiode: ArbeidsperiodeFraAA) => {

            const arbeidsgiverAsPeriodeMedForsikring = arbeidsperioderFraAAToPeriodeMedForsikring(arbeidsperiode)
            const orgnr = getOrgnr(arbeidsgiverAsPeriodeMedForsikring, 'organisasjonsnummer')

            const index = valgteArbeidsperioder?.findIndex((item: ArbeidsperiodeFraAA) => (
              item.arbeidsgiversOrgnr === orgnr &&
              item.fraDato === arbeidsgiverAsPeriodeMedForsikring.startdato &&
              item.tilDato === arbeidsperiode.tilDato
            ))

            if (!_.isNil(index) && index >= 0) {
              arbeidsgiverAsPeriodeMedForsikring.__index = index
            }

            return (
              <ArbeidsperioderBox
                periodeMedForsikring={arbeidsgiverAsPeriodeMedForsikring}
                editable={editable}
                key={arbeidsperiode.arbeidsgiversOrgnr + '-' + arbeidsperiode.fraDato + '-' + arbeidsperiode.tilDato}
                onPeriodeMedForsikringSelect={onArbeidsgiverSelect}
                onPeriodeMedForsikringDelete={onArbeidsgiverDelete}
                onPeriodeMedForsikringEdit={onArbeidsgiverEdit}
                namespace={namespace}
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

export default ArbeidsperioderList
