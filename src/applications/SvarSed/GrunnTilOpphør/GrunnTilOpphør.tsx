import { Delete } from '@navikt/ds-icons'
import { Button, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { validateGrunnTilOpphor, ValidateGrunnTilOpphørProps } from 'applications/SvarSed/GrunnTilOpphør/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { SisteAnsettelseInfo, TypeGrunn } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const GrunnTilOpphør: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'sisteAnsettelseInfo'
  const sisteAnsettelseInfo: SisteAnsettelseInfo | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-grunntilopphør`

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidateGrunnTilOpphørProps>(
      clonedValidation, namespace, validateGrunnTilOpphor, {
        sisteAnsettelseInfo,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const årsakOptions: Options = [
    { label: t('el:option-grunntilopphør-oppsagt_av_arbeidsgiver'), value: 'oppsagt_av_arbeidsgiver' },
    { label: t('el:option-grunntilopphør-arbeidstaker_har_sagt_opp_selv'), value: 'arbeidstaker_har_sagt_opp_selv' },
    { label: t('el:option-grunntilopphør-kontrakten_utløpt'), value: 'kontrakten_utløpt' },
    { label: t('el:option-grunntilopphør-avsluttet_etter_felles_overenskomst'), value: 'avsluttet_etter_felles_overenskomst' },
    { label: t('el:option-grunntilopphør-avskjediget_av_disiplinære_grunner'), value: 'avskjediget_av_disiplinære_grunner' },
    { label: t('el:option-grunntilopphør-overtallighet'), value: 'overtallighet' },
    { label: t('el:option-grunntilopphør-ukjent'), value: 'ukjent' },
    { label: t('el:option-grunntilopphør-annet'), value: 'annet' }
  ]

  const setTypeGrunnOpphoerAnsatt = (typeGrunnOpphoerAnsatt: TypeGrunn | undefined) => {
    let newSisteAnsettelseInfo: SisteAnsettelseInfo | undefined = _.cloneDeep(sisteAnsettelseInfo)
    if (_.isUndefined(newSisteAnsettelseInfo)) {
      newSisteAnsettelseInfo = {} as SisteAnsettelseInfo
    }
    if (!_.isNil(typeGrunnOpphoerAnsatt)) {
      if (typeGrunnOpphoerAnsatt !== 'annet') {
        _.unset(newSisteAnsettelseInfo, 'annenGrunnOpphoerAnsatt')
        _.unset(newSisteAnsettelseInfo, 'grunnOpphoerSelvstendig')
      }
      _.set(newSisteAnsettelseInfo, 'typeGrunnOpphoerAnsatt', typeGrunnOpphoerAnsatt)
    } else {
      _.unset(newSisteAnsettelseInfo, 'typeGrunnOpphoerAnsatt')
    }
    dispatch(updateReplySed(target, newSisteAnsettelseInfo))
    dispatch(resetValidation(namespace))
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

  const value = _.find(årsakOptions, b => b.value === sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt) || null

  return (
    <PaddedDiv>
      <Heading size='small'>
        {label}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column flex='3'>
          <Select
            data-testid={namespace + '-typeGrunnOpphoerAnsatt'}
            error={validation[namespace + '-typeGrunnOpphoerAnsatt']?.feilmelding}
            id={namespace + '-typeGrunnOpphoerAnsatt'}
            label={t('label:årsak-til-avslutning-av-arbeidsforhold')}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setTypeGrunnOpphoerAnsatt((o as Option).value as TypeGrunn)}
            options={årsakOptions}
            value={value}
            defaultValue={value}
          />
        </Column>
        <Column>
          <div style={{ paddingTop: '2rem' }}>
            <Button
              variant='tertiary'
              onClick={() => setTypeGrunnOpphoerAnsatt(undefined)}
            >
              <Delete />
              {t('el:button-clear')}
            </Button>
          </div>
        </Column>

      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt === 'annet' && (
        <>
          <AlignStartRow>
            <Column>
              <Input
                error={validation[namespace + '-annenGrunnOpphoerAnsatt']?.feilmelding}
                namespace={namespace}
                id='annenGrunnOpphoerAnsatt'
                label={t('label:annet-opphør')}
                onChanged={setAnnenGrunnOpphoerAnsatt}
                required
                value={sisteAnsettelseInfo?.annenGrunnOpphoerAnsatt ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow>
            <Column>
              <Input
                error={validation[namespace + '-grunnOpphoerSelvstendig']?.feilmelding}
                namespace={namespace}
                id='grunnOpphoerSelvstendig'
                label={t('label:årsak-til-avslutning-av-selvstendig-næringsvirksomhet')}
                onChanged={setGrunnOpphoerSelvstendig}
                required
                value={sisteAnsettelseInfo?.grunnOpphoerSelvstendig ?? ''}
              />
            </Column>
          </AlignStartRow>
        </>
      )}
    </PaddedDiv>
  )
}

export default GrunnTilOpphør
