import { Add, Close, Delete, Edit, Office1 } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Detail, Ingress, Panel } from '@navikt/ds-react'
import AdresseForm from 'applications/SvarSed/PersonManager/Adresser/AdresseForm'
import IdentifikatorFC from 'applications/SvarSed/PersonManager/Identifikator/Identifikator'
import classNames from 'classnames'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import Input from 'components/Forms/Input'
import PeriodeInput, { toDateFormat } from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { Adresse as IAdresse, ArbeidsgiverIdentifikator, Periode, PeriodeMedForsikring } from 'declarations/sed.d'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import {
  AlignStartRow,
  Column,
  FlexCenterSpacedDiv,
  FlexDiv,
  FlexEndDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { generateIdentifikatorKey } from 'utils/arbeidsgiver'
import { validateArbeidsgiver, ValidationArbeidsgiverProps } from './validation'

const ArbeidsgiverPanel = styled(Panel)`
  padding: 0rem !important;
  max-width: 800px;
  &.new {
    background-color: #FFFFCC;
  }
  &.new {
    background-color: light-gray;
  }
`
const AdresseDiv = styled.div`
  .panel {
    padding: 0px !important;
  }
`

const EditIcon = styled(Edit)`
  cursor: pointer;
`
const TrashcanIcon = styled(Delete)`
  width: 20px;
  cursor: pointer;
`
export type Editable = 'no' | 'only_period' | 'full'

export interface ArbeidsgiverProps {
  arbeidsgiver: PeriodeMedForsikring
  editable?: Editable
  error?: boolean,
  includeAddress ?: boolean
  newArbeidsgiver?: boolean
  orphanArbeidsgiver ?: boolean
  onArbeidsgiverSelect?: (a: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverEdit?: (a: PeriodeMedForsikring, old: PeriodeMedForsikring, checked: boolean) => void
  onArbeidsgiverDelete?: (a: PeriodeMedForsikring, checked: boolean) => void
  namespace: string
  personFnr?: string
  selected?: boolean
  selectable?: boolean
}

const ArbeidsgiverBox = ({
  arbeidsgiver,
  editable = 'no',
  error = false,
  includeAddress = false,
  newArbeidsgiver = false,
  orphanArbeidsgiver = false,
  selected = false,
  selectable = true,
  onArbeidsgiverSelect,
  onArbeidsgiverDelete,
  onArbeidsgiverEdit,
  namespace
//  personFnr
}: ArbeidsgiverProps): JSX.Element => {
  const { t } = useTranslation()
  const _namespace = namespace + '-arbeidsgiver[' + (generateIdentifikatorKey(arbeidsgiver.arbeidsgiver.identifikatorer) ?? '-') + ']'

  const [_isDeleting, setIsDeleting] = useState<boolean>(false)
  const [_isEditing, setIsEditing] = useState<boolean>(false)
  const [_beforeEditingVersion, setBeforeEditingVersion] = useState<PeriodeMedForsikring | undefined>(undefined)

  const [_arbeidsgiversNavn, setArbeidsgiversNavn] = useState<string>(arbeidsgiver.arbeidsgiver.navn ?? '')
  const [_arbeidsgiversIdentifikator, setArbeidsgiversIdentifikator] = useState<Array<ArbeidsgiverIdentifikator>>(arbeidsgiver.arbeidsgiver.identifikatorer ?? [])
  const [_arbeidsgiverPeriode, setArbeidsgiversPeriode] = useState<Periode>({
    startdato: arbeidsgiver.startdato,
    sluttdato: arbeidsgiver.sluttdato,
    aapenPeriodeType: arbeidsgiver.aapenPeriodeType
  })

  // for includeAddress
  const [_adresse, _setAdresse] = useState<IAdresse | undefined>(arbeidsgiver.arbeidsgiver.adresse ?? undefined)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationArbeidsgiverProps>({}, validateArbeidsgiver)

  const setAdresse = (adresse: IAdresse) => {
    _setAdresse(adresse)
  }

  const onNameChanged = (newName: string) => {
    resetValidation(_namespace + '-navn')
    setArbeidsgiversNavn(newName)
  }

  const onIdentifikatorerChanged = (newIdentifikatorer: Array<ArbeidsgiverIdentifikator>, whatChanged: string) => {
    resetValidation(_namespace + '-' + whatChanged)
    setArbeidsgiversIdentifikator(newIdentifikatorer)
    if (whatChanged && _validation[namespace + '-' + whatChanged]) {
      (resetValidation(namespace + '-' + whatChanged))
    }
  }

  const onPeriodeChanged = (newPeriode: Periode) => {
    if (_arbeidsgiverPeriode.startdato !== newPeriode.startdato) {
      resetValidation(_namespace + '-startdato')
    }
    if (_arbeidsgiverPeriode.sluttdato !== newPeriode.sluttdato) {
      resetValidation(_namespace + '-sluttdato')
    }
    setArbeidsgiversPeriode(newPeriode)
  }

  const onSaveEditButtonClicked = () => {
    const newArbeidsgiver: PeriodeMedForsikring = {
      ..._arbeidsgiverPeriode,
      arbeidsgiver: {
        identifikatorer: _arbeidsgiversIdentifikator,
        navn: _arbeidsgiversNavn
      }
    } as PeriodeMedForsikring

    if (includeAddress) {
      newArbeidsgiver.arbeidsgiver.adresse = _adresse
    }

    const valid: boolean = performValidation({
      arbeidsgiver: newArbeidsgiver,
      includeAddress: includeAddress,
      namespace: _namespace
    })
    if (valid) {
      if (_.isFunction(onArbeidsgiverEdit)) {
        onArbeidsgiverEdit(newArbeidsgiver, _beforeEditingVersion!, selected)
      }
      setIsEditing(false)
      setBeforeEditingVersion(undefined)
    }
  }

  const onEditButtonClicked = () => {
    setIsEditing(true)
    setBeforeEditingVersion(_.cloneDeep(arbeidsgiver))
    setArbeidsgiversIdentifikator(_arbeidsgiversIdentifikator)
    setArbeidsgiversNavn(_arbeidsgiversNavn || '')
    setArbeidsgiversPeriode(_arbeidsgiverPeriode)
    if (includeAddress) {
      _setAdresse(_adresse)
    }
  }

  const onCancelButtonClicked = () => {
    setIsEditing(false)
    setArbeidsgiversIdentifikator(_beforeEditingVersion?.arbeidsgiver.identifikatorer ?? [])
    setArbeidsgiversNavn(_beforeEditingVersion?.arbeidsgiver.navn || '')
    setArbeidsgiversPeriode({
      startdato: _beforeEditingVersion?.startdato!,
      sluttdato: _beforeEditingVersion?.sluttdato,
      aapenPeriodeType: _beforeEditingVersion?.aapenPeriodeType
    })
    setBeforeEditingVersion(undefined)
  }

  const onSelectCheckboxClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (_.isFunction(onArbeidsgiverSelect)) {
      onArbeidsgiverSelect(arbeidsgiver, e.target.checked)
    }
  }

  if (!_arbeidsgiversNavn || _.isEmpty(_arbeidsgiversIdentifikator)) {
    return <div />
  }
  return (
    <div
      className='slideInFromLeft'
      key={generateIdentifikatorKey(_arbeidsgiversIdentifikator)}
    >
      <VerticalSeparatorDiv size='0.5' />
      <ArbeidsgiverPanel
        border
        className={classNames({ new: newArbeidsgiver, orphan: orphanArbeidsgiver })}
      >
        {_isEditing
          ? (
            <FlexDiv style={{ padding: '0.5rem 0.5rem 0rem 0.5rem' }}>
              <VerticalSeparatorDiv size='0.5' />
              <Row>
                <PeriodeInput
                  namespace={_namespace}
                  error={{
                    startdato: _validation[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _validation[_namespace + '-sluttdato']?.feilmelding
                  }}
                  setPeriode={onPeriodeChanged}
                  value={_arbeidsgiverPeriode}
                />
              </Row>
            </FlexDiv>
            )
          : (
            <FlexEndDiv style={{ padding: '0.5rem' }}>
              <Ingress>
                {toDateFormat(_arbeidsgiverPeriode.startdato, 'DD.MM.YYYY')} {
                _arbeidsgiverPeriode.sluttdato
                  ? ' - ' + toDateFormat(_arbeidsgiverPeriode.sluttdato, 'DD.MM.YYYY')
                  : '(' + t('label:' + _arbeidsgiverPeriode.aapenPeriodeType).toLowerCase() + ')'
                }
              </Ingress>
              <HorizontalSeparatorDiv size='0.5' />
              {arbeidsgiver?.extra?.fraArbeidsgiverregisteret === 'ja' && (
                <BodyLong>{t('label:fra-arbeidsgiverregisteret')}</BodyLong>
              )}
              {arbeidsgiver?.extra?.fraInntektsregisteret === 'ja' && (
                <BodyLong>{t('label:fra-inntektsregisteret')}</BodyLong>
              )}
            </FlexEndDiv>
            )}
        <FlexCenterSpacedDiv>
          <FlexDiv style={{ padding: '1rem' }} className='slideInFromLeft'>
            <Office1 width='30' height='30' />
            <HorizontalSeparatorDiv />
            <div>
              {_isEditing && editable === 'full'
                ? (
                  <>
                    <AlignStartRow>
                      <Column>
                        <Input
                          namespace={_namespace}
                          error={_validation[_namespace + '-navn']?.feilmelding}
                          id='navn'
                          label={t('label:navn')}
                          onChanged={onNameChanged}
                          value={_arbeidsgiversNavn}
                        />
                      </Column>
                    </AlignStartRow>
                    {includeAddress && (
                      <>
                        <HorizontalSeparatorDiv />
                        <div>
                          <VerticalSeparatorDiv size='0.5' />
                          <AdresseForm
                            adresse={_adresse}
                            onAdressChanged={setAdresse}
                            namespace={_namespace}
                            validation={_validation}
                          />
                        </div>
                      </>
                    )}
                  </>
                  )
                : (
                  <div>
                    <Detail>
                      {_arbeidsgiversNavn}
                    </Detail>
                    <HorizontalLineSeparator />
                    <VerticalSeparatorDiv size='0.5' />
                    {_.isEmpty(_adresse)
                      ? (
                        <BodyLong>
                          {t('message:warning-unknown-address')}
                        </BodyLong>
                        )
                      : (
                        <AdresseDiv>
                          <AdresseBox border={false} adresse={_adresse} />
                        </AdresseDiv>
                        )}
                  </div>
                  )}
            </div>
            <HorizontalSeparatorDiv />
            <div>
              {_isEditing && editable === 'full'
                ? (
                  <IdentifikatorFC
                    identifikatorer={_arbeidsgiversIdentifikator}
                    onIdentifikatorerChanged={onIdentifikatorerChanged}
                    namespace={_namespace + '-identifikatorer'}
                    validation={_validation}
                    personName={_arbeidsgiversNavn}
                  />
                  )
                : (
                  <>
                    {_.isEmpty(_arbeidsgiversIdentifikator)
                      ? (<BodyLong>{t('message:warning-no-ids')}</BodyLong>)
                      : null}
                    {_arbeidsgiversIdentifikator.map(id => (
                      <BodyLong key={id.type}>
                        {t('el:option-identifikator-' + id.type) + ': ' + id.id}
                      </BodyLong>
                    ))}
                  </>
                  )}
            </div>
            <>
              <HorizontalSeparatorDiv />
              {error && (
                <BodyLong>
                  duplicate warning
                </BodyLong>
              )}

            </>
          </FlexDiv>
          <FlexDiv style={{ padding: '1rem' }} className='slideInFromRight'>
            {editable === 'full' && !_isEditing && !_isDeleting && (
              <>
                <Button
                  variant='tertiary'
                  style={{
                    marginTop: '-0.5rem',
                    marginRight: '-0.5rem'
                  }}
                  onClick={() => setIsDeleting(!_isDeleting)}
                >
                  <TrashcanIcon />
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
              </>
            )}
            {editable !== 'no' && !_isEditing && !_isDeleting && (
              <>
                <Button
                  variant='tertiary'
                  style={{
                    marginTop: '-0.5rem',
                    marginRight: '-0.5rem'
                  }}
                  onClick={onEditButtonClicked}
                >
                  <EditIcon />
                </Button>
                <HorizontalSeparatorDiv />
              </>
            )}
            {!_isEditing && !_isDeleting && selectable && (
              <Checkbox
                checked={selected}
                onChange={onSelectCheckboxClicked}
              >{t('label:velg')}
              </Checkbox>
            )}
            {_isEditing && (
              <PileDiv>
                <Button
                  variant='secondary'
                  onClick={onSaveEditButtonClicked}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-save')}
                </Button>
                <VerticalSeparatorDiv size='0.5' />
                <Button
                  variant='tertiary'
                  onClick={onCancelButtonClicked}
                >
                  <Close />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-cancel')}
                </Button>
              </PileDiv>
            )}
          </FlexDiv>
          {_isDeleting && (
            <PileCenterDiv className='slideInFromRight'>
              <strong>
                {t('label:er-du-sikker')}
              </strong>
              <VerticalSeparatorDiv />
              <FlexDiv>
                <Button
                  variant='secondary'
                  onClick={() => {
                    if (_.isFunction(onArbeidsgiverDelete)) {
                      onArbeidsgiverDelete(arbeidsgiver, selected)
                    }
                  }}
                >
                  <Delete />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-remove')}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
                <Button
                  variant='tertiary'
                  onClick={() => setIsDeleting(!_isDeleting)}
                >
                  {t('el:button-cancel')}
                </Button>
                <HorizontalSeparatorDiv />
              </FlexDiv>
            </PileCenterDiv>
          )}
        </FlexCenterSpacedDiv>
      </ArbeidsgiverPanel>
      <VerticalSeparatorDiv size='0.5' />
    </div>
  )
}

export default ArbeidsgiverBox
