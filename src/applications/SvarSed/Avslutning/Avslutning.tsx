import { Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexRadioPanels,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { validateAvslutning, ValidationAvslutningProps } from 'applications/SvarSed/Avslutning/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { AvslutningsType, X001Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Avslutning: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-avslutning`

  const begrunnelseOptions: Options = [
    { label: t('el:option-avslutting-begrunnelse-01'), value: '01' },
    { label: t('el:option-avslutting-begrunnelse-02'), value: '02' },
    { label: t('el:option-avslutting-begrunnelse-03'), value: '03' },
    { label: t('el:option-avslutting-begrunnelse-04'), value: '04' },
    { label: t('el:option-avslutting-begrunnelse-05'), value: '05' },
    { label: t('el:option-avslutting-begrunnelse-06'), value: '06' },
    { label: t('el:option-avslutting-begrunnelse-07'), value: '07' },
    { label: t('el:option-avslutting-begrunnelse-08'), value: '08' },
    { label: t('el:option-avslutting-begrunnelse-09'), value: '09' },
    { label: t('el:option-avslutting-begrunnelse-10'), value: '10' },
    { label: t('el:option-avslutting-begrunnelse-11'), value: '11' },
    { label: t('el:option-avslutting-begrunnelse-12'), value: '12' },
    { label: t('el:option-avslutting-begrunnelse-99'), value: '99' }
  ]

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationAvslutningProps>(
      validation, namespace, validateAvslutning, {
        replySed: (replySed as X001Sed),
        personName
      }
    )
    dispatch(setValidation(newValidation))
  })

  const setAvslutningsDato = (avslutningsDato: string) => {
    dispatch(updateReplySed('avslutningsDato', avslutningsDato.trim()))
    if (validation[namespace + '-avslutningsDato']) {
      dispatch(resetValidation(namespace + '-avslutningsDato'))
    }
  }

  const setAvslutningsType = (avslutningsType: AvslutningsType) => {
    dispatch(updateReplySed('avslutningsType', avslutningsType.trim()))
    if (validation[namespace + '-avslutningsType']) {
      dispatch(resetValidation(namespace + '-avslutningsType'))
    }
  }

  const setBegrunnelse = (begrunnelse: string) => {
    dispatch(updateReplySed('begrunnelse', begrunnelse.trim()))
    if (begrunnelse !== 'annet') {
      dispatch(updateReplySed('begrunnelseAnnen', ''))
    }
    if (validation[namespace + '-begrunnelse']) {
      dispatch(resetValidation(namespace + '-begrunnelse'))
    }
  }

  const setBegrunnelseAnnen = (begrunnelseAnnen: string) => {
    dispatch(updateReplySed('begrunnelseAnnen', begrunnelseAnnen.trim()))
    if (validation[namespace + '-begrunnelseAnnen']) {
      dispatch(resetValidation(namespace + '-begrunnelseAnnen'))
    }
  }

  return (
    <PaddedDiv>
      <Heading size='small'>
        {label}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <DateInput
            error={validation[namespace + '-avslutningsDato']?.feilmelding}
            id='avslutningsDato'
            namespace={namespace}
            label={t('label:avslutningsdato')}
            onChanged={setAvslutningsDato}
            required
            value={(replySed as X001Sed).avslutningsDato}
          />
        </Column>
        <Column flex='1.5' />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='2'>
          <RadioPanelGroup
            value={(replySed as X001Sed).avslutningsType}
            data-no-border
            data-testid={namespace + '-avslutningsType'}
            error={validation[namespace + '-avslutningsType']?.feilmelding}
            id={namespace + '-avslutningsType'}
            legend={t('label:avslutningstype')}
            hideLabel={false}
            required
            name={namespace + '-avslutningsType'}
            onChange={setAvslutningsType}
          >
            <FlexRadioPanels>
              <RadioPanel value='manuell'>
                {t('label:manuell')}
              </RadioPanel>
              <RadioPanel value='automatisk'>
                {t('label:automatisk')}
              </RadioPanel>
            </FlexRadioPanels>
          </RadioPanelGroup>
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Select
            data-testid={namespace + '-begrunnelse'}
            error={validation[namespace + '-begrunnelse']?.feilmelding}
            id={namespace + '-begrunnelse'}
            label={t('label:begrunnelse')}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setBegrunnelse((o as Option).value)}
            options={begrunnelseOptions}
            required
            value={_.find(begrunnelseOptions, b => b.value === (replySed as X001Sed).begrunnelse)}
            defaultValue={_.find(begrunnelseOptions, b => b.value === (replySed as X001Sed).begrunnelse)}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {(replySed as X001Sed).begrunnelse === '99' && (
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-begrunnelseAnnen']?.feilmelding}
              namespace={namespace}
              id='begrunnelseAnnen'
              label={t('label:begrunnelseAnnen')}
              hideLabel
              onChanged={setBegrunnelseAnnen}
              required
              value={(replySed as X001Sed).begrunnelseAnnen}
            />
          </Column>
        </AlignStartRow>
      )}
    </PaddedDiv>
  )
}

export default Avslutning
