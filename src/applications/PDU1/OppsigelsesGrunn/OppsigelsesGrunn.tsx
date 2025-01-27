import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import {
  validateOppsigelsesGrunn,
  ValidationOppsigelsesGrunnProps
} from 'applications/PDU1/OppsigelsesGrunn/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import {Oppsigelsesgrunn, PDU1} from 'declarations/pd'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const OppsigelsesGrunnFC: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  setReplySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'oppsigelsesgrunn'
  const oppsigelsesGrunn: Oppsigelsesgrunn | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-oppsigelsesgrunn`

  const [_typeGrunnAnsatt, _setTypeGrunnAnsatt] = useState<string | undefined>(undefined)

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
    performValidation<ValidationOppsigelsesGrunnProps>(
      clonedvalidation, namespace, validateOppsigelsesGrunn, {
        oppsigelsesGrunn: oppsigelsesGrunn
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setTypeGrunnAnsatt = (typeGrunnAnsatt: string | undefined) => {
    _setTypeGrunnAnsatt(typeGrunnAnsatt)
    if (typeGrunnAnsatt === undefined || _.isEmpty(typeGrunnAnsatt?.trim())) {
      dispatch(updateReplySed(target, {}))
    } else {
      const newReplySed: PDU1 = _.cloneDeep(replySed) as PDU1
      _.set(newReplySed, `${target}.typeGrunnAnsatt`, typeGrunnAnsatt.trim())
      if (typeGrunnAnsatt !== 'annet-ansettelsesforhold') {
        delete newReplySed[target].annenGrunnAnsatt
      }
      if (typeGrunnAnsatt !== 'annet-selvstendig') {
        delete newReplySed[target].grunnSelvstendig
      }
      dispatch(setReplySed(newReplySed!))
    }
    if (validation[namespace + '-typeGrunnAnsatt']) {
      dispatch(resetValidation(namespace + '-typeGrunnAnsatt'))
    }
  }

  const setAnnenGrunnAnsatt = (annenGrunnAnsatt: string) => {
    dispatch(updateReplySed(`${target}.annenGrunnAnsatt`, annenGrunnAnsatt.trim()))
    if (validation[namespace + '-annenGrunnAnsatt']) {
      dispatch(resetValidation(namespace + '-annenGrunnAnsatt'))
    }
  }

  const setGrunnSelvstendig = (grunnSelvstendig: string) => {
    dispatch(updateReplySed(`${target}.grunnSelvstendig`, grunnSelvstendig.trim()))
    if (validation[namespace + '-grunnSelvstendig']) {
      dispatch(resetValidation(namespace + '-grunnSelvstendig'))
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
            data-testid={namespace + '-typeGrunnAnsatt'}
            error={validation[namespace + '-typeGrunnAnsatt']?.feilmelding}
            id={namespace + '-typeGrunnAnsatt'}
            label={t('label:grunn-type')}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setTypeGrunnAnsatt((o as Option).value)}
            options={årsakOptions}
            required
            value={_.find(årsakOptions, b => b.value === oppsigelsesGrunn?.typeGrunnAnsatt) ?? null}
            defaultValue={_.find(årsakOptions, b => b.value === oppsigelsesGrunn?.typeGrunnAnsatt)}
          />
        </Column>
        <Column>
          <div style={{ marginTop: '2rem' }}>
            <Button variant='secondary' onClick={() => setTypeGrunnAnsatt(undefined)} icon={<TrashIcon/>}>
              {t('el:button-remove')}
            </Button>
          </div>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {_typeGrunnAnsatt === 'annet-ansettelsesforhold' && (
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-annenGrunnAnsatt']?.feilmelding}
              namespace={namespace}
              id='annenGrunnAnsatt'
              label={t('label:annen-grunn')}
              onChanged={setAnnenGrunnAnsatt}
              value={oppsigelsesGrunn?.annenGrunnAnsatt ?? ''}
            />
          </Column>
        </AlignStartRow>
      )}
      {_typeGrunnAnsatt === 'annet-selvstendig' && (
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-årsakselvstendig']?.feilmelding}
              namespace={namespace}
              id='grunnOpphoerSelvstendig'
              label={t('label:årsak-til-avslutning-av-selvstendig-næringsvirksomhet')}
              onChanged={setGrunnSelvstendig}
              value={oppsigelsesGrunn?.grunnSelvstendig ?? ''}
            />
          </Column>
        </AlignStartRow>
      )}
    </PaddedDiv>
  )
}

export default OppsigelsesGrunnFC
