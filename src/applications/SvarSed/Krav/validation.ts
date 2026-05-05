import { H021Sed, RefusjonItem } from 'declarations/h021'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkIfNotNumber, checkLength, checkValidDateFormat } from 'utils/validation'

export interface ValidationRefusjonItemProps {
  refusjonItem: RefusjonItem | undefined
  nsIndex?: number
  formalName?: string
}

export interface ValidationKravProps {
  replySed: ReplySed
  formalName?: string
}

export const validateRefusjonItem = (
  v: Validation,
  namespace: string,
  {
    refusjonItem,
    nsIndex,
    formalName
  }: ValidationRefusjonItemProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = nsIndex !== undefined ? `[${nsIndex}]` : ''
  const ns = namespace + idx

  hasErrors.push(checkIfNotEmpty(v, {
    needle: refusjonItem?.henvisningTil,
    id: ns + '-henvisningTil',
    message: 'validation:noHenvisningTil',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: refusjonItem?.utstedelsesdato,
    id: ns + '-utstedelsesdato',
    message: 'validation:noDate',
    personName: formalName
  }))

  hasErrors.push(checkValidDateFormat(v, {
    needle: refusjonItem?.utstedelsesdato,
    id: ns + '-utstedelsesdato',
    message: 'validation:invalidDateFormat',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: refusjonItem?.fakturanummer,
    id: ns + '-fakturanummer',
    message: 'validation:noFakturanummer',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: refusjonItem?.fakturabeloep?.beloep,
    id: ns + '-fakturabeloep-beloep',
    message: 'validation:noBeloep',
    personName: formalName
  }))

  hasErrors.push(checkIfNotNumber(v, {
    needle: refusjonItem?.fakturabeloep?.beloep,
    id: ns + '-fakturabeloep-beloep',
    message: 'validation:invalidBeloep',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: refusjonItem?.fakturabeloep?.valuta,
    id: ns + '-fakturabeloep-valuta',
    message: 'validation:noValuta',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: refusjonItem?.avslag,
    id: ns + '-avslag',
    message: 'validation:noAvslag',
    personName: formalName
  }))

  if (refusjonItem?.avslag === 'delvis_avslag' || refusjonItem?.avslag === 'totalt_avslag') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: refusjonItem?.avslagDetaljer?.avvistBeloep?.beloep,
      id: ns + '-avslagDetaljer-avvistBeloep-beloep',
      message: 'validation:noBeloep',
      personName: formalName
    }))

    hasErrors.push(checkIfNotNumber(v, {
      needle: refusjonItem?.avslagDetaljer?.avvistBeloep?.beloep,
      id: ns + '-avslagDetaljer-avvistBeloep-beloep',
      message: 'validation:invalidBeloep',
      personName: formalName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: refusjonItem?.avslagDetaljer?.avvistBeloep?.valuta,
      id: ns + '-avslagDetaljer-avvistBeloep-valuta',
      message: 'validation:noValuta',
      personName: formalName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: refusjonItem?.avslagDetaljer?.grunn,
      id: ns + '-avslagDetaljer-grunn',
      message: 'validation:noAvslagGrunn',
      personName: formalName
    }))

    if (refusjonItem?.avslagDetaljer?.grunn === 'annet') {
      hasErrors.push(checkIfNotEmpty(v, {
        needle: refusjonItem?.avslagDetaljer?.grunnAnnet,
        id: ns + '-avslagDetaljer-grunnAnnet',
        message: 'validation:noAvslagGrunnAnnet',
        personName: formalName
      }))

      hasErrors.push(checkLength(v, {
        needle: refusjonItem?.avslagDetaljer?.grunnAnnet,
        max: 155,
        id: ns + '-avslagDetaljer-grunnAnnet',
        message: 'validation:textOverX',
        personName: formalName
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateKrav = (
  v: Validation,
  namespace: string,
  {
    replySed,
    formalName
  }: ValidationKravProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H021Sed
  const refusjoner = sed.refusjonskrav?.refusjoner

  if (!refusjoner || refusjoner.length === 0) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: undefined,
      id: namespace + '-refusjoner',
      message: 'validation:noRefusjoner',
      personName: formalName
    }))
  } else {
    refusjoner.forEach((item, index) => {
      hasErrors.push(validateRefusjonItem(v, namespace, {
        refusjonItem: item,
        nsIndex: index,
        formalName
      }))
    })
  }

  return hasErrors.find(value => value) !== undefined
}
