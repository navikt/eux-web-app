import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import { Arbeidsgiver, Arbeidsperioder } from 'declarations/types.d'
import _ from 'lodash'
import { Normaltekst } from 'nav-frontend-typografi'
import { Column, Row } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ArbeidsgiverBox from './ArbeidsgiverBox'

export interface ArbeidsgiverProps {
  arbeidsperioder: Arbeidsperioder | undefined
  editable?: boolean
  getArbeidsperioder?: () => void
  gettingArbeidsperioder?: boolean
  namespace: string
  personFnr?: string
  onArbeidsgiverSelect: (a: Arbeidsgiver, checked: boolean) => void
  onArbeidsgiverEdit?: (a: Arbeidsgiver) => void
  onArbeidsgiverDelete?: (a: Arbeidsgiver) => void
  searchable?: boolean
  valgteArbeidsgivere: Array<Arbeidsgiver>
}

const Arbeidsgivere: React.FC<ArbeidsgiverProps> = ({
  arbeidsperioder,
  editable = false,
  gettingArbeidsperioder = false,
  getArbeidsperioder = () => {},
  namespace,
  personFnr,
  onArbeidsgiverSelect,
  onArbeidsgiverEdit = () => {},
  onArbeidsgiverDelete = () => {},
  searchable = false,
  valgteArbeidsgivere
}: ArbeidsgiverProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Row>
      <Column className='arbeidsgiver'>
        {searchable && !arbeidsperioder && (
          <Row>
            <Column>
              <ArbeidsgiverSøk
                gettingArbeidsperioder={gettingArbeidsperioder}
                getArbeidsperioder={getArbeidsperioder}
              />
            </Column>
          </Row>
        )}
        {arbeidsperioder && arbeidsperioder.arbeidsperioder?.map(
          (arbeidsgiver: Arbeidsgiver) => {
            const selected: boolean = valgteArbeidsgivere
              ? valgteArbeidsgivere.find((item: Arbeidsgiver) => item.arbeidsgiversOrgnr === arbeidsgiver.arbeidsgiversOrgnr) !== undefined
              : false
            return (
              <ArbeidsgiverBox
                arbeidsgiver={arbeidsgiver}
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
          <Normaltekst>
            {t('message:warning-no-arbeidsgiver-found')}
          </Normaltekst>
        )}

      </Column>
    </Row>
  )
}

export default Arbeidsgivere
