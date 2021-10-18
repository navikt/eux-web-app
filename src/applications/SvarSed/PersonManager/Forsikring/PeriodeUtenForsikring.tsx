import PeriodeInput from 'components/Forms/PeriodeInput'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { AlignStartRow, Column } from 'nav-hoykontrast'
import React from 'react'

export interface PeriodeUtenForsikringProps {
  namespace: string
  periode: Periode
  setPeriode: (p: Periode, id?: string) => void
  validation: Validation
  addRemove: JSX.Element
}

const PeriodeUtenForsikringFC: React.FC<PeriodeUtenForsikringProps> = ({
   namespace,
   periode,
   setPeriode,
   validation,
   addRemove
 }: PeriodeUtenForsikringProps): JSX.Element => {
return (
    <AlignStartRow>
      <PeriodeInput
        key={'' + periode?.startdato + periode?.sluttdato}
        namespace={namespace}
        error={{
          startdato: validation[namespace + '-startdato']?.feilmelding,
          sluttdato: validation[namespace + '-sluttdato']?.feilmelding,
        }}
        setPeriode={setPeriode}
        value={periode}
      />
      <Column>{addRemove}</Column>
    </AlignStartRow>
  )
}

export default PeriodeUtenForsikringFC
