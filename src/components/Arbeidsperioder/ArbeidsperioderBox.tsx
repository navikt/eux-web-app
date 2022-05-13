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
  PileDiv,
  PileEndDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import IdentifikatorFC from 'applications/SvarSed/Identifikator/Identifikator'
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
`
export type Editable = 'no' | 'only_period' | 'full'

export interface ArbeidsgiverBoxProps {
  periodeMedForsikring: PeriodeMedForsikring
  editable?: Editable
  error?: boolean,
  includeAddress ?: boolean
  namespace: string
  onPeriodeMedForsikringSelect?: (a: PeriodeMedForsikring, checked: boolean) => void
  onPeriodeMedForsikringEdit?: (a: PeriodeMedForsikring, old: PeriodeMedForsikring, checked: boolean) => void
  onPeriodeMedForsikringDelete?: (a: PeriodeMedForsikring) => void
  selected?: boolean
  selectable?: boolean
}

const ArbeidsperioderBox = ({
  periodeMedForsikring,
  editable = 'no',
  error = false,
  includeAddress = false,
  namespace,
  onPeriodeMedForsikringSelect,
  onPeriodeMedForsikringDelete,
  onPeriodeMedForsikringEdit,
  selected = false,
  selectable = true
}: ArbeidsgiverBoxProps): JSX.Element => {
  const { t } = useTranslation()

  const [_inEditMode, _setInEditMode] = useState<boolean>(false)
  const [_editPeriodeMedForsikring, _setEditPeriodeMedForsikring] = useState<PeriodeMedForsikring | undefined>(undefined)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPeriodeMedForsikringProps>(validatePeriodeMedForsikring, namespace)

  const setPeriode = (periode: Periode) => {
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      ...periode
    } as PeriodeMedForsikring)
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
    } as PeriodeMedForsikring)
    _resetValidation(namespace + '-arbeidsgiver-adresse')
  }

  const setNavn = (navn: string) => {
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      arbeidsgiver: {
        ..._editPeriodeMedForsikring?.arbeidsgiver,
        navn
      } as ArbeidsgiverWithAdresse
    } as PeriodeMedForsikring)
    _resetValidation(namespace + '-arbeidsgiver-navn')
  }

  const setIdentifikatorer = (identifikatorer: Array<ArbeidsgiverIdentifikator>) => {
    _setEditPeriodeMedForsikring({
      ..._editPeriodeMedForsikring,
      arbeidsgiver: {
        ..._editPeriodeMedForsikring?.arbeidsgiver,
        identifikatorer
      } as ArbeidsgiverWithAdresse
    } as PeriodeMedForsikring)
    _resetValidation(namespace + '-arbeidsgiver-identifikatorer')
  }

  const onCloseEdit = (namespace: string) => {
    _setInEditMode(false)
    _setEditPeriodeMedForsikring(undefined)
    _resetValidation(namespace)
  }

  const onStartEdit = (p: PeriodeMedForsikring) => {
    _setInEditMode(true)
    _setEditPeriodeMedForsikring(_.cloneDeep(p))
  }

  const onSaveEdit = () => {
    const valid: boolean = _performValidation({
      periodeMedForsikring: _editPeriodeMedForsikring,
      includeAddress: includeAddress!
    })
    if (!!_editPeriodeMedForsikring && valid) {
      if (_.isFunction(onPeriodeMedForsikringEdit)) {
        onPeriodeMedForsikringEdit(_editPeriodeMedForsikring, periodeMedForsikring, selected!)
      }
      onCloseEdit(namespace)
    }
  }

  const onRemove = () => {
    if (_.isFunction(onPeriodeMedForsikringDelete)) {
      onPeriodeMedForsikringDelete(periodeMedForsikring)
    }
  }

  const onSelectCheckboxClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (_.isFunction(onPeriodeMedForsikringSelect)) {
      onPeriodeMedForsikringSelect(periodeMedForsikring, e.target.checked)
    }
  }

  const _periodeMedForsikring: PeriodeMedForsikring | undefined = _inEditMode ? _editPeriodeMedForsikring : periodeMedForsikring

  const addremove = (
    <PileEndDiv>
      {!_inEditMode && selectable && (
        <Checkbox
          checked={selected}
          onChange={onSelectCheckboxClicked}
        >{t('label:velg')}
        </Checkbox>
      )}
      {editable !== 'no' && (
        <AddRemovePanel2
          item={periodeMedForsikring}
          index={0}
          inEditMode={_inEditMode}
          shortButtons
          onStartEdit={onStartEdit}
          onConfirmEdit={onSaveEdit}
          onCancelEdit={() => onCloseEdit(namespace)}
          onRemove={onRemove}
        />
      )}
    </PileEndDiv>
  )

  return (
    <div>
      <VerticalSeparatorDiv size='0.5' />
      <ArbeidsgiverPanel border>
        {_inEditMode
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
            </FlexEndDiv>
            )}
        <VerticalSeparatorDiv size='0.3' />
        <HorizontalLineSeparator />
        <VerticalSeparatorDiv size='0.3' />
        {_inEditMode && editable === 'full'
          ? (
            <>
              <PaddedDiv>
                <AlignStartRow>
                  <Column>
                    <Input
                      namespace={namespace}
                      error={_validation[namespace + '-arbeidsgiver-navn']?.feilmelding}
                      id='arbeidsgiver-navn'
                      label={t('label:navn')}
                      onChanged={setNavn}
                      value={_periodeMedForsikring?.arbeidsgiver.navn}
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
                identifikatorer={_periodeMedForsikring?.arbeidsgiver.identifikatorer}
                onIdentifikatorerChanged={setIdentifikatorer}
                namespace={namespace + '-arbeidsgiver-identifikatorer'}
                validation={_validation}
              />
              {includeAddress && (
                <PaddedDiv>
                  <AdresseForm
                    adresse={_periodeMedForsikring?.arbeidsgiver.adresse}
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
                    {_periodeMedForsikring?.arbeidsgiver.navn}
                  </Detail>
                  <HorizontalLineSeparator />
                  <VerticalSeparatorDiv size='0.5' />
                  {_.isEmpty(_periodeMedForsikring?.arbeidsgiver.adresse)
                    ? (
                      <BodyLong>
                        {t('message:warning-unknown-address')}
                      </BodyLong>
                      )
                    : (
                      <AdresseBox border={false} adresse={_periodeMedForsikring?.arbeidsgiver.adresse} padding='0' />
                      )}
                </PileDiv>
              </FlexDiv>
              <PileDiv>
                {_.isEmpty(_periodeMedForsikring?.arbeidsgiver.identifikatorer)
                  ? (
                    <BodyLong>{t('message:warning-no-ids')}</BodyLong>
                    )
                  : _periodeMedForsikring?.arbeidsgiver.identifikatorer?.map((id, i) => {
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
