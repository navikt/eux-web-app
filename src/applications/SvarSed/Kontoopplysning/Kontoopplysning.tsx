import {Heading, Radio, RadioGroup, Button, Box, VStack, HGrid} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import {
  validateKontoopplysning,
  ValidationKontoopplysningProps
} from 'applications/SvarSed/Kontoopplysning/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import InstitutionSelector from 'components/InstitutionSelector/InstitutionSelector'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse, F002Sed, KontoType, UtbetalingTilInstitusjon } from 'declarations/sed'
import { CountryCodes, Institusjon as IRInstitusjon } from 'declarations/types'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState, JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getLandkodeFromInstitusjonsId } from 'utils/institusjon'
import performValidation from 'utils/performValidation'

interface KontoopplysningSelector extends MainFormSelector {
  countryCodes: CountryCodes | null | undefined
  cdmVersjonApp: string | undefined
}

const mapState = (state: State): KontoopplysningSelector => ({
  validation: state.validation.status,
  countryCodes: state.app.countryCodes,
  cdmVersjonApp: state.app.cdmVersjon
})

const Kontoopplysning: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  personName
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation, countryCodes, cdmVersjonApp }: KontoopplysningSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = 'utbetalingTilInstitusjon'
  const utbetalingTilInstitusjon: UtbetalingTilInstitusjon | undefined = _.get((replySed as F002Sed), target)
  const namespace: string = `${parentNamespace}-kontoopplysninger`
  const cdmVersjon: string | undefined = (replySed as F002Sed).sak?.cdmVersjon ?? cdmVersjonApp
  // Country picked before an institution is chosen
  const [_valgtLandkode, _setValgtLandkode] = useState<string | undefined>(undefined)
  const institusjonLandkode: string | undefined = utbetalingTilInstitusjon?.id
    ? utbetalingTilInstitusjon.__landkode ?? getLandkodeFromInstitusjonsId(utbetalingTilInstitusjon.id, countryCodes, cdmVersjon)
    : _valgtLandkode

  const [_kontoType, _setKontoType] = useState<KontoType | undefined>(() => {
    if (_.isNil(utbetalingTilInstitusjon)) {
      return undefined
    }
    if (utbetalingTilInstitusjon.kontoOrdinaer) {
      return 'ordinaer'
    }
    if (utbetalingTilInstitusjon.kontoSepa) {
      return 'sepa'
    }
    return undefined
  })

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationKontoopplysningProps>(
      clonedValidation, namespace, validateKontoopplysning, {
        uti: utbetalingTilInstitusjon,
        formalName: personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  // caches konto information while switching from konto ordinaer to sepa, so that we do not
  // throw away completely all information added
  const [_cacheKonto, _setCacheKonto] = useState<any>({
    ordinaer: utbetalingTilInstitusjon?.kontoOrdinaer,
    sepa: utbetalingTilInstitusjon?.kontoSepa
  })

  const setKontoType = (kontoType: KontoType | undefined) => {
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
      newUti.kontoOrdinaer = _cacheKonto.ordinaer ? _cacheKonto.ordinaer : {}
    }
    if (kontoType === 'sepa') {
      _setCacheKonto({
        ..._cacheKonto,
        ordinaer: utbetalingTilInstitusjon?.kontoOrdinaer
      })
      delete newUti.kontoOrdinaer
      newUti.kontoSepa = _cacheKonto.sepa ? _cacheKonto.sepa : {}
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

  const resetInstitusjonValidation = () => {
    if (validation[namespace + '-institusjon-id']) {
      dispatch(resetValidation(namespace + '-institusjon-id'))
    }
  }

  // Only id, navn and __landkode change; begrunnelse and account details are kept
  const updateInstitusjon = (institusjon: IRInstitusjon | undefined, landkode: string | undefined) => {
    const newUti: UtbetalingTilInstitusjon = {
      ...(_.omit(utbetalingTilInstitusjon, '__landkode') as UtbetalingTilInstitusjon),
      id: institusjon?.institusjonsID ?? '',
      navn: institusjon?.navn ?? ''
    }
    if (institusjon) {
      newUti.__landkode = landkode
    }
    dispatch(updateReplySed(target, newUti))
    resetInstitusjonValidation()
  }

  const setInstitusjonLandkode = (landkode: string) => {
    _setValgtLandkode(landkode)
    updateInstitusjon(undefined, undefined)
  }

  const setInstitusjon = (institusjon: IRInstitusjon | undefined) => {
    if (!institusjon) {
      _setValgtLandkode(institusjonLandkode)
    }
    updateInstitusjon(institusjon, institusjonLandkode)
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

  const setSepaBanknavn = (newBanknavn: string) => {
    dispatch(updateReplySed(`${target}.kontoSepa.banknavn`, newBanknavn.trim()))
    if (validation[namespace + '-kontoSepa-banknavn']) {
      dispatch(resetValidation(namespace + '-kontoSepa-banknavn'))
    }
  }

  const setSepaKontoeier = (newKontoeier: string) => {
    dispatch(updateReplySed(`${target}.kontoSepa.kontoeier`, newKontoeier.trim()))
    if (validation[namespace + '-kontoSepa-kontoeier']) {
      dispatch(resetValidation(namespace + '-kontoSepa-kontoeier'))
    }
  }

  const setSepaBetalingreferanse = (newBetalingsreferanse: string) => {
    dispatch(updateReplySed(`${target}.kontoSepa.betalingsreferanse`, newBetalingsreferanse.trim()))
    if (validation[namespace + '-kontoSepa-betalingsreferanse']) {
      dispatch(resetValidation(namespace + '-kontoSepa-betalingsreferanse'))
    }
  }

  const emptyKontoopplysninger = () => {
    let uti: UtbetalingTilInstitusjon = {
      begrunnelse: '',
      id: '',
      navn: '',
      kontoSepa: undefined,
      kontoOrdinaer: undefined
    }
    setKontoType(undefined)
    _setValgtLandkode(undefined)
    dispatch(updateReplySed('utbetalingTilInstitusjon', uti));
  }


  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        <TextArea
          error={validation[namespace + '-begrunnelse']?.feilmelding}
          id='begrunnelse'
          label={t('label:begrunnelse-for-myndighetens-krav') + '*'}
          namespace={namespace}
          onChanged={setBegrunnelse}
          required
          value={utbetalingTilInstitusjon?.begrunnelse ?? ''}
          maxLength={255}
        />
        <InstitutionSelector
          namespace={namespace}
          id='institusjon'
          bucType={(replySed as F002Sed).sak?.sakType}
          landkode={institusjonLandkode}
          value={utbetalingTilInstitusjon?.id || undefined}
          valueNavn={utbetalingTilInstitusjon?.navn}
          error={validation[namespace + '-institusjon-id']?.feilmelding}
          onLandkodeChanged={setInstitusjonLandkode}
          onInstitutionSelected={setInstitusjon}
        />
        <RadioGroup
          value={_kontoType ?? ""}
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
        {_kontoType === 'ordinaer' && (
          <VStack>
            <HGrid columns={3} gap="space-16" align="start">
              <Input
                error={validation[namespace + '-kontoOrdinaer-bankensNavn']?.feilmelding}
                id='kontoOrdinaer-bankensNavn'
                label={t('label:bankens-navn')}
                namespace={namespace}
                onChanged={setOrdinaerBankensNavn}
                required
                value={utbetalingTilInstitusjon?.kontoOrdinaer?.bankensNavn ?? ''}
              />
              <Input
                error={validation[namespace + '-kontoOrdinaer-kontonummer']?.feilmelding}
                id='kontoOrdinaer-kontonummer'
                label={t('label:kontonummer')}
                namespace={namespace}
                onChanged={setOrdinaerKontonummer}
                required
                value={utbetalingTilInstitusjon?.kontoOrdinaer?.kontonummer ?? ''}
              />
              <Input
                error={validation[namespace + '-kontoOrdinaer-swift']?.feilmelding}
                id='kontoOrdinaer-swift'
                label={t('label:swift') + (_.isEmpty(utbetalingTilInstitusjon?.kontoOrdinaer?.kontonummer) ? ' *' : '')}
                namespace={namespace}
                onChanged={setOrdinaerSwift}
                value={utbetalingTilInstitusjon?.kontoOrdinaer?.swift ?? ''}
              />
            </HGrid>
            <Box paddingBlock="space-16">
              <AdresseForm
                adresse={utbetalingTilInstitusjon?.kontoOrdinaer?.adresse ?? {}}
                onAdressChanged={setOrdinaerAdresse}
                namespace={namespace + '-kontoOrdinaer'}
                validation={validation}
                type={false}
              />
            </Box>
          </VStack>
        )}
        {_kontoType === 'sepa' && (
          <>
            <HGrid columns={2} gap="space-16" align="start">
              <Input
                error={validation[namespace + '-kontoSepa-iban']?.feilmelding}
                id='kontoSepa-iban'
                label={t('label:iban')}
                namespace={namespace}
                onChanged={setSepaIban}
                required
                value={utbetalingTilInstitusjon?.kontoSepa?.iban ?? ''}
              />
              <Input
                error={validation[namespace + '-kontoSepa-swift']?.feilmelding}
                id='kontoSepa-swift'
                label={t('label:swift')}
                namespace={namespace}
                onChanged={setSepaSwift}
                value={utbetalingTilInstitusjon?.kontoSepa?.swift ?? ''}
              />
            </HGrid>
            {parseFloat((replySed as F002Sed).sak?.cdmVersjon!) >= 4.4 &&
              <VStack gap="space-16">
                <HGrid columns={2} gap="space-16" align="start">
                  <Input
                    error={validation[namespace + '-kontoSepa-banknavn']?.feilmelding}
                    id='kontoSepa-banknavn'
                    label={t('label:bankens-navn')}
                    namespace={namespace}
                    onChanged={setSepaBanknavn}
                    value={utbetalingTilInstitusjon?.kontoSepa?.banknavn ?? ''}
                  />
                  <Input
                    error={validation[namespace + '-kontoSepa-betalingsreferanse']?.feilmelding}
                    id='kontoSepa-swift'
                    label={t('label:betalingsreferanse')}
                    namespace={namespace}
                    onChanged={setSepaBetalingreferanse}
                    value={utbetalingTilInstitusjon?.kontoSepa?.betalingsreferanse ?? ''}
                  />
                </HGrid>
                <HGrid columns={2} gap="space-16" align="start">
                  <Input
                    error={validation[namespace + '-kontoSepa-kontoeier']?.feilmelding}
                    id='kontoSepa-kontoeier'
                    label={t('label:kontoeier')}
                    namespace={namespace}
                    onChanged={setSepaKontoeier}
                    value={utbetalingTilInstitusjon?.kontoSepa?.kontoeier ?? ''}
                  />
                </HGrid>
              </VStack>
            }
          </>
        )}
        <Box>
          <Button variant='secondary' size='small' onClick={() => emptyKontoopplysninger()} >
            {t('el:button-remove-account-info')}
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default Kontoopplysning
