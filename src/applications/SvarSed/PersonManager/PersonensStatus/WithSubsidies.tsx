import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'hooks/useAddRemove'
import Select from 'components/Forms/Select'
import Period from 'components/Period/Period'
import { AlignStartRow } from 'components/StyledComponents'
import useValidation from 'hooks/useValidation'
import { Option, Options } from 'declarations/app'
import { PensjonPeriode, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ValueType } from 'react-select'
import { getIdx } from 'utils/namespace'
import { validateWithSubsidies, ValidationWithSubsidiesProps } from './withSubsidiesValidation'

interface WithSubsidiesProps {
  highContrast: boolean
  updateReplySed: (needle: string, value: any) => void
  parentNamespace: string
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  validation: Validation
}

const WithSubsidies: React.FC<WithSubsidiesProps> = ({
  highContrast,
  parentNamespace,
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}: WithSubsidiesProps): JSX.Element => {
  const { t } = useTranslation()
  const target: string = `${personID}.perioderMedPensjon`
  const perioderMedPensjon: Array<PensjonPeriode> = _.get(replySed, target)
  const namespace = `${parentNamespace}-withsubsidies`

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newPensjonType, _setNewPensjonType] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PensjonPeriode>((p: PensjonPeriode): string => {
    return p?.periode.startdato // assume startdato is unique
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationWithSubsidiesProps>({}, validateWithSubsidies)

  const selectPensjonTypeOptions: Options = [{
    label: t('el:option-trygdeordning-alderspensjon'), value: 'alderspensjon'
  }, {
    label: t('el:option-trygdeordning-uførhet'), value: 'uførhet'
  }]

  const setStartDato = (newDato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(newDato.trim())
      _resetValidation(namespace + '-startdato')
    } else {
      updateReplySed(`${target}[${index}].startdato`, newDato.trim())
      if (validation[namespace + getIdx(index) + '-startdato']) {
        resetValidation(namespace + getIdx(index) + '-startdato')
      }
    }
  }

  const setSluttDato = (sluttdato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(sluttdato.trim())
      _resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioderMedPensjon)
      if (sluttdato === '') {
        delete newPerioder[index].periode.sluttdato
        newPerioder[index].periode.aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].periode.aapenPeriodeType
        newPerioder[index].periode.sluttdato = sluttdato.trim()
      }
      updateReplySed(target, newPerioder)
      if (validation[namespace + getIdx(index) + '-sluttdato']) {
        resetValidation(namespace + getIdx(index) + '-sluttdato')
      }
    }
  }

  const setPensjonType = (pensjontype: string | undefined, index: number) => {
    if (pensjontype) {
      if (index < 0) {
        _setNewPensjonType(pensjontype.trim())
        _resetValidation(namespace + '-pensjontype')
      } else {
        updateReplySed(`${target}[${index}].pensjonstype`, pensjontype.trim())
        if (validation[namespace + getIdx(index) + '-pensjontype']) {
          resetValidation(namespace + getIdx(index) + '-pensjontype')
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

  const onRemove = (index: number) => {
    const newPerioder: Array<PensjonPeriode> = _.cloneDeep(perioderMedPensjon)
    const deletedPeriods: Array<PensjonPeriode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeFromDeletion(deletedPeriods[0])
    }
    updateReplySed(target, newPerioder)
  }

  const onAdd = () => {
    const newPensjonPeriode: PensjonPeriode = {
      pensjonstype: _newPensjonType.trim(),
      periode: {
        startdato: _newStartDato.trim()
      }
    }
    if (_newSluttDato) {
      newPensjonPeriode.periode.sluttdato = _newSluttDato.trim()
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
      updateReplySed(target, newPensjonPerioder)
      resetForm()
    }
  }

  const getPensjonTypeOption = (value: string | undefined | null) => _.find(selectPensjonTypeOptions, s => s.value === value)

  const renderRow = (pensjonPeriode: PensjonPeriode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(pensjonPeriode)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const startdato = index < 0 ? _newStartDato : pensjonPeriode?.periode.startdato
    const sluttdato = index < 0 ? _newSluttDato : pensjonPeriode?.periode.sluttdato
    return (
      <div
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
      >
        <AlignStartRow>
          <Period
            key={'' + startdato + sluttdato}
            namespace={namespace + idx + '-periode'}
            errorStartDato={getErrorFor(index, 'periode-startdato')}
            errorSluttDato={getErrorFor(index, 'periode-sluttdato')}
            setStartDato={(dato: string) => setStartDato(dato, index)}
            setSluttDato={(dato: string) => setSluttDato(dato, index)}
            valueStartDato={startdato}
            valueSluttDato={sluttdato}
          />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Select
              data-test-id={namespace + idx + '-pensjontype'}
              feil={getErrorFor(index, 'pensjontype')}
              highContrast={highContrast}
              id={namespace + idx + '-pensjontype'}
              label={t('label:type-pensjon')}
              menuPortalTarget={document.body}
              onChange={(e: ValueType<Option, false>) => setPensjonType(e?.value, index)}
              options={selectPensjonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={getPensjonTypeOption(index < 0 ? _newPensjonType : (pensjonPeriode as PensjonPeriode)?.pensjonstype)}
              defaultValue={getPensjonTypeOption(index < 0 ? _newPensjonType : (pensjonPeriode as PensjonPeriode)?.pensjonstype)}
            />
          </Column>
          <Column />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(pensjonPeriode)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(pensjonPeriode)}
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
        {t('label:periode-pensjon-avsenderlandet')}
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
        ? renderRow(null, -1)
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
