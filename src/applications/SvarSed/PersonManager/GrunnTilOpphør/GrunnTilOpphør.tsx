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
  const target = 'grunntilopphor'
  const grunntilopphor: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-grunntilopphør`

  const [_typeGrunnOpphoerAnsatt, _setTypeGrunnOpphoerAnsatt] = useState<string | undefined>(undefined)

  const årsakOptions: Options = [
    { label: t('el:option-grunntilopphør-oppsagt_av_arbeidsgiver'), value: '01' },
    { label: t('el:option-grunntilopphør-arbeidstaker_har_sagt_opp_selv'), value: '02' },
    { label: t('el:option-grunntilopphør-kontrakten_utløpt'), value: '03' },
    { label: t('el:option-grunntilopphør-avsluttet_etter_felles_overenskomst'), value: '04' },
    { label: t('el:option-grunntilopphør-avskjediget_av_disiplinære_grunner'), value: '05' },
    { label: t('el:option-grunntilopphør-overtallighet'), value: '06' },
    { label: t('el:option-grunntilopphør-ukjent'), value: '98' },
    { label: t('el:option-grunntilopphør-annet'), value: '99' }
  ]

  const setTypeGrunnOpphoerAnsatt = (typeGrunnOpphoerAnsatt: string) => {
    _setTypeGrunnOpphoerAnsatt(typeGrunnOpphoerAnsatt)
    dispatch(updateReplySed(`${target}.typeGrunnOpphoerAnsatt`, typeGrunnOpphoerAnsatt))
    if (validation[namespace + '-typeGrunnOpphoerAnsatt']) {
      dispatch(resetValidation(namespace + '-typeGrunnOpphoerAnsatt'))
    }
  }

  const setAnnenGrunnOpphoerAnsatt = (annenGrunnOpphoerAnsatt: string) => {
    dispatch(updateReplySed(`${target}.annenGrunnOpphoerAnsatt`, annenGrunnOpphoerAnsatt))
    if (validation[namespace + '-annenGrunnOpphoerAnsatt']) {
      dispatch(resetValidation(namespace + '-annenGrunnOpphoerAnsatt'))
    }
  }

  const setGrunnOpphoerSelvstendig = (grunnOpphoerSelvstendig: string) => {
    dispatch(updateReplySed(`${target}.grunnOpphoerSelvstendig`, grunnOpphoerSelvstendig))
    if (validation[namespace + '-grunnOpphoerSelvstendig']) {
      dispatch(resetValidation(namespace + '-grunnOpphoerSelvstendig'))
    }
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:grunn-til-opphør')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <Select
            data-test-id={namespace + '-typeGrunnOpphoerAnsatt'}
            feil={validation[namespace + '-typeGrunnOpphoerAnsatt']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-typeGrunnOpphoerAnsatt'}
            label={t('label:årsak-til-avslutning-av-arbeidsforhold')}
            menuPortalTarget={document.body}
            onChange={(o: OptionTypeBase) => setTypeGrunnOpphoerAnsatt(o.value)}
            options={årsakOptions}
            placeholder={t('el:placeholder-select-default')}
            selectedValue={_.find(årsakOptions, b => b.value === grunntilopphor?.typeGrunnOpphoerAnsatt)}
            defaultValue={_.find(årsakOptions, b => b.value === grunntilopphor?.typeGrunnOpphoerAnsatt)}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {_typeGrunnOpphoerAnsatt === '99' && (
        <>
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <Input
                feil={validation[namespace + '-annenGrunnOpphoerAnsatt']?.feilmelding}
                namespace={namespace}
                id='annenGrunnOpphoerAnsatt'
                label={t('label:annet-opphør') + ' *'}
                onChanged={setAnnenGrunnOpphoerAnsatt}
                value={grunntilopphor?.annenGrunnOpphoerAnsatt ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
            <Column>
              <Input
                feil={validation[namespace + '-årsakselvstendig']?.feilmelding}
                namespace={namespace}
                id='grunnOpphoerSelvstendig'
                label={t('label:årsak-til-avslutning-av-selvstendig-næringsvirksomhet') + ' *'}
                onChanged={setGrunnOpphoerSelvstendig}
                value={grunntilopphor?.grunnOpphoerSelvstendig ?? ''}
              />
            </Column>
          </AlignStartRow>
        </>
      )}
    </PaddedDiv>
  )
}

export default GrunnTilOpphør
