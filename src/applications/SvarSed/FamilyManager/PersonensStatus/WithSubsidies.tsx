import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'components/AddRemovePanel/useAddRemove'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { AlignStartRow } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
import { Option, Options } from 'declarations/app'
import { PensjonPeriode, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ValueType } from 'react-select'
import { validateWithSubsidies, ValidationWithSubsidiesProps } from './withSubsidiesValidation'

interface WithSubsidiesProps {
  highContrast: boolean
  updateReplySed: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  validation: Validation
}

const WithSubsidies: React.FC<WithSubsidiesProps> = ({
  highContrast,
  updateReplySed,
  personID,
  replySed,
  resetValidation,
  validation
}: WithSubsidiesProps): JSX.Element => {
  const { t } = useTranslation()
  const target: string = `${personID}.perioderMedPensjon`
  const perioderMedPensjon: Array<PensjonPeriode> = _.get(replySed, target)
  const namespace = `familymanager-${personID}-personensstatus-withsubsidies`

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newPensjonType, _setNewPensjonType] = useState<string>('')

  const [addCandidateForDeletion, removeCandidateForDeletion, hasKey] = useAddRemove()
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationWithSubsidiesProps>({}, validateWithSubsidies)

  const selectPensjonTypeOptions: Options = [{
    label: t('el:option-trygdeordning-alderspensjon'), value: 'alderspensjon'
  }, {
    label: t('el:option-trygdeordning-uførhet'), value: 'uførhet'
  }]

  const setStartDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(dato)
      _resetValidation(namespace + '-startdato')
    } else {
      const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioderMedPensjon)
      newPerioder[index].periode.startdato = dato
      updateReplySed(target, newPerioder)
      if (validation[namespace + '-startdato']) {
        resetValidation(namespace + '-startdato')
      }
    }
  }

  const setSluttDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(dato)
      _resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioderMedPensjon)
      if (dato === '') {
        delete newPerioder[index].periode.sluttdato
        newPerioder[index].periode.aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].periode.aapenPeriodeType
        newPerioder[index].periode.sluttdato = dato
      }
      updateReplySed(target, newPerioder)
      if (validation[namespace + '-sluttdato']) {
        resetValidation(namespace + '-sluttdato')
      }
    }
  }

  const setPensjonType = (type: string | undefined, index: number) => {
    if (type) {
      if (index < 0) {
        _setNewPensjonType(type)
        _resetValidation(namespace + '-pensjontype')
      } else {
        const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioderMedPensjon)
        newPerioder[index].pensjonstype = type
        updateReplySed(target, newPerioder)
        if (validation[namespace + '-pensjontype']) {
          resetValidation(namespace + '-pensjontype')
        }
      }
    }
  }

  const resetForm = () => {
    _setNewStartDato('')
    _setNewSluttDato('')
    _setNewPensjonType('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const getKey = (p: PensjonPeriode): string => {
    return p?.periode.startdato // assume startdato is unique
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioderMedPensjon)
    const deletedPeriods: Array<PensjonPeriode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeCandidateForDeletion(getKey(deletedPeriods[0]))
    }
    updateReplySed(target, newPerioder)
  }

  const onAdd = () => {
    const newPensjonPeriode: PensjonPeriode = {
      pensjonstype: _newPensjonType,
      periode: {
        startdato: _newStartDato
      }
    }
    if (_newSluttDato) {
      newPensjonPeriode.periode.sluttdato = _newSluttDato
    } else {
      newPensjonPeriode.periode.aapenPeriodeType = 'åpen_sluttdato'
    }
    const valid: boolean = performValidation({
      pensjonPeriod: newPensjonPeriode,
      otherPensjonPeriods: perioderMedPensjon,
      index: -1,
      namespace
    })

    if (valid) {
      let newPensjonPerioder: Array<PensjonPeriode> = _.cloneDeep(perioderMedPensjon)
      if (_.isNil(newPensjonPerioder)) {
        newPensjonPerioder = []
      }
      const newPeriode: Periode = {
        startdato: _newStartDato
      } as Periode
      if (_newSluttDato) {
        newPeriode.sluttdato = _newSluttDato
      } else {
        newPeriode.aapenPeriodeType = 'åpen_sluttdato'
      }
      newPensjonPerioder = newPensjonPerioder.concat({
        pensjonstype: _newPensjonType,
        periode: newPeriode
      })
      resetForm()
      updateReplySed(target, newPensjonPerioder)
    }
  }

  const getPensjonTypeOption = (value: string | undefined | null) => _.find(selectPensjonTypeOptions, s => s.value === value)

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (p: PensjonPeriode | undefined, i: number) => {
    const key = p ? getKey(p) : 'new'
    const candidateForDeletion = i < 0 ? false : !!key && hasKey(key)
    const idx = (i >= 0 ? '[' + i + ']' : '')
    return (
      <div className={classNames('slideInFromLeft')}>
        <AlignStartRow>
          <Column>
            <Input
              feil={getErrorFor(i, 'startdato')}
              namespace={namespace + idx}
              id='startdato-date'
              label={t('label:startdato')}
              onChanged={(value: string) => setStartDato(value, i)}
              placeholder={t('el:placeholder-date-default')}
              value={i < 0 ? _newStartDato : p?.periode.startdato}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(i, 'sluttdato')}
              namespace={namespace + idx}
              id='sluttdato-date'
              label={t('label:sluttdato')}
              onChanged={(value: string) => setSluttDato(value, i)}
              placeholder={t('el:placeholder-date-default')}
              value={i < 0 ? _newSluttDato : p?.periode.sluttdato}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Select
              data-test-id={'c-' + namespace + idx + '-pensjontype-text'}
              feil={getErrorFor(i, 'pensjontype')}
              highContrast={highContrast}
              id={'c-' + namespace + idx + '-pensjontype-text'}
              label={t('label:type-pensjon')}
              menuPortalTarget={document.body}
              onChange={(e: ValueType<Option, false>) => setPensjonType(e?.value, i)}
              options={selectPensjonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={getPensjonTypeOption(i < 0 ? _newPensjonType : (p as PensjonPeriode)?.pensjonstype)}
              defaultValue={getPensjonTypeOption(i < 0 ? _newPensjonType : (p as PensjonPeriode)?.pensjonstype)}
            />
          </Column>
          <Column />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(i >= 0)}
              marginTop
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(i)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </div>
    )
  }

  return (
    <>
      <Undertittel>
        {t('el:title-periode-pensjon-avsenderlandet')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {perioderMedPensjon
        ?.sort((a, b) =>
          moment(a.periode.startdato).isSameOrBefore(moment(b.periode.startdato)) ? -1 : 1
        )
        ?.map(renderRow)}
      <hr />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(undefined, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
    </>
  )
}

export default WithSubsidies
