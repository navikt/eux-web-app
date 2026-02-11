import { TrashIcon } from '@navikt/aksel-icons';
import { Box, Button, Heading, HGrid, VStack } from '@navikt/ds-react'
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
    <Box padding="4" key={namespace + '-div'}>
      <VStack gap="4">
        <Heading size='medium'>
          {t('label:årsak-til-avsluttet-arbeidsforhold')}
        </Heading>
        <HGrid columns="2fr 1fr" gap="4" align="start">
          <Select
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
          <Box paddingBlock="8 0">
            <Button variant='secondary' onClick={() => setTypeGrunnAnsatt(undefined)} icon={<TrashIcon/>}>
              {t('el:button-remove')}
            </Button>
          </Box>
        </HGrid>
        {_typeGrunnAnsatt === 'annet-ansettelsesforhold' && (
          <Input
            error={validation[namespace + '-annenGrunnAnsatt']?.feilmelding}
            namespace={namespace}
            id='annenGrunnAnsatt'
            label={t('label:annen-grunn')}
            onChanged={setAnnenGrunnAnsatt}
            value={oppsigelsesGrunn?.annenGrunnAnsatt ?? ''}
          />
        )}
        {_typeGrunnAnsatt === 'annet-selvstendig' && (
          <Input
            error={validation[namespace + '-årsakselvstendig']?.feilmelding}
            namespace={namespace}
            id='grunnOpphoerSelvstendig'
            label={t('label:årsak-til-avslutning-av-selvstendig-næringsvirksomhet')}
            onChanged={setGrunnSelvstendig}
            value={oppsigelsesGrunn?.grunnSelvstendig ?? ''}
          />
        )}
      </VStack>
    </Box>
  )
}

export default OppsigelsesGrunnFC
