import { TrashIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, Heading, HGrid, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateGrunnTilOpphor, ValidateGrunnTilOpphørProps } from 'applications/SvarSed/GrunnTilOpphør/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import {SisteAnsettelseInfo, TypeGrunn, USed} from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import {getAllArbeidsPerioderHaveSluttDato, getNrOfArbeidsPerioder} from "../../../utils/arbeidsperioder";

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

  const nrArbeidsperioder = getNrOfArbeidsPerioder(replySed as USed)
  const allArbeidsPerioderHaveSluttdato = getAllArbeidsPerioderHaveSluttDato(replySed as USed)

  useUnmount(() => {
      const clonedValidation = _.cloneDeep(validation)
      performValidation<ValidateGrunnTilOpphørProps>(
        clonedValidation, namespace, validateGrunnTilOpphor, {
          sisteAnsettelseInfo,
          personName,
          doValidate: (nrArbeidsperioder>0 && allArbeidsPerioderHaveSluttdato)
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
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <HGrid columns={"2fr 1fr"} gap="4" align="end">
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
            <Box>
              <Button
                variant='tertiary'
                onClick={() => setTypeGrunnOpphoerAnsatt(undefined)}
                icon={<TrashIcon/>}
              >
                {t('el:button-clear')}
              </Button>
            </Box>
        </HGrid>
        {sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt === 'annet' && (
          <>
            <BodyLong>
              * {t('label:du-må-fylle-ut-enten')} <b>{t('label:annet-opphør')}</b> {t('label:eller')} <b>{t('label:årsak-til-avslutning-av-selvstendig-næringsvirksomhet')}</b>
            </BodyLong>
            <Input
              error={validation[namespace + '-annenGrunnOpphoerAnsatt']?.feilmelding}
              namespace={namespace}
              id='annenGrunnOpphoerAnsatt'
              label={t('label:annet-opphør')}
              onChanged={setAnnenGrunnOpphoerAnsatt}
              value={sisteAnsettelseInfo?.annenGrunnOpphoerAnsatt ?? ''}
            />
            <Input
              error={validation[namespace + '-grunnOpphoerSelvstendig']?.feilmelding}
              namespace={namespace}
              id='grunnOpphoerSelvstendig'
              label={t('label:årsak-til-avslutning-av-selvstendig-næringsvirksomhet')}
              onChanged={setGrunnOpphoerSelvstendig}
              value={sisteAnsettelseInfo?.grunnOpphoerSelvstendig ?? ''}
            />
          </>
        )}
      </VStack>
    </Box>
  )
}

export default GrunnTilOpphør
