import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { FormålManagerFormProps, FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import classNames from 'classnames'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { F002Sed, JaNei, UtbetalingTilInstitusjon } from 'declarations/sed'
import { Undertittel } from 'nav-frontend-typografi'
import { AlignStartRow, Column, HighContrastRadioPanelGroup, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface KravOmRefusjonProps extends FormålManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): KravOmRefusjonProps => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status,
  viewValidation: state.validation.view
})

const Kontoopplysning: React.FC<FormålManagerFormProps> = ({
  parentNamespace
}: FormålManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  }: any = useSelector<State, FormålManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'utbetalingTilInstitusjon'
  const utbetalingTilInstitusjon: UtbetalingTilInstitusjon | undefined = (replySed as F002Sed).utbetalingTilInstitusjon
  const namespace = `${parentNamespace}-kontoopplysninger`

  const setBegrunnelse = (newBegrunnelse: string) => {
    dispatch(updateReplySed(`${target}.begrunnelse`, newBegrunnelse.trim()))
    if (validation[namespace + '-begrunnelse']) {
      dispatch(resetValidation(namespace + '-begrunnelse'))
    }
  }

  const setId = (newId: string) => {
    dispatch(updateReplySed(`${target}.id`, newId.trim()))
    if (validation[namespace + '-id']) {
      dispatch(resetValidation(namespace + '-id'))
    }
  }

  const setNavn = (newNavn: string) => {
    dispatch(updateReplySed(`${target}.navn`, newNavn.trim()))
    if (validation[namespace + '-navn']) {
      dispatch(resetValidation(namespace + '-navn'))
    }
  }

  const setSepaKonto = (newSepaKonto: JaNei) => {
    dispatch(updateReplySed(`${target}.kontoOrdinaer.sepaKonto`, newSepaKonto.trim()))
    if (validation[namespace + '-kontoOrdinaer-sepaKonto']) {
      dispatch(resetValidation(namespace + '-kontoOrdinaer-sepaKonto'))
    }
  }
  const setIban = (newIban: string) => {
    dispatch(updateReplySed(`${target}.kontoOrdinaer.iban`, newIban.trim()))
    if (validation[namespace + '-kontoOrdinaer-iban']) {
      dispatch(resetValidation(namespace + '-kontoOrdinaer-iban'))
    }
  }

  const setSwift = (newSwift: string) => {
    dispatch(updateReplySed(`${target}.kontoOrdinaer.swift`, newSwift.trim()))
    if (validation[namespace + '-kontoOrdinaer-swift']) {
      dispatch(resetValidation(namespace + '-kontoOrdinaer-swift'))
    }
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:kontoopplysninger')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
      >
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-begrunnelse']?.feilmelding}
              namespace={namespace}
              id='begrunnelse'
              label={t('label:begrunnelse-for-myndighetens-krav') + '*'}
              onChanged={setBegrunnelse}
              value={utbetalingTilInstitusjon.begrunnelse ?? ''}
            />
          </TextAreaDiv>
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.1s' }}
      >
        <Column>
          <Input
            feil={validation[namespace + '-id']?.feilmelding}
            namespace={namespace}
            id='id'
            label={t('label:institusjonens-id') + ' *'}
            onChanged={setId}
            value={utbetalingTilInstitusjon.id ?? ''}
          />
        </Column>
        <Column>
          <Input
            feil={validation[namespace + '-navn']?.feilmelding}
            namespace={namespace}
            id='navn'
            label={t('label:institusjonens-navn') + ' *'}
            onChanged={setNavn}
            value={utbetalingTilInstitusjon.navn ?? ''}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.2s' }}
      >
        <Column>
          <HighContrastRadioPanelGroup
            checked={utbetalingTilInstitusjon.kontoOrdinaer.sepaKonto}
            data-no-border
            data-test-id={namespace + '-kontoOrdinaer-sepaKonto'}
            feil={validation[namespace + '-kontoOrdinaer-sepaKonto']?.feilmelding}
            id={namespace + '-kontoOrdinaer-sepaKonto'}
            legend={t('label:bankinformasjon') + ' *'}
            name={namespace + '-bankinformasjon'}
            radios={[
              { label: t('label:sepa-konto-ja'), value: 'ja' },
              { label: t('label:sepa-konto-nei'), value: 'nei' }
            ]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSepaKonto(e.target.value as JaNei)}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.3s' }}
      >
        <Column flex='2'>
          <Input
            feil={validation[namespace + '-kontoOrdinaer-iban']?.feilmelding}
            namespace={namespace}
            id='kontoOrdinaer-iban'
            label={t('label:iban') + ' *'}
            onChanged={setIban}
            value={utbetalingTilInstitusjon.kontoOrdinaer.iban ?? ''}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.4s' }}
      >
        <Column flex='2'>
          <Input
            feil={validation[namespace + '-kontoOrdinaer-swift']?.feilmelding}
            namespace={namespace}
            id='kontoOrdinaer-swift'
            label={t('label:swift') + ' *'}
            onChanged={setSwift}
            value={utbetalingTilInstitusjon.kontoOrdinaer.swift ?? ''}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
    </PaddedDiv>
  )
}

export default Kontoopplysning
