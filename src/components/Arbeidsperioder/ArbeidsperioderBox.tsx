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
import AddRemovePanel2 from 'components/AddRemovePanel/AddRemovePanel2'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import PeriodeInput, { toDateFormat } from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import {
  Adresse as IAdresse,
  ArbeidsgiverIdentifikator,
  ArbeidsgiverWithAdresse,
  Periode,
  PeriodeMedForsikring
} from 'declarations/sed.d'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { getIdx } from 'utils/namespace'
import { validatePeriodeMedForsikring, ValidationPeriodeMedForsikringProps } from './validation'

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
  periodeMedForsikring: T | null
  editable?: Editable
  error?: boolean,
  showAddress ?: boolean
  namespace: string
  onPeriodeMedForsikringSelect?: (a: T, checked: boolean) => void
  onPeriodeMedForsikringEdit?: (a: T, old: T) => void
  onPeriodeMedForsikringDelete?: (a: T) => void
  onPeriodeMedForsikringNew?: (a: T) => void
  onPeriodeMedForsikringNewClose ?: () => void
  selectable?: boolean
  newMode ?: boolean
  editMode ?: boolean
  allowDelete ?: boolean
  style ?: string
}

const ArbeidsperioderBox = <T extends PeriodeMedForsikring>({
  periodeMedForsikring,
  editable = 'no',
  error = false,
  showAddress = false,
  namespace,
  onPeriodeMedForsikringSelect,
  onPeriodeMedForsikringDelete,
  onPeriodeMedForsikringEdit,
  onPeriodeMedForsikringNew,
  onPeriodeMedForsikringNewClose,
  selectable = true,
  newMode = false,
  editMode = false,
  allowDelete = false,
  style
}: ArbeidsgiverBoxProps<T>): JSX.Element => {
  const { t } = useTranslation()

  const [_inEditMode, _setInEditMode] = useState<boolean>(false)
  const [_editPeriodeMedForsikring, _setEditPeriodeMedForsikring] = useState<T | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPeriodeMedForsikringProps>(validatePeriodeMedForsikring, namespace)

  const setPeriode = (periode: Periode) => {
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      ...periode
    } as T)
    _resetValidation(namespace + '-startdato')
    _resetValidation(namespace + '-sluttdato')
  }

  const setAdresse = (adresse: IAdresse) => {
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      arbeidsgiver: {
        ..._editPeriodeMedForsikring?.arbeidsgiver,
        adresse
      } as ArbeidsgiverWithAdresse
    } as T)
    _resetValidation(namespace + '-arbeidsgiver-adresse')
  }

  const setNavn = (navn: string) => {
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      arbeidsgiver: {
        ..._editPeriodeMedForsikring?.arbeidsgiver,
        navn
      } as ArbeidsgiverWithAdresse
    } as T)
    _resetValidation(namespace + '-arbeidsgiver-navn')
  }

  const setIdentifikatorer = (identifikatorer: Array<ArbeidsgiverIdentifikator>) => {
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      arbeidsgiver: {
        ..._editPeriodeMedForsikring?.arbeidsgiver,
        identifikatorer
      } as ArbeidsgiverWithAdresse
    } as T)
    _resetValidation(namespace + '-arbeidsgiver-identifikatorer')
  }

  const onCloseEdit = (namespace: string) => {
    _setInEditMode(false)
    _setEditPeriodeMedForsikring(undefined)
    _resetValidation(namespace)
  }

  const onStartEdit = (p: T) => {
    _setInEditMode(true)
    _setEditPeriodeMedForsikring(_.cloneDeep(p))
  }

  const onSaveEdit = () => {
    const valid: boolean = _performValidation({
      periodeMedForsikring: _editPeriodeMedForsikring,
      showAddress: showAddress!
    })
    if (!!_editPeriodeMedForsikring && valid) {
      if (_.isFunction(onPeriodeMedForsikringEdit)) {
        onPeriodeMedForsikringEdit(_editPeriodeMedForsikring, periodeMedForsikring!)
      }
      onCloseEdit(namespace)
    }
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      periodeMedForsikring: _editPeriodeMedForsikring,
      showAddress: showAddress!
    })
    if (!!_editPeriodeMedForsikring && valid) {
      if (newMode && _.isFunction(onPeriodeMedForsikringNew)) {
        onPeriodeMedForsikringNew(_editPeriodeMedForsikring)
      }
    }
    onCloseEdit(namespace)
  }

  const onRemove = () => {
    if (_.isFunction(onPeriodeMedForsikringDelete)) {
      onPeriodeMedForsikringDelete(periodeMedForsikring!)
    }
  }

  const onSelectCheckboxClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (_.isFunction(onPeriodeMedForsikringSelect)) {
      onPeriodeMedForsikringSelect(periodeMedForsikring!, e.target.checked)
    }
  }

  const _periodeMedForsikring: T | null | undefined = (_inEditMode || newMode || editMode) ? _editPeriodeMedForsikring : periodeMedForsikring
  const selected: boolean = !_.isNil(_periodeMedForsikring?.__index) && _periodeMedForsikring!.__index >= 0

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
        <AddRemovePanel2
          item={periodeMedForsikring}
          index={newMode ? -1 : 0}
          allowDelete={allowDelete}
          inEditMode={_inEditMode || editMode}
          onStartEdit={onStartEdit}
          onConfirmEdit={onSaveEdit}
          onAddNew={newMode ? onAddNew : () => {}}
          onCancelEdit={() => onCloseEdit(namespace)}
          onCancelNew={onPeriodeMedForsikringNewClose}
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
                  value={_periodeMedForsikring}
                />
              </AlignStartRow>
              <Column />
            </PaddedDiv>
            )
          : (
            <FlexEndDiv style={{ padding: '0.5rem' }}>
              <Label>
                {toDateFormat(_periodeMedForsikring?.startdato, 'DD.MM.YYYY')}
                {_periodeMedForsikring?.sluttdato
                  ? ' - ' + toDateFormat(_periodeMedForsikring?.sluttdato, 'DD.MM.YYYY')
                  : '(' + t('label:' + _periodeMedForsikring?.aapenPeriodeType).toLowerCase() + ')'}
              </Label>
              <HorizontalSeparatorDiv size='0.5' />
              {periodeMedForsikring?.extra?.fraArbeidsgiverregisteret === 'ja' && (
                <BodyLong>{t('label:fra-arbeidsgiverregisteret')}</BodyLong>
              )}
              {periodeMedForsikring?.extra?.fraInntektsregisteret === 'ja' && (
                <BodyLong>{t('label:fra-inntektsregisteret')}</BodyLong>
              )}
              {periodeMedForsikring?.extra?.fraSed === 'ja' && (
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
                      value={_periodeMedForsikring?.arbeidsgiver?.navn}
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
                identifikatorer={_periodeMedForsikring?.arbeidsgiver?.identifikatorer}
                onIdentifikatorerChanged={setIdentifikatorer}
                namespace={namespace + '-arbeidsgiver-identifikatorer'}
                validation={_validation}
              />
              {showAddress && (
                <PaddedDiv>
                  <AdresseForm
                    adresse={_periodeMedForsikring?.arbeidsgiver?.adresse}
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
                <Office1 width='32' height='32' />
                <HorizontalSeparatorDiv />
                <PileDiv>
                  <Detail>
                    {_periodeMedForsikring?.arbeidsgiver?.navn}
                  </Detail>
                  <HorizontalLineSeparator />
                  <VerticalSeparatorDiv size='0.5' />
                  {_.isEmpty(_periodeMedForsikring?.arbeidsgiver?.adresse)
                    ? (
                      <BodyLong>
                        {t('message:warning-unknown-address')}
                      </BodyLong>
                      )
                    : (
                      <AdresseBox border={false} adresse={_periodeMedForsikring?.arbeidsgiver?.adresse} padding='0' seeType />
                      )}
                </PileDiv>
              </FlexDiv>
              <PileDiv>
                {_.isEmpty(_periodeMedForsikring?.arbeidsgiver?.identifikatorer)
                  ? (
                    <BodyLong>{t('message:warning-no-ids')}</BodyLong>
                    )
                  : _periodeMedForsikring?.arbeidsgiver?.identifikatorer?.map((id, i) => {
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

export default ArbeidsperioderBox
