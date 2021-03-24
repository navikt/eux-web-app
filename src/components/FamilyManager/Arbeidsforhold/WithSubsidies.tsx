import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import Select from 'components/Select/Select'
import { AlignStartRow, FlexCenterDiv } from 'components/StyledComponents'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
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

type PensjonType = 'alderspensjon' | 'uførhet' // | 'enkepensjon' | 'barnepensjon=' | 'etterlattepensjon'

interface MyOption {
  label: string,
  value: PensjonType
}

interface WithSubsidiesProps {
  highContrast: boolean
  personID: string
  validation: Validation
}

const WithSubsidies: React.FC<WithSubsidiesProps> = ({
  highContrast,
  personID,
  validation
}: WithSubsidiesProps): JSX.Element => {
  const { t } = useTranslation()
  const [_perioder, setPerioder] = useState<Array<PensjonPeriode>>([])
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newPensjonType, setNewPensjonType] = useState<string>('')
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const [_validation, setValidation] = useState<Validation>({})

  const namespace = 'familymanager-' + personID + '-personensstatus-withsubsidies'

  const resetValidation = (key: string): void => {
    setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const validation: Validation = {}
    if (!_newStartDato) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-input',
        feilmelding: t('message:validation-noDate')
      } as FeiloppsummeringFeil
    }
    if (_newStartDato && !_newStartDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-input',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    if (_.find(_perioder, p => p.periode.startdato === _newStartDato)) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-input',
        feilmelding: t('message:validation-duplicateStartDate')
      } as FeiloppsummeringFeil
    }
    if (_newSluttDato && !_newSluttDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[namespace + '-sluttdato'] = {
        skjemaelementId: 'c-' + namespace + '-sluttdato-input',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    if (!_newPensjonType) {
      validation[namespace + '-pensjontype'] = {
        skjemaelementId: 'c-' + namespace + '-pensjontype-select',
        feilmelding: t('message:validation-noPensjonType')
      } as FeiloppsummeringFeil
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onAddNewPeriodClicked = () => setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const setStartDato = (dato: string, i: number) => {
    if (i < 0) {
      setNewStartDato(dato)
      resetValidation( namespace + '-startdato')
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].periode.startdato = dato
      setPerioder(newPerioder)
      // onValueChanged(`${personID}.XXX`, newPerioder)
      setNewStartDato('')
    }
  }

  const setSluttDato = (dato: string, i: number) => {
    if (i < 0) {
      setNewSluttDato(dato)
      resetValidation( namespace + '-sluttdato')
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].periode.sluttdato = dato
      setPerioder(newPerioder)
      // onValueChanged(`${personID}.XXX`, newPerioder)
      setNewSluttDato('')
    }
  }

  const setPensjonType = (type: string | undefined, i: number) => {
    if (type) {
      if (i < 0) {
        setNewPensjonType(type)
        resetValidation( namespace + '-pensjontype')
      } else {
        const newPerioder = _.cloneDeep(_perioder)
        newPerioder[i].pensjonstype = type
        setPerioder(newPerioder)
        // onValueChanged(`${personID}.XXX`, newPerioder)
        setNewPensjonType('')
      }
    }
  }

  const resetForm = () => {
    setNewStartDato('')
    setNewSluttDato('')
    setNewPensjonType('')
    setValidation({})
  }

  const onCancel = () => {
    setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PensjonPeriode> = _.cloneDeep(_perioder)
    const deletedPeriods: Array<PensjonPeriode> = newPerioder.splice(index, 1)
    setPerioder(newPerioder)
    if ( deletedPeriods && deletedPeriods.length > 0) {
      removeCandidateForDeletion(deletedPeriods[0].periode.startdato)
    }
    // onValueChanged(`${personID}.XXX`, newPerioder)
  }

  const onAdd = () => {
    if (performValidation()) {
      let newPerioder: Array<PensjonPeriode> = _.cloneDeep(_perioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      const newPeriode = {
        startdato: _newStartDato
      } as Periode
      if (_newSluttDato) {
        newPeriode.sluttdato = _newSluttDato
      } else {
        newPeriode.aapenPeriodeType = 'åpen_sluttdato'
      }

      newPerioder = newPerioder.concat({
        pensjonstype: _newPensjonType,
        periode: newPeriode
      })
      setPerioder(newPerioder)
      resetForm()
      // onValueChanged(`${personID}.XXX`, newPerioder)
    }
  }

  const selectPensjonTypeOptions: Array<MyOption> = [{
    label: t('el:option-trygdeordning-alderspensjon'), value: 'alderspensjon'
  }, {
    label: t('el:option-trygdeordning-uførhet'), value: 'uførhet'
  }]

  const getPensjonTypeOption = (value: string | undefined | null) => _.find(selectPensjonTypeOptions, s => s.value === value)

  const renderRow = (p: PensjonPeriode | undefined, i: number) => {

    const key = i < 0 ? 'new' : p?.periode.startdato // assume startdato is unique
    const startDatoError = i < 0 ? _validation[namespace + '-startdato']?.feilmelding : validation[namespace + '[' + i + ']-startdato']?.feilmelding
    const sluttDatoError = i < 0 ? _validation[namespace + '-sluttdato']?.feilmelding : validation[namespace + '[' + i + ']-sluttdato']?.feilmelding
    const pensjonTypeError = i < 0 ? _validation[namespace + '-pensjontype']?.feilmelding : validation[namespace + '[' + i + ']-sluttdato']?.feilmelding
    const candidateForDeletion = i < 0 ? false : key && _confirmDelete.indexOf(key) >= 0

    return (
      <div className={classNames('slideInFromLeft')}>
        <AlignStartRow>
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-startdato-input'}
              feil={startDatoError}
              id={'c-' + namespace + '[' + i + ']-startdato-input'}
              label={t('label:start-date')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDato(e.target.value, i)}
              placeholder={t('el:placeholder-date-default')}
              value={i < 0 ? _newStartDato : p?.periode.startdato}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-sluttdato-input'}
              feil={sluttDatoError}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-sluttdato-input'}
              label={t('label:end-date')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSluttDato(e.target.value, i)}
              placeholder={t('el:placeholder-date-default')}
              value={i < 0 ? _newSluttDato : p?.periode.sluttdato}
            />
          </Column>
          <Column/>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Select
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-pensjontype-select'}
              feil={pensjonTypeError}
              highContrast={highContrast}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-pensjontype-select'}
              label={t('label:type-pensjon')}
              onChange={(e: ValueType<MyOption, false>) => setPensjonType(e?.value, i)}
              options={selectPensjonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={getPensjonTypeOption(i < 0 ? _newPensjonType : (p as PensjonPeriode)?.pensjonstype)}
              defaultValue={getPensjonTypeOption(i < 0 ? _newPensjonType : (p as PensjonPeriode)?.pensjonstype)}
            />
          </Column>
          <Column/>
          <Column>
            {candidateForDeletion ? (
              <FlexCenterDiv className={classNames('nolabel', 'slideInFromRight')}>
                <Normaltekst>
                  {t('label:are-you-sure')}
                </Normaltekst>
                <HorizontalSeparatorDiv data-size='0.5'/>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => onRemove(i)}
                >
                  {t('label:yes')}
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv data-size='0.5'/>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => removeCandidateForDeletion(key!)}
                >
                  {t('label:no')}
                </HighContrastFlatknapp>
              </FlexCenterDiv>
              )
              : (
                <div className={classNames('nolabel')}>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => i < 0 ? onAdd() : addCandidateForDeletion(key!)}
                  >
                    {i < 0 ? <Add/> : <Trashcan/>}
                    <HorizontalSeparatorDiv data-size='0.5'/>
                    {i < 0 ? t('el:button-add') : t('el:button-remove')}
                  </HighContrastFlatknapp>
                  {_seeNewForm && i < 0 && (
                    <>
                      <HorizontalSeparatorDiv/>
                      <HighContrastFlatknapp
                        mini
                        kompakt
                        onClick={onCancel}
                      >
                        {t('el:button-cancel')}
                      </HighContrastFlatknapp>
                    </>
                  )}
                </div>
              )}
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
      </div>
    )
  }

  return (
    <>
      <Undertittel>
        {t('el:title-period-with-received-pension-from-sender-country')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_perioder
        .sort((a, b) =>
          moment(a.periode.startdato).isSameOrAfter(moment(b.periode.startdato)) ? -1 : 1
        ).map(renderRow)}
      <hr />
      <VerticalSeparatorDiv />
      {_seeNewForm ?
        renderRow(undefined, -1) :
        (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onAddNewPeriodClicked}
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
