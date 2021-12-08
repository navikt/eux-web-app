import { resetValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/PersonManager/Adresser/AdresseForm'
import { standardLogger } from 'metrics/loggers'
import { Button, BodyLong, Heading } from '@navikt/ds-react'
import {
  validatePeriodeDagpenger,
  ValidationPeriodeDagpengerProps
} from './validationPeriodeDagpenger'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse, Periode, PeriodeDagpenger } from 'declarations/sed'
import { Kodeverk } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import {
  AlignStartRow,
  Column, FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv, RadioPanel,
  RadioPanelGroup,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { Add } from '@navikt/ds-icons'

interface PeriodeForDagpengerSelector extends PersonManagerFormSelector {
  landkoderList: Array<Kodeverk> | undefined
}

const mapState = (state: State): PeriodeForDagpengerSelector => ({
  landkoderList: state.app.landkoder,
  validation: state.validation.status
})

const PeriodeForDagpenger: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    validation
  } = useSelector<State, PeriodeForDagpengerSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'perioderDagpenger'
  const perioder: Array<PeriodeDagpenger> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-periodefordagpenger`

  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newInstitutionsId, _setNewInstitutionsId] = useState<string>('')
  const [_newInstitutionsNavn, _setNewInstitutionsNavn] = useState<string>('')
  const [_newNavn, _setNewNavn] = useState<string>('')
  const [_newAdresse, _setNewAdresse] = useState<Adresse | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeDagpenger>(
    (p: PeriodeDagpenger) => p.periode.startdato + '-' + (p.periode.sluttdato ?? p.periode.aapenPeriodeType))
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeDagpengerProps>({}, validatePeriodeDagpenger)

  const [cacheForIdMangler, setCacheForIdMangler] = useState<any>({})

  const setInstitutionsId = (newInstitutionsId: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsId(newInstitutionsId.trim())
      _resetValidation(namespace + '-institution-id')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institution.id`, newInstitutionsId.trim()))
      if (validation[namespace + getIdx(index) + '-institution-id']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institution-id'))
      }
    }
  }
  const setInstitutionsNavn = (newInstitutionsNavn: string, index: number) => {
    if (index < 0) {
      _setNewInstitutionsNavn(newInstitutionsNavn.trim())
      _resetValidation(namespace + '-institusjon-navn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjon.navn`, newInstitutionsNavn.trim()))
      if (validation[namespace + getIdx(index) + '-institusjon-navn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-navn'))
      }
    }
  }

  const setNewIdMangler = (newIdMangler: boolean, index: number) => {
    if (index < 0) {
      if (!newIdMangler) {
        setCacheForIdMangler({
          ...cacheForIdMangler,
          newitem: {
            navn: _newNavn,
            adresse: _newAdresse
          }
        })
        _setNewNavn('')
        _setNewAdresse(undefined)
      } else {
        if (Object.prototype.hasOwnProperty.call(cacheForIdMangler, 'newitem')) {
          _setNewNavn(cacheForIdMangler.newitem?.navn ?? '-')
          _setNewAdresse(cacheForIdMangler.newitem?.adresse)
          setCacheForIdMangler({
            ...cacheForIdMangler,
            newitem: undefined
          })
        } else {
          // this is for telling render that I need to show the form for address
          _setNewNavn('-')
        }
      }
      _resetValidation(namespace + '-idmangler')
    } else {
      const _index: string = '' + index
      if (!newIdMangler) {
        setCacheForIdMangler({
          ...cacheForIdMangler,
          [_index]: {
            navn: _.get(perioder, `[${index}].institusjon.idmangler.navn`) ?? '',
            adresse: _.get(perioder, `[${index}].institusjon.idmangler.adresse`) ?? {}
          }
        })
        dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler`, {}))
      } else {
        if (Object.prototype.hasOwnProperty.call(cacheForIdMangler, '' + index)) {
          dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler`, {
            navn: cacheForIdMangler['' + index].navn,
            adresse: cacheForIdMangler['' + index].adresse
          }))
          setCacheForIdMangler({
            ...cacheForIdMangler,
            ['' + index]: undefined
          })
        } else {
          dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler`, {
            navn: '-',
            adresse: {}
          }))
        }
      }
      if (validation[namespace + getIdx(index) + '-idmangler']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-idmangler'))
      }
    }
  }

  const setNavn = (newNavn: string, index: number) => {
    if (index < 0) {
      _setNewNavn(newNavn.trim())
      _resetValidation(namespace + '-institusjon-idmangler-navn')
    } else {
      dispatch(updateReplySed(`${target}[${index}].institusjon.idmangler.navn`, newNavn.trim()))
      if (validation[namespace + getIdx(index) + '-institusjon-idmangler-navn']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-institusjon-idmangler-navn'))
      }
    }
  }

  const setPeriode = (periode: Periode, id: string, index: number) => {
    if (index < 0) {
      _setNewPeriode(periode)
      if (id === 'startdato') {
        _resetValidation(namespace + '-periode-startdato')
      }
      if (id === 'sluttdato') {
        _resetValidation(namespace + '-periode-sluttdato')
      }
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode`, periode))
      if (id === 'startdato' && validation[namespace + getIdx(index) + '-periode-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-startdato'))
      }
      if (id === 'sluttdato' && validation[namespace + getIdx(index) + '-periode-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-periode-sluttdato'))
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

  const resetForm = () => {
    _setNewInstitutionsNavn('')
    _setNewInstitutionsId('')
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
    const newPerioder: Array<PeriodeDagpenger> = _.cloneDeep(perioder) as Array<PeriodeDagpenger>
    const deletedPerioder: Array<PeriodeDagpenger> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
    standardLogger('svarsed.editor.periode.remove', { type: 'perioderDagpenger' })
  }

  const onAdd = () => {
    const newPeriodeDagpenger: PeriodeDagpenger = {
      periode: _newPeriode,
      institusjon: {
        navn: _newInstitutionsNavn.trim(),
        id: _newInstitutionsId.trim(),
        idmangler: {
          navn: _newNavn.trim(),
          adresse: _newAdresse ?? {} as Adresse
        }
      }
    }

    const valid: boolean = performValidation({
      periodeDagpenger: newPeriodeDagpenger,
      perioderDagpenger: perioder ?? [],
      namespace: namespace,
      personName: personName
    })
    if (valid) {
      let newPerioderDagpenger: Array<PeriodeDagpenger> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderDagpenger)) {
        newPerioderDagpenger = []
      }
      newPerioderDagpenger = newPerioderDagpenger.concat(newPeriodeDagpenger)
      dispatch(updateReplySed(target, newPerioderDagpenger))
      standardLogger('svarsed.editor.periode.add', { type: 'perioderDagpenger' })
      resetForm()
    }
  }

  const renderRow = (periodeDagpenger: PeriodeDagpenger | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periodeDagpenger)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : periodeDagpenger?.periode

    const idmangler = index < 0
      ? !_.isEmpty(_newNavn.trim()) || !_.isEmpty(_newAdresse?.gate?.trim()) || !_.isEmpty(_newAdresse?.postnummer?.trim()) ||
        !_.isEmpty(_newAdresse?.bygning?.trim()) || !_.isEmpty(_newAdresse?.by?.trim()) || !_.isEmpty(_newAdresse?.region?.trim()) || !_.isEmpty(_newAdresse?.land)
      : !_.isEmpty(periodeDagpenger?.institusjon.idmangler?.navn) || !_.isEmpty(periodeDagpenger?.institusjon.idmangler?.adresse)

    const institusjonKjent = !idmangler
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <PeriodeInput
            namespace={namespace}
            error={{
              startdato: getErrorFor(index, 'periode-startdato'),
              sluttdato: getErrorFor(index, 'periode-sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
            value={_periode}
          />
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <Input
              error={getErrorFor(index, 'institusjon-id')}
              namespace={namespace}
              id='institusjon-id'
              key={'institusjon-id-' + (index < 0 ? _newInstitutionsId : periodeDagpenger?.institusjon.id ?? '')}
              label={t('label:institusjonens-id')}
              onChanged={(institusjonsid: string) => setInstitutionsId(institusjonsid, index)}
              value={index < 0 ? _newInstitutionsId : periodeDagpenger?.institusjon.id ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={getErrorFor(index, 'institusjon-navn')}
              namespace={namespace}
              id='institusjon-navn'
              key={'institusjon-navn-' + (index < 0 ? _newInstitutionsNavn : periodeDagpenger?.institusjon.navn ?? '')}
              label={t('label:institusjonens-navn')}
              onChanged={(institusjonsnavn: string) => setInstitutionsNavn(institusjonsnavn, index)}
              value={index < 0 ? _newInstitutionsNavn : periodeDagpenger?.institusjon.navn ?? ''}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <RadioPanelGroup
              value={institusjonKjent ? 'ja' : 'nei'}
              data-test-id={namespace + idx + '-idmangler'}
              data-no-border
              id={namespace + idx + '-idmangler'}
              error={getErrorFor(index, 'idmangler')}
              legend={t('label:institusjonens-id-er-kjent') + ' *'}
              name={namespace + idx + '-idmangler'}
              onChange={(e: string) => setNewIdMangler(e === 'nei', index)}
            >
              <FlexRadioPanels>
                <RadioPanel value='ja'>{t('label:ja')}</RadioPanel>
                <RadioPanel value='nei'>{t('label:nei')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {idmangler && (
          <>
            <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
              <Column>
                <Input
                  error={getErrorFor(index, 'institusjon-idmangler-navn')}
                  namespace={namespace}
                  id='institusjon-idmangler-navn'
                  key={'institusjon-idmangler-navn-' + (index < 0 ? _newNavn : periodeDagpenger?.institusjon.idmangler?.navn ?? '')}
                  label={t('label:navn')}
                  onChanged={(navn: string) => setNavn(navn, index)}
                  value={index < 0 ? _newNavn : periodeDagpenger?.institusjon.idmangler?.navn ?? ''}
                />
              </Column>
              <Column />
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AdresseForm
              adresse={(index < 0 ? _newAdresse : periodeDagpenger?.institusjon.idmangler?.adresse)}
              onAdressChanged={(a) => setAdresse(a, index)}
              namespace={namespace + '-institusjon-idmangler-adresse'}
              validation={index < 0 ? _validation : validation}
              resetValidation={(fullnamespace: string) => resetAdresseValidation(fullnamespace, index)}
            />
          </>
        )}
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column flex='2' />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periodeDagpenger)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periodeDagpenger)}
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
      <Heading size='small'>
        {t('label:periode-for-dagpenger')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(perioder)
        ? (
          <BodyLong>
            {t('message:warning-no-periods')}
          </BodyLong>
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
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default PeriodeForDagpenger
