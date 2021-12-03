import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Barnetilhoerighet, BarnRelasjon, BarnRelasjonType, JaNei, Periode } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Button, BodyLong, Heading } from '@navikt/ds-react'
import {
  AlignCenterRow,
  Column,
  RadioPanelGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateBarnetilhoerighet, ValidationBarnetilhoerigheterProps } from './validation'
import { Add } from '@navikt/ds-icons'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const Relasjon: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target: string = `${personID}.barnetilhoerigheter`
  const barnetilhoerigheter: Array<Barnetilhoerighet> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-relasjon`

  const [_newRelasjon, _setNewRelasjon] = useState<BarnRelasjon | undefined>(undefined)
  const [_newRelasjonType, _setNewRelasjonType] = useState<BarnRelasjonType | undefined>(undefined)
  const [_newPeriode, _setNewPeriode] = useState<Periode>({ startdato: '' })
  const [_newErDeltForeldreansvar, _setNewErDeltForeldreansvar] = useState<JaNei | undefined>(undefined)
  const [_newQuestion1, _setNewQuestion1] = useState<JaNei | undefined>(undefined)
  const [_newQuestion2, _setNewQuestion2] = useState<JaNei | undefined>(undefined)
  const [_newQuestion3, _setNewQuestion3] = useState<JaNei | undefined>(undefined)
  const [_newQuestion4, _setNewQuestion4] = useState<JaNei | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Barnetilhoerighet>((b: Barnetilhoerighet): string => b.relasjonType + '-' + b.relasjonTilPerson)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationBarnetilhoerigheterProps>({}, validateBarnetilhoerighet)

  const relasjonTypeOptions: Options = [
    { label: t('el:option-relasjon-1'), value: '01' },
    { label: t('el:option-relasjon-2'), value: '02' },
    { label: t('el:option-relasjon-3'), value: '03' },
    { label: t('el:option-relasjon-4'), value: '04' },
    { label: t('el:option-relasjon-5'), value: '05' },
    { label: t('el:option-relasjon-6'), value: '06' },
    { label: t('el:option-relasjon-7'), value: '07' },
    { label: t('el:option-relasjon-8'), value: '08' }
  ]

  const setRelasjon = (barnRelasjon: BarnRelasjon, index: number) => {
    if (index < 0) {
      _setNewRelasjon(barnRelasjon.trim() as BarnRelasjon)
      _resetValidation(namespace + '-relasjonTilPerson')
    } else {
      dispatch(updateReplySed(`${target}[${index}].relasjonTilPerson`, barnRelasjon))
      if (validation[namespace + getIdx(index) + '-relasjonTilPerson']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-relasjonTilPerson'))
      }
    }
  }

  const setRelasjonType = (barnRelasjonType: BarnRelasjonType, index: number) => {
    if (index < 0) {
      _setNewRelasjonType(barnRelasjonType.trim() as BarnRelasjonType)
      _resetValidation(namespace + '-relasjonType')
    } else {
      dispatch(updateReplySed(`${target}[${index}].relasjonType`, barnRelasjonType))
      if (validation[namespace + getIdx(index) + '-relasjonType']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-relasjonType'))
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

  const setErDeltForeldreansvar = (erDeltForeldreansvar: JaNei, index: number) => {
    if (index < 0) {
      _setNewErDeltForeldreansvar(erDeltForeldreansvar.trim() as JaNei)
      _resetValidation(namespace + '-erDeltForeldreansvar')
    } else {
      dispatch(updateReplySed(`${target}[${index}].erDeltForeldreansvar`, erDeltForeldreansvar))
      if (validation[namespace + getIdx(index) + '-erDeltForeldreansvar']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-erDeltForeldreansvar'))
      }
    }
  }

  const setQuestion1 = (svar: JaNei, index: number) => {
    if (index < 0) {
      _setNewQuestion1(svar.trim() as JaNei)
      _resetValidation(namespace + '-borIBrukersHushold')
    } else {
      dispatch(updateReplySed(`${target}[${index}].borIBrukersHushold`, svar))
      if (validation[namespace + getIdx(index) + '-borIBrukersHushold']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-borIBrukersHushold'))
      }
    }
  }

  const setQuestion2 = (svar: JaNei, index: number) => {
    if (index < 0) {
      _setNewQuestion2(svar.trim() as JaNei)
      _resetValidation(namespace + '-borIEktefellesHushold')
    } else {
      dispatch(updateReplySed(`${target}[${index}].borIEktefellesHushold`, svar))
      if (validation[namespace + getIdx(index) + '-borIEktefellesHushold']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-borIEktefellesHushold'))
      }
    }
  }

  const setQuestion3 = (svar: JaNei, index: number) => {
    if (index < 0) {
      _setNewQuestion3(svar.trim() as JaNei)
      _resetValidation(namespace + '-borIAnnenPersonsHushold')
    } else {
      dispatch(updateReplySed(`${target}[${index}].borIAnnenPersonsHushold`, svar))
      if (validation[namespace + getIdx(index) + '-borIAnnenPersonsHushold']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-borIAnnenPersonsHushold'))
      }
    }
  }

  const setQuestion4 = (svar: JaNei, index: number) => {
    if (index < 0) {
      _setNewQuestion4(svar.trim() as JaNei)
      _resetValidation(namespace + '-borPaaInstitusjon')
    } else {
      dispatch(updateReplySed(`${target}[${index}].borPaaInstitusjon`, svar))
      if (validation[namespace + getIdx(index) + '-borPaaInstitusjon']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-borPaaInstitusjon'))
      }
    }
  }

  const resetForm = () => {
    _setNewRelasjon(undefined)
    _setNewRelasjonType(undefined)
    _setNewPeriode({ startdato: '' })
    _setNewErDeltForeldreansvar(undefined)
    _setNewQuestion1(undefined)
    _setNewQuestion2(undefined)
    _setNewQuestion3(undefined)
    _setNewQuestion4(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (i: number) => {
    const newBarnetilhoerighet = _.cloneDeep(barnetilhoerigheter) as Array<Barnetilhoerighet>
    const deletedBarnetilhoerighet: Array<Barnetilhoerighet> = newBarnetilhoerighet.splice(i, 1)
    if (deletedBarnetilhoerighet && deletedBarnetilhoerighet.length > 0) {
      removeFromDeletion(deletedBarnetilhoerighet[0])
    }
    dispatch(updateReplySed(target, newBarnetilhoerighet))
    standardLogger('svarsed.editor.relasjon.remove')
  }

  const onAdd = () => {
    const newBarnetilhoerighet: Barnetilhoerighet = {
      // @ts-ignore
      borIBrukersHushold: _newQuestion1, // @ts-ignore
      borIEktefellesHushold: _newQuestion2, // @ts-ignore
      borIAnnenPersonsHushold: _newQuestion3, // @ts-ignore
      borPaaInstitusjon: _newQuestion4, // @ts-ignore
      erDeltForeldreansvar: _newErDeltForeldreansvar, // @ts-ignore
      relasjonTilPerson: _newRelasjon, // @ts-ignore
      relasjonType: _newRelasjonType,
      periode: _newPeriode
    }

    const valid: boolean = performValidation({
      barnetilhorighet: newBarnetilhoerighet,
      barnetilhorigheter: barnetilhoerigheter ?? [],
      namespace,
      personName
    })

    if (valid) {
      let newBarnetilhoerigheter = _.cloneDeep(barnetilhoerigheter)
      if (_.isNil(newBarnetilhoerigheter)) {
        newBarnetilhoerigheter = []
      }
      newBarnetilhoerigheter.push(newBarnetilhoerighet)
      dispatch(updateReplySed(target, newBarnetilhoerigheter))
      standardLogger('svarsed.editor.relasjon.add')
      resetForm()
    }
  }

  const renderRow = (barnetilhoerighet: Barnetilhoerighet | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(barnetilhoerighet)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const _periode = index < 0 ? _newPeriode : barnetilhoerighet?.periode

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <Row>
          <Column flex='3'>
            <RadioPanelGroup
              checked={index < 0 ? _newRelasjon : barnetilhoerighet?.relasjonTilPerson}
              data-no-border
              data-test-id={namespace + idx + '-relasjonTilPerson'}
              error={getErrorFor(index, 'relasjonTilPerson') ? ' ' : undefined}
              id={namespace + idx + '-relasjonTilPerson'}
              legend={t('label:relasjon-med') + ' *'}
              name={namespace + idx + '-relasjonTilPerson'}
              radios={[
                { label: t('label:søker'), value: '01' },
                { label: t('label:avdød'), value: '02' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRelasjon(e.target.value as BarnRelasjon, index)}
            />
            <VerticalSeparatorDiv size='0.15' />
            <RadioPanelGroup
              checked={index < 0 ? _newRelasjon : barnetilhoerighet?.relasjonTilPerson}
              data-no-border
              data-test-id={namespace + idx + '-relasjonTilPerson'}
              error={getErrorFor(index, 'relasjonTilPerson')}
              id={namespace + idx + '-relasjonTilPerson'}
              name={namespace + idx + '-relasjonTilPerson'}
              radios={[
                { label: t('label:partner'), value: '03' },
                { label: t('label:annen-person'), value: '04' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRelasjon(e.target.value as BarnRelasjon, index)}
            />
          </Column>
        </Row>
        <VerticalSeparatorDiv />
        <Row>
          <Column flex='3'>
            <Select
              closeMenuOnSelect
              data-test-id={namespace + idx + '-relasjonType'}
              error={getErrorFor(index, 'relasjonType')}
              id={namespace + idx + '-relasjonType'}
              key={namespace + idx + '-relasjonType' + (index < 0 ? _newRelasjonType : _.find(relasjonTypeOptions, b => b.value === barnetilhoerighet?.relasjonType))}
              label={t('label:type') + ' *'}
              menuPortalTarget={document.body}
              onChange={(e: unknown) => setRelasjonType((e as Option).value as BarnRelasjonType, index)}
              options={relasjonTypeOptions}
              placeholder={t('el:placeholder-select-default')}
              value={_.find(relasjonTypeOptions, b => b.value === (index < 0 ? _newRelasjonType : barnetilhoerighet?.relasjonType))}
              defaultValue={_.find(relasjonTypeOptions, b => b.value === (index < 0 ? _newRelasjonType : barnetilhoerighet?.relasjonType))}
            />
          </Column>
        </Row>
        <VerticalSeparatorDiv size='2' />
        <Heading size='small' className='slideInFromLeft'>
          {t('label:relasjonens-varighet')}
        </Heading>
        <VerticalSeparatorDiv />
        <Row>
          <PeriodeInput
            namespace={namespace + idx + '-periode'}
            error={{
              startdato: getErrorFor(index, 'periode-startdato'),
              sluttdato: getErrorFor(index, 'periode-sluttdato')
            }}
            setPeriode={(p: Periode, id: string) => setPeriode(p, id, index)}
            value={_periode}
            requiredStartDato={false}
          />
          <Column />
        </Row>
        <VerticalSeparatorDiv size='2' />
        <Row>
          <Column flex={2}>
            <RadioPanelGroup
              checked={index < 0 ? _newErDeltForeldreansvar : barnetilhoerighet?.erDeltForeldreansvar}
              data-no-border
              data-test-id={namespace + idx + '-erDeltForeldreansvar'}
              error={getErrorFor(index, 'erDeltForeldreansvar')}
              id={namespace + idx + '-erDeltForeldreansvar'}
              legend={t('label:delt-foreldreansvar')}
              name={namespace + '-erDeltForeldreansvar'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setErDeltForeldreansvar(e.target.value as JaNei, index)}
            />
          </Column>
          <Column />
        </Row>
        <VerticalSeparatorDiv />
        <Heading size='small'>
          {t('label:barn-i-hustand-spørsmål')}
        </Heading>
        <AlignCenterRow>
          <Column flex='2'>
            <BodyLong>
              {t('label:barn-i-hustand-spørsmål-1')}
            </BodyLong>
          </Column>
          <Column>
            <RadioPanelGroup
              checked={index < 0 ? _newQuestion1 : barnetilhoerighet?.borIBrukersHushold}
              data-no-border
              data-test-id={namespace + idx + '-borIBrukersHushold'}
              error={getErrorFor(index, 'borIBrukersHushold')}
              id={namespace + idx + '-borIBrukersHushold'}
              name={namespace + idx + '-borIBrukersHushold'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion1(e.target.value as JaNei, index)}
            />
          </Column>
        </AlignCenterRow>
        <VerticalSeparatorDiv size='0.2' />
        <AlignCenterRow>
          <Column flex='2'>
            <BodyLong>
              {t('label:barn-i-hustand-spørsmål-2')}
            </BodyLong>
          </Column>
          <Column>
            <RadioPanelGroup
              checked={index < 0 ? _newQuestion2 : barnetilhoerighet?.borIEktefellesHushold}
              data-no-border
              data-test-id={namespace + idx + '-borIEktefellesHushold'}
              error={getErrorFor(index, 'borIEktefellesHushold')}
              id={namespace + idx + '-borIEktefellesHushold'}
              name={namespace + idx + '-borIEktefellesHushold'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion2(e.target.value as JaNei, index)}
            />
          </Column>
        </AlignCenterRow>
        <VerticalSeparatorDiv size='0.2' />
        <AlignCenterRow>
          <Column flex='2'>
            <BodyLong>
              {t('label:barn-i-hustand-spørsmål-3')}
            </BodyLong>
          </Column>
          <Column>
            <RadioPanelGroup
              checked={index < 0 ? _newQuestion3 : barnetilhoerighet?.borIAnnenPersonsHushold}
              data-no-border
              data-test-id={namespace + idx + '-borIAnnenPersonsHushold'}
              error={getErrorFor(index, 'borIAnnenPersonsHushold')}
              id={namespace + idx + '-borIAnnenPersonsHushold'}
              name={namespace + idx + '-borIAnnenPersonsHushold'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion3(e.target.value as JaNei, index)}
            />
          </Column>
        </AlignCenterRow>
        <VerticalSeparatorDiv size='0.2' />
        <AlignCenterRow>
          <Column flex='2'>
            <BodyLong>
              {t('label:barn-i-hustand-spørsmål-4')}
            </BodyLong>
          </Column>
          <Column>
            <RadioPanelGroup
              checked={index < 0 ? _newQuestion4 : barnetilhoerighet?.borPaaInstitusjon}
              data-no-border
              data-test-id={namespace + idx + '-borPaaInstitusjon'}
              error={getErrorFor(index, 'borPaaInstitusjon')}
              id={namespace + idx + '-borPaaInstitusjon'}
              name={namespace + idx + '-borPaaInstitusjon'}
              radios={[
                { label: t('label:ja'), value: 'ja' },
                { label: t('label:nei'), value: 'nei' }
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion4(e.target.value as JaNei, index)}
            />
          </Column>
        </AlignCenterRow>
        <VerticalSeparatorDiv />
        <AlignCenterRow>
          <Column flex='2' />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(barnetilhoerighet)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(barnetilhoerighet)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignCenterRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      <Heading size='small' className='slideInFromLeft'>
        {t('label:relasjon-til-barn')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(barnetilhoerigheter)
        ? (
          <BodyLong>
            {t('message:warning-no-relasjon')}
          </BodyLong>
          )
        : barnetilhoerigheter?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>

            <Column>
              <Button
                variant='tertiary'
                size='small'
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:relasjon').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Relasjon
