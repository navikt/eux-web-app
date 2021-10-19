import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { FormålManagerFormProps, FormålManagerFormSelector, mapState } from 'applications/SvarSed/Formaal/FormålManager'
import Adresse from 'applications/SvarSed/PersonManager/Adresser/Adresse'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse, F002Sed, KontoType, UtbetalingTilInstitusjon } from 'declarations/sed'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import { AlignStartRow, Column, HighContrastRadioPanelGroup, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const Kontoopplysning: React.FC<FormålManagerFormProps> = ({
  parentNamespace
}: FormålManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { replySed, validation }: FormålManagerFormSelector = useSelector<State, FormålManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target: string = 'utbetalingTilInstitusjon'
  const utbetalingTilInstitusjon: UtbetalingTilInstitusjon | undefined = (replySed as F002Sed).utbetalingTilInstitusjon
  const namespace: string = `${parentNamespace}-kontoopplysninger`

  const [_kontoType, _setKontoType] = useState<KontoType | undefined>(() => {
    if (Object.prototype.hasOwnProperty.call(utbetalingTilInstitusjon, 'kontoOrdinaer')) {
      return 'ordinaer'
    }
    if (Object.prototype.hasOwnProperty.call(utbetalingTilInstitusjon, 'kontoSepa')) {
      return 'sepa'
    }
    return undefined
  })
  // caches konto information while switching from konto ordinær to sepa, so that we do not
  // throw away completely all information added
  const [_cacheKonto, _setCacheKonto] = useState<any>({
    ordinaer: utbetalingTilInstitusjon?.kontoOrdinaer,
    sepa: utbetalingTilInstitusjon?.kontoSepa
  })

  const setKontoType = (kontoType: KontoType) => {
    let newUti: UtbetalingTilInstitusjon | undefined = _.cloneDeep(utbetalingTilInstitusjon)
    if (!newUti) {
      newUti = {} as UtbetalingTilInstitusjon
    }
    if (kontoType === 'ordinaer') {
      _setCacheKonto({
        ..._cacheKonto,
        sepa: utbetalingTilInstitusjon?.kontoSepa
      })
      delete newUti!.kontoSepa
      newUti.kontoOrdinaer = _cacheKonto.ordinaer
    }
    if (kontoType === 'sepa') {
      _setCacheKonto({
        ..._cacheKonto,
        ordinaer: utbetalingTilInstitusjon?.kontoOrdinaer
      })
      delete newUti.kontoOrdinaer
      newUti.kontoSepa = _cacheKonto.sepa
    }
    dispatch(updateReplySed(target, newUti))
    _setKontoType(kontoType)
  }

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

  const setOrdinaerAdresse = (newAdresse: IAdresse) => {
    dispatch(updateReplySed(`${target}.kontoOrdinaer.adresse`, newAdresse))
    if (validation[namespace + '-kontoOrdinaer-adresse']) {
      dispatch(resetValidation(namespace + '-kontoOrdinaer-adresse'))
    }
  }

  const setOrdinaerBankensNavn = (newBankensNavn: string) => {
    dispatch(updateReplySed(`${target}.kontoOrdinaer.bankensNavn`, newBankensNavn.trim()))
    if (validation[namespace + '-kontoOrdinaer-bankensNavn']) {
      dispatch(resetValidation(namespace + '-kontoOrdinaer-bankensNavn'))
    }
  }

  const setOrdinaerKontonummer = (newKontonummer: string) => {
    dispatch(updateReplySed(`${target}.kontoOrdinaer.kontonummer`, newKontonummer.trim()))
    if (validation[namespace + '-kontoOrdinaer-kontonummer']) {
      dispatch(resetValidation(namespace + '-kontoOrdinaer-kontonummer'))
    }
  }

  const setOrdinaerSwift = (newSwift: string) => {
    dispatch(updateReplySed(`${target}.kontoOrdinaer.swift`, newSwift.trim()))
    if (validation[namespace + '-kontoOrdinaer-swift']) {
      dispatch(resetValidation(namespace + '-kontoOrdinaer-swift'))
    }
  }

  const setSepaIban = (newIban: string) => {
    dispatch(updateReplySed(`${target}.kontoSepa.iban`, newIban.trim()))
    if (validation[namespace + '-kontoSepa-iban']) {
      dispatch(resetValidation(namespace + '-kontoSepa-iban'))
    }
  }

  const setSepaSwift = (newSwift: string) => {
    dispatch(updateReplySed(`${target}.kontoSepa.swift`, newSwift.trim()))
    if (validation[namespace + '-kontoSepa-swift']) {
      dispatch(resetValidation(namespace + '-kontoSepa-swift'))
    }
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:kontoopplysninger')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-begrunnelse']?.feilmelding}
              key={namespace + '-begrunnelse-' + (utbetalingTilInstitusjon?.begrunnelse ?? '')}
              id='begrunnelse'
              label={t('label:begrunnelse-for-myndighetens-krav') + '*'}
              namespace={namespace}
              onChanged={setBegrunnelse}
              required
              value={utbetalingTilInstitusjon?.begrunnelse ?? ''}
            />
          </TextAreaDiv>
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Input
            feil={validation[namespace + '-id']?.feilmelding}
            id='id'
            key={namespace + '-id-' + (utbetalingTilInstitusjon?.id ?? '')}
            label={t('label:institusjonens-id') + ' *'}
            namespace={namespace}
            onChanged={setId}
            required
            value={utbetalingTilInstitusjon?.id ?? ''}
          />
        </Column>
        <Column>
          <Input
            feil={validation[namespace + '-navn']?.feilmelding}
            namespace={namespace}
            key={namespace + '-navn-' + (utbetalingTilInstitusjon?.navn ?? '')}
            id='navn'
            label={t('label:institusjonens-navn') + ' *'}
            onChanged={setNavn}
            required
            value={utbetalingTilInstitusjon?.navn ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_kontoType}
            data-no-border
            data-test-id={namespace + '-kontotype'}
            feil={validation[namespace + '-kontotype']?.feilmelding}
            id={namespace + '-kontotype'}
            legend={t('label:konto-type') + ' *'}
            name={namespace + '-kontotype'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKontoType(e.target.value as KontoType)}
            radios={[
              { label: t('label:ordinær-konto'), value: 'ordinaer' },
              { label: t('label:sepa-konto'), value: 'sepa' }
            ]}
            required
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {_kontoType === 'ordinaer' && (
        <>
          <AlignStartRow>
            <Column>
              <Input
                feil={validation[namespace + '-kontoOrdinaer-bankensNavn']?.feilmelding}
                namespace={namespace}
                id='kontoOrdinaer-bankensNavn'
                key={namespace + '-kontoOrdinaer-bankensNavn-' + (utbetalingTilInstitusjon?.kontoOrdinaer?.bankensNavn ?? '')}
                label={t('label:bankens-navn') + ' *'}
                onChanged={setOrdinaerBankensNavn}
                value={utbetalingTilInstitusjon?.kontoOrdinaer?.bankensNavn ?? ''}
              />
            </Column>
            <Column>
              <Input
                feil={validation[namespace + '-kontoOrdinaer-kontonummer']?.feilmelding}
                namespace={namespace}
                id='kontoOrdinaer-kontonummer'
                key={namespace + '-kontoOrdinaer-kontonummer-' + (utbetalingTilInstitusjon?.kontoOrdinaer?.kontonummer ?? '')}
                label={t('label:kontonummer') + ' *'}
                onChanged={setOrdinaerKontonummer}
                value={utbetalingTilInstitusjon?.kontoOrdinaer?.kontonummer ?? ''}
              />
            </Column>
            <Column>
              <Input
                feil={validation[namespace + '-kontoOrdinaer-swift']?.feilmelding}
                namespace={namespace}
                id='kontoOrdinaer-swift'
                key={namespace + '-kontoOrdinaer-swift-' + (utbetalingTilInstitusjon?.kontoOrdinaer?.swift ?? '')}
                label={t('label:swift') + ' *'}
                onChanged={setOrdinaerSwift}
                placeholder={t('message:placeholder-swift')}
                value={utbetalingTilInstitusjon?.kontoOrdinaer?.swift ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <Adresse
            namespace={namespace + '-kontoOrdinaer'}
            adresse={utbetalingTilInstitusjon?.kontoOrdinaer?.adresse ?? {}}
            onAdressChanged={setOrdinaerAdresse}
            validation={validation}
            resetValidation={(fullNamespace) => {
              if (validation[fullNamespace]) {
                dispatch(resetValidation(fullNamespace))
              }
            }}
          />
        </>
      )}
      {_kontoType === 'sepa' && (
        <>
          <AlignStartRow>
            <Column>
              <Input
                feil={validation[namespace + '-kontoSepa-iban']?.feilmelding}
                namespace={namespace}
                id='kontoSepa-iban'
                key={namespace + 'kontoOrdinaer-iban' + (utbetalingTilInstitusjon?.kontoSepa?.iban ?? '')}
                label={t('label:iban') + ' *'}
                onChanged={setSepaIban}
                value={utbetalingTilInstitusjon?.kontoSepa?.iban ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow>
            <Column>
              <Input
                feil={validation[namespace + '-kontoSepa-swift']?.feilmelding}
                namespace={namespace}
                id='kontoSepa-swift'
                key={namespace + '-kontoOrdinaer-swift-' + (utbetalingTilInstitusjon?.kontoSepa?.swift ?? '')}
                label={t('label:swift') + ' *'}
                onChanged={setSepaSwift}
                required
                value={utbetalingTilInstitusjon?.kontoSepa?.swift ?? ''}
              />
            </Column>
          </AlignStartRow>
        </>
      )}
      <VerticalSeparatorDiv />
    </PaddedDiv>
  )
}

export default Kontoopplysning
