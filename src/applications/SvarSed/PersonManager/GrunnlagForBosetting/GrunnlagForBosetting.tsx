import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import TextArea from 'components/Forms/TextArea'
import Period from 'components/Period/Period'
import { TextAreaDiv } from 'components/StyledComponents'
import { Flyttegrunn, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import moment from 'moment'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import { Column, AlignStartRow, PaddedDiv, HighContrastFlatknapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { validateGrunnlagForBosetting, ValidationGrunnlagForBosettingProps } from './validation'

interface GrunnlagForBosettingProps {
  parentNamespace: string,
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  standalone ?: boolean
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const GrunnlagforBosetting: React.FC<GrunnlagForBosettingProps> = ({
  updateReplySed,
  parentNamespace,
  personID,
  replySed,
  resetValidation,
  standalone = false,
  validation
}:GrunnlagForBosettingProps): JSX.Element => {
  const { t } = useTranslation()
  const target = `${personID}.flyttegrunn`
  const flyttegrunn: Flyttegrunn = _.get(replySed, target)
  const namespace = standalone ? `${parentNamespace}-${personID}-grunnlagforbosetting` : `${parentNamespace}-grunnlagforbosetting`

  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newStartDato, _setNewStartDato] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => {
    return p?.startdato // assume startdato is unique
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationGrunnlagForBosettingProps>({}, validateGrunnlagForBosetting)

  const setAvsenderDato = (dato: string) => {
    updateReplySed(`${target}.datoFlyttetTilAvsenderlandet`, dato.trim())
    if (validation[namespace + '-datoFlyttetTilAvsenderlandet']) {
      resetValidation(namespace + '-datoFlyttetTilAvsenderlandet')
    }
  }

  const setMottakerDato = (dato: string) => {
    updateReplySed(`${target}.datoFlyttetTilMottakerlandet`, dato.trim())
    if (validation[namespace + '-datoFlyttetTilMottakerlandet']) {
      resetValidation(namespace + '-datoFlyttetTilMottakerlandet')
    }
  }

  const setStartDato = (startdato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(startdato.trim())
      _resetValidation(namespace + '-perioder-startdato')
    } else {
      updateReplySed(`${target}.perioder[${index}].startdato`, startdato.trim())
      if (validation[namespace + '-perioder' + getIdx(index) + '-startdato']) {
        resetValidation(namespace + '-perioder' + getIdx(index) + '-startdato')
      }
    }
  }

  const setSluttDato = (sluttdato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(sluttdato.trim())
      _resetValidation(namespace + '-perioder-sluttdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
      if (sluttdato === '') {
        delete newPerioder[index].sluttdato
        newPerioder[index].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].aapenPeriodeType
        newPerioder[index].sluttdato = sluttdato.trim()
      }
      updateReplySed(`${target}.perioder`, newPerioder)
      if (validation[namespace + '-perioder' + getIdx(index) + '-sluttdato']) {
        resetValidation(namespace + '-perioder' + getIdx(index) + '-sluttdato')
      }
    }
  }

  const setPersonligSituasjon = (personligSituasjon: string) => {
    updateReplySed(`${target}.personligSituasjon`, personligSituasjon.trim())
    if (validation[namespace + '-personligSituasjon']) {
      resetValidation(namespace + '-personligSituasjon')
    }
  }

  const resetForm = () => {
    _setNewStartDato('')
    _setNewSluttDato('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
    const deletedPeriods: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeFromDeletion(deletedPeriods[0])
    }
    updateReplySed(`${target}.perioder`, newPerioder)
  }

  const onAdd = () => {
    const newPeriode: Periode = {
      startdato: _newStartDato.trim()
    }
    if (_newSluttDato) {
      newPeriode.sluttdato = _newSluttDato.trim()
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }

    const valid: boolean = performValidation({
      period: newPeriode,
      otherPeriods: flyttegrunn.perioder,
      index: -1,
      namespace
    })

    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(newPeriode)
      updateReplySed(`${target}.perioder`, newPerioder)
      resetForm()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | null | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const startdato = index < 0 ? _newStartDato : periode?.startdato
    const sluttdato = index < 0 ? _newSluttDato : periode?.sluttdato

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
        >
          <Period
            key={'' + startdato + sluttdato}
            namespace={namespace + '-perioder' + idx}
            errorStartDato={getErrorFor(index, 'startdato')}
            errorSluttDato={getErrorFor(index, 'sluttdato')}
            setStartDato={(dato: string) => setStartDato(dato, index)}
            setSluttDato={(dato: string) => setSluttDato(dato, index)}
            valueStartDato={startdato}
            valueSluttDato={sluttdato}
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
        <VerticalSeparatorDiv />
      </>
    )
  }

  const render = () => (
    <>
      <UndertekstBold>
        {t('label:oppholdets-varighet')}
      </UndertekstBold>
      <VerticalSeparatorDiv />
      {flyttegrunn.perioder
        .sort((a, b) =>
          moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1
        )
        .map(renderRow)}
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
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <DateInput
            error={validation[namespace + '-datoFlyttetTilAvsenderlandet']?.feilmelding}
            namespace={namespace + '-datoFlyttetTilAvsenderlandet'}
            key={flyttegrunn.datoFlyttetTilAvsenderlandet}
            label={t('label:flyttedato-til-avsenderlandet')}
            setDato={setAvsenderDato}
            value={flyttegrunn.datoFlyttetTilAvsenderlandet}
          />
        </Column>
        <Column>
          <DateInput
            error={validation[namespace + '-datoFlyttetTilMottakerlandet']?.feilmelding}
            namespace={namespace + '-datoFlyttetTilMottakerlandet'}
            key={flyttegrunn.datoFlyttetTilMottakerlandet}
            label={t('label:flyttedato-til-mottakerslandet')}
            setDato={setMottakerDato}
            value={flyttegrunn.datoFlyttetTilMottakerlandet}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-personligSituasjon']?.feilmelding}
              namespace={namespace}
              id='personligSituasjon'
              label={t('label:elementter-i-personlig-situasjon')}
              onChanged={setPersonligSituasjon}
              value={flyttegrunn.personligSituasjon}
            />
          </TextAreaDiv>
        </Column>
        <Column />
      </AlignStartRow>
    </>
  )

  return (
    standalone
      ? (
        <PaddedDiv>
          <VerticalSeparatorDiv />
          {render()}
        </PaddedDiv>
        )
      : (
        <>
          <Undertittel>
            {t('label:grunnlag-for-bosetting')}
          </Undertittel>
          <VerticalSeparatorDiv />
          {render()}
        </>
        )
  )
}

export default GrunnlagforBosetting
