import { Add } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Label } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import { RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import {
  AlignStartRow,
  Column,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateDagpengerPeriode, ValidationDagpengerPeriodeProps } from './validation'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const Dagpenger: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}: PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target: string = 'perioderDagpengerMottatt'
  const perioderDagpengerMottatt: Array<Periode> | undefined = _.get(replySed, target)
  const namespace: string = `${parentNamespace}-${personID}-dagpenger`

  const [_newStartdato, _setNewStartdato] = useState<string |undefined>(undefined)
  const [_newSluttdato, _setNewSluttdato] = useState<string |undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => p.startdato + '-' + (p.sluttdato ?? ''))
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

  const onRemove = (index: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(perioderDagpengerMottatt) as Array<Periode>
    const deletedPerioder: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    standardLogger('pdu1.editor.dagpenger.periode.remove')
    dispatch(updateReplySed(`${target}`, newPerioder))
  }

  const resetForm = () => {
    _setNewStartdato('')
    _setNewSluttdato('')
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
      namespace: namespace
    })
    if (valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(perioderDagpengerMottatt)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat({
        startdato: _newStartdato!,
        sluttdato: _newSluttdato!
      })
      dispatch(updateReplySed(`${target}`, newPerioder))
      standardLogger('pdu1.editor.dagpenger.perioder.add')
      onCancel()
    }
  }

  const renderRow = (p: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(p)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const startdato = index < 0 ? _newStartdato : p?.startdato
    const sluttdato = index < 0 ? _newSluttdato : p?.sluttdato
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
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
          <Column flex='1.5'>
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
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={index >= 0}
              marginTop={index < 0}
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
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
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
