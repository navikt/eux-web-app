import { resetValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector, mapState } from 'applications/SvarSed/MainForm'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { Adresse as IAdresse, F002Sed, KontoType, UtbetalingTilInstitusjon } from 'declarations/sed'
import _ from 'lodash'
import { Heading, Radio, RadioGroup } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

const Kontoopplysning: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = 'utbetalingTilInstitusjon'
  const utbetalingTilInstitusjon: UtbetalingTilInstitusjon | undefined = (replySed as F002Sed).utbetalingTilInstitusjon
  const namespace: string = `${parentNamespace}-kontoopplysninger`

  const [_kontoType, _setKontoType] = useState<KontoType | undefined>(() => {
    if (_.isNil(utbetalingTilInstitusjon)) {
      return undefined
    }
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

  const setOrdinaerAdresse = (newAdresse: IAdresse, type: string | undefined) => {
    dispatch(updateReplySed(`${target}.kontoOrdinaer.adresse`, newAdresse))
    if (type && validation[namespace + '-kontoOrdinaer-adresse-' + type]) {
      dispatch(resetValidation(namespace + '-kontoOrdinaer-adresse-' + type))
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
      <Heading size='small'>
        {t('label:kontoopplysninger')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-begrunnelse']?.feilmelding}
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
            error={validation[namespace + '-id']?.feilmelding}
            key={namespace + '-id-' + (utbetalingTilInstitusjon?.id ?? '')}
            id='id'
            label={t('label:institusjonens-id')}
            namespace={namespace}
            onChanged={setId}
            required
            value={utbetalingTilInstitusjon?.id ?? ''}
          />
        </Column>
        <Column>
          <Input
            error={validation[namespace + '-navn']?.feilmelding}
            key={namespace + '-navn-' + (utbetalingTilInstitusjon?.navn ?? '')}
            id='navn'
            label={t('label:institusjonens-navn')}
            namespace={namespace}
            onChanged={setNavn}
            required
            value={utbetalingTilInstitusjon?.navn ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <RadioGroup
            value={_kontoType}
            data-testid={namespace + '-kontotype'}
            error={validation[namespace + '-kontotype']?.feilmelding}
            id={namespace + '-kontotype'}
            legend={t('label:konto-type') + ' *'}
            name={namespace + '-kontotype'}
            onChange={(e: string | number | boolean) => setKontoType(e as KontoType)}
          >
            <Radio
              value='ordinaer'
            >{t('label:ordinær-konto')}
            </Radio>
            <Radio
              value='sepa'
            >{t('label:sepa-konto')}
            </Radio>
          </RadioGroup>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {_kontoType === 'ordinaer' && (
        <>
          <AlignStartRow>
            <Column>
              <Input
                error={validation[namespace + '-kontoOrdinaer-bankensNavn']?.feilmelding}
                id='kontoOrdinaer-bankensNavn'
                key={namespace + '-kontoOrdinaer-bankensNavn-' + (utbetalingTilInstitusjon?.kontoOrdinaer?.bankensNavn ?? '')}
                label={t('label:bankens-navn')}
                namespace={namespace}
                onChanged={setOrdinaerBankensNavn}
                required
                value={utbetalingTilInstitusjon?.kontoOrdinaer?.bankensNavn ?? ''}
              />
            </Column>
            <Column>
              <Input
                error={validation[namespace + '-kontoOrdinaer-kontonummer']?.feilmelding}
                id='kontoOrdinaer-kontonummer'
                key={namespace + '-kontoOrdinaer-kontonummer-' + (utbetalingTilInstitusjon?.kontoOrdinaer?.kontonummer ?? '')}
                label={t('label:kontonummer')}
                namespace={namespace}
                onChanged={setOrdinaerKontonummer}
                required
                value={utbetalingTilInstitusjon?.kontoOrdinaer?.kontonummer ?? ''}
              />
            </Column>
            <Column>
              <Input
                error={validation[namespace + '-kontoOrdinaer-swift']?.feilmelding}
                id='kontoOrdinaer-swift'
                key={namespace + '-kontoOrdinaer-swift-' + (utbetalingTilInstitusjon?.kontoOrdinaer?.swift ?? '')}
                label={t('label:swift') + (_.isEmpty(utbetalingTilInstitusjon?.kontoOrdinaer?.kontonummer) ? ' *' : '') + ' (' + t('el:placeholder-swift') + ')'}
                namespace={namespace}
                onChanged={setOrdinaerSwift}
                value={utbetalingTilInstitusjon?.kontoOrdinaer?.swift ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AdresseForm
            adresse={utbetalingTilInstitusjon?.kontoOrdinaer?.adresse ?? {}}
            onAdressChanged={setOrdinaerAdresse}
            namespace={namespace + '-kontoOrdinaer'}
            validation={validation}
          />
        </>
      )}
      {_kontoType === 'sepa' && (
        <>
          <AlignStartRow>
            <Column>
              <Input
                error={validation[namespace + '-kontoSepa-iban']?.feilmelding}
                id='kontoSepa-iban'
                key={namespace + '-kontoSepa-iban-' + (utbetalingTilInstitusjon?.kontoSepa?.iban ?? '')}
                label={t('label:iban')}
                namespace={namespace}
                onChanged={setSepaIban}
                required
                value={utbetalingTilInstitusjon?.kontoSepa?.iban ?? ''}
              />
            </Column>
          </AlignStartRow>
          <VerticalSeparatorDiv />
          <AlignStartRow>
            <Column>
              <Input
                error={validation[namespace + '-kontoSepa-swift']?.feilmelding}
                id='kontoSepa-swift'
                key={namespace + '-kontoSepa-swift-' + (utbetalingTilInstitusjon?.kontoSepa?.swift ?? '')}
                label={t('label:swift') + (!_.isEmpty(utbetalingTilInstitusjon?.kontoSepa?.iban) ? '' : ' *')}
                namespace={namespace}
                onChanged={setSepaSwift}
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