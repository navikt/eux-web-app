import { BodyLong, Checkbox, Heading, Label, Panel } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexCenterDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  PileDiv,
  PileEndDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import IdentifikatorFC from 'applications/SvarSed/Identifikator/Identifikator'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput, { toDateFormat } from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import {
  Adresse,
  ArbeidsgiverIdentifikator,
  ArbeidsgiverWithAdresse,
  ForsikringPeriode,
  InntektOgTime,
  Periode,
  PeriodeAnnenForsikring,
  PeriodeMedForsikring,
  PeriodeUtenForsikring
} from 'declarations/sed.d'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { getIdx, getNSIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import InntektOgTimerFC from './InntektOgTimer/InntektOgTimer'
import { validateForsikringPeriode, ValidationForsikringPeriodeProps } from './validation'

const ArbeidsgiverPanel = styled(Panel)`
  padding: 1rem;
  max-width: 800px;
  &.new {
    background-color: rgba(236, 243, 153, 0.5);
  }
  &.original {
    background-color: var(--navds-global-color-blue-100);
  }
`
export type Editable = 'only_period' | 'full'

export interface ArbeidsgiverBoxProps<T> {
  forsikringPeriode: T | null
  editable?: Editable
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
  showInntekt ?: boolean
  showAnnen ?: boolean
  newMode ?: boolean
  allowEdit ?: boolean
  allowDelete ?: boolean
  style ?: string
  validation ?: Validation
  resetValidation ?: (namespace: string) => void
  setValidation ?: (v: Validation) => void
}

const ForsikringPeriodeBox = <T extends ForsikringPeriode>({
  forsikringPeriode,
  editable = 'full',
  error = false,
  icon,
  showAnnen = false,
  showAddress = false,
  showInntekt = false,
  showArbeidsgiver = false,
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
  setValidation
}: ArbeidsgiverBoxProps<T>): JSX.Element => {
  const { t } = useTranslation()

  const [_inEditMode, _setInEditMode] = useState<boolean>(newMode)
  const [_newForsikringPeriode, _setNewForsikringPeriode] = useState<T | undefined>(undefined)
  const [_editForsikringPeriode, _setEditForsikringPeriode] = useState<T | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationForsikringPeriodeProps>(validateForsikringPeriode, namespace)

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
          navn
        } as ArbeidsgiverWithAdresse
      } as any)
      _resetValidation(namespace + '-arbeidsgiver-navn')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      arbeidsgiver: {
        ...(_editForsikringPeriode as any)?.arbeidsgiver,
        navn
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
        inntektOgTimerInfo
      } as any)
      _resetValidation(namespace + '-inntektOgTimerInfo')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      inntektOgTimerInfo
    } as any)
    if (resetValidation) {
      resetValidation(namespace + '-inntektOgTimerInfo')
    }
  }

  const setAnnenTypeForsikringsperiode = (annenTypeForsikringsperiode: string) => {
    if (newMode) {
      _setNewForsikringPeriode({
        ..._newForsikringPeriode,
        annenTypeForsikringsperiode
      } as any)
      _resetValidation(namespace + '-annenTypeForsikringsperiode')
      return
    }
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      annenTypeForsikringsperiode
    } as any)
    if (resetValidation) {
      resetValidation(namespace + '-annenTypeForsikringsperiode')
    }
  }

  const onCloseNew = () => {
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
    const [valid, newValidation] = performValidation<ValidationForsikringPeriodeProps>(
      validation!, namespace, validateForsikringPeriode, {
        forsikringPeriode: _editForsikringPeriode,
        showAddress,
        showArbeidsgiver,
        showInntekt
      })
    if (!!_editForsikringPeriode && valid) {
      if (_.isFunction(onForsikringPeriodeEdit)) {
        onForsikringPeriodeEdit(_editForsikringPeriode, forsikringPeriode!)
      }
      onCloseEdit(namespace)
    } else {
      if (setValidation) {
        setValidation(newValidation)
      }
    }
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      forsikringPeriode: _newForsikringPeriode,
      showAddress,
      showArbeidsgiver,
      showInntekt
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

  const onSelectCheckboxClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (_.isFunction(onForsikringPeriodeSelect)) {
      onForsikringPeriodeSelect(forsikringPeriode!, e.target.checked)
    }
  }

  const _forsikringPeriode: ForsikringPeriode | null | undefined = (_inEditMode) ? _editForsikringPeriode : (newMode ? _newForsikringPeriode : forsikringPeriode)
  // if this is a selectable box, then it's selected if we find an index in it
  const selected: boolean = !_.isNil(_forsikringPeriode?.__index) && _forsikringPeriode!.__index >= 0
  const _v: Validation = newMode ? _validation : (validation ?? {})
  const idx: string = newMode ? '' : getNSIdx(_forsikringPeriode?.__type, _forsikringPeriode?.__index)
  const _namespace: string = namespace + idx

  return (
    <>
      <VerticalSeparatorDiv size='0.5' />
      <ArbeidsgiverPanel border className={classNames(style)}>
        <AlignStartRow>
          {newMode || (_inEditMode && allowEdit)
            ? (
              <PeriodeInput
                namespace={namespace}
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                hideLabel={false}
                setPeriode={setPeriode}
                value={_forsikringPeriode}
              />
              )
            : (
              <Column>
                <FlexCenterDiv style={{ padding: '0.5rem' }}>
                  {icon}
                  <HorizontalSeparatorDiv />
                  <PileDiv>
                    <Label id={_v[_namespace + '-startdato']?.skjemaelementId}>
                      {toDateFormat(_forsikringPeriode?.startdato, 'DD.MM.YYYY')}
                    </Label>
                    {_v[_namespace + '-startdato']?.feilmelding && (
                      <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                        {_v[_namespace + '-startdato']?.feilmelding}
                      </Label>
                    )}
                  </PileDiv>
                  <HorizontalSeparatorDiv size='0.5' />-<HorizontalSeparatorDiv size='0.5' />
                  {_forsikringPeriode?.sluttdato
                    ? (
                      <PileDiv>
                        <Label id={_namespace + '-sluttdato'}>
                          {toDateFormat(_forsikringPeriode?.sluttdato, 'DD.MM.YYYY')}
                        </Label>
                        {_v[_namespace + '-sluttdato']?.feilmelding && (
                          <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                            {_v[_namespace + '-sluttdato']?.feilmelding}
                          </Label>
                        )}
                      </PileDiv>
                      )
                    : (
                      <PileDiv>
                        <Label id={_v[_namespace + '-aapenPeriodeType']?.skjemaelementId}>
                          {' (' + _forsikringPeriode?.aapenPeriodeType + ')'}
                        </Label>
                        {_v[_namespace + '-aapenPeriodeType']?.feilmelding && (
                          <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                            {_v[_namespace + '-aapenPeriodeType']?.feilmelding}
                          </Label>
                        )}
                      </PileDiv>
                      )}
                  <HorizontalSeparatorDiv size='0.5' />
                  {(_forsikringPeriode as PeriodeMedForsikring)?.extra?.fraArbeidsgiverregisteret === 'ja' && (
                    <BodyLong>{t('label:fra-arbeidsgiverregisteret')}</BodyLong>
                  )}
                  {(_forsikringPeriode as PeriodeMedForsikring)?.extra?.fraInntektsregisteret === 'ja' && (
                    <BodyLong>{t('label:fra-inntektsregisteret')}</BodyLong>
                  )}
                  {(_forsikringPeriode as PeriodeMedForsikring)?.extra?.fraSed === 'ja' && (
                    <BodyLong>{t('label:fra-sed')}</BodyLong>
                  )}
                </FlexCenterDiv>
              </Column>
              )}
          <AlignEndColumn>
            <PileEndDiv>
              {!(_inEditMode || newMode) && selectable && (
                <Checkbox
                  checked={selected}
                  onChange={onSelectCheckboxClicked}
                >{t('label:velg')}
                </Checkbox>
              )}
              {(newMode || allowEdit) && (
                <AddRemovePanel
                  item={newMode ? null : forsikringPeriode}
                  index={newMode ? -1 : 0}
                  marginTop={_inEditMode}
                  allowDelete={allowDelete}
                  inEditMode={_inEditMode}
                  onStartEdit={onStartEdit}
                  onConfirmEdit={onSaveEdit}
                  onAddNew={onAddNew}
                  onCancelEdit={() => onCloseEdit(namespace)}
                  onCancelNew={onCloseNew}
                  onRemove={onRemove}
                />
              )}
            </PileEndDiv>
          </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.3' />
        {(showArbeidsgiver || showAnnen || showAddress || showInntekt) && (
          <>
            <HorizontalLineSeparator />
            <VerticalSeparatorDiv />
          </>
        )}
        {newMode || (_inEditMode && editable === 'full')
          ? (
            <>
              {showArbeidsgiver && (
                <>
                  <AlignStartRow>
                    <Column>
                      <Input
                        namespace={_namespace + '-arbeidsgiver'}
                        error={_v[_namespace + '-arbeidsgiver-navn']?.feilmelding}
                        id='navn'
                        label={t('label:navn')}
                        onChanged={setNavn}
                        value={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.navn}
                      />
                    </Column>
                  </AlignStartRow>
                  <VerticalSeparatorDiv />
                  <Heading size='small'>
                    {t('label:institusjonens-id')}
                  </Heading>
                  <IdentifikatorFC
                    identifikatorer={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer}
                    onIdentifikatorerChanged={setIdentifikatorer}
                    namespace={_namespace + '-arbeidsgiver-identifikatorer'}
                    validation={_v}
                  />
                  {showAddress && (
                    <AdresseForm
                      adresse={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.adresse}
                      onAdressChanged={setAdresse}
                      namespace={_namespace + '-arbeidsgiver-adresse'}
                      validation={_v}
                    />
                  )}
                </>
              )}
              {showInntekt && (
                <>
                  <InntektOgTimerFC
                    validation={_v}
                    parentNamespace={_namespace}
                    inntektOgTimer={(_forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimer}
                    onInntektOgTimeChanged={(newInntektOgTimer: Array<InntektOgTime>) => setInntektOgTimer(newInntektOgTimer)}
                  />

                  <AlignStartRow>
                    <Column>
                      <Input
                        error={_validation[namespace + '-inntektOgTimerInfo']?.feilmelding}
                        namespace={namespace}
                        id='inntektOgTimerInfo'
                        key={namespace + '-inntektOgTimerInfo-' + (_forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimerInfo}
                        label={t('label:inntekt-og-time-info')}
                        onChanged={(newInntektOgTimerInfo: string) => setInntektOgTimerInfo(newInntektOgTimerInfo)}
                        value={(_forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimerInfo}
                      />
                    </Column>
                  </AlignStartRow>
                </>
              )}
              {showAnnen && (
                <Input
                  error={_validation[namespace + '-annenTypeForsikringsperiode']?.feilmelding}
                  namespace={namespace}
                  id='annenTypeForsikringsperiode'
                  key={namespace + '-annenTypeForsikringsperiode-' + (_forsikringPeriode as PeriodeAnnenForsikring).annenTypeForsikringsperiode}
                  label={t('label:annen-type')}
                  onChanged={(newAnnenTypeForsikringsperiode: string) => setAnnenTypeForsikringsperiode(newAnnenTypeForsikringsperiode)}
                  value={(_forsikringPeriode as PeriodeAnnenForsikring).annenTypeForsikringsperiode}
                />
              )}
            </>
            )
          : (
            <>
              <AlignStartRow>
                {showAddress && (
                  <>
                    <Column>
                      <FlexDiv>
                        <PileDiv>
                          <PileDiv>
                            <Label id={_namespace + '-arbeidsgiver-navn'}>
                              {(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.navn}
                            </Label>
                            {_v[_namespace + '-arbeidsgiver-navn']?.feilmelding && (
                              <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                                {_v[_namespace + '-arbeidsgiver-navn']?.feilmelding}
                              </Label>
                            )}
                          </PileDiv>
                          {showAddress && (
                            <>
                              <HorizontalLineSeparator />
                              <VerticalSeparatorDiv size='0.5' />
                              <PileDiv>
                                {_.isEmpty((_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.adresse)
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
                                      seeType
                                    />
                                    )}
                                {_v[_namespace + '-arbeidsgiver-adresse']?.feilmelding && (
                                  <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                                    {_v[_namespace + '-arbeidsgiver-adresse']?.feilmelding}
                                  </Label>
                                )}
                              </PileDiv>
                            </>
                          )}
                        </PileDiv>
                      </FlexDiv>
                    </Column>
                    <Column>
                      {_.isEmpty((_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer)
                        ? (
                          <BodyLong>{t('message:warning-no-ids')}</BodyLong>
                          )
                        : (_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer?.map((id, i) => {
                            const idx = getIdx(i)
                            return (
                              <FormText key={id.type} error={_validation[namespace + idx + '-identifikatorer']}>
                                <FlexDiv>
                                  <Label>{t('label:' + id.type) + ':'}</Label>
                                  <HorizontalSeparatorDiv size='0.5' />
                                  {id?.id}
                                </FlexDiv>
                              </FormText>
                            )
                          })}
                      {_v[_namespace + '-arbeidsgiver-identifikatorer']?.feilmelding && (
                        <Label role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium'>
                          {_v[_namespace + '-arbeidsgiver-identifikatorer']?.feilmelding}
                        </Label>
                      )}
                    </Column>
                  </>
                )}
              </AlignStartRow>
              {showInntekt && (
                <>
                  <VerticalSeparatorDiv />
                  <AlignStartRow>
                    <Column>
                      <Label>
                        {(_forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimerInfo}
                      </Label>
                      {(_forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimer?.map((inntektOgTime: InntektOgTime) => (
                        <AlignStartRow key={inntektOgTime?.inntektsperiode.startdato}>
                          <Column>
                            <PeriodeText
                              error={{
                                startdato: _v[_namespace + '-inntektOgTimer-startdato'],
                                sluttdato: _v[_namespace + '-inntektOgTimer-sluttdato']
                              }}
                              periode={inntektOgTime?.inntektsperiode}
                            />
                          </Column>
                          <Column>
                            {inntektOgTime?.bruttoinntekt}  {inntektOgTime?.valuta}
                          </Column>
                          <Column>
                            {inntektOgTime?.arbeidstimer}
                          </Column>
                        </AlignStartRow>
                      ))}
                    </Column>
                  </AlignStartRow>
                </>
              )}
              {showAnnen && (
                <>
                  <VerticalSeparatorDiv />
                  <AlignStartRow>
                    <Column>
                      <BodyLong>
                        {(_forsikringPeriode as PeriodeAnnenForsikring).annenTypeForsikringsperiode}
                      </BodyLong>
                    </Column>
                  </AlignStartRow>
                </>
              )}
            </>
            )}
        {error && (
          <BodyLong>
            duplicate warning
          </BodyLong>
        )}
      </ArbeidsgiverPanel>
      <VerticalSeparatorDiv size='0.5' />
    </>
  )
}

export default ForsikringPeriodeBox
