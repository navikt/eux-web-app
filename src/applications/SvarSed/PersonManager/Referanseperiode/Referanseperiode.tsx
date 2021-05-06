import Period from 'components/Period/Period'
import { Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, AlignStartRow, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface ReferanseperiodeProps {
  personID: string
  parentNamespace: string,
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Referanseperiode: React.FC<ReferanseperiodeProps> = ({
  personID,
  parentNamespace,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:ReferanseperiodeProps): JSX.Element => {
  const { t } = useTranslation()
  const target = 'anmodningsperiode'
  const anmodningsperiode: Periode = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-referanseperiode`

  const setStartDato = (startdato: string) => {
    updateReplySed(`${target}.startdato`, startdato.trim())
    if (validation[namespace + '-startdato']) {
      resetValidation(namespace + '-startdato')
    }
  }

  const setSluttDato = (sluttdato: string) => {
    const newAnmodningsperiode: Periode = _.cloneDeep(anmodningsperiode)
    if (sluttdato === '') {
      delete newAnmodningsperiode.sluttdato
      newAnmodningsperiode.aapenPeriodeType = 'åpen_sluttdato'
    } else {
      delete newAnmodningsperiode.aapenPeriodeType
      newAnmodningsperiode.sluttdato = sluttdato.trim()
    }
    updateReplySed(target, newAnmodningsperiode)
    if (validation[namespace + '-sluttdato']) {
      resetValidation(namespace + '-sluttdato')
    }
  }

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:referanseperiode')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Period
          key={'' + anmodningsperiode?.startdato + anmodningsperiode?.sluttdato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={anmodningsperiode?.startdato ?? ''}
          valueSluttDato={anmodningsperiode?.sluttdato ?? ''}
        />
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default Referanseperiode
