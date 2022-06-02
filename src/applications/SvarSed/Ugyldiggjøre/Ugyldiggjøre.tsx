import { Heading } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import { X008Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateUgyldiggjøre, ValidationUgyldiggjøreProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Ugyldiggjøre: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-ugyldiggjøre`

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationUgyldiggjøreProps>(
      validation, namespace, validateUgyldiggjøre, {
        replySed: (replySed as X008Sed),
        personName
      }
    )
    dispatch(setValidation(newValidation))
  })

  const setTilbakekallSedType = (tilbakekallSedType: string) => {
    dispatch(updateReplySed('tilbakekallSedType', tilbakekallSedType.trim()))
    if (validation[namespace + '-tilbakekallSedType']) {
      dispatch(resetValidation(namespace + '-tilbakekallSedType'))
    }
  }

  const setTilbakekallSedUtstedtDato = (tilbakekallSedUtstedtDato: string) => {
    dispatch(updateReplySed('tilbakekallSedUtstedtDato', tilbakekallSedUtstedtDato.trim()))
    if (validation[namespace + '-tilbakekallSedUtstedtDato']) {
      dispatch(resetValidation(namespace + '-tilbakekallSedUtstedtDato'))
    }
  }

  const setBegrunnelseType = (begrunnelseType: string) => {
    dispatch(updateReplySed('begrunnelseType', begrunnelseType.trim()))
    if (begrunnelseType !== '99') {
      dispatch(updateReplySed('begrunnelseAnnen', ''))
    }
    if (validation[namespace + '-begrunnelseType']) {
      dispatch(resetValidation(namespace + '-begrunnelseType'))
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
          <Input
            error={validation[namespace + '-tilbakekallSedType']?.feilmelding}
            namespace={namespace}
            id='tilbakekallSedType'
            label={t('label:sed-type')}
            onChanged={setTilbakekallSedType}
            value={(replySed as X008Sed)?.tilbakekallSedType}
          />
        </Column>
        <Column>
          <DateInput
            uiFormat='DD.MM.YYYY'
            finalFormat='DD.MM.YYYY'
            error={validation[namespace + '-tilbakekallSedUtstedtDato']?.feilmelding}
            id='tilbakekallSedUtstedtDato'
            label={t('label:utstedelsesdato')}
            namespace={namespace}
            onChanged={setTilbakekallSedUtstedtDato}
            required
            value={(replySed as X008Sed)?.tilbakekallSedUtstedtDato ?? ''}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='2'>
          <RadioPanelGroup
            value={(replySed as X008Sed).begrunnelseType}
            data-no-border
            data-testid={namespace + '-begrunnelseType'}
            error={validation[namespace + '-begrunnelseType']?.feilmelding}
            id={namespace + '-begrunnelseType'}
            legend={t('label:begrunnelse')}
            hideLabel={false}
            required
            name={namespace + '-begrunnelseType'}
            onChange={setBegrunnelseType}
          >
            <RadioPanel value='01'>{t('el:option-ugyldiggjøre-01')}</RadioPanel>
            <RadioPanel value='02'>{t('el:option-ugyldiggjøre-02')}</RadioPanel>
            <RadioPanel value='03'>{t('el:option-ugyldiggjøre-03')}</RadioPanel>
            <RadioPanel value='04'>{t('el:option-ugyldiggjøre-04')}</RadioPanel>
            <RadioPanel value='05'>{t('el:option-ugyldiggjøre-05')}</RadioPanel>
            <RadioPanel value='06'>{t('el:option-ugyldiggjøre-06')}</RadioPanel>
            <RadioPanel value='99'>{t('el:option-ugyldiggjøre-99')}</RadioPanel>
          </RadioPanelGroup>
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {(replySed as X008Sed).begrunnelseType === '99' && (
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
              value={(replySed as X008Sed).begrunnelseAnnen}
            />
          </Column>
        </AlignStartRow>
      )}
    </PaddedDiv>
  )
}

export default Ugyldiggjøre
