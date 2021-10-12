import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import AdresseFC from 'applications/SvarSed/PersonManager/Adresser/Adresse'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse, JaNei, Periode, PeriodeUtenForsikring, ReplySed } from 'declarations/sed'
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
import { getOrgnr } from 'utils/arbeidsgiver'
import { getIdx } from 'utils/namespace'
import { validatePeriodeUtenForsikring, ValidationPeriodeUtenForsikringProps } from './validationPeriodeUtenForsikring'

export interface ArbeidsforholdUtenForsikringSelector extends PersonManagerFormSelector {
  replySed: ReplySed | null | undefined
  validation: Validation
}

export interface ArbeidsforholdUtenForsikringProps {
  parentNamespace: string
  target: string
  typeTrygdeforhold: string
}

const mapState = (state: State): ArbeidsforholdUtenForsikringSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdUtenForsikring: React.FC<ArbeidsforholdUtenForsikringProps> = ({
  parentNamespace,
  target,
  typeTrygdeforhold
}: ArbeidsforholdUtenForsikringProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, ArbeidsforholdUtenForsikringSelector>(mapState)
  const dispatch = useDispatch()
  const perioder: Array<PeriodeUtenForsikring> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newOrgnr, _setNewOrgnr] = useState<string>('')
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newAdresse, _setNewAdresse] = useState<Adresse | undefined>(undefined)

  const [_newKreverinformasjonomtypearberidsforhold, _setNewKreverinformasjonomtypearberidsforhold] = useState<string>('')
  const [_newKreverinformasjonomantallarbeidstimer, _setNewKreverinformasjonomantallarbeidstimer] = useState<string>('')
  const [_newKreverinformasjonominntekt, _setNewKreverinformasjonominntekt] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeUtenForsikring>(
    (p: PeriodeUtenForsikring) => p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeUtenForsikringProps>({}, validatePeriodeUtenForsikring)

  const setNavn = (newNavn: string, index: number) => {
    if (index < 0) {
      _setNewNavn(newNavn.trim())
      _resetValidation(namespace + '-navn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].arbeidsgiver.navn`, newNavn.trim()))
      if (validation[namespace + getIdx(index) + '-navn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-navn'))
      }
    }
  }

  const setOrgnr = (newOrgnr: string, index: number) => {
    if (index < 0) {
      _setNewOrgnr(newOrgnr.trim())
      _resetValidation(namespace + '-orgnr')
    } else {
      dispatch(updateReplySed(`${target}[${index}].identifikator`, [
        { type: 'registrering', id: newOrgnr.trim() }
      ]))
      if (validation[namespace + getIdx(index) + '-orgnr']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-orgnr'))
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

  const setAdresse = (adresse: Adresse, index: number) => {
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

  const setKreverinformasjonomtypearberidsforhold = (newKreverinformasjonomtypearberidsforhold: string, index: number) => {
    if (index < 0) {
      _setNewKreverinformasjonomtypearberidsforhold(newKreverinformasjonomtypearberidsforhold.trim() as JaNei)
      _resetValidation(namespace + '-kreverinformasjonomtypearberidsforhold')
    } else {
      dispatch(updateReplySed(`${target}[${index}].kreverinformasjonomtypearberidsforhold`, newKreverinformasjonomtypearberidsforhold.trim()))
      if (validation[namespace + getIdx(index) + '-kreverinformasjonomtypearberidsforhold']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-kreverinformasjonomtypearberidsforhold'))
      }
    }
  }

  const setKreverinformasjonomantallarbeidstimer = (newKreverinformasjonomantallarbeidstimer: string, index: number) => {
    if (index < 0) {
      _setNewKreverinformasjonomantallarbeidstimer(newKreverinformasjonomantallarbeidstimer.trim() as JaNei)
      _resetValidation(namespace + '-kreverinformasjonomantallarbeidstimer')
    } else {
      dispatch(updateReplySed(`${target}[${index}].kreverinformasjonomantallarbeidstimer`, newKreverinformasjonomantallarbeidstimer.trim()))
      if (validation[namespace + getIdx(index) + '-kreverinformasjonomantallarbeidstimer']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-kreverinformasjonomantallarbeidstimer'))
      }
    }
  }

  const setKreverinformasjonominntekt = (newKreverinformasjonominntekt: string, index: number) => {
    if (index < 0) {
      _setNewKreverinformasjonominntekt(newKreverinformasjonominntekt.trim() as JaNei)
      _resetValidation(namespace + '-kreverinformasjonominntekt')
    } else {
      dispatch(updateReplySed(`${target}[${index}].kreverinformasjonominntekt`, newKreverinformasjonominntekt.trim()))
      if (validation[namespace + getIdx(index) + '-kreverinformasjonominntekt']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-kreverinformasjonominntekt'))
      }
    }
  }

  const resetForm = () => {
    _setNewNavn('')
    _setNewOrgnr('')
    _setNewPeriode({ startdato: '' })
    _setNewAdresse(undefined)
    _setNewKreverinformasjonomantallarbeidstimer('')
    _setNewKreverinformasjonomtypearberidsforhold('')
    _setNewKreverinformasjonominntekt('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PeriodeUtenForsikring> = _.cloneDeep(perioder) as Array<PeriodeUtenForsikring>
    const deletedPerioder: Array<PeriodeUtenForsikring> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: target })
  }

  const onAdd = () => {
    const newPeriodeUtenForsikring: PeriodeUtenForsikring = {
      periode: _newPeriode,
      typeTrygdeforhold: typeTrygdeforhold,
      arbeidsgiver: {
        navn: _newNavn.trim(),
        identifikator: [{ type: 'registrering', id: _newOrgnr.trim() }],
        adresse: _newAdresse
      },
      kreverinformasjonomtypearberidsforhold: _newKreverinformasjonomtypearberidsforhold as JaNei,
      kreverinformasjonomantallarbeidstimer: _newKreverinformasjonomantallarbeidstimer as JaNei,
      kreverinformasjonominntekt: _newKreverinformasjonominntekt as JaNei
    }

    const valid: boolean = performValidation({
      periodeUtenForsikring: newPeriodeUtenForsikring,
      perioderUtenForsikring: perioder ?? [],
      namespace: namespace
    })
    if (valid) {
      let newPerioderUtenForsikring: Array<PeriodeUtenForsikring> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderUtenForsikring)) {
        newPerioderUtenForsikring = []
      }
      newPerioderUtenForsikring = newPerioderUtenForsikring.concat(newPeriodeUtenForsikring)
      dispatch(updateReplySed(target, newPerioderUtenForsikring))
      standardLogger('svarsed.editor.periode.add', { type: target })
      resetForm()
    }
  }

  const renderRow = (periodeUtenForsikring: PeriodeUtenForsikring | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periodeUtenForsikring)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : periodeUtenForsikring?.periode

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
              feil={getErrorFor(index, 'orgnr')}
              namespace={namespace}
              id='orgnr'
              key={'orgnr-' + (index < 0 ? _newOrgnr : getOrgnr(periodeUtenForsikring!))}
              label={t('label:orgnr')}
              onChanged={(orgnr: string) => setOrgnr(orgnr, index)}
              value={index < 0 ? _newOrgnr : getOrgnr(periodeUtenForsikring!)}
            />
          </Column>
          <Column>
            <Input
              feil={getErrorFor(index, 'navn')}
              namespace={namespace}
              id='navn'
              key={'navn-' + (index < 0 ? _newNavn : periodeUtenForsikring?.arbeidsgiver?.navn)}
              label={t('label:navn')}
              onChanged={(navn: string) => setNavn(navn, index)}
              value={index < 0 ? _newNavn : periodeUtenForsikring?.arbeidsgiver?.navn ?? ''}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AdresseFC
          adresse={(index < 0 ? _newAdresse : periodeUtenForsikring?.arbeidsgiver?.adresse)}
          onAdressChanged={(a) => setAdresse(a, index)}
          namespace={namespace + '-adresse'}
          validation={index < 0 ? _validation : validation}
          resetValidation={(fullnamespace: string) => resetAdresseValidation(fullnamespace, index)}
          />
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newKreverinformasjonomtypearberidsforhold : periodeUtenForsikring?.kreverinformasjonomtypearberidsforhold}
              data-test-id={namespace + idx + '-kreverinformasjonomtypearberidsforhold'}
              data-no-border
              id={namespace + idx + '-kreverinformasjonomtypearberidsforhold'}
              feil={getErrorFor(index, 'kreverinformasjonomtypearberidsforhold')}
              legend={t('label:kreverinformasjonomtypearberidsforhold') + ' *'}
              name={namespace + idx + '-kreverinformasjonomtypearberidsforhold'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKreverinformasjonomtypearberidsforhold(e.target.value as JaNei, index)}
            />
          </Column>
          <Column flex='2' />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newKreverinformasjonomantallarbeidstimer : periodeUtenForsikring?.kreverinformasjonomantallarbeidstimer}
              data-test-id={namespace + idx + '-kreverinformasjonomantallarbeidstimer'}
              data-no-border
              id={namespace + idx + '-kreverinformasjonomantallarbeidstimer'}
              feil={getErrorFor(index, 'kreverinformasjonomantallarbeidstimer')}
              legend={t('label:kreverinformasjonomantallarbeidstimer') + ' *'}
              name={namespace + idx + '-kreverinformasjonomantallarbeidstimer'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKreverinformasjonomantallarbeidstimer(e.target.value as JaNei, index)}
            />
          </Column>
          <Column flex='2' />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2'>
            <HighContrastRadioPanelGroup
              checked={index < 0 ? _newKreverinformasjonominntekt : periodeUtenForsikring?.kreverinformasjonominntekt}
              data-test-id={namespace + idx + '-kreverinformasjonominntekt'}
              data-no-border
              id={namespace + idx + '-kreverinformasjonominntekt'}
              feil={getErrorFor(index, 'kreverinformasjonominntekt')}
              legend={t('label:kreverinformasjonominntekt') + ' *'}
              name={namespace + idx + '-kreverinformasjonominntekt'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKreverinformasjonominntekt(e.target.value as JaNei, index)}
            />
          </Column>
          <Column flex='2'>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periodeUtenForsikring)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periodeUtenForsikring)}
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

export default ArbeidsforholdUtenForsikring
