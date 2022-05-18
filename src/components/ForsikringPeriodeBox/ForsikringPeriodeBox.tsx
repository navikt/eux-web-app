import { Office1 } from '@navikt/ds-icons'
import { BodyLong, Checkbox, Detail, Heading, Label, Panel } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexDiv,
  FlexEndDiv,
  FlexStartSpacedDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
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
import { HorizontalLineSeparator } from 'components/StyledComponents'
import {
  Adresse as IAdresse,
  ArbeidsgiverIdentifikator,
  ArbeidsgiverWithAdresse,
  ForsikringPeriode,
  InntektOgTime,
  Periode,
  PeriodeAnnenForsikring, PeriodeMedForsikring,
  PeriodeUtenForsikring
} from 'declarations/sed.d'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { getIdx } from 'utils/namespace'
import InntektOgTimerFC from './InntektOgTimer/InntektOgTimer'
import { validateForsikringPeriode, ValidationForsikringPeriodeProps } from './validation'

const ArbeidsgiverPanel = styled(Panel)`
  padding: 0rem !important;
  max-width: 800px;
  &.new {
    background-color: rgba(236, 243, 153, 0.5);
  }
  &.original {
    background-color: var(--navds-global-color-blue-100);
  }
`
export type Editable = 'no' | 'only_period' | 'full'

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
  editMode ?: boolean
  allowDelete ?: boolean
  style ?: string
}

const ForsikringPeriodeBox = <T extends ForsikringPeriode>({
  forsikringPeriode,
  editable = 'no',
  error = false,
  icon,
  showAnnen = false,
  showAddress = false,
  showInntekt = false,
  showArbeidsgiver = true,
  namespace,
  onForsikringPeriodeSelect,
  onForsikringPeriodeDelete,
  onForsikringPeriodeEdit,
  onForsikringPeriodeNew,
  onForsikringPeriodeNewClose,
  selectable = true,
  newMode = false,
  editMode = false,
  allowDelete = false,
  style
}: ArbeidsgiverBoxProps<T>): JSX.Element => {
  const { t } = useTranslation()

  const [_inEditMode, _setInEditMode] = useState<boolean>(false)
  const [_editForsikringPeriode, _setEditForsikringPeriode] = useState<any | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationForsikringPeriodeProps>(validateForsikringPeriode, namespace)

  const setPeriode = (periode: Periode) => {
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      ...periode
    } as ForsikringPeriode)
    _resetValidation(namespace + '-startdato')
    _resetValidation(namespace + '-sluttdato')
  }

  const setAdresse = (adresse: IAdresse) => {
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      arbeidsgiver: {
        ..._editForsikringPeriode?.arbeidsgiver,
        adresse
      } as ArbeidsgiverWithAdresse
    } as ForsikringPeriode)
    _resetValidation(namespace + '-arbeidsgiver-adresse')
  }

  const setNavn = (navn: string) => {
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      arbeidsgiver: {
        ..._editForsikringPeriode?.arbeidsgiver,
        navn
      } as ArbeidsgiverWithAdresse
    } as ForsikringPeriode)
    _resetValidation(namespace + '-arbeidsgiver-navn')
  }

  const setIdentifikatorer = (identifikatorer: Array<ArbeidsgiverIdentifikator>) => {
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      arbeidsgiver: {
        ..._editForsikringPeriode?.arbeidsgiver,
        identifikatorer
      } as ArbeidsgiverWithAdresse
    } as ForsikringPeriode)
    _resetValidation(namespace + '-arbeidsgiver-identifikatorer')
  }

  const setInntektOgTimer = (inntektOgTimer: Array<InntektOgTime>) => {
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      inntektOgTimer
    } as PeriodeUtenForsikring)
    _resetValidation(namespace + '-inntektOgTimer')
  }

  const setInntektOgTimerInfo = (inntektOgTimerInfo: string) => {
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      inntektOgTimerInfo
    } as PeriodeUtenForsikring)
    _resetValidation(namespace + '-inntektOgTimerInfo')
  }

  const setAnnenTypeForsikringsperiode = (annenTypeForsikringsperiode: string) => {
    _setEditForsikringPeriode({
      ..._editForsikringPeriode,
      annenTypeForsikringsperiode
    } as PeriodeAnnenForsikring)
    _resetValidation(namespace + '-annenTypeForsikringsperiode')
  }

  const onCloseEdit = (namespace: string) => {
    _setInEditMode(false)
    _setEditForsikringPeriode(undefined)
    _resetValidation(namespace)
  }

  const onStartEdit = (p: ForsikringPeriode) => {
    _setInEditMode(true)
    _setEditForsikringPeriode(_.cloneDeep(p))
  }

  const onSaveEdit = () => {
    const valid: boolean = _performValidation({
      forsikringPeriode: _editForsikringPeriode,
      showAddress,
      showArbeidsgiver
    })
    if (!!_editForsikringPeriode && valid) {
      if (_.isFunction(onForsikringPeriodeEdit)) {
        onForsikringPeriodeEdit(_editForsikringPeriode, forsikringPeriode!)
      }
      onCloseEdit(namespace)
    }
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      forsikringPeriode: _editForsikringPeriode,
      showAddress,
      showArbeidsgiver
    })
    if (!!_editForsikringPeriode && valid) {
      if (newMode && _.isFunction(onForsikringPeriodeNew)) {
        onForsikringPeriodeNew(_editForsikringPeriode)
      }
    }
    onCloseEdit(namespace)
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

  const _forsikringPeriode: ForsikringPeriode | null | undefined = (_inEditMode || newMode || editMode) ? _editForsikringPeriode : forsikringPeriode
  const selected: boolean = !_.isNil(_forsikringPeriode?.__index) && _forsikringPeriode!.__index >= 0

  const addremove = (
    <PileEndDiv>
      {!(_inEditMode || newMode || editMode) && selectable && (
        <Checkbox
          checked={selected}
          onChange={onSelectCheckboxClicked}
        >{t('label:velg')}
        </Checkbox>
      )}
      {editable !== 'no' && (
        <AddRemovePanel
          item={forsikringPeriode}
          index={newMode ? -1 : 0}
          allowDelete={allowDelete}
          inEditMode={_inEditMode || editMode}
          onStartEdit={onStartEdit}
          onConfirmEdit={onSaveEdit}
          onAddNew={newMode ? onAddNew : () => {}}
          onCancelEdit={() => onCloseEdit(namespace)}
          onCancelNew={onForsikringPeriodeNewClose}
          onRemove={onRemove}
        />
      )}
    </PileEndDiv>
  )

  return (
    <div>
      <VerticalSeparatorDiv size='0.5' />
      <ArbeidsgiverPanel border className={classNames(style)}>
        {(_inEditMode || newMode || editMode) && editable !== 'no'
          ? (
            <PaddedDiv>
              <AlignStartRow>
                <PeriodeInput
                  namespace={namespace}
                  error={{
                    startdato: _validation[namespace + '-startdato']?.feilmelding,
                    sluttdato: _validation[namespace + '-sluttdato']?.feilmelding
                  }}
                  hideLabel={false}
                  setPeriode={setPeriode}
                  value={_forsikringPeriode}
                />
              </AlignStartRow>
              <Column />
            </PaddedDiv>
            )
          : (
            <FlexEndDiv style={{ padding: '0.5rem' }}>
              <Label>
                {toDateFormat(_forsikringPeriode?.startdato, 'DD.MM.YYYY')}
                {_forsikringPeriode?.sluttdato
                  ? ' - ' + toDateFormat(_forsikringPeriode?.sluttdato, 'DD.MM.YYYY')
                  : '(' + t('label:' + _forsikringPeriode?.aapenPeriodeType).toLowerCase() + ')'}
              </Label>
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
            </FlexEndDiv>
            )}
        <VerticalSeparatorDiv size='0.3' />
        <PaddedHorizontallyDiv>
          <HorizontalLineSeparator />
        </PaddedHorizontallyDiv>
        <VerticalSeparatorDiv size='0.3' />
        {(_inEditMode || newMode || editMode) && editable === 'full'
          ? (
            <>
              <PaddedDiv>
                <AlignStartRow>
                  <Column>
                    <Input
                      namespace={namespace + '-arbeidsgiver'}
                      error={_validation[namespace + '-arbeidsgiver-navn']?.feilmelding}
                      id='navn'
                      label={t('label:navn')}
                      onChanged={setNavn}
                      value={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.navn}
                    />
                  </Column>
                </AlignStartRow>
              </PaddedDiv>
              <PaddedDiv>
                <Heading size='small'>
                  {t('label:institusjonens-id')}
                </Heading>
              </PaddedDiv>
              <IdentifikatorFC
                identifikatorer={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer}
                onIdentifikatorerChanged={setIdentifikatorer}
                namespace={namespace + '-arbeidsgiver-identifikatorer'}
                validation={_validation}
              />
              {showAddress && (
                <PaddedDiv>
                  <AdresseForm
                    adresse={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.adresse}
                    onAdressChanged={setAdresse}
                    namespace={namespace + '-arbeidsgiver-adresse'}
                    validation={_validation}
                  />
                </PaddedDiv>
              )}
              <AlignStartRow>
                <AlignEndColumn>
                  {addremove}
                </AlignEndColumn>
              </AlignStartRow>
            </>
            )
          : (
            <FlexStartSpacedDiv style={{ padding: '1rem' }}>
              <FlexDiv>
                {icon ?? <Office1 width='32' height='32' />}
                <HorizontalSeparatorDiv />
                <PileDiv>
                  <Detail>
                    {(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.navn}
                  </Detail>
                  <HorizontalLineSeparator />
                  <VerticalSeparatorDiv size='0.5' />
                  {_.isEmpty((_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.adresse)
                    ? (
                      <BodyLong>
                        {t('message:warning-unknown-address')}
                      </BodyLong>
                      )
                    : (
                      <AdresseBox border={false} adresse={(_forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.adresse} padding='0' seeType />
                      )}
                </PileDiv>
              </FlexDiv>
              <PileDiv>
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
              </PileDiv>
              {addremove}
            </FlexStartSpacedDiv>
            )}
        {showInntekt && (
          <>
            {(_inEditMode || newMode || editMode) && editable === 'full'
              ? (
                <InntektOgTimerFC
                  validation={_validation}
                  parentNamespace={namespace}
                  inntektOgTimer={(_forsikringPeriode as PeriodeUtenForsikring).inntektOgTimer}
                  onInntektOgTimeChanged={(newInntektOgTimer: Array<InntektOgTime>) => setInntektOgTimer(newInntektOgTimer)}
                />
                )
              : (
                <BodyLong>{JSON.stringify((_forsikringPeriode as PeriodeUtenForsikring).inntektOgTimer)}</BodyLong>
                )}
            <VerticalSeparatorDiv />
            <AlignStartRow>
              <Column>
                {(_inEditMode || newMode || editMode) && editable === 'full'
                  ? (
                    <Input
                      error={_validation[namespace + '-inntektOgTimerInfo']?.feilmelding}
                      namespace={namespace}
                      id='inntektOgTimerInfo'
                      key={namespace + '-inntektOgTimerInfo-' + (_forsikringPeriode as PeriodeUtenForsikring).inntektOgTimerInfo}
                      label={t('label:inntekt-og-time-info')}
                      onChanged={(newInntektOgTimerInfo: string) => setInntektOgTimerInfo(newInntektOgTimerInfo)}
                      value={(_forsikringPeriode as PeriodeUtenForsikring).inntektOgTimerInfo}
                    />
                    )
                  : (
                    <BodyLong>
                      {JSON.stringify((_forsikringPeriode as PeriodeUtenForsikring).inntektOgTimerInfo)}
                    </BodyLong>
                    )}
              </Column>
            </AlignStartRow>
          </>
        )}
        {showAnnen && (
          <>
            {(_inEditMode || newMode || editMode) && editable === 'full'
              ? (
                <Input
                  error={_validation[namespace + '-annenTypeForsikringsperiode']?.feilmelding}
                  namespace={namespace}
                  id='annenTypeForsikringsperiode'
                  key={namespace + '-annenTypeForsikringsperiode-' + (_forsikringPeriode as PeriodeAnnenForsikring).annenTypeForsikringsperiode}
                  label={t('label:annen-type')}
                  onChanged={(newAnnenTypeForsikringsperiode: string) => setAnnenTypeForsikringsperiode(newAnnenTypeForsikringsperiode)}
                  value={(_forsikringPeriode as PeriodeAnnenForsikring).annenTypeForsikringsperiode}
                />
                )
              : (
                <BodyLong>
                  {(_forsikringPeriode as PeriodeAnnenForsikring).annenTypeForsikringsperiode}
                </BodyLong>
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
    </div>
  )
}

export default ForsikringPeriodeBox
