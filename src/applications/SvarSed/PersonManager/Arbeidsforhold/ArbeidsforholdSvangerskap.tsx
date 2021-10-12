import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse, JaNei, Periode, PeriodeSykSvangerskapOmsorg, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Normaltekst } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import AdresseFC from '../Adresser/Adresse'
import { validatePeriodeSvangerskap, ValidationPeriodeSvangerskapProps } from './validationPeriodeSvangerskap'

export interface ArbeidsforholdSvangerskapSelector extends PersonManagerFormSelector {
  replySed: ReplySed | null | undefined
  validation: Validation
}

export interface ArbeidsforholdSvangerskapProps {
  parentNamespace: string
  target: string
  typeTrygdeforhold: string
}

const mapState = (state: State): ArbeidsforholdSvangerskapSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdSvangerskap: React.FC<ArbeidsforholdSvangerskapProps> = ({
  parentNamespace,
  target,
  typeTrygdeforhold
}: ArbeidsforholdSvangerskapProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, ArbeidsforholdSvangerskapSelector>(mapState)
  const dispatch = useDispatch()
  const perioder: Array<PeriodeSykSvangerskapOmsorg> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newInstitutionsId, _setNewInstitutionsId] = useState<string>('')
  const [_newInstitutionsNavn, _setNewInstitutionsNavn] = useState<string>('')
  const [_newErInstitusjonsIdKjent, _setNewErInstitusjonsIdKjent] = useState<JaNei | undefined>(undefined)
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newAdresse, _setNewAdresse] = useState<IAdresse | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeSykSvangerskapOmsorg>(
    (p: PeriodeSykSvangerskapOmsorg) => p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeSvangerskapProps>({}, validatePeriodeSvangerskap)

  const setInstitutionsId = (newInstitutionsId: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsId(newInstitutionsId.trim())
      _resetValidation(namespace + '-institutionsid')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institutionsid`, newInstitutionsId.trim()))
      if (validation[namespace + getIdx(index) + '-institutionsid']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institutionsid'))
      }
    }
  }
  const setInstitutionsNavn = (newInstitutionsNavn: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsNavn(newInstitutionsNavn.trim())
      _resetValidation(namespace + '-institusjonsnavn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjonsnavn`, newInstitutionsNavn.trim()))
      if (validation[namespace + getIdx(index) + '-institusjonsnavn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjonsnavn'))
      }
    }
  }

  const setErInstitusjonsIdKjent = (newErInstitusjonsIdKjent: JaNei, index: number) => {
    if (index < 0) {
      _setNewErInstitusjonsIdKjent(newErInstitusjonsIdKjent)
      _resetValidation(namespace + '-erinstitusjonsidkjent')
    } else {
      dispatch(updateReplySed(`${target}[${index}].erinstitusjonsidkjent`, newErInstitusjonsIdKjent))
      if (validation[namespace + getIdx(index) + '-erinstitusjonsidkjent']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-erinstitusjonsidkjent'))
      }
    }
  }

  const setNavn = (newNavn: string, index: number) => {
    if (index < 0) {
      _setNewNavn(newNavn.trim())
      _resetValidation(namespace + '-navn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].navn`, newNavn.trim()))
      if (validation[namespace + getIdx(index) + '-navn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-navn'))
      }
    }
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      _resetValidation(namespace + '-startdato')
      _resetValidation(namespace + '-sluttdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode`, periode))
      if (validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
      if (validation[namespace + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const setAdresse = (adresse: IAdresse, index: number) => {
    if (index < 0) {
      _setNewAdresse(adresse)
    } else {
      dispatch(updateReplySed(`${target}[${index}].adresse`, adresse))
    }
  }

  const resetAdresseValidation = (fullnamespace: string, index: number) => {
    if (index < 0) {
      _resetValidation(fullnamespace)
    } else {
      if (validation[fullnamespace]) {
        dispatch(resetValidation(fullnamespace))
      }
    }
  }

  const resetForm = () => {
    _setNewInstitutionsNavn('')
    _setNewInstitutionsId('')
    _setNewErInstitusjonsIdKjent(undefined)
    _setNewNavn('')
    _setNewPeriode({ startdato: '' })
    _setNewAdresse(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PeriodeSykSvangerskapOmsorg> = _.cloneDeep(perioder) as Array<PeriodeSykSvangerskapOmsorg>
    const deletedPerioder: Array<PeriodeSykSvangerskapOmsorg> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: target })
  }

  const onAdd = () => {
    const newPeriodeSvangerskap: PeriodeSykSvangerskapOmsorg = {
      periode: _newPeriode,
      typeTrygdeforhold: typeTrygdeforhold,
      institusjonsnavn: _newInstitutionsNavn.trim(),
      navn: _newNavn.trim(),
      institusjonsid: _newInstitutionsId.trim(),
      erinstitusjonsidkjent: _newErInstitusjonsIdKjent as JaNei,
      adresse: _newAdresse!
    }

    const valid: boolean = performValidation({
      periodeSvangerskap: newPeriodeSvangerskap,
      perioderSvangerskap: perioder ?? [],
      namespace: namespace
    })
    if (valid) {
      let newPerioderSvangerskap: Array<PeriodeSykSvangerskapOmsorg> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderSvangerskap)) {
        newPerioderSvangerskap = []
      }
      newPerioderSvangerskap = newPerioderSvangerskap.concat(newPeriodeSvangerskap)
      dispatch(updateReplySed(target, newPerioderSvangerskap))
      standardLogger('svarsed.editor.periode.add', { type: target })
      resetForm()
    }
  }

  const renderRow = (periodeSvangerskap: PeriodeSykSvangerskapOmsorg | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periodeSvangerskap)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : periodeSvangerskap?.periode

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <PeriodeInput
            key={'' + _periode?.startdato + _periode?.sluttdato}
            namespace={namespace}
            error={{
              startdato: getErrorFor(index, 'startdato'),
              sluttdato: getErrorFor(index, 'sluttdato')
            }}
            setPeriode={(p: Periode) => setPeriode(p, index)}
            value={_periode}
          />
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <Input
              feil={getErrorFor(index, 'institusjonsid')}
              namespace={namespace}
              id='institusjonsid'
              key={'institusjonsid-' + (index < 0 ? _newInstitutionsId : periodeSvangerskap?.institusjonsid ?? '')}
              label={t('label:institusjonens-id')}
              onChanged={(institusjonsid: string) => setInstitutionsId(institusjonsid, index)}
              value={index < 0 ? _newInstitutionsId : periodeSvangerskap?.institusjonsid ?? ''}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'institusjonsnavn')}
              namespace={namespace}
              id='institusjonsnavn'
              key={'institusjonsnavn-' + (index < 0 ? _newInstitutionsNavn : periodeSvangerskap?.institusjonsnavn ?? '')}
              label={t('label:institusjonens-navn')}
              onChanged={(institusjonsnavn: string) => setInstitutionsNavn(institusjonsnavn, index)}
              value={index < 0 ? _newInstitutionsNavn : periodeSvangerskap?.institusjonsnavn ?? ''}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <Input
              feil={getErrorFor(index, 'navn')}
              namespace={namespace}
              id='navn'
              key={'navn-' + (index < 0 ? _newNavn : periodeSvangerskap?.navn ?? '')}
              label={t('label:navn')}
              onChanged={(navn: string) => setNavn(navn, index)}
              value={index < 0 ? _newNavn : periodeSvangerskap?.navn ?? ''}
            />
          </Column>
          <Column>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newErInstitusjonsIdKjent : periodeSvangerskap?.erinstitusjonsidkjent ?? ''}
              data-test-id={namespace + idx + '-erinstitusjonsidkjent'}
              data-no-border
              id={namespace + idx + '-erinstitusjonsidkjent'}
              feil={getErrorFor(index, 'erinstitusjonsidkjent')}
              legend={t('label:institusjonens-id-er-kjent') + ' *'}
              name={namespace + idx + '-erinstitusjonsidkjent'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setErInstitusjonsIdKjent(e.target.value as JaNei, index)}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AdresseFC
          adresse={(index < 0 ? _newAdresse : periodeSvangerskap?.adresse)}
          onAdressChanged={(a) => setAdresse(a, index)}
          namespace={namespace + '-adresse'}
          validation={index < 0 ? _validation : validation}
          resetValidation={(fullnamespace: string) => resetAdresseValidation(fullnamespace, index)}
        />
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2' />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periodeSvangerskap)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periodeSvangerskap)}
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
    <PaddedDiv>
      {_.isEmpty(perioder)
        ? (
          <Normaltekst>
            {t('message:warning-no-periods')}
          </Normaltekst>
          )
        : perioder?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
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
    </PaddedDiv>
  )
}

export default ArbeidsforholdSvangerskap
