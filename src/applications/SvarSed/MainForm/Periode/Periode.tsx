import { AddCircle } from '@navikt/ds-icons'
import { Button, Radio, RadioGroup } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import {
  validateAnmodningsPeriode,
  ValidationAnmodningsPeriodeProps
} from 'applications/SvarSed/MainForm/Periode/validation'
import { mapState, OneLevelFormProps, OneLevelFormSelector } from 'applications/SvarSed/OneLevelForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import PeriodeInput from 'components/Forms/PeriodeInput'
import TextArea from 'components/Forms/TextArea'
import { HorizontalLineSeparator, RepeatableRow, TextAreaDiv } from 'components/StyledComponents'
import { F002Sed, FSed, Periode } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import { isFSed } from 'utils/sed'

const PeriodeFC: React.FC<OneLevelFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
}: OneLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: OneLevelFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-periode`

  const [_newAnmodningsperioder, _setNewAnmodningsperioder] = useState<Periode>({ startdato: '' })

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationAnmodningsPeriodeProps>({}, validateAnmodningsPeriode)

  const resetForm = () => {
    _setNewAnmodningsperioder({ startdato: '' })
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newAnmodningsperioder: Array<Periode> = _.cloneDeep((replySed as FSed).anmodningsperioder)
    const deletedAnmodningsperioder: Array<Periode> = newAnmodningsperioder.splice(index, 1)
    if (deletedAnmodningsperioder && deletedAnmodningsperioder.length > 0) {
      removeFromDeletion(deletedAnmodningsperioder[0])
    }
    dispatch(updateReplySed('anmodningsperioder', newAnmodningsperioder))
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      anmodningsperiode: _newAnmodningsperioder,
      namespace
    })
    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep((replySed as FSed).anmodningsperioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(_newAnmodningsperioder)
      dispatch(updateReplySed('anmodningsperioder', newPerioder))
      onCancel()
    }
  }

  const setAnmodningsperioder = (newPeriode: Periode, index: number) => {
    if (index < 0) {
      _setNewAnmodningsperioder(newPeriode)
      _resetValidation(namespace + '-anmodningsperioder-stardato')
      _resetValidation(namespace + '-anmodningsperioder-sluttdato')
    } else {
      dispatch(updateReplySed(`anmodningsperioder[${index}]`, newPeriode))
      if (validation[namespace + '-anmodningsperioder' + getIdx(index) + '-stardato']) {
        dispatch(resetValidation(namespace + '-anmodningsperiode' + getIdx(index) + '-stardato'))
      }
      if (validation[namespace + '-anmodningsperioder' + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + '-anmodningsperioder' + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const setInfoPresisering = (infoPresisering: string) => {
    dispatch(updateReplySed('krav.infoPresisering', infoPresisering.trim()))
    if (validation[namespace + '-infoPresisering']) {
      dispatch(resetValidation(namespace + '-infoPresisering'))
    }
  }

  const setKravMottattDato = (kravDato: string) => {
    dispatch(updateReplySed('krav.kravMottattDato', kravDato.trim()))
    if (validation[namespace + '-kravMottattDato']) {
      dispatch(resetValidation(namespace + '-kravMottattDato'))
    }
  }
  const setKravType = (krav: string) => {
    dispatch(updateReplySed('krav.kravType', krav.trim()))
    if (validation[namespace + '-kravType']) {
      dispatch(resetValidation(namespace + '-kravType'))
    }
  }

  const setInfoType = (info: string) => {
    dispatch(updateReplySed('krav.infoType', info.trim()))
    if (validation[namespace + '-infoType']) {
      dispatch(resetValidation(namespace + '-infoType'))
    }
  }


  const renderPeriode = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    const getErrorFor = (index: number, el: string): string | undefined => {
      return index < 0
        ? _validation[namespace + '-anmodningsperioder' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-anmodningsperioder' + idx + '-' + el]?.feilmelding
    }
    const _periode = index < 0 ? _newAnmodningsperioder : periode
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <PeriodeInput
            namespace={namespace + '-perioder' + getIdx(index)}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            breakInTwo
            setPeriode={(p: Periode) => setAnmodningsperioder(p, index)}
            value={_periode}
          />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periode)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periode)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <VerticalSeparatorDiv/>
      {isFSed(replySed) && (
        <>
          {(replySed as FSed)?.anmodningsperioder?.map(renderPeriode)}
          <VerticalSeparatorDiv />
          <HorizontalLineSeparator />
          <VerticalSeparatorDiv />
          {_seeNewForm
            ? renderPeriode(null, -1)
            : (
              <Row>
                <Column>
                  <Button
                    variant='tertiary'
                    onClick={() => _setSeeNewForm(true)}
                  >
                    <AddCircle />
                    {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
                  </Button>
                </Column>
              </Row>
            )}
          <VerticalSeparatorDiv />
        </>
      )}
    <VerticalSeparatorDiv/>
    <PaddedDiv>
      <Row>
        <Column>
          <div>
            <RadioGroup
              legend={t('label:type-krav')}
              data-testid='seddetails-typeKrav'
              error={validation['seddetails-typeKrav']?.feilmelding}
              id='seddetails-kravType'
              onChange={(e: string | number | boolean) => setKravType(e as string)}
              value={(replySed as F002Sed).krav?.kravType}
            >
              <Radio
                value='nytt_krav'
              >
                {t('label:kravType-nytt_krav')}
              </Radio>
              <Radio
                value='endrede_omstendigheter'
              >
                {t('label:kravType-endrede_omstendigheter')}
              </Radio>
            </RadioGroup>

          <VerticalSeparatorDiv />
          <DateInput
            error={validation[namespace + '-kravMottattDato']?.feilmelding}
            namespace={namespace}
            key={(replySed as F002Sed).krav?.kravMottattDato ?? ''}
            id='kravMottattDato'
            label={t('label:krav-mottatt-dato')}
            onChanged={setKravMottattDato}
            value={(replySed as F002Sed).krav?.kravMottattDato}
          />
          <VerticalSeparatorDiv />
          </div>
        </Column>
        <Column>
        <RadioGroup
          legend={t('label:informasjon-om-søknaden')}
          data-testid='seddetails-informasjon'
          error={validation['seddetails-informasjon']?.feilmelding}
          id='seddetails-informasjon'
          value={(replySed as F002Sed).krav?.infoType}
          onChange={(e: string | number | boolean) => setInfoType(e as string)}
        >
          <Radio
            value='vi_bekrefter_leverte_opplysninger'
          >
            {t('label:info-confirm-information')}
          </Radio>
          <Radio
            value='gi_oss_punktvise_opplysninger'
          >
            {t('label:info-point-information')}
          </Radio>
          {(replySed as F002Sed).krav?.infoType === 'gi_oss_punktvise_opplysninger' && (
            <div>
              <VerticalSeparatorDiv />
              <TextAreaDiv>
                <TextArea
                  error={validation['seddetails-opplysninger']?.feilmelding}
                  id='opplysninger'
                  namespace='seddetails'
                  label={t('label:opplysninger')}
                  maxLength={500}
                  onChanged={setInfoPresisering}
                  value={(replySed as F002Sed).krav?.infoPresisering ?? ''}
                />
              </TextAreaDiv>
            </div>
          )}
        </RadioGroup>
        </Column>
      </Row>
    </PaddedDiv>
      </>
  )
}

export default PeriodeFC
