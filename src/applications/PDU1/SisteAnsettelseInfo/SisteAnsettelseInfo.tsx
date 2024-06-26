import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import {
  validateSisteAnsettelseinfo,
  ValidationSisteAnsettelseinfoProps
} from 'applications/PDU1/SisteAnsettelseInfo/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { SisteAnsettelseInfo } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SisteAnsettelseInfoFC: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  setReplySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'opphoer'
  const sisteAnsettelseInfo: SisteAnsettelseInfo | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-sisteansettelseinfo`

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

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationSisteAnsettelseinfoProps>(
      clonedvalidation, namespace, validateSisteAnsettelseinfo, {
        sisteAnsettelseInfo
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setTypeGrunnOpphoerAnsatt = (typeGrunnOpphoerAnsatt: string | undefined) => {
    _setTypeGrunnOpphoerAnsatt(typeGrunnOpphoerAnsatt)
    if (typeGrunnOpphoerAnsatt === undefined || _.isEmpty(typeGrunnOpphoerAnsatt?.trim())) {
      dispatch(updateReplySed(target, {}))
    } else {
      const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
      _.set(newReplySed, `${target}.typeGrunnOpphoerAnsatt`, typeGrunnOpphoerAnsatt.trim())
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
    dispatch(updateReplySed(`${target}.annenGrunnOpphoerAnsatt`, annenGrunnOpphoerAnsatt.trim()))
    if (validation[namespace + '-annenGrunnOpphoerAnsatt']) {
      dispatch(resetValidation(namespace + '-annenGrunnOpphoerAnsatt'))
    }
  }

  const setGrunnOpphoerSelvstendig = (grunnOpphoerSelvstendig: string) => {
    dispatch(updateReplySed(`${target}.grunnOpphoerSelvstendig`, grunnOpphoerSelvstendig.trim()))
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
            label={t('label:grunn-type')}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setTypeGrunnOpphoerAnsatt((o as Option).value)}
            options={årsakOptions}
            required
            value={_.find(årsakOptions, b => b.value === sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt) ?? null}
            defaultValue={_.find(årsakOptions, b => b.value === sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt)}
          />
        </Column>
        <Column>
          <div style={{ marginTop: '2rem' }}>
            <Button variant='secondary' onClick={() => setTypeGrunnOpphoerAnsatt(undefined)} icon={<TrashIcon/>}>
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

export default SisteAnsettelseInfoFC
