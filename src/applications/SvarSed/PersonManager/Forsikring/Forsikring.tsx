import Arbeidsforhold from 'applications/SvarSed/PersonManager/Arbeidsforhold/Arbeidsforhold'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import Stack from 'components/Stack/Stack'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { ReplySed } from 'declarations/sed'
import { Arbeidsperioder, Validation } from 'declarations/types'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'

interface ForsikringProps {
  arbeidsperioder: Arbeidsperioder
  getArbeidsperioder: () => void
  gettingArbeidsperioder: boolean
  inntekter: any
  getInntekter: () => void
  highContrast: boolean
  gettingInntekter: boolean
  parentNamespace: string
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Forsikring: React.FC<ForsikringProps> = ({
  arbeidsperioder,
  getArbeidsperioder,
  gettingArbeidsperioder,
  inntekter,
  getInntekter,
  gettingInntekter,
  highContrast,
  parentNamespace,
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}:ForsikringProps): JSX.Element => {
  const { t } = useTranslation()
  // TODO add target
  // const target = 'xxx-forsikring'
  // const xxx: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-forsikring`

  const [_periodeType, setPeriodeType] = useState<Array<string>>([])

  const periodeOptions: Options = [
    { label: t('el:option-forsikring-1'), value: 'forsikring-1' },
    { label: t('el:option-forsikring-2'), value: 'forsikring-2' },
    { label: t('el:option-forsikring-3'), value: 'forsikring-3' },
    { label: t('el:option-forsikring-4'), value: 'forsikring-4' },
    { label: t('el:option-forsikring-5'), value: 'forsikring-5' },
    { label: t('el:option-forsikring-6'), value: 'forsikring-6' },
    { label: t('el:option-forsikring-7'), value: 'forsikring-7' },
    { label: t('el:option-forsikring-8'), value: 'forsikring-8' },
    { label: t('el:option-forsikring-9'), value: 'forsikring-9' },
    { label: t('el:option-forsikring-10'), value: 'forsikring-10' }
  ]
  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:forsikring')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <Stack
            feil={undefined}
            highContrast={highContrast}
            initialValues={_periodeType}
            itemLabel={t('label:periode')}
            namespace='formål'
            options={periodeOptions}
            onChange={setPeriodeType}
            selectLabel={t('label:type-periode')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='2' />
      {_periodeType.map(type => (
        <div key={type}>
          <ExpandingPanel
            open
            renderContentWhenClosed
            highContrast={highContrast}
            heading={(
              <Undertittel>
                {_.find(periodeOptions, p => p.value === type)?.label}
              </Undertittel>
          )}
          >
            <Arbeidsforhold
              arbeidsperioder={arbeidsperioder}
              gettingArbeidsperioder={gettingArbeidsperioder}
              getArbeidsperioder={getArbeidsperioder}
              inntekter={inntekter}
              gettingInntekter={gettingInntekter}
              getInntekter={getInntekter}
              highContrast={highContrast}
              parentNamespace={namespace}
              personID={personID}
              replySed={replySed}
              resetValidation={resetValidation}
              updateReplySed={updateReplySed}
              validation={validation}
            />
          </ExpandingPanel>
          <VerticalSeparatorDiv data-size='2' />
        </div>
      ))}
    </PaddedDiv>
  )
}

export default Forsikring
