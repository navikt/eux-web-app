import {Accordion, BodyLong, Box, Checkbox, Heading, HGrid, HStack, Label, Spacer, VStack} from '@navikt/ds-react'
import { Currency } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import IdentifikatorFC from 'applications/SvarSed/Identifikator/Identifikator'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { toDateFormat } from 'components/DateField/DateField'
import PeriodeText from 'components/Forms/PeriodeText'
import {HorizontalLineSeparator, RepeatableBox} from 'components/StyledComponents'
import {
  Adresse,
  ArbeidsgiverIdentifikator,
  ArbeidsgiverWithAdresse,
  ForsikringPeriode,
  InntektOgTime,
  Periode,
  PeriodeAnnenForsikring,
  PeriodeFerieForsikring,
  PeriodeMedForsikring,
  PeriodeUtenForsikring
} from 'declarations/sed.d'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import InntektOgTimerFC from './InntektOgTimer/InntektOgTimer'
import { validateForsikringPeriodeBox, ValidationForsikringPeriodeBoxProps } from './validation'

export type Editable = 'only_period' | 'full'

export interface ArbeidsgiverBoxProps<T> {
  forsikringPeriode: T | null,
  editable?: Editable,
  error?: boolean,
  icon ?: any,
  namespace: string
  onForsikringPeriodeSelect?: (a: T, checked: boolean) => void
  onForsikringPeriodeEdit?: (a: T, old: T) => void
  onForsikringPeriodeDelete?: (a: T) => void
  onForsikringPeriodeNew?: (a: T) => void
  onForsikringPeriodeNewClose ?: () => void
  selectable?: boolean,
  showArbeidsgiver ?: boolean,
  showAddress ?: boolean
  showAddressInListView ?: boolean
  showInntekt ?: boolean
  showAnnen ?: boolean
  showBeløp ?: boolean
  newMode ?: boolean
  allowEdit ?: boolean
  allowDelete ?: boolean
  style ?: string
  validation ?: Validation
  resetValidation ?: (namespace: string) => void
  setValidation ?: (v: Validation) => void
  setCopiedPeriod?: (p:any | null) => void
  index?: number | undefined
  type?: string | undefined
}

const ForsikringPeriodeBox = <T extends ForsikringPeriode>({
  forsikringPeriode,
  editable = 'full',
  error = false,
  icon,
  showAnnen = false,
  showAddress = false,
  showAddressInListView = false,
  showInntekt = false,
  showArbeidsgiver = false,
  showBeløp = false,
  namespace,
  onForsikringPeriodeSelect,
  onForsikringPeriodeDelete,
  onForsikringPeriodeEdit,
  onForsikringPeriodeNew,
  onForsikringPeriodeNewClose,
  selectable = false,
  newMode = false,
  allowEdit = false,
  allowDelete = false,
  style,
  validation,
  resetValidation,
  setValidation,
  setCopiedPeriod,
  index,
  type
}: ArbeidsgiverBoxProps<T>): JSX.Element => {
  const { t } = useTranslation()

  const idx = index === undefined || (index && index === -1) ? "" : "[" + index + "]"
  namespace = type ? namespace + '[' + type + ']' + idx : namespace + idx

  const [_inEditMode, _setInEditMode] = useState<boolean>(newMode)
  const [_newForsikringPeriode, _setNewForsikringPeriode] = useState<T | null | undefined>(newMode ? forsikringPeriode : undefined)
  const [_editForsikringPeriode, _setEditForsikringPeriode] = useState<T | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationForsikringPeriodeBoxProps>(validateForsikringPeriodeBox, namespace)
  const [validateAddress, setValidateAddress] = useState(false)

  const adresseHasProps = (adresse: Adresse | undefined) => {
    let adresseHasProps = false
    if(adresse){
      Object.keys(adresse).forEach((k) => {
        if(adresse[k as keyof Adresse] && adresse[k as keyof Adresse] !== "" ) {
          adresseHasProps = true
        }
      })
    }
    return adresseHasProps
  }

  const setPeriode = (periode: Periode) => {
    if (newMode) {
      _setNewForsikringPeriode({
        ..._newForsikringPeriode,
        ...periode
      } as T)
      _resetValidation(namespace + '-startdato')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      ...periode
    } as T)
    if (resetValidation) {
      resetValidation(namespace + '-startdato')
      resetValidation(namespace + '-sluttdato')
    }
  }

  const setAdresse = (adresse: Adresse) => {
    adresseHasProps(adresse) ? setValidateAddress(true) : setValidateAddress(false)

    if (newMode) {
      _setNewForsikringPeriode({
        ..._newForsikringPeriode,
        arbeidsgiver: {
          ...(_newForsikringPeriode as any)?.arbeidsgiver,
          adresse
        } as ArbeidsgiverWithAdresse
      } as any)
      _resetValidation(namespace + '-arbeidsgiver-adresse')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      arbeidsgiver: {
        ...(_editForsikringPeriode as any)?.arbeidsgiver,
        adresse
      } as ArbeidsgiverWithAdresse
    } as any)
    if (resetValidation) {
      resetValidation(namespace + '-arbeidsgiver-adresse')
    }
  }

  const setNavn = (navn: string) => {
    if (newMode) {
      _setNewForsikringPeriode({
        ..._newForsikringPeriode,
        arbeidsgiver: {
          ...(_newForsikringPeriode as any)?.arbeidsgiver,
          navn: navn.trim()
        } as ArbeidsgiverWithAdresse
      } as any)
      _resetValidation(namespace + '-arbeidsgiver-navn')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      arbeidsgiver: {
        ...(_editForsikringPeriode as any)?.arbeidsgiver,
        navn: navn.trim()
      } as ArbeidsgiverWithAdresse
    } as any)
    if (resetValidation) {
      resetValidation(namespace + '-arbeidsgiver-navn')
    }
  }

  const setIdentifikatorer = (identifikatorer: Array<ArbeidsgiverIdentifikator>) => {
    if (newMode) {
      _setNewForsikringPeriode({
        ..._newForsikringPeriode,
        arbeidsgiver: {
          ...(_newForsikringPeriode as any)?.arbeidsgiver,
          identifikatorer
        } as ArbeidsgiverWithAdresse
      } as any)
      _resetValidation(namespace + '-arbeidsgiver-identifikatorer')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      arbeidsgiver: {
        ...(_editForsikringPeriode as any)?.arbeidsgiver,
        identifikatorer
      } as ArbeidsgiverWithAdresse
    } as any)
    if (resetValidation) {
      resetValidation(namespace + '-arbeidsgiver-identifikatorer')
    }
  }

  const setInntektOgTimer = (inntektOgTimer: Array<InntektOgTime>) => {
    if (newMode) {
      _setNewForsikringPeriode({
        ..._newForsikringPeriode,
        inntektOgTimer
      } as any)
      _resetValidation(namespace + '-inntektOgTimer')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      inntektOgTimer
    } as any)
    if (resetValidation) {
      resetValidation(namespace + '-inntektOgTimer')
    }
  }

  const setInntektOgTimerInfo = (inntektOgTimerInfo: string) => {
    if (newMode) {
      _setNewForsikringPeriode({
        ..._newForsikringPeriode,
        inntektOgTimerInfo: inntektOgTimerInfo.trim()
      } as any)
      _resetValidation(namespace + '-inntektOgTimerInfo')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      inntektOgTimerInfo: inntektOgTimerInfo.trim()
    } as any)
    if (resetValidation) {
      resetValidation(namespace + '-inntektOgTimerInfo')
    }
  }

  const setBeløp = (newBeløp: string) => {
    const beloep = parseFloat(newBeløp?.trim().replace(",", ".")).toFixed(2)
    if (newMode) {
      _setNewForsikringPeriode({
        ..._newForsikringPeriode,
        beloep: beloep,
        valuta: _.isNil((_newForsikringPeriode as any)?.valuta) ? 'NOK' : (_newForsikringPeriode as any)?.valuta
      } as any)
      _resetValidation([namespace + '-beloep', namespace + '-valuta'])
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      beloep: beloep,
      valuta: _.isNil((_editForsikringPeriode as any)?.valuta) ? 'NOK' : (_editForsikringPeriode as any)?.valuta
    } as any)
    if (resetValidation) {
      resetValidation(namespace + '-beloep')
    }
  }

  const setValuta = (newValuta: Currency) => {
    if (newMode) {
      _setNewForsikringPeriode({
        ..._newForsikringPeriode,
        valuta: newValuta.value
      } as any)
      _resetValidation(namespace + '-valuta')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      valuta: newValuta.value
    } as any)
    if (resetValidation) {
      resetValidation(namespace + '-valuta')
    }
  }

  const setAnnenTypeForsikringsperiode = (annenTypeForsikringsperiode: string) => {
    if (newMode) {
      _setNewForsikringPeriode({
        ..._newForsikringPeriode,
        annenTypeForsikringsperiode: annenTypeForsikringsperiode.trim()
      } as any)
      _resetValidation(namespace + '-annenTypeForsikringsperiode')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      annenTypeForsikringsperiode: annenTypeForsikringsperiode.trim()
    } as any)
    if (resetValidation) {
      resetValidation(namespace + '-annenTypeForsikringsperiode')
    }
  }

  const onCloseNew = () => {
    if (setCopiedPeriod) {
      setCopiedPeriod(null)
    }

    _resetValidation(namespace)
    if (onForsikringPeriodeNewClose) {
      onForsikringPeriodeNewClose()
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setInEditMode(false)
    _setEditForsikringPeriode(undefined)
    if (resetValidation) {
      resetValidation(namespace)
    }
  }

  const onStartEdit = (p: T) => {
    _setInEditMode(true)
    _setEditForsikringPeriode(_.cloneDeep(p))
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationForsikringPeriodeBoxProps>(
      clonedValidation!, namespace, validateForsikringPeriodeBox, {
        forsikringPeriode: _editForsikringPeriode,
        showAddress,
        validateAddress,
        showArbeidsgiver,
        showInntekt,
        showAnnen,
        showBeløp
      })
    if (!!_editForsikringPeriode && !hasErrors) {
      if (_.isFunction(onForsikringPeriodeEdit)) {
        onForsikringPeriodeEdit(_editForsikringPeriode, forsikringPeriode!)
      }
      onCloseEdit(namespace)
    } else {
      if (setValidation) {
        setValidation(clonedValidation!)
      }
    }
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      forsikringPeriode: _newForsikringPeriode,
      showAddress,
      validateAddress,
      showArbeidsgiver,
      showInntekt,
      showAnnen,
      showBeløp
    })
    if (!!_newForsikringPeriode && valid) {
      if (_.isFunction(onForsikringPeriodeNew)) {
        onForsikringPeriodeNew(_newForsikringPeriode)
      }
      onCloseNew()
    }
  }

  const onRemove = () => {
    if (_.isFunction(onForsikringPeriodeDelete)) {
      onForsikringPeriodeDelete(forsikringPeriode!)
    }
  }

  const onCopy = (p:T) => {
    if (_.isFunction(setCopiedPeriod)) {
      setCopiedPeriod(p)
    }
  }

  const onSelectCheckboxClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (_.isFunction(onForsikringPeriodeSelect)) {
      onForsikringPeriodeSelect(forsikringPeriode!, e.target.checked)
    }
  }

  const _forsikringPeriode: ForsikringPeriode | null | undefined = newMode ? _newForsikringPeriode : (_inEditMode ? _editForsikringPeriode : forsikringPeriode)
  // if this is a selectable box, then it's selected if we find an index in it
  const selected: boolean = !_.isNil(_forsikringPeriode?.__index) && _forsikringPeriode!.__index >= 0
  const _v: Validation = newMode ? _validation : (validation ?? {})

  return (
    <RepeatableBox
      padding="4"
      borderWidth="1"
      className={classNames(style, {
        error: hasNamespaceWithErrors(_v, namespace)
      })}
    >
      <VStack gap="4">
      {(newMode || (_inEditMode && allowEdit)) && (
        <HStack>
          <Spacer/>
          <AddRemovePanel
            item={newMode ? null : forsikringPeriode}
            index={newMode ? -1 : 0}
            marginTop={false}
            allowDelete={allowDelete}
            inEditMode={_inEditMode}
            onStartEdit={onStartEdit}
            onConfirmEdit={onSaveEdit}
            onAddNew={onAddNew}
            onCopy={setCopiedPeriod ? onCopy : undefined}
            onCancelEdit={() => onCloseEdit(namespace)}
            onCancelNew={onCloseNew}
            onRemove={onRemove}
          />
        </HStack>
      )}
      <HStack gap="4" align="center">
        {newMode || (_inEditMode && allowEdit)
          ? (
            <PeriodeInput
              namespace={namespace}
              error={{
                startdato: _v[namespace + '-startdato']?.feilmelding,
                sluttdato: _v[namespace + '-sluttdato']?.feilmelding
              }}
              hideLabel={false}
              setPeriode={setPeriode}
              value={_forsikringPeriode}
            />
            )
          : (
              <>
                {icon && <>{icon}</>}
                <VStack>
                  <Label id={_v[namespace + '-startdato']?.skjemaelementId}>
                    {toDateFormat(_forsikringPeriode?.startdato, 'DD.MM.YYYY')}
                  </Label>
                  {_v[namespace + '-startdato']?.feilmelding && (
                    <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                      {_v[namespace + '-startdato']?.feilmelding}
                    </Label>
                  )}
                </VStack>
                -
                {_forsikringPeriode?.sluttdato
                  ? (
                    <VStack>
                      <Label id={namespace + '-sluttdato'}>
                        {toDateFormat(_forsikringPeriode?.sluttdato, 'DD.MM.YYYY')}
                      </Label>
                      {_v[namespace + '-sluttdato']?.feilmelding && (
                        <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                          {_v[namespace + '-sluttdato']?.feilmelding}
                        </Label>
                      )}
                    </VStack>
                    )
                  : (
                    <VStack>
                      <Label id={_v[namespace + '-aapenPeriodeType']?.skjemaelementId}>
                        {' (' + _forsikringPeriode?.aapenPeriodeType + ')'}
                      </Label>
                      {_v[namespace + '-aapenPeriodeType']?.feilmelding && (
                        <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                          {_v[namespace + '-aapenPeriodeType']?.feilmelding}
                        </Label>
                      )}
                    </VStack>
                  )
                }
              </>
          )
        }
        <Spacer/>
        {allowEdit && !newMode && !_inEditMode && (
          <AddRemovePanel
            item={newMode ? null : forsikringPeriode}
            index={newMode ? -1 : 0}
            marginTop={_inEditMode}
            allowDelete={allowDelete}
            inEditMode={_inEditMode}
            onStartEdit={onStartEdit}
            onConfirmEdit={onSaveEdit}
            onAddNew={onAddNew}
            onCopy={setCopiedPeriod ? onCopy : undefined}
            onCancelEdit={() => onCloseEdit(namespace)}
            onCancelNew={onCloseNew}
            onRemove={onRemove}
          />
        )}
        {!(_inEditMode || newMode) && selectable && (
          <Checkbox
            checked={selected}
            onChange={onSelectCheckboxClicked}
          >{t('label:velg')}
          </Checkbox>
        )}
      </HStack>
      {!_inEditMode && (showArbeidsgiver || showAnnen || showAddress || showInntekt) && (
        <HorizontalLineSeparator />
      )}
      {newMode || (_inEditMode && editable === 'full')
        ? (
          <>
            {showArbeidsgiver && (
              <>
                <Input
                  namespace={namespace + '-arbeidsgiver'}
                  error={_v[namespace + '-arbeidsgiver-navn']?.feilmelding}
                  id='navn'
                  label={t('label:navn')}
                  onChanged={setNavn}
                  value={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.navn}
                />
                <Heading size='small'>
                  {t('label:institusjonens-id')}
                </Heading>
                <Box>
                  <IdentifikatorFC
                    identifikatorer={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer}
                    onIdentifikatorerChanged={setIdentifikatorer}
                    namespace={namespace + '-arbeidsgiver-identifikatorer'}
                    validation={_v}
                  />
                </Box>
                {showAddress && (
                  <Accordion>
                    <Accordion.Item>
                    <Accordion.Header>{t('label:forsikringsperiode-adresse')}</Accordion.Header>
                    <Accordion.Content>
                      <AdresseForm
                        adresse={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.adresse}
                        onAdressChanged={setAdresse}
                        type={false}
                        namespace={namespace + '-arbeidsgiver-adresse'}
                        validation={_v}
                      />
                    </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                )}
              </>
            )}
            {showInntekt && (
              <>
                <Heading size='small'>
                  {t('label:inntekt-og-time')}
                </Heading>
                <InntektOgTimerFC
                  validation={_v}
                  parentNamespace={namespace}
                  inntektOgTimer={(_forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimer}
                  onInntektOgTimeChanged={setInntektOgTimer}
                />
                <Input
                  error={_v[namespace + '-inntektOgTimerInfo']?.feilmelding}
                  namespace={namespace}
                  id='inntektOgTimerInfo'
                  label={t('label:inntekt-og-time-info')}
                  onChanged={(newInntektOgTimerInfo: string) => setInntektOgTimerInfo(newInntektOgTimerInfo)}
                  value={(_forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimerInfo}
                  required={true}
                />
              </>
            )}
            {showAnnen && (
              <Input
                error={_v[namespace + '-annenTypeForsikringsperiode']?.feilmelding}
                namespace={namespace}
                id='annenTypeForsikringsperiode'
                label={t('label:annen-type')}
                onChanged={setAnnenTypeForsikringsperiode}
                value={(_forsikringPeriode as PeriodeAnnenForsikring).annenTypeForsikringsperiode}
                required={true}
              />
            )}

            {showBeløp && (
              <HGrid gap="4" align="start" columns={2}>
                <Input
                  error={_v[namespace + '-beloep']?.feilmelding}
                  namespace={namespace}
                  id='beloep'
                  label={t('label:beløp')}
                  onChanged={setBeløp}
                  required
                  value={(_forsikringPeriode as PeriodeFerieForsikring)?.beloep ? (_forsikringPeriode as PeriodeFerieForsikring)?.beloep?.replace('.', ',') : undefined}
                />
                <CountrySelect
                  closeMenuOnSelect
                  ariaLabel={t('label:valuta')}
                  data-testid={namespace + '-valuta'}
                  error={_v[namespace + '-valuta']?.feilmelding}
                  id={namespace + '-valuta'}
                  label={t('label:valuta') + ' *'}
                  locale='nb'
                  menuPortalTarget={document.body}
                  onOptionSelected={setValuta}
                  type='currency'
                  values={(_forsikringPeriode as PeriodeFerieForsikring)?.valuta}
                />
              </HGrid>
            )}
          </>
          )
        : (
          <>
            <HStack gap="4">
              {showArbeidsgiver && (
                <>
                  <VStack gap="4">
                    <VStack>
                      <Label id={namespace + '-arbeidsgiver-navn'}>
                        {(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.navn}
                      </Label>
                      {_v[namespace+ '-arbeidsgiver-navn']?.feilmelding && (
                        <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                          {_v[namespace + '-arbeidsgiver-navn']?.feilmelding}
                        </Label>
                      )}
                    </VStack>
                    {showAddress && showAddressInListView  && (
                      <>
                        <HorizontalLineSeparator />
                        <VStack>
                          {_.isEmpty((_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.adresse) || !adresseHasProps((_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.adresse)
                            ? (
                              <BodyLong>
                                {t('message:warning-unknown-address')}
                              </BodyLong>
                              )
                            : (
                              <AdresseBox
                                border={false}
                                adresse={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.adresse}
                                padding='0'
                                seeType={false}
                              />
                              )}
                          {_v[namespace + '-arbeidsgiver-adresse']?.feilmelding && (
                            <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                              {_v[namespace + '-arbeidsgiver-adresse']?.feilmelding}
                            </Label>
                          )}
                        </VStack>
                      </>
                    )}
                  </VStack>
                  <Spacer/>
                  <VStack>
                    {_.isEmpty((_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer)
                      ? (
                        <BodyLong>{t('message:warning-no-ids')}</BodyLong>
                        )
                      : (_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer?.map((id, i) => {
                          const _namespace = namespace + getIdx(i)
                          return (
                            <FormText
                              key={id.type}
                              error={_validation[_namespace + '-identifikatorer']?.feilmelding}
                              id={_namespace + '-identifikatorer'}
                            >
                              <HStack gap="2">
                                <Label>{t('label:' + id.type) + ':'}</Label>
                                {id?.id}
                              </HStack>
                            </FormText>
                          )
                        })}
                    {_v[namespace + '-arbeidsgiver-identifikatorer']?.feilmelding && (
                      <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                        {_v[namespace + '-arbeidsgiver-identifikatorer']?.feilmelding}
                      </Label>
                    )}
                  </VStack>
                  <Spacer/>
                </>
              )}
            </HStack>
            {showInntekt && (
              <Box>
                <VStack width="100%">
                  <Label>
                    {(_forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimerInfo}
                  </Label>
                  {(_forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimer?.map((inntektOgTime: InntektOgTime) => (
                    <HGrid columns={3} gap="4" align="center" key={inntektOgTime?.inntektsperiode.startdato} width="100%">
                      <PeriodeText
                        error={{
                          startdato: _v[namespace + '-inntektOgTimer-startdato']?.feilmelding,
                          sluttdato: _v[namespace + '-inntektOgTimer-sluttdato']?.feilmelding
                        }}
                        namespace={namespace}
                        periode={inntektOgTime?.inntektsperiode}
                      />
                      <span>{inntektOgTime?.bruttoinntekt?.replace('.', ',')}  {inntektOgTime?.valuta}</span>
                      <span>{inntektOgTime?.arbeidstimer?.replace('.', ',')} {t('label:arbeidstimer')}</span>
                    </HGrid>
                  ))}
                </VStack>
              </Box>
            )}
            {showAnnen && (
              <BodyLong>
                {(_forsikringPeriode as PeriodeAnnenForsikring).annenTypeForsikringsperiode}
              </BodyLong>
            )}
            {showBeløp && (
              <HStack gap="2">
                <Label>{t('label:beløp') + ':'} </Label>
                <FormText
                  error={_v[namespace + '-beloep']?.feilmelding}
                  id={namespace + '-beloep'}
                >
                  {(_forsikringPeriode as PeriodeFerieForsikring)?.beloep ? (_forsikringPeriode as PeriodeFerieForsikring)?.beloep?.replace('.', ',') : '-'}
                </FormText>
                <FormText
                  error={_v[namespace + '-valuta']?.feilmelding}
                  id={namespace + '-valuta'}
                >
                  {(_forsikringPeriode as PeriodeFerieForsikring)?.valuta}
                </FormText>
              </HStack>
            )}
          </>
          )}
      {error && (
        <BodyLong>
          duplicate warning
        </BodyLong>
      )}
      </VStack>
    </RepeatableBox>
  )
}

export default ForsikringPeriodeBox
