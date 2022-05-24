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
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import { X001Sed, X008Sed } from 'declarations/sed'
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

  const setBegrunnelse = (begrunnelse: string) => {
    dispatch(updateReplySed('begrunnelse', begrunnelse.trim()))
    if (begrunnelse !== '99') {
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
        <Column flex='2'>
          <RadioPanelGroup
            value={(replySed as X001Sed).begrunnelse}
            data-no-border
            data-testid={namespace + '-begrunnelse'}
            error={validation[namespace + '-begrunnelse']?.feilmelding}
            id={namespace + '-begrunnelse'}
            legend={t('label:begrunnelse')}
            hideLabel={false}
            required
            name={namespace + '-begrunnelse'}
            onChange={setBegrunnelse}
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
      {(replySed as X008Sed).begrunnelse === '99' && (
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
