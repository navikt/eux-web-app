import ArbeidsperioderSøk from 'components/Arbeidsperioder/ArbeidsperioderSøk'
import { ForsikringPeriode } from 'declarations/sed'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA } from 'declarations/types.d'
import _ from 'lodash'
import { BodyLong } from '@navikt/ds-react'
import { Column, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { arbeidsperioderFraAAToForsikringPeriode, getOrgnr } from 'utils/arbeidsperioder'
import ForsikringPeriodeBox, { Editable } from 'components/ForsikringPeriodeBox/ForsikringPeriodeBox'
import { getIdx } from 'utils/namespace'

export interface ArbeidsperioderListProps {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
  editable?: Editable
  fnr: string | undefined
  namespace: string
  onArbeidsgiverSelect: (a: ArbeidsperiodeFraAA, checked: boolean) => void
  searchable?: boolean
  valgteArbeidsperioder: Array<ArbeidsperiodeFraAA>
}

const ArbeidsperioderList: React.FC<ArbeidsperioderListProps> = ({
  arbeidsperioder,
  fnr,
  namespace,
  onArbeidsgiverSelect,
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
            const arbeidsgiverAsForsikringPeriode = arbeidsperioderFraAAToForsikringPeriode(arbeidsperiode)
            const orgnr = getOrgnr(arbeidsgiverAsForsikringPeriode, 'organisasjonsnummer')

            const index = valgteArbeidsperioder?.findIndex((item: ArbeidsperiodeFraAA) => (
              item.arbeidsgiversOrgnr === orgnr &&
              item.fraDato === arbeidsgiverAsForsikringPeriode.startdato &&
              item.tilDato === arbeidsgiverAsForsikringPeriode.sluttdato
            ))

            if (!_.isNil(index) && index >= 0) {
              arbeidsgiverAsForsikringPeriode.__index = index
            }

            return (
              <ForsikringPeriodeBox
                forsikringPeriode={arbeidsgiverAsForsikringPeriode}
                selectable
                showArbeidsgiver
                key={arbeidsperiode.arbeidsgiversOrgnr + '-' + arbeidsperiode.fraDato + '-' + arbeidsperiode.tilDato}
                onForsikringPeriodeSelect={(p: ForsikringPeriode, checked: boolean) => onArbeidsgiverSelect(arbeidsperiode, checked)}
                namespace={namespace + getIdx(arbeidsgiverAsForsikringPeriode.__index)}
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
