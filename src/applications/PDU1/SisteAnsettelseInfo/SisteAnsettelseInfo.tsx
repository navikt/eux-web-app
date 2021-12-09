import { Heading } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const SisteAnsettelseInfo: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'sisteAnsettelseInfo'
  const grunntilopphor: any = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-sisteAnsettelseInfo`

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
    <PaddedDiv key={namespace + '-div'}>
      <Heading size='medium'>
        {t('label:siste-ansettelse-info')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <Select
            data-test-id={namespace + '-typeGrunnOpphoerAnsatt'}
            error={validation[namespace + '-typeGrunnOpphoerAnsatt']?.feilmelding}
            id={namespace + '-typeGrunnOpphoerAnsatt'}
            label={t('label:årsak-til-avslutning-av-arbeidsforhold')}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setTypeGrunnOpphoerAnsatt((o as Option).value)}
            options={årsakOptions}
            value={_.find(årsakOptions, b => b.value === grunntilopphor?.typeGrunnOpphoerAnsatt)}
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
                error={validation[namespace + '-annenGrunnOpphoerAnsatt']?.feilmelding}
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
                error={validation[namespace + '-årsakselvstendig']?.feilmelding}
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

export default SisteAnsettelseInfo
