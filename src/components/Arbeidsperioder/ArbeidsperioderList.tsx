import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import { PeriodeMedForsikring } from 'declarations/sed'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA } from 'declarations/types.d'
import _ from 'lodash'
import { BodyLong } from '@navikt/ds-react'
import { Column, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { arbeidsperioderFraAAToPeriodeMedForsikring } from 'utils/arbeidsperioder'
import ArbeidsperioderBox, { Editable } from './ArbeidsperioderBox'

export interface ArbeidsperioderListProps {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
  editable?: Editable
  fnr: string | undefined
  namespace: string
  personFnr?: string
  onArbeidsgiverSelect: (a: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverEdit?: (a: PeriodeMedForsikring, old: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverDelete?: (a: PeriodeMedForsikring) => void
  searchable?: boolean
  valgteArbeidsperioder: Array<ArbeidsperiodeFraAA>
}

const ArbeidsperioderList: React.FC<ArbeidsperioderListProps> = ({
  arbeidsperioder,
  editable = 'no',
  fnr,
  namespace,
  personFnr,
  onArbeidsgiverSelect,
  onArbeidsgiverEdit = () => {},
  onArbeidsgiverDelete = () => {},
  searchable = false,
  valgteArbeidsperioder
}: ArbeidsperioderListProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Row>
      <Column className='arbeidsgiver'>
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
            const selected: boolean = valgteArbeidsperioder
              ? valgteArbeidsperioder.find((item: ArbeidsperiodeFraAA) =>
              item.arbeidsgiversOrgnr === arbeidsperiode.arbeidsgiversOrgnr &&
              item.fraDato === arbeidsperiode.fraDato && item.tilDato === arbeidsperiode.tilDato) !== undefined
              : false
            const arbeidsgiverAsPeriodeMedForsikring = arbeidsperioderFraAAToPeriodeMedForsikring(arbeidsperiode)
            return (
              <ArbeidsperioderBox
                arbeidsgiver={arbeidsgiverAsPeriodeMedForsikring}
                editable={editable}
                selected={selected}
                key={arbeidsperiode.arbeidsgiversOrgnr + '-' + arbeidsperiode.fraDato + '-' + arbeidsperiode.tilDato}
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

export default ArbeidsperioderList

