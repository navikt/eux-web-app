import { fetchInntekt } from 'actions/inntekt'
import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import Inntekter from 'applications/SvarSed/PersonManager/InntektForm/Inntekter'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import {
  validateLoennsopplysning,
  ValidationLoennsopplysningProps
} from './validationInntektForm'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Search from 'assets/icons/Search'
import Select from 'components/Forms/Select'
import InntektFC from 'components/Inntekt/Inntekt'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Loennsopplysning, Periode } from 'declarations/sed'
import { IInntekter } from 'declarations/types'
import { Inntekt } from 'declarations/sed.d'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  PaddedDiv, Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OptionTypeBase } from 'react-select'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'

interface InntektFormSelector extends PersonManagerFormSelector {
  gettingInntekter: boolean
  highContrast: boolean
  inntekter: IInntekter | undefined
}

const mapState = (state: State): InntektFormSelector => ({
  gettingInntekter: state.loading.gettingInntekter,
  highContrast: state.ui.highContrast,
  inntekter: state.inntekt.inntekter,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const InntektForm: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    gettingInntekter,
    highContrast,
    inntekter,
    replySed,
    validation
  } = useSelector<State, InntektFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'loennsopplysninger'
  const loennsopplysninger: Array<Loennsopplysning> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-inntekt`

  const [_filter, _setFilter] = useState<string | undefined>(undefined)

  const [_searchStartDato, _setSearchStartDato] = useState<string>('')
  const [_searchSluttDato, _setSearchSluttDato] = useState<string>('')

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newAnsettelsesType, _setNewAnsettelsesType] = useState<string>('')
  const [_newInntekter, _setNewInntekter] = useState<Array<Inntekt>>([])
  const [_newArbeidsdager, _setNewArbeidsdager] = useState<string>('')
  const [_newArbeidstimer, _setNewArbeidstimer] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Loennsopplysning>((l: Loennsopplysning) => l.periode.startdato)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationLoennsopplysningProps>({}, validateLoennsopplysning)

  const filterOptions : Options = [
    { label: t('el:option-inntektsfilter-BARNETRYGD'), value: 'BARNETRYGD' },
    { label: t('el:option-inntektsfilter-KONTANTSTOETTE'), value: 'KONTANTSTOETTE' },
    { label: t('el:option-inntektsfilter-DAGPENGER'), value: 'DAGPENGER' }
  ]

  const setSearchStartDato = (startdato: string) => {
    _setSearchStartDato(startdato.trim())
    _resetValidation(namespace + '-startdato')
  }

  const setSearchSluttDato = (sluttdato: string) => {
    _setSearchSluttDato(sluttdato.trim())
    _resetValidation(namespace + '-sluttdato')
  }

  const setFilter = (filter: string) => {
    _setFilter(filter)
  }

  const setStartDato = (startdato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(startdato.trim())
      _resetValidation(namespace + '-periode-startdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode.startdato`, startdato.trim()))
      if (validation[namespace + getIdx(index) + '-periode-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-startdato'))
      }
    }
  }

  const setSluttDato = (sluttdato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(sluttdato.trim())
      _resetValidation(namespace + '-periode-sluttdato')
    } else {
      const newPerioder: Array<Loennsopplysning> = _.cloneDeep(loennsopplysninger) as Array<Loennsopplysning>
      if (sluttdato === '') {
        delete newPerioder[index].periode.sluttdato
        newPerioder[index].periode.aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].periode.aapenPeriodeType
        newPerioder[index].periode.sluttdato = sluttdato.trim()
      }
      dispatch(updateReplySed(target, newPerioder))
      if (validation[namespace + getIdx(index) + '-periode-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-sluttdato'))
      }
    }
  }

  const setAnsettelsesType = (newAnsettelsesType: string, index: number) => {
    if (index < 0) {
      _setNewAnsettelsesType(newAnsettelsesType.trim())
      _resetValidation(namespace + '-ansettelsestype')
    } else {
      dispatch(updateReplySed(`${target}[${index}].ansettelsestype`, newAnsettelsesType.trim()))
      if (validation[namespace + getIdx(index) + '-ansettelsestype']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-ansettelsestype'))
      }
    }
  }

  const setInntekter = (_newInntekter: Array<Inntekt>, index: number) => {
    if (index < 0) {
      _setNewInntekter(_newInntekter)
      _resetValidation(namespace + '-inntekter')
    } else {
      dispatch(updateReplySed(`${target}[${index}].inntekter`, _newInntekter))
      if (validation[namespace + getIdx(index) + '-inntekter']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-inntekter'))
      }
    }
  }

  const setArbeidsDager = (newArbeidsDager: string, index: number) => {
    if (index < 0) {
      _setNewArbeidsdager(newArbeidsDager.trim())
      _resetValidation(namespace + '-arbeidsdager')
    } else {
      dispatch(updateReplySed(`${target}[${index}].arbeidsdager`, newArbeidsDager.trim()))
      if (validation[namespace + getIdx(index) + '-arbeidsdager']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-arbeidsdager'))
      }
    }
  }

  const setArbeidsTimer = (newArbeidstimer: string, index: number) => {
    if (index < 0) {
      _setNewArbeidstimer(newArbeidstimer.trim())
      _resetValidation(namespace + '-arbeidstimer')
    } else {
      dispatch(updateReplySed(`${target}[${index}].arbeidstimerr`, newArbeidstimer.trim()))
      if (validation[namespace + getIdx(index) + '-arbeidstimer']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-arbeidstimer'))
      }
    }
  }
  const resetForm = () => {
    _setNewAnsettelsesType('')
    _setNewArbeidsdager('')
    _setNewArbeidstimer('')
    _setNewSluttDato('')
    _setNewStartDato('')
    _setNewInntekter([])
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newLoennsopplysning: Array<Loennsopplysning> = _.cloneDeep(loennsopplysninger) as Array<Loennsopplysning>
    const deletedLoennsopplysning: Array<Loennsopplysning> = newLoennsopplysning.splice(index, 1)
    if (deletedLoennsopplysning && deletedLoennsopplysning.length > 0) {
      removeFromDeletion(deletedLoennsopplysning[0])
    }
    dispatch(updateReplySed(target, newLoennsopplysning))
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

    const newLoennsopplysning: Loennsopplysning = {
      periode: newPeriode,
      ansettelsestype: _newAnsettelsesType,
      inntekter: _newInntekter,
      arbeidsdager: _newArbeidsdager,
      arbeidstimer: _newArbeidstimer
    }

    const valid: boolean = performValidation({
      loennsopplysning: newLoennsopplysning,
      loennsopplysninger: loennsopplysninger ?? [],
      namespace: namespace
    })
    if (valid) {
      let newLoennsopplysninger: Array<Loennsopplysning> | undefined = _.cloneDeep(loennsopplysninger)
      if (_.isNil(newLoennsopplysninger)) {
        newLoennsopplysninger = []
      }
      newLoennsopplysninger = newLoennsopplysninger.concat(newLoennsopplysning)
      dispatch(updateReplySed(target, newLoennsopplysninger))
      resetForm()
    }
  }

  const renderRow = (loennsopplysning: Loennsopplysning | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(loennsopplysning)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const startdato = index < 0 ? _newStartDato : loennsopplysning?.periode?.startdato
    const sluttdato = index < 0 ? _newSluttDato : loennsopplysning?.periode?.sluttdato

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Period
            key={'' + startdato + sluttdato}
            namespace={namespace}
            errorStartDato={getErrorFor(index, 'periode-startdato')}
            errorSluttDato={getErrorFor(index, 'periode-sluttdato')}
            setStartDato={(dato: string) => setStartDato(dato, index)}
            setSluttDato={(dato: string) => setSluttDato(dato, index)}
            valueStartDato={startdato}
            valueSluttDato={sluttdato}
          />
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Column>
            <Inntekter
              key={JSON.stringify(index < 0 ? _newInntekter : loennsopplysning?.inntekter ?? [])}
              highContrast={highContrast}
              inntekter={index < 0 ? _newInntekter : loennsopplysning?.inntekter ?? []}
              onInntekterChanged={(inntekter: Array<Inntekt>) => setInntekter(inntekter, index)}
              parentNamespace={namespace + '-inntekter'}
              validation={validation}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <Input
              feil={getErrorFor(index, 'ansettelsestype')}
              namespace={namespace}
              id='ansettelsestype'
              key={'ansettelsestype-' + (index < 0 ? _newAnsettelsesType : loennsopplysning?.ansettelsestype ?? '')}
              label={t('label:ansettelses-type')}
              onChanged={(ansettelsestype: string) => setAnsettelsesType(ansettelsestype, index)}
              value={index < 0 ? _newAnsettelsesType : loennsopplysning?.ansettelsestype ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'arbeidsdager')}
              namespace={namespace}
              id='arbeidsdager'
              key={'arbeidsdager' + (index < 0 ? _newArbeidsdager : loennsopplysning?.arbeidsdager ?? '')}
              label={t('label:arbeidsdager')}
              onChanged={(arbeidsdager: string) => setArbeidsDager(arbeidsdager, index)}
              value={index < 0 ? _newArbeidsdager : loennsopplysning?.arbeidsdager ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'arbeidstimer')}
              namespace={namespace}
              id='arbeidstimer'
              key={'arbeidstimer' + (index < 0 ? _newArbeidstimer : loennsopplysning?.arbeidstimer ?? '')}
              label={t('label:arbeidstimer')}
              onChanged={(arbeidstimer: string) => setArbeidsTimer(arbeidstimer, index)}
              value={index < 0 ? _newArbeidstimer : loennsopplysning?.arbeidstimer ?? ''}
            />
          </Column>
          <Column flex='1.3'>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(loennsopplysning)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(loennsopplysning)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  const fnr = getFnr(replySed)

  const onInntektClick = () => {
    dispatch(fetchInntekt(fnr, _searchStartDato, _searchSluttDato, _filter))
  }

  return (
    <PaddedDiv>
      <VerticalSeparatorDiv size='2' />
      {loennsopplysninger?.map(renderRow)}
      <HorizontalLineSeparator />
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
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:loennsopplysning').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:inntekt-fra-komponent')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Period
          key={'' + _searchStartDato + _searchSluttDato}
          namespace={namespace}
          errorStartDato={validation[namespace + '-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-sluttdato']?.feilmelding}
          setStartDato={setSearchStartDato}
          setSluttDato={setSearchSluttDato}
          valueStartDato={_searchStartDato ?? ''}
          valueSluttDato={_searchSluttDato ?? ''}
        />
        <Column>
          <Select
            data-test-id={namespace + '-filter'}
            feil={validation[namespace + '-filter']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-filter'}
            label={t('label:inntektsfilter')}
            menuPortalTarget={document.body}
            onChange={(o: OptionTypeBase) => setFilter(o.value)}
            options={filterOptions}
            placeholder={t('el:placeholder-select-default')}
            selectedValue={_.find(filterOptions, b => b.value === _filter)}
            defaultValue={_.find(filterOptions, b => b.value === _filter)}
          />
        </Column>
        <Column>
          <VerticalSeparatorDiv size='1.8' />
          <HighContrastFlatknapp
            disabled={gettingInntekter}
            spinner={gettingInntekter}
            onClick={onInntektClick}
          >
            <Search />
            <HorizontalSeparatorDiv />
            {gettingInntekter ? t('message:loading-searching') : t('el:button-search')}
          </HighContrastFlatknapp>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      {gettingInntekter && <WaitingPanel />}
      {inntekter && (
        <InntektFC inntekter={inntekter} />
      )}

    </PaddedDiv>
  )
}

export default InntektForm
