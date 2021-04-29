import ArbeidsgiverSøk from 'components/Arbeidsgiver/ArbeidsgiverSøk'
import { Arbeidsgiver, Arbeidsperioder } from 'declarations/types.d'
import { Column, Row } from 'nav-hoykontrast'
import React from 'react'
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
              ? valgteArbeidsgivere.find((item: Arbeidsgiver) => item.arbeidsgiverOrgnr === arbeidsgiver.arbeidsgiverOrgnr) !== undefined
              : false
            return (
              <ArbeidsgiverBox
                arbeidsgiver={arbeidsgiver}
                editable={editable}
                selected={selected}
                key={arbeidsgiver.arbeidsgiverOrgnr}
                onArbeidsgiverSelect={onArbeidsgiverSelect}
                onArbeidsgiverDelete={onArbeidsgiverDelete}
                onArbeidsgiverEdit={onArbeidsgiverEdit}
                namespace={namespace}
                personFnr={personFnr}
              />
            )
          }

        ).filter(e => e !== undefined)}
      </Column>
    </Row>
  )
}

export default Arbeidsgivere
