import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Label } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import { RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import {
  AlignStartRow,
  Column,
  PaddedDiv,
  PaddedHorizontallyDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateDagpengerPeriode, ValidationDagpengerPeriodeProps } from './validation'
import { PDPeriode } from 'declarations/pd'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const Dagpenger: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}: TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, TwoLevelFormSelector>(mapState)
  const dispatch = useDispatch()
  const target: string = 'perioderDagpengerMottatt'
  const perioderDagpengerMottatt: Array<PDPeriode> | undefined = _.get(replySed, target)
  const namespace: string = `${parentNamespace}-${personID}-dagpenger`

  const [_newStartdato, _setNewStartdato] = useState<string |undefined>(undefined)
  const [_newSluttdato, _setNewSluttdato] = useState<string |undefined>(undefined)
  const [_newInfo, _setNewInfo] = useState<string |undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PDPeriode>((p: PDPeriode): string => p.startdato + '-' + (p.sluttdato ?? ''))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationDagpengerPeriodeProps>({}, validateDagpengerPeriode)

  const onStartdatoChange = (newStartdato: string, index: number) => {
    if (index < 0) {
      _setNewStartdato(newStartdato.trim())
      _resetValidation(namespace + '-startdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].startdato`, newStartdato.trim()))
      if (validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
    }
  }

  const onSluttdatoChange = (newSluttdato: string, index: number) => {
    if (index < 0) {
      _setNewSluttdato(newSluttdato.trim())
      _resetValidation(namespace + '-sluttdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].sluttdato`, newSluttdato.trim()))
      if (validation[namespace + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const onInfoChange = (newInfo: string, index: number) => {
    if (index < 0) {
      _setNewInfo(newInfo.trim())
      _resetValidation(namespace + '-info')
    } else {
      dispatch(updateReplySed(`${target}[${index}].info`, newInfo.trim()))
      if (validation[namespace + getIdx(index) + '-info']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-info'))
      }
    }
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PDPeriode> = _.cloneDeep(perioderDagpengerMottatt) as Array<PDPeriode>
    const deletedPerioder: Array<PDPeriode> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    standardLogger('pdu1.editor.dagpenger.periode.remove')
    dispatch(updateReplySed(`${target}`, newPerioder))
  }

  const resetForm = () => {
    _setNewStartdato('')
    _setNewSluttdato('')
    _setNewInfo('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      startdato: _newStartdato,
      sluttdato: _newSluttdato,
      info: _newInfo,
      namespace: namespace
    })
    if (valid) {
      let newPerioder: Array<PDPeriode> | undefined = _.cloneDeep(perioderDagpengerMottatt)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat({
        startdato: _newStartdato!,
        sluttdato: _newSluttdato!,
        info: _newInfo ?? ''
      })
      dispatch(updateReplySed(`${target}`, newPerioder))
      standardLogger('pdu1.editor.dagpenger.perioder.add')
      onCancel()
    }
  }

  const renderRow = (p: PDPeriode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(p)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const startdato = index < 0 ? _newStartdato : p?.startdato
    const sluttdato = index < 0 ? _newSluttdato : p?.sluttdato
    const info = index < 0 ? _newInfo : p?.info
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              ariaLabel={t('label:startdato')}
              error={getErrorFor(index, 'startdato')}
              id='startdato'
              key={namespace + idx + '-startdato-' + startdato}
              hideLabel={index >= 0}
              label={t('label:startdato')}
              namespace={namespace + idx}
              onChanged={(e: string) => onStartdatoChange(e, index)}
              value={startdato}
            />
          </Column>
          <Column>
            <Input
              ariaLabel={t('label:sluttdato')}
              error={getErrorFor(index, 'sluttdato')}
              id='sluttdato'
              key={namespace + idx + '-sluttdato-' + sluttdato}
              hideLabel={index >= 0}
              label={t('label:sluttdato')}
              namespace={namespace + idx}
              onChanged={(e: string) => onSluttdatoChange(e, index)}
              value={sluttdato}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <Input
              error={getErrorFor(index, 'info')}
              namespace={namespace + idx}
              id='type'
              key={namespace + idx + '-info-' + info}
              label={t('label:comment')}
              onChanged={(newInfo: string) => onInfoChange(newInfo, index)}
              value={info}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={index >= 0}
              marginTop
              onBeginRemove={() => addToDeletion(p)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(p)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }
  return (
    <div key={namespace + '-div'}>
      <PaddedDiv>
        <Heading size='medium'>
          {t('label:mottatte-dagpenger')}
        </Heading>
        <VerticalSeparatorDiv />
      </PaddedDiv>
      {_.isEmpty(perioderDagpengerMottatt)
        ? (
          <PaddedDiv>
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
          </PaddedDiv>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <AlignStartRow>
                <Column>
                  <Label>
                    {t('label:startdato')}
                  </Label>
                </Column>
                <Column>
                  <Label>
                    {t('label:sluttdato')}
                  </Label>
                </Column>
                <Column />
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {perioderDagpengerMottatt?.map(renderRow)}
          </>
          )}
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
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
          </PaddedDiv>
          )}
    </div>
  )
}

export default Dagpenger
