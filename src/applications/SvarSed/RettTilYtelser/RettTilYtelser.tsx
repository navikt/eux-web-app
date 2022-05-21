import { Radio, RadioGroup } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { validateRettTilYtelse, ValidationRettTilYtelseProps } from 'applications/SvarSed/RettTilYtelser/validation'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { State } from 'declarations/reducers'
import { JaNei, Periode, RettTilYtelse } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const RettTilYtelser: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'rettTilYtelse'
  const rettTilYtelse: RettTilYtelse | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-retttilytelser`

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationRettTilYtelseProps>(
      validation, namespace, validateRettTilYtelse, {
        rettTilYtelse
      }
    )
    dispatch(setValidation(newValidation))
  })

  const [_rettTilStonad, _setRettTilStonad] = useState<JaNei | undefined>(() => {
    if (!_.isEmpty(rettTilYtelse?.bekreftelsesgrunn)) {
      return 'ja'
    }
    if (!_.isEmpty(rettTilYtelse?.avvisningsgrunn)) {
      return 'nei'
    }
    return undefined
  })

  const setPeriode = (periode: Periode) => {
    if (rettTilYtelse?.periode.startdato !== periode.startdato &&
      validation[namespace + '-periode-startdato']) {
      dispatch(resetValidation(namespace + '-periode-startdato'))
    }
    if (rettTilYtelse?.periode.sluttdato !== periode.sluttdato &&
      validation[namespace + '-periode-sluttdato']) {
      dispatch(resetValidation(namespace + '-periode-sluttdato'))
    }
    dispatch(updateReplySed(`${target}.periode`, periode))
  }

  const setRettTilStonad = (rettTilStonad: JaNei) => {
    _setRettTilStonad(rettTilStonad)
    if (validation[namespace + '-retttilstonad']) {
      dispatch(resetValidation(namespace + '-retttilstonad'))
    }
  }

  const setBekreftelsesgrunn = (bekreftelsesgrunn: string) => {
    let newRettTilYtelse: RettTilYtelse = _.cloneDeep(rettTilYtelse) as RettTilYtelse
    if (!newRettTilYtelse) {
      newRettTilYtelse = {} as RettTilYtelse
    }
    newRettTilYtelse.bekreftelsesgrunn = bekreftelsesgrunn.trim()
    delete newRettTilYtelse.avvisningsgrunn
    dispatch(updateReplySed(target, newRettTilYtelse))
    if (validation[namespace + '-bekreftelsesgrunn']) {
      dispatch(resetValidation(namespace + '-bekreftelsesgrunn'))
    }
  }

  const setAvvisningsGrunn = (avvisningsgrunn: string) => {
    let newRettTilYtelse: RettTilYtelse = _.cloneDeep(rettTilYtelse) as RettTilYtelse
    if (!newRettTilYtelse) {
      newRettTilYtelse = {} as RettTilYtelse
    }
    newRettTilYtelse.avvisningsgrunn = avvisningsgrunn.trim()
    delete newRettTilYtelse.bekreftelsesgrunn
    dispatch(updateReplySed(target, newRettTilYtelse))
    if (validation[namespace + '-avvisningsgrunn']) {
      dispatch(resetValidation(namespace + '-avvisningsgrunn'))
    }
  }

  return (
    <PaddedDiv>
      <AlignStartRow>
        <Column>
          <RadioGroup
            defaultValue={_rettTilStonad}
            id={namespace + '-retttilstønad'}
            data-testid={namespace + '-retttilstønad'}
            legend={t('label:rett-til-stønad') + ' *'}
            error={validation[namespace + '-retttilstønad']?.feilmelding}
            onChange={(e: string | number | boolean) => setRettTilStonad(e as JaNei)}
          >
            <Radio
              value='ja'
            >
              {t('label:ja')}
            </Radio>
            <Radio
              value='nei'
            >
              {t('label:nei')}
            </Radio>
          </RadioGroup>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {_rettTilStonad === 'ja' && (
        <AlignStartRow>
          <Column>
            <RadioGroup
              id={namespace + '-bekreftelsesgrunn'}
              value={rettTilYtelse?.bekreftelsesgrunn}
              data-testid={namespace + '-bekreftelsesgrunn'}
              legend={t('label:artikkelnummer') + ' *'}
              error={validation[namespace + '-bekreftelsesgrunn']?.feilmelding}
              onChange={(e: string | number | boolean) => setBekreftelsesgrunn(e as string)}
            >
              <Radio
                value='artikkel_64_i_forordningen_EF_nr._883/2004'
              >
                {t('label:artikkel-64')}
              </Radio>
              <Radio
                value='artikkel_65_1_i_forordningen_EF_nr._883/2004'
              >
                {t('label:artikkel-65')}
              </Radio>
            </RadioGroup>
          </Column>
        </AlignStartRow>
      )}
      {_rettTilStonad === 'nei' && (
        <AlignStartRow>
          <Column>
            <RadioGroup
              id={namespace + '-avvisningsgrunn'}
              data-testid={namespace + '-avvisningsgrunn'}
              legend={t('label:grunn') + ' *'}
              value={rettTilYtelse?.avvisningsgrunn}
              error={validation[namespace + '-avvisningsgrunn']?.feilmelding}
              onChange={(e: string | number | boolean) => setAvvisningsGrunn(e as string)}
            >
              <Radio
                value='ingen_rett_til_stønad_i_henhold_til_lovgivningen_til_institusjonen_som_utsteder_denne_meldingen'
              >
                {t('label:grunn-ingen-rett')}
              </Radio>
              <Radio
                value='personen_søkte_ikke_om_eksport_av_stønad_på_riktig_måte'
              >
                {t('label:grunn-personen')}
              </Radio>
            </RadioGroup>
          </Column>
        </AlignStartRow>
      )}
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <PeriodeInput
          namespace={namespace}
          error={{
            startdato: validation[namespace + '-periode-startdato']?.feilmelding,
            sluttdato: validation[namespace + '-periode-sluttdato']?.feilmelding
          }}
          setPeriode={setPeriode}
          value={rettTilYtelse?.periode}
        />
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
    </PaddedDiv>
  )
}

export default RettTilYtelser
