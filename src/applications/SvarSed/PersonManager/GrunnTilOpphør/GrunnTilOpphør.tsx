import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OptionTypeBase } from 'react-select'

interface GrunnTilOpphørSelector extends PersonManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): GrunnTilOpphørSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const GrunnTilOpphør: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation
  } = useSelector<State, GrunnTilOpphørSelector>(mapState)
  const dispatch = useDispatch()
  // TODO add target
  const target = 'xxx-grunntilopphør'
  const xxx: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-grunntilopphør`

  const [_årsak, _setÅrsak] = useState<string | undefined>(undefined)

  const årsakOptions: Options = [
    { label: t('el:option-grunntilopphør-01'), value: 'grunntilopphør-01' },
    { label: t('el:option-grunntilopphør-02'), value: 'grunntilopphør-02' },
    { label: t('el:option-grunntilopphør-03'), value: 'grunntilopphør-03' },
    { label: t('el:option-grunntilopphør-04'), value: 'grunntilopphør-04' },
    { label: t('el:option-grunntilopphør-05'), value: 'grunntilopphør-05' },
    { label: t('el:option-grunntilopphør-06'), value: 'grunntilopphør-06' },
    { label: t('el:option-grunntilopphør-07'), value: 'grunntilopphør-07' },
    { label: t('el:option-grunntilopphør-08'), value: 'grunntilopphør-08-annet' }
  ]

  const setÅrsak = (årsak: string) => {
    _setÅrsak(årsak)
    dispatch(updateReplySed(`${target}.årsak`, årsak))
    if (validation[namespace + '-årsak']) {
      dispatch(resetValidation(namespace + '-årsak'))
    }
  }

  const setAnnet = (annet: string) => {
    dispatch(updateReplySed(`${target}.annet`, annet))
    if (validation[namespace + '-annet']) {
      dispatch(resetValidation(namespace + '-annet'))
    }
  }

  const setÅrsakSelvstendig = (årsakselvstendig: string) => {
    dispatch(updateReplySed(`${target}.årsakselvstendig`, årsakselvstendig))
    if (validation[namespace + '-årsakselvstendig']) {
      dispatch(resetValidation(namespace + '-årsakselvstendig'))
    }
  }

  return (
    <PaddedDiv>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:grunn-til-opphør')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <Select
            data-test-id={namespace + '-årsak'}
            feil={validation[namespace + '-årsak']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-årsak'}
            label={t('label:årsak-til-avslutning-av-arbeidsforhold')}
            menuPortalTarget={document.body}
            onChange={(o: OptionTypeBase) => setÅrsak(o.value)}
            options={årsakOptions}
            placeholder={t('el:placeholder-select-default')}
            selectedValue={_.find(årsakOptions, b => b.value === xxx?.årsak)}
            defaultValue={_.find(årsakOptions, b => b.value === xxx?.årsak)}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {_årsak === 'grunntilopphør-08-annet' && (
        <>
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <Input
                feil={validation[namespace + '-annet']?.feilmelding}
                namespace={namespace}
                id='annet'
                label={t('label:annet-opphør') + ' *'}
                onChanged={setAnnet}
                value={xxx?.annet ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <Input
                feil={validation[namespace + '-årsakselvstendig']?.feilmelding}
                namespace={namespace}
                id='årsakselvstendig'
                label={t('label:årsak-til-avslutning-av-selvstendig-næringsvirksomhet') + ' *'}
                onChanged={setÅrsakSelvstendig}
                value={xxx?.årsakselvstendig ?? ''}
              />
            </Column>
          </AlignStartRow>
        </>
      )}
    </PaddedDiv>
  )
}

export default GrunnTilOpphør
