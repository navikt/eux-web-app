import { ValidationVedtakPeriodeProps } from 'applications/SvarSed/Formaal/Vedtak/validation'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator, TextAreaDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { F002Sed, FormalVedtak, JaNei, PeriodeMedVedtak, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Checkbox } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  FlexDiv,
  HighContrastFlatknapp,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OptionTypeBase } from 'react-select'
import { getIdx } from 'utils/namespace'
import { validateVedtakPeriode } from './validation'

export interface VedtakProps {
  highContrast: boolean
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const VedtakFC: React.FC<VedtakProps> = ({
  highContrast,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}: VedtakProps): JSX.Element => {
  const { t } = useTranslation()
  const target = 'formaalx.vedtak'
  const vedtak: FormalVedtak | undefined = (replySed as F002Sed).formaalx?.vedtak
  const namespace = 'vedtak'

  const howManyBarn: number = (replySed as F002Sed).barn.length ?? 0
  const initialBarnRadio: JaNei | undefined = !_.isNil(vedtak?.barn) ? (vedtak?.barn.length === howManyBarn ? 'ja' : 'nei') : undefined

  const [_barnRadio, _setBarnRadio] = useState<JaNei | undefined>(initialBarnRadio)
  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newVedtak, _setNewVedtak] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeMedVedtak>((p: PeriodeMedVedtak): string => {
    return p.periode.startdato
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationVedtakPeriodeProps>({}, validateVedtakPeriode)

  const vedtakTypeOptions: Options = [
    { label: t('el:option-vedtaktype-1'), value: '1' },
    { label: t('el:option-vedtaktype-2'), value: '2' },
    { label: t('el:option-vedtaktype-3'), value: '3' },
    { label: t('el:option-vedtaktype-4'), value: '4' }
  ]

  const setBarnAlleBarn = () => {
    updateReplySed(`${target}.barn`, (replySed as F002Sed).barn.map(b => (b.personInfo.fornavn + ' ' + b.personInfo.etternavn)))
    if (validation[namespace + '-barn']) {
      resetValidation(namespace + '-barn')
    }
    _setBarnRadio('ja')
  }

  const setBarnNoeBarn = () => {
    _setBarnRadio('nei')
  }

  const removeBarn = (barn: string, checked: boolean) => {
    let newBarn: Array<String> = _.cloneDeep(vedtak?.barn)!
    // checked means that we will remove from list
    if (checked) {
      newBarn = _.filter(newBarn, _n => _n !== barn.trim())
    } else {
      newBarn = newBarn.concat(barn.trim())
    }
    updateReplySed(`${target}.barn`, newBarn)
    if (validation[namespace + '-barn']) {
      resetValidation(namespace + '-barn')
    }
  }

  const setStartDato = (newDato: string) => {
    updateReplySed(`${target}.periode.startdato`, newDato.trim())
    if (validation[namespace + '-periode-startdato']) {
      resetValidation(namespace + '-periode-startdato')
    }
  }

  const setSluttDato = (newDato: string) => {
    updateReplySed(`${target}.periode.sluttdato`, newDato.trim())
    if (validation[namespace + '-periode-sluttdato']) {
      resetValidation(namespace + '-periode-sluttdato')
    }
  }

  const setType = (newType: string) => {
    updateReplySed(`${target}.type`, newType.trim())
    if (validation[namespace + '-type']) {
      resetValidation(namespace + '-type')
    }
  }

  const setGrunnen = (newGrunnen: string) => {
    updateReplySed(`${target}.grunnen`, newGrunnen.trim())
    if (validation[namespace + '-grunnen']) {
      resetValidation(namespace + '-grunnen')
    }
  }

  const setVedtaksperioderStartDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(dato.trim())
      _resetValidation(namespace + '-vedtaksperioder-periode-startdato')
    } else {
      updateReplySed(`${target}.vedtaksperioder[${index}].periode.startdato`, dato.trim())
      if (validation[namespace + '-vedtaksperioder' + getIdx(index) + '-periode-startdato']) {
        resetValidation(namespace + '-vedtaksperioder' + getIdx(index) + '-periode-startdato')
      }
    }
  }

  const setVedtaksperioderSluttDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(dato.trim())
      _resetValidation(namespace + '-vedtaksperioder-periode-sluttdato')
    } else {
      let newPerioder: Array<PeriodeMedVedtak> | undefined = _.cloneDeep(vedtak?.vedtaksperioder)
      if (!newPerioder) {
        newPerioder = []
      }
      if (dato === '') {
        delete newPerioder[index].periode.sluttdato
        newPerioder[index].periode.aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].periode.aapenPeriodeType
        newPerioder[index].periode.sluttdato = dato.trim()
      }
      updateReplySed(`${target}.vedtaksperioder`, newPerioder)
      if (validation[namespace + '-vedtaksperioder' + getIdx(index) + '-periode-sluttdato']) {
        resetValidation(namespace + '-vedtaksperioder' + getIdx(index) + '-periode-sluttdato')
      }
    }
  }

  const setVedtaksperioderVedtak = (newVedtak: string, index: number) => {
    if (index < 0) {
      _setNewVedtak(newVedtak.trim())
      _resetValidation(namespace + '-vedtaksperioder-vedtak')
    } else {
      updateReplySed(`${target}.vedtaksperioder[${index}].vedtak`, newVedtak.trim())
      if (validation[namespace + '-vedtaksperioder' + getIdx(index) + '-vedtak']) {
        resetValidation(namespace + '-vedtaksperioder' + getIdx(index) + '-vedtak')
      }
    }
  }

  const resetForm = () => {
    _setNewStartDato('')
    _setNewSluttDato('')
    _setNewVedtak('')
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder = _.cloneDeep(vedtak?.vedtaksperioder) as Array<PeriodeMedVedtak>
    const deletedPerioder: Array<PeriodeMedVedtak> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    updateReplySed(`${target}.vedtaksperioder`, newPerioder)
  }

  const onAdd = () => {
    const newPeriode: PeriodeMedVedtak = {
      periode: {
        startdato: _newStartDato.trim()
      },
      vedtak: _newVedtak.trim()
    }
    if (_newSluttDato) {
      newPeriode.periode.sluttdato = _newSluttDato.trim()
    } else {
      newPeriode.periode.aapenPeriodeType = 'åpen_sluttdato'
    }

    const valid = performValidation({
      periode: newPeriode,
      namespace
    })

    if (valid) {
      let newPerioder: Array<PeriodeMedVedtak> = _.cloneDeep(vedtak?.vedtaksperioder) as Array<PeriodeMedVedtak>
      if (!newPerioder) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(newPeriode)
      updateReplySed(`${target}.vedtaksperioder`, newPerioder)
      resetForm()
    }
  }

  const renderPeriodeAndVedtak = (periode: PeriodeMedVedtak | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    const getErrorFor = (index: number, el: string): string | undefined => {
      return index < 0
        ? _validation[namespace + '-vedtaksperioder' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-vedtaksperioder' + idx + '-' + el]?.feilmelding
    }
    const startdato = index < 0 ? _newStartDato : periode?.periode.startdato
    const sluttdato = index < 0 ? _newSluttDato : periode?.periode.sluttdato
    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Period
            key={'' + startdato + sluttdato}
            namespace={namespace + '-vedtaksperioder' + getIdx(index) + '-periode'}
            errorStartDato={getErrorFor(index, 'periode-startdato')}
            errorSluttDato={getErrorFor(index, 'periode-sluttdato')}
            setStartDato={(dato: string) => setVedtaksperioderStartDato(dato, index)}
            setSluttDato={(dato: string) => setVedtaksperioderSluttDato(dato, index)}
            valueStartDato={startdato}
            valueSluttDato={sluttdato}
          />
          <Column>
            <Select
              key={namespace + '-vedtaksperioder' + getIdx(index) + '-vedtak'}
              data-test-id={namespace + '-vedtaksperioder' + getIdx(index) + '-vedtak'}
              feil={getErrorFor(index, 'vedtak')}
              highContrast={highContrast}
              id={namespace + '-vedtaksperioder' + getIdx(index) + '-vedtak'}
              label={t('label:vedtak-type')}
              menuPortalTarget={document.body}
              onChange={(o: OptionTypeBase) => setVedtaksperioderVedtak(o.value, index)}
              options={vedtakTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              defaultValue={_.find(vedtakTypeOptions, v => v.value === (index < 0 ? _newVedtak : periode?.vedtak))}
              selectedValue={_.find(vedtakTypeOptions, v => v.value === (index < 0 ? _newVedtak : periode?.vedtak))}
            />
          </Column>
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
      </>
    )
  }

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:vedtak')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <HighContrastRadioGroup
        id={namespace + '-barn'}
        className={classNames('slideInFromLeft')}
        data-test-id={namespace + '-barn'}
        legend={t('label:vedtak-angående-alle-barn') + ' *'}
        feil={_validation['vedtak-allkids']?.feilmelding}
      >
        <FlexDiv>
          <HighContrastRadio
            name={namespace + '-barn'}
            checked={_barnRadio === 'ja'}
            label={t('label:ja')}
            onClick={setBarnAlleBarn}
          />
          <HorizontalSeparatorDiv size='2' />
          <HighContrastRadio
            name={namespace + '-barn'}
            checked={_barnRadio === 'nei'}
            label={t('label:nei')}
            onClick={setBarnNoeBarn}
          />
        </FlexDiv>
      </HighContrastRadioGroup>
      {_barnRadio === 'nei' && (
        <div className={classNames('slideInFromLeft')}>
          <div dangerouslySetInnerHTML={{ __html: t('label:avhuk-de-barn-vedtaket') + ':' }} />
          <VerticalSeparatorDiv />
          {(replySed as F002Sed)?.barn?.map((b, index) => {
            const name = b.personInfo.fornavn + ' ' + b.personInfo.etternavn
            return (
              <div
                key={name}
                className={classNames('slideInFromLeft')}
                style={{ animationDelay: (index * 0.1) + 's' }}
              >
                <Checkbox
                  label={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => removeBarn(name, e.target.checked)}
                />
                <VerticalSeparatorDiv size='0.5' />
              </div>
            )
          })}
        </div>
      )}
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.1s' }}
      >
        <Period
          key={'' + vedtak?.periode?.startdato + vedtak?.periode?.sluttdato}
          namespace={namespace + '-periode'}
          errorStartDato={validation[namespace + '-periode-startdato']?.feilmelding}
          errorSluttDato={validation[namespace + '-periode-sluttdato']?.feilmelding}
          setStartDato={setStartDato}
          setSluttDato={setSluttDato}
          valueStartDato={vedtak?.periode?.startdato ?? ''}
          valueSluttDato={vedtak?.periode?.sluttdato ?? ''}
        />
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.2s' }}
      >
        <Column flex='2'>
          <Select
            data-test-id={namespace + '-type'}
            feil={validation[namespace + '-type']?.feilmelding}
            highContrast={highContrast}
            id={namespace + '-type'}
            label={t('label:vedtak-type') + ' *'}
            menuPortalTarget={document.body}
            onChange={(e: any) => setType(e.value)}
            options={vedtakTypeOptions}
            placeholder={t('el:placeholder-select-default')}
            defaultValue={_.find(vedtakTypeOptions, v => v.value === vedtak?.type)}
            selectedValue={_.find(vedtakTypeOptions, v => v.value === vedtak?.type)}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow
        className={classNames('slideInFromLeft')}
        style={{ animationDelay: '0.3s' }}
      >
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              feil={validation[namespace + '-grunnen']?.feilmelding}
              namespace={namespace}
              id='grunnen'
              label={t('label:ytterligere-informasjon-til-sed')}
              onChanged={setGrunnen}
              value={vedtak?.grunnen}
            />
          </TextAreaDiv>
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      {vedtak?.vedtaksperioder?.map(renderPeriodeAndVedtak)}
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderPeriodeAndVedtak(null, -1)
        : (
          <Row className='slideInFromLeft'>
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
    </PaddedDiv>
  )
}

export default VedtakFC