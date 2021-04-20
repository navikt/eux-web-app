import {
  validateNotAnsatte,
  ValidationNotAnsattProps
} from 'applications/SvarSed/FamilyManager/Arbeidsforhold/notAnsattValidation'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Period from 'components/Period/Period'
import { AlignStartRow, TextAreaDiv } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
import { Aktivitet, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface NotAnsattProps {
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const NotAnsatt: React.FC<NotAnsattProps> = ({
   onValueChanged,
   personID,
   replySed,
   validation
}: NotAnsattProps): JSX.Element => {
  const { t } = useTranslation()

  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')

  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationNotAnsattProps>({}, validateNotAnsatte)

  const target: string = `${personID}.aktivitet.perioderMedAktivitet`
  let perioderMedAktivitet = _.get(replySed, target)
  let indexOfAktivitetSelvstendig: number = _.findIndex(perioderMedAktivitet, (p: Aktivitet) => p.type === 'selvstendig')
  let updatedTarget: string = `${personID}.aktivitet.perioderMedAktivitet[${indexOfAktivitetSelvstendig}]`
  let perioderMedAktivitetSelvstendig: Aktivitet = _.get(replySed, updatedTarget)

  const [_comment, _setComment] = useState<string>(perioderMedAktivitetSelvstendig?.ytterligereinfo ?? '')

  const namespace = `familymanager-${personID}-personensstatus-notansatt`


  const onAddNewClicked = () => setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const setStartDato = (dato: string, i: number) => {
    if (i < 0) {
      setNewStartDato(dato)
      resetValidation(namespace + '-startdato')
    } else {
      const newPerioder: Aktivitet = _.cloneDeep(perioderMedAktivitetSelvstendig)
      newPerioder.perioder[i].startdato = dato
      onValueChanged(updatedTarget, newPerioder)
      setNewStartDato('')
    }
  }

  const setSluttDato = (dato: string, i: number) => {
    if (i < 0) {
      setNewSluttDato(dato)
      resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder: Aktivitet = _.cloneDeep(perioderMedAktivitetSelvstendig)
      newPerioder.perioder[i].sluttdato = dato
      onValueChanged(updatedTarget, newPerioder)
      setNewSluttDato('')
    }
  }

  const setComment = () => {
    if (indexOfAktivitetSelvstendig < 0) {
      perioderMedAktivitetSelvstendig = {
        type: 'selvstendig',
        perioder: [],
        ytterligereinfo: _comment
      } as Aktivitet
      perioderMedAktivitet = perioderMedAktivitet.concat(perioderMedAktivitetSelvstendig)
      indexOfAktivitetSelvstendig = perioderMedAktivitet.length - 1
      updatedTarget = `${personID}.aktivitet.perioderMedAktivitet[${indexOfAktivitetSelvstendig}]`
    }
    const newPerioderMedAktivitetSelvstendig: Aktivitet = _.cloneDeep(perioderMedAktivitetSelvstendig)
    newPerioderMedAktivitetSelvstendig.ytterligereinfo = _comment
    onValueChanged(updatedTarget, newPerioderMedAktivitetSelvstendig)
  }

  const resetForm = () => {
    setNewStartDato('')
    setNewSluttDato('')
    resetValidation(undefined)
  }

  const onCancel = () => {
    setSeeNewForm(false)
    resetForm()
  }

  const getKey = (p: Periode): string => {
    return p?.startdato // assume startdato is unique
  }

  const onRemove = (index: number) => {

    const newPerioderMedAktivitetSelvstendig: Aktivitet = _.cloneDeep(perioderMedAktivitetSelvstendig)
    const deletedPeriods: Array<Periode> = newPerioderMedAktivitetSelvstendig.perioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeCandidateForDeletion(getKey(deletedPeriods[0]))
    }
    onValueChanged(updatedTarget, newPerioderMedAktivitetSelvstendig)
  }

  const onAdd = () => {
    const newPeriode: Periode = {
      startdato: _newStartDato
    }
    if (_newSluttDato) {
      newPeriode.sluttdato = _newSluttDato
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }

    const valid: boolean = performValidation({
      period: newPeriode,
      otherPeriods: perioderMedAktivitetSelvstendig?.perioder,
      index: -1,
      namespace
    })

    if (valid) {
      if (indexOfAktivitetSelvstendig < 0) {
        perioderMedAktivitetSelvstendig = {
          type: 'selvstendig',
          perioder: [],
          ytterligereinfo: _comment
        } as Aktivitet
        perioderMedAktivitet = perioderMedAktivitet.concat(perioderMedAktivitetSelvstendig)
        indexOfAktivitetSelvstendig = perioderMedAktivitet.length - 1
        updatedTarget = `${personID}.aktivitet.perioderMedAktivitet[${indexOfAktivitetSelvstendig}]`
      }

      let newPerioderMedAktivitet: Array<Aktivitet> = _.cloneDeep(perioderMedAktivitet)
      newPerioderMedAktivitet[indexOfAktivitetSelvstendig].perioder =
        newPerioderMedAktivitet[indexOfAktivitetSelvstendig].perioder.concat(newPeriode)
      resetForm()
      onValueChanged(target, newPerioderMedAktivitet)
    }
  }

  const getErrorFor = (index: number, el: string): string | null | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (p: Periode | undefined, i: number) => {
    const key = p ? getKey(p) : 'new'
    const candidateForDeletion = i < 0 ? false : !!key && _confirmDelete.indexOf(key) >= 0

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
          <Period
            index={i}
            key={_newStartDato + _newSluttDato}
            namespace={namespace}
            errorStartDato={getErrorFor(i, 'startdato')}
            errorSluttDato={getErrorFor(i, 'sluttdato')}
            setStartDato={setStartDato}
            setSluttDato={setSluttDato}
            valueStartDato={i < 0 ? _newStartDato : p?.startdato}
            valueSluttDato={i < 0 ? _newSluttDato : p?.sluttdato}
          />
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
      </>
    )
  }

  return (
    <>
      <Undertittel>
        {t('el:title-ansettelsesperioder')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {perioderMedAktivitetSelvstendig?.perioder
        ?.sort((a, b) =>
          moment(a.startdato, 'YYYY-MM-DD')
            .isSameOrBefore(moment(b.startdato, 'YYYY-MM-DD')) ? -1 : 1
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
                onClick={onAddNewClicked}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
      <TextAreaDiv>
        <HighContrastTextArea
          className={classNames({
            'skjemaelement__input--harFeil': validation[namespace + '-comment']?.feilmelding
          })}
          data-test-id={'c-' + namespace + '-comment-text'}
          feil={validation[namespace + '-comment']?.feilmelding}
          id={'c-' + namespace + '-comment-text'}
          label={t('label:ytterligere-informasjon')}
          maxLength={500}
          onBlur={setComment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => _setComment(e.target.value)}
          placeholder={t('el:placeholder-text-to-sed')}
          value={_comment}
        />
      </TextAreaDiv>
    </>
  )
}

export default NotAnsatt
