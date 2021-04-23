import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import { AlignStartRow, FlexDiv, PileDiv, TextAreaDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { F002Sed, Periode, ReplySed } from 'declarations/sed'
import { PeriodeMedVedtak, Validation } from 'declarations/types'
import _ from 'lodash'
import { Checkbox } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastPanel,
  HighContrastRadio,
  HighContrastRadioGroup,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateVedtakPeriode } from './validation'

export interface VedtakProps {
  highContrast: boolean
  replySed: ReplySed
  validation: Validation
}

const VedtakFC: React.FC<VedtakProps> = ({
  highContrast,
  replySed,
  validation
}: VedtakProps): JSX.Element => {
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])

  const [_allKids, _setAllKids] = useState<string | undefined>(undefined)
  const [_whichKids, _setWhichKids] = useState<Array<string> | undefined>(undefined)
  const [_startDato, _setStartDato] = useState<string>('')
  const [_sluttDato, _setSluttDato] = useState<string>('')
  const [_type, _setType] = useState<string | undefined>(undefined)
  const [_grunnen, _setGrunnen] = useState<string>('')
  const [_perioderMedVedtak, _setPerioderMedVedtak] = useState<Array<PeriodeMedVedtak>>([])

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newVedtak, _setNewVedtak] = useState<string>('')
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _setValidation] = useState<Validation>({})

  const { t } = useTranslation()

  const vedtakTypeOptions: Options = [
    { label: t('el:option-vedtaktype-1'), value: '1' },
    { label: t('el:option-vedtaktype-2'), value: '2' },
    { label: t('el:option-vedtaktype-3'), value: '3' },
    { label: t('el:option-vedtaktype-4'), value: '4' }
  ]

  const resetValidation = (key: string): void => {
    _setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const newValidation: Validation = {}
    validateVedtakPeriode(
      newValidation,
      {
        periode: {
          startdato: _newStartDato,
          sluttdato: _newSluttDato
        },
        vedtak: _newVedtak
      },
      -1,
      t
    )
    _setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }

  const onAddNewClicked = () => _setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const setWhichKids = (name: string, checked: boolean) => {
    _setWhichKids(
      checked
        ? _whichKids?.concat(name)
        : _.filter(_whichKids, k => k !== name)
    )
  }

  const setStartDato = (s: string, i: number) => {
    if (i < 0) {
      _setNewStartDato(s)
      resetValidation('vedtak-perioder-periode-startdato')
    } else {
      const newPerioder = _.cloneDeep(_perioderMedVedtak)
      newPerioder[i].periode.startdato = s
      _setPerioderMedVedtak(newPerioder)
    }
  }

  const setSluttDato = (s: string, i: number) => {
    if (i < 0) {
      _setNewSluttDato(s)
      resetValidation('vedtak-perioder-periode-sluttdato')
    } else {
      const newPerioder = _.cloneDeep(_perioderMedVedtak)
      newPerioder[i].periode.sluttdato = s
      _setPerioderMedVedtak(newPerioder)
    }
  }

  const setVedtak = (s: string, i: number) => {
    if (i < 0) {
      _setNewVedtak(s)
      resetValidation('vedtak-perioder-periode-sluttdato')
    } else {
      const newPerioder = _.cloneDeep(_perioderMedVedtak)
      newPerioder[i].vedtak = s
      _setPerioderMedVedtak(newPerioder)
    }
  }

  const resetForm = () => {
    _setNewStartDato('')
    _setNewSluttDato('')
    _setNewVedtak('')
    _setValidation({})
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const getKey = (p: PeriodeMedVedtak): string => {
    return p.periode.startdato
  }

  const onRemove = (i: number) => {
    const newPerioder = _.cloneDeep(_perioderMedVedtak)
    const deletedPerioder: Array<PeriodeMedVedtak> = newPerioder.splice(i, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeCandidateForDeletion(getKey(deletedPerioder[0]))
    }
    _setPerioderMedVedtak(newPerioder)
  }

  const onAdd = () => {
    if (performValidation()) {
      let newPerioder = _.cloneDeep(_perioderMedVedtak)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      const periode: Periode = {
        startdato: _newStartDato
      }
      if (_newSluttDato) {
        periode.sluttdato = _newSluttDato
      } else {
        periode.aapenPeriodeType = 'åpen_sluttdato'
      }
      newPerioder.push({
        periode: periode,
        vedtak: _newVedtak
      })
      resetForm()
      _setPerioderMedVedtak(newPerioder)
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0 ? _validation['vedtak-perioder-' + el]?.feilmelding : validation['vedtak-perioder[' + index + ']-' + el]?.feilmelding
  }

  const renderPeriodeAndVedtak = (p: PeriodeMedVedtak | null, i: number) => {
    const key = p ? getKey(p) : 'new'
    const candidateForDeletion = i < 0 ? false : !!key && _confirmDelete.indexOf(key) >= 0

    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column>
            <HighContrastInput
              data-test-id={'c-vedtak-perioder' + (i >= 0 ? '[' + i + ']' : '') + '-periode-startdato-date'}
              feil={getErrorFor(i, 'periode-startdato')}
              id={'c-vedtak-perioder' + (i >= 0 ? '[' + i + ']' : '') + '-periode-startdato-date'}
              label={t('label:startdato')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDato(e.target.value, i)}
              value={i < 0 ? _newStartDato : p?.periode.startdato}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id={'c-vedtak-perioder' + (i >= 0 ? '[' + i + ']' : '') + '-periode-sluttdato-date'}
              feil={getErrorFor(i, 'periode-sluttdato')}
              id={'c-vedtak-perioder' + (i >= 0 ? '[' + i + ']' : '') + '-periode-sluttdato-date'}
              label={t('label:sluttdato')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSluttDato(e.target.value, i)}
              value={i < 0 ? _newSluttDato : p?.periode.sluttdato}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column>
            <Select
              key={'vedtak-perioder' + (i >= 0 ? '[' + i + ']' : '') + '-vedtak'}
              data-test-id={'c-vedtak-perioder' + (i >= 0 ? '[' + i + ']' : '') + '-vedtak-text'}
              feil={getErrorFor(i, 'vedtak')}
              highContrast={highContrast}
              id={'c-vedtak-perioder' + (i >= 0 ? '[' + i + ']' : '') + '-vedtak-text'}
              label={t('label:vedtak-type')}
              menuPortalTarget={document.body}
              onChange={(e: any) => setVedtak(e.value, i)}
              options={vedtakTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              defaultValue={_.find(vedtakTypeOptions, v => v.value === (i < 0 ? _newVedtak : p?.vedtak))}
              selectedValue={_.find(vedtakTypeOptions, v => v.value === (i < 0 ? _newVedtak : p?.vedtak))}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(i >= 0)}
              marginTop={false}
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(i)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv data-size='0.5' />
      </>
    )
  }

  return (
    <PileDiv>
      <Undertittel>
        {t('el:title-vedtak')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <HighContrastPanel>
        <HighContrastRadioGroup
          className={classNames('slideInFromLeft')}
          legend={t('label:vedtak-angående-alle-barn')}
          feil={_validation['vedtak-allkids']?.feilmelding}
        >
          <FlexDiv>
            <HighContrastRadio
              name='vedtak-allkids'
              checked={_allKids === 'ja'}
              label={t('label:ja')}
              onClick={() => _setAllKids('ja')}
            />
            <HorizontalSeparatorDiv data-size='2' />
            <HighContrastRadio
              name='vedtak-allkids'
              checked={_allKids === 'nei'}
              label={t('label:nei')}
              onClick={() => _setAllKids('nei')}
            />
          </FlexDiv>
        </HighContrastRadioGroup>
        {_allKids === 'nei' && (
          <div className={classNames('slideInFromLeft')}>
            <div dangerouslySetInnerHTML={{ __html: t('label:avhuk-de-barn-vedtaket') + ':' }} />
            <VerticalSeparatorDiv />
            {(replySed as F002Sed)?.barn?.map((b, i) => {
              const name = b.personInfo.fornavn + ' ' + b.personInfo.etternavn
              return (
                <div
                  key={name}
                  className={classNames('slideInFromLeft')}
                  style={{ animationDelay: (i * 0.1) + 's' }}
                >
                  <Checkbox
                    label={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhichKids(name, e.target.checked)}
                  />
                  <VerticalSeparatorDiv data-size='0.5' />
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
          <Column>
            <HighContrastInput
              data-test-id='c-vedtak-startdato-date'
              id='c-vedtak-startdato-date'
              feil={validation['vedtak-startdato']?.feilmelding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setStartDato(e.target.value)}
              value={_startDato}
              label={t('label:startdato')}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id='c-vedtak-sluttdato-date'
              id='c-vedtak-sluttdato-date'
              feil={validation['vedtak-sluttdato']?.feilmelding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSluttDato(e.target.value)}
              value={_sluttDato}
              label={t('label:sluttdato')}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.2s' }}
        >
          <Column>
            <Select
              data-test-id='c-vedtak-type-text'
              feil={validation['vedtak-type']?.feilmelding}
              highContrast={highContrast}
              id='c-vedtak-type-text'
              label={t('label:vedtak-type')}
              menuPortalTarget={document.body}
              onChange={(e: any) => _setType(e.value)}
              options={vedtakTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              defaultValue={_.find(vedtakTypeOptions, v => v.value === _type)}
              selectedValue={_.find(vedtakTypeOptions, v => v.value === _type)}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.3s' }}
        >
          <Column>
            <TextAreaDiv>
              <HighContrastTextArea
                className={classNames({ 'skjemaelement__input--harFeil': validation['vedtak-grunnen'] })}
                data-test-id='c-vedtak-grunnen-text'
                feil={validation['vedtak-grunnen']?.feilmelding}
                id='c-vedtak-grunnen-text'
                label={t('label:ytterligere-informasjon-til-sed')}
                maxLength={500}
                onChange={(e: any) => _setGrunnen(e.target.value)}
                placeholder={t('el:placeholder-input-default')}
                value={_grunnen}
              />
            </TextAreaDiv>
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {_perioderMedVedtak.map(renderPeriodeAndVedtak)}
        <hr />
        <VerticalSeparatorDiv />
        {_seeNewForm
          ? renderPeriodeAndVedtak(null, -1)
          : (
            <Row className='slideInFromLeft'>
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
      </HighContrastPanel>
    </PileDiv>
  )
}

export default VedtakFC
