import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { PeriodeAnnenForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { AlignStartRow, Column, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface PeriodeAnnenForsikringProps {
  namespace: string
  periode: PeriodeAnnenForsikring
  setPeriode: (p: PeriodeAnnenForsikring, id?: string) => void
  validation: Validation
  addRemove: JSX.Element
}

const PeriodeAnnenForsikringFC: React.FC<PeriodeAnnenForsikringProps> = ({
  namespace,
  periode,
  setPeriode,
  validation,
  addRemove
}: PeriodeAnnenForsikringProps): JSX.Element => {
  const {t} = useTranslation()

  const onAnnenChanged = (annenTypeForsikringsperiode: string) => {
    setPeriode({
      ...periode,
      annenTypeForsikringsperiode: annenTypeForsikringsperiode
    }, 'annenTypeForsikringsperiode')
  }

  return (
    <>
      <AlignStartRow>
        <PeriodeInput<PeriodeAnnenForsikring>
          key={'' + periode?.startdato + periode?.sluttdato}
          namespace={namespace}
          error={{
            startdato: validation[namespace + '-startdato']?.feilmelding,
            sluttdato: validation[namespace + '-sluttdato']?.feilmelding,
          }}
          setPeriode={setPeriode}
          value={periode}
        />
      </AlignStartRow>
      <VerticalSeparatorDiv size='0.5' />
      <AlignStartRow>
        <Column>
          <Input
            feil={validation[namespace + '-annenTypeForsikringsperiode']?.feilmelding}
            namespace={namespace}
            id='annenTypeForsikringsperiode'
            key={'annenTypeForsikringsperiode-' + periode?.annenTypeForsikringsperiode ?? ''}
            label={t('label:virksomhetens-art')}
            onChanged={onAnnenChanged}
            value={periode?.annenTypeForsikringsperiode ?? ''}
          />
        </Column>
        <Column>
          {addRemove}
        </Column>
      </AlignStartRow>
    </>
  )
}

export default PeriodeAnnenForsikringFC
