import { Delete } from '@navikt/ds-icons'
import { Button, Heading } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { GrunnTilOpphør } from 'declarations/sed'
import _ from 'lodash'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const SisteAnsettelseInfo: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  setReplySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, TwoLevelFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'opphoer'
  const sisteAnsettelseInfo: GrunnTilOpphør | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-sisteansettelseinfo`

  const [_typeGrunnOpphoerAnsatt, _setTypeGrunnOpphoerAnsatt] = useState<string | undefined>(undefined)

  const årsakOptions: Options = [
    { label: t('el:option-grunntilopphør-oppsagt_av_arbeidsgiver'), value: 'oppsagt_av_arbeidsgiver' },
    { label: t('el:option-grunntilopphør-arbeidstaker_har_sagt_opp_selv'), value: 'arbeidstaker_har_sagt_opp_selv' },
    { label: t('el:option-grunntilopphør-kontrakten_utløpt'), value: 'kontrakten_utløpt' },
    { label: t('el:option-grunntilopphør-avsluttet_etter_felles_overenskomst'), value: 'avsluttet_etter_felles_overenskomst' },
    { label: t('el:option-grunntilopphør-avskjediget_av_disiplinære_grunner'), value: 'avskjediget_av_disiplinære_grunner' },
    { label: t('el:option-grunntilopphør-overtallighet'), value: 'overtallighet' },
    { label: t('el:option-grunntilopphør-annet-ansettelsesforhold'), value: 'annet-ansettelsesforhold' },
    { label: t('el:option-grunntilopphør-annet-selvstendig'), value: 'annet-selvstendig' }
  ]

  const setTypeGrunnOpphoerAnsatt = (typeGrunnOpphoerAnsatt: string | undefined) => {
    _setTypeGrunnOpphoerAnsatt(typeGrunnOpphoerAnsatt)
    if (typeGrunnOpphoerAnsatt === undefined) {
      dispatch(updateReplySed(target, {}))
    } else {
      const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
      _.set(newReplySed, `${target}.typeGrunnOpphoerAnsatt`, typeGrunnOpphoerAnsatt)
      if (typeGrunnOpphoerAnsatt !== 'annet-ansettelsesforhold') {
        delete newReplySed[target].annenGrunnOpphoerAnsatt
      }
      if (typeGrunnOpphoerAnsatt !== 'annet-selvstendig') {
        delete newReplySed[target].grunnOpphoerSelvstendig
      }
      dispatch(setReplySed(newReplySed!))
    }
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
        {t('label:årsak-til-avsluttet-arbeidsforhold')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column flex='2'>
          <Select
            style={{ width: '100%' }}
            data-testid={namespace + '-typeGrunnOpphoerAnsatt'}
            error={validation[namespace + '-typeGrunnOpphoerAnsatt']?.feilmelding}
            id={namespace + '-typeGrunnOpphoerAnsatt'}
            label={t('label:grunn-type') + ' *'}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setTypeGrunnOpphoerAnsatt((o as Option).value)}
            options={årsakOptions}
            value={_.find(årsakOptions, b => b.value === sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt) ?? null}
            defaultValue={_.find(årsakOptions, b => b.value === sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt)}
          />
        </Column>
        <Column>
          <div style={{ marginTop: '2rem' }}>
            <Button variant='secondary' onClick={() => setTypeGrunnOpphoerAnsatt(undefined)}>
              <Delete />
              {t('el:button-remove')}
            </Button>
          </div>

        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {_typeGrunnOpphoerAnsatt === 'annet-ansettelsesforhold' && (
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-annenGrunnOpphoerAnsatt']?.feilmelding}
              namespace={namespace}
              id='annenGrunnOpphoerAnsatt'
              label={t('label:annen-grunn')}
              onChanged={setAnnenGrunnOpphoerAnsatt}
              value={sisteAnsettelseInfo?.annenGrunnOpphoerAnsatt ?? ''}
            />
          </Column>
        </AlignStartRow>
      )}
      {_typeGrunnOpphoerAnsatt === 'annet-selvstendig' && (
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-årsakselvstendig']?.feilmelding}
              namespace={namespace}
              id='grunnOpphoerSelvstendig'
              label={t('label:årsak-til-avslutning-av-selvstendig-næringsvirksomhet')}
              onChanged={setGrunnOpphoerSelvstendig}
              value={sisteAnsettelseInfo?.grunnOpphoerSelvstendig ?? ''}
            />
          </Column>
        </AlignStartRow>
      )}
    </PaddedDiv>
  )
}

export default SisteAnsettelseInfo
