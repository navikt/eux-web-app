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
import { X011Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateAvvis, ValidationAvvisProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Avvis: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-avvis`

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationAvvisProps>(
      validation, namespace, validateAvvis, {
        replySed: (replySed as X011Sed),
        personName
      }
    )
    dispatch(setValidation(newValidation))
  })

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
          {(replySed as X011Sed)?.kansellerSedId}
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column flex='2'>
          <RadioPanelGroup
            value={(replySed as X011Sed).begrunnelseType}
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
            <RadioPanel value='01'>{t('el:option-avvis-01')}</RadioPanel>
            <RadioPanel value='02'>{t('el:option-avvis-02')}</RadioPanel>
            <RadioPanel value='03'>{t('el:option-avvis-03')}</RadioPanel>
            <RadioPanel value='99'>{t('el:option-avvis-99')}</RadioPanel>
          </RadioPanelGroup>
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {(replySed as X011Sed).begrunnelseType === '99' && (
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
              value={(replySed as X011Sed).begrunnelseAnnen}
            />
          </Column>
        </AlignStartRow>
      )}
    </PaddedDiv>
  )
}

export default Avvis
