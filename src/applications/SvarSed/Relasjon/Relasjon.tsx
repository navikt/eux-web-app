import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Heading, Label } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  AlignEndRow,
  Column,
  FlexBaseDiv,
  FlexDiv,
  FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  PileDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetAdresse } from 'actions/adresse'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import Select from 'components/Forms/Select'
import { RepeatableRow, SpacedHr } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Barnetilhoerighet, BarnRelasjon, BarnRelasjonType, JaNei, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validateBarnetilhoerighet,
  validateBarnetilhoerigheter,
  ValidationBarnetilhoerigheterProps,
  ValidationBarnetilhoerighetProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Relasjon: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = `${personID}.barnetilhoerigheter`
  const barnetilhoerigheter: Array<Barnetilhoerighet> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-relasjon`
  const getId = (b: Barnetilhoerighet | null | undefined): string => b ? b.relasjonType + '-' + (b?.periode?.startdato ?? '') : 'new'

  const [_newBarnetilhoerighet, _setNewBarnetilhoerighet] = useState<Barnetilhoerighet | undefined>(undefined)
  const [_editBarnetilhoerighet, _setEditBarnetilhoerighet] = useState<Barnetilhoerighet | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_seeNewForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationBarnetilhoerighetProps>(validateBarnetilhoerighet, namespace)

  const relasjonTypeOptions: Options = [
    { label: t('el:option-relasjon-daglig_omsorg'), value: 'daglig_omsorg' },
    { label: t('el:option-relasjon-født_i_ekteskap'), value: 'født_i_ekteskap' },
    { label: t('el:option-relasjon-eget_barn'), value: 'eget_barn' },
    { label: t('el:option-relasjon-adoptert_barn'), value: 'adoptert_barn' },
    { label: t('el:option-relasjon-født_utenfor_ekteskap'), value: 'født_utenfor_ekteskap' },
    { label: t('el:option-relasjon-barn_av_ektefelle'), value: 'barn_av_ektefelle' },
    { label: t('el:option-relasjon-barnebarn_bror_søster_nevø_niese'), value: 'barnebarn_bror_søster_nevø_niese' },
    { label: t('el:option-relasjon-fosterbarn'), value: 'fosterbarn' }
  ]

  useUnmount(() => {
    const [, newValidation] = performValidation<ValidationBarnetilhoerigheterProps>(
      validation, namespace, validateBarnetilhoerigheter, {
        barnetilhoerigheter,
        personName
      }
    )
    dispatch(setValidation(newValidation))
    dispatch(resetAdresse())
  })

  const setRelasjon = (relasjonTilPerson: BarnRelasjon, index: number) => {
    if (index < 0) {
      _setNewBarnetilhoerighet({
        ..._newBarnetilhoerighet,
        relasjonTilPerson: relasjonTilPerson.trim() as BarnRelasjon
      } as Barnetilhoerighet)
      _resetValidation(namespace + '-relasjonTilPerson')
      return
    }
    _setEditBarnetilhoerighet({
      ..._editBarnetilhoerighet,
      relasjonTilPerson: relasjonTilPerson.trim() as BarnRelasjon
    } as Barnetilhoerighet)
    dispatch(resetValidation(namespace + getIdx(index) + '-relasjonTilPerson'))
  }

  const setRelasjonType = (barnRelasjonType: BarnRelasjonType, index: number) => {
    if (index < 0) {
      _setNewBarnetilhoerighet({
        ..._newBarnetilhoerighet,
        relasjonType: barnRelasjonType.trim() as BarnRelasjonType
      } as Barnetilhoerighet)
      _resetValidation(namespace + '-relasjonType')
      return
    }
    _setEditBarnetilhoerighet({
      ..._editBarnetilhoerighet,
      relasjonType: barnRelasjonType.trim() as BarnRelasjonType
    } as Barnetilhoerighet)
    dispatch(resetValidation(namespace + getIdx(index) + '-relasjonType'))
  }

  const setPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewBarnetilhoerighet({
        ..._newBarnetilhoerighet,
        periode
      } as Barnetilhoerighet)
      _resetValidation(namespace + '-periode')
      return
    }
    _setEditBarnetilhoerighet({
      ..._editBarnetilhoerighet,
      periode
    } as Barnetilhoerighet)
    dispatch(resetValidation(namespace + getIdx(index) + '-periode'))
  }

  const setErDeltForeldreansvar = (erDeltForeldreansvar: JaNei, index: number) => {
    if (index < 0) {
      _setNewBarnetilhoerighet({
        ..._newBarnetilhoerighet,
        erDeltForeldreansvar
      } as Barnetilhoerighet)
      _resetValidation(namespace + '-erDeltForeldreansvar')
      return
    }
    _setEditBarnetilhoerighet({
      ..._editBarnetilhoerighet,
      erDeltForeldreansvar
    } as Barnetilhoerighet)
    dispatch(resetValidation(namespace + getIdx(index) + '-erDeltForeldreansvar'))
  }

  const setQuestion1 = (svar: boolean, index: number) => {
    if (index < 0) {
      _setNewBarnetilhoerighet({
        ..._newBarnetilhoerighet,
        borIBrukersHushold: svar ? 'ja' : 'nei'
      } as Barnetilhoerighet)
      _resetValidation(namespace + '-borIBrukersHushold')
      return
    }
    _setEditBarnetilhoerighet({
      ..._editBarnetilhoerighet,
      borIBrukersHushold: svar ? 'ja' : 'nei'
    } as Barnetilhoerighet)
    dispatch(resetValidation(namespace + getIdx(index) + '-borIBrukersHushold'))
  }

  const setQuestion2 = (svar: boolean, index: number) => {
    if (index < 0) {
      _setNewBarnetilhoerighet({
        ..._newBarnetilhoerighet,
        borIEktefellesHushold: svar ? 'ja' : 'nei'
      } as Barnetilhoerighet)
      _resetValidation(namespace + '-borIEktefellesHushold')
      return
    }
    _setEditBarnetilhoerighet({
      ..._editBarnetilhoerighet,
      borIEktefellesHushold: svar ? 'ja' : 'nei'
    } as Barnetilhoerighet)
    dispatch(resetValidation(namespace + getIdx(index) + '-borIEktefellesHushold'))
  }

  const setQuestion3 = (svar: boolean, index: number) => {
    if (index < 0) {
      _setNewBarnetilhoerighet({
        ..._newBarnetilhoerighet,
        borIAnnenPersonsHushold: svar ? 'ja' : 'nei'
      } as Barnetilhoerighet)
      _resetValidation(namespace + '-borIAnnenPersonsHushold')
      return
    }
    _setEditBarnetilhoerighet({
      ..._editBarnetilhoerighet,
      borIAnnenPersonsHushold: svar ? 'ja' : 'nei'
    } as Barnetilhoerighet)
    dispatch(resetValidation(namespace + getIdx(index) + '-borIAnnenPersonsHushold'))
  }

  const setQuestion4 = (svar: boolean, index: number) => {
    if (index < 0) {
      _setNewBarnetilhoerighet({
        ..._newBarnetilhoerighet,
        borPaaInstitusjon: svar ? 'ja' : 'nei'
      } as Barnetilhoerighet)
      _resetValidation(namespace + '-borPaaInstitusjon')
      return
    }
    _setEditBarnetilhoerighet({
      ..._editBarnetilhoerighet,
      borPaaInstitusjon: svar ? 'ja' : 'nei'
    } as Barnetilhoerighet)
    dispatch(resetValidation(namespace + getIdx(index) + '-borPaaInstitusjon'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditBarnetilhoerighet(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewBarnetilhoerighet(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (b: Barnetilhoerighet, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditBarnetilhoerighet(b)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const [valid, newValidation] = performValidation<ValidationBarnetilhoerighetProps>(
      validation, namespace, validateBarnetilhoerighet, {
        barnetilhoerighet: _editBarnetilhoerighet,
        barnetilhoerigheter,
        index: _editIndex,
        personName
      })
    if (valid) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editBarnetilhoerighet))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(newValidation))
    }
  }

  const onRemove = (removed: Barnetilhoerighet) => {
    const newBarnetilhoerighet: Array<Barnetilhoerighet> = _.reject(barnetilhoerigheter, (b: Barnetilhoerighet) => _.isEqual(removed, b))
    dispatch(updateReplySed(target, newBarnetilhoerighet))
    standardLogger('svarsed.editor.relasjon.remove')
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      barnetilhoerighet: _newBarnetilhoerighet,
      barnetilhoerigheter,
      personName
    })

    if (!!_newBarnetilhoerighet && valid) {
      let newBarnetilhoerigheter = _.cloneDeep(barnetilhoerigheter)
      if (_.isNil(newBarnetilhoerigheter)) {
        newBarnetilhoerigheter = []
      }
      newBarnetilhoerigheter.push(_newBarnetilhoerighet)
      dispatch(updateReplySed(target, newBarnetilhoerigheter))
      standardLogger('svarsed.editor.relasjon.add')
      onCloseNew()
    }
  }

  const renderRow = (barnetilhoerighet: Barnetilhoerighet | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _barnetilhoerighet = index < 0 ? _newBarnetilhoerighet : (inEditMode ? _editBarnetilhoerighet : barnetilhoerighet)

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(barnetilhoerighet)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        {inEditMode
          ? (
            <>
              <AlignStartRow>
                <Column>
                  <RadioPanelGroup
                    defaultValue={_barnetilhoerighet?.relasjonTilPerson}
                    data-no-border
                    data-testid={_namespace + '-relasjonTilPerson'}
                    error={_v[_namespace + '-relasjonTilPerson']?.feilmelding}
                    id={_namespace + '-relasjonTilPerson'}
                    legend={t('label:relasjon-med') + ' *'}
                    name={_namespace + '-relasjonTilPerson'}
                    onChange={(e: string) => setRelasjon(e as BarnRelasjon, index)}
                  >
                    <FlexRadioPanels>
                      <RadioPanel value='søker'>{t('label:søker')}</RadioPanel>
                      <RadioPanel value='ektefelle_partner'>{t('label:ektefelle_partner')}</RadioPanel>
                      <RadioPanel value='avdød'>{t('label:avdød')}</RadioPanel>
                      <RadioPanel value='annen_person'>{t('label:annen_person')}</RadioPanel>
                    </FlexRadioPanels>
                  </RadioPanelGroup>
                </Column>
              </AlignStartRow>
              <AlignStartRow>
                <Column flex='2'>
                  <Select
                    closeMenuOnSelect
                    data-testid={_namespace + '-relasjonType'}
                    error={_v[_namespace + '-relasjonType']?.feilmelding}
                    id={_namespace + '-relasjonType'}
                    label={t('label:type')}
                    menuPortalTarget={document.body}
                    onChange={(e: unknown) => setRelasjonType((e as Option).value as BarnRelasjonType, index)}
                    options={relasjonTypeOptions}
                    required
                    value={_.find(relasjonTypeOptions, b => b.value === _barnetilhoerighet?.relasjonType)}
                    defaultValue={_.find(relasjonTypeOptions, b => b.value === _barnetilhoerighet?.relasjonType)}
                  />
                </Column>
                <PeriodeInput
                  namespace={_namespace}
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  hideLabel={false}
                  setPeriode={(p: Periode) => setPeriode(p, index)}
                  value={_barnetilhoerighet?.periode}
                  requiredStartDato={false}
                />
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column>
                  <RadioPanelGroup
                    value={_barnetilhoerighet?.erDeltForeldreansvar}
                    data-no-border
                    data-testid={_namespace + '-erDeltForeldreansvar'}
                    error={_v[_namespace + '-erDeltForeldreansvar']?.feilmelding}
                    id={_namespace + '-erDeltForeldreansvar'}
                    legend={t('label:delt-foreldreansvar')}
                    name={_namespace + '-erDeltForeldreansvar'}
                    onChange={(e: string) => setErDeltForeldreansvar(e as JaNei, index)}
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
              <Label>
                {t('label:hvor-bor-barnet')}
              </Label>
              <AlignEndRow>
                <Column flex='2'>
                  <Checkbox
                    checked={_barnetilhoerighet?.borIBrukersHushold === 'ja'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion1(e.target.checked, index)}
                  >
                    {t('label:barn-i-hustand-spørsmål-1')}
                  </Checkbox>
                  <Checkbox
                    checked={_barnetilhoerighet?.borIEktefellesHushold === 'ja'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion2(e.target.checked, index)}
                  >
                    {t('label:barn-i-hustand-spørsmål-2')}
                  </Checkbox>
                  <Checkbox
                    checked={_barnetilhoerighet?.borIAnnenPersonsHushold === 'ja'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion3(e.target.checked, index)}
                  >
                    {t('label:barn-i-hustand-spørsmål-3')}
                  </Checkbox>
                  <Checkbox
                    checked={_barnetilhoerighet?.borPaaInstitusjon === 'ja'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion4(e.target.checked, index)}
                  >
                    {t('label:barn-i-hustand-spørsmål-4')}
                  </Checkbox>
                </Column>
                <AlignEndColumn>
                  <AddRemovePanel<Barnetilhoerighet>
                    item={barnetilhoerighet}
                    marginTop={false}
                    index={index}
                    inEditMode={inEditMode}
                    onRemove={onRemove}
                    onAddNew={onAddNew}
                    onCancelNew={onCloseNew}
                    onStartEdit={onStartEdit}
                    onConfirmEdit={onSaveEdit}
                    onCancelEdit={() => onCloseEdit(_namespace)}
                  />
                </AlignEndColumn>
              </AlignEndRow>
            </>
            )
          : (
            <>
              <AlignEndRow>
                <Column>
                  <FlexBaseDiv>
                    <FormText
                      error={_v[_namespace + '-relasjonTilPerson']?.feilmelding}
                      id={_namespace + '-relasjonTilPerson'}
                    >
                      <FlexDiv>
                        {t('label:relasjon-med')}
                        <HorizontalSeparatorDiv size='0.5' />
                        {t('label:' + _barnetilhoerighet?.relasjonTilPerson).toLowerCase()}
                      </FlexDiv>
                    </FormText>
                    ,
                    <HorizontalSeparatorDiv size='0.5' />
                    <FormText
                      error={_v[_namespace + '-relasjonType']?.feilmelding}
                      id={_namespace + '-relasjonType'}
                    >
                      {t('el:option-relasjon-' + _barnetilhoerighet?.relasjonType).toLowerCase()}
                    </FormText>
                    ,
                    <HorizontalSeparatorDiv size='0.5' />
                    <PeriodeText
                      error={{
                        startdato: _v[_namespace + '-startdato']?.feilmelding,
                        sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                      }}
                      namespace={_namespace}
                      periode={barnetilhoerighet?.periode}
                    />
                  </FlexBaseDiv>
                </Column>
              </AlignEndRow>
              <VerticalSeparatorDiv />
              <AlignEndRow>
                <Column flex='2'>
                  <PileDiv>
                    <FormText
                      error={_v[_namespace + '-erDeltForeldreansvar']?.feilmelding}
                      id={_namespace + '-erDeltForeldreansvar'}
                    >
                      <FlexDiv>
                        <Label>{t('label:delt-foreldreansvar')}:</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {barnetilhoerighet?.erDeltForeldreansvar ? t('label:' + barnetilhoerighet?.erDeltForeldreansvar) : '-'}
                      </FlexDiv>
                    </FormText>
                    <FormText
                      error={_v[_namespace + '-borIBrukersHushold']?.feilmelding}
                      id={_namespace + '-borIBrukersHushold'}
                    >
                      <FlexDiv>
                        <Label>{t('label:barn-i-hustand-spørsmål-1')}:</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {barnetilhoerighet?.borIBrukersHushold ? t('label:' + barnetilhoerighet?.borIBrukersHushold) : '-'}
                      </FlexDiv>
                    </FormText>
                    <FormText
                      error={_v[_namespace + '-borIEktefellesHushold']?.feilmelding}
                      id={_namespace + '-borIEktefellesHushold'}
                    >
                      <FlexDiv>
                        <Label>{t('label:barn-i-hustand-spørsmål-2')}:</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {barnetilhoerighet?.borIEktefellesHushold ? t('label:' + barnetilhoerighet?.borIEktefellesHushold) : '-'}
                      </FlexDiv>
                    </FormText>
                    <FormText
                      error={_v[_namespace + '-borIAnnenPersonsHushold']?.feilmelding}
                      id={_namespace + '-borIAnnenPersonsHushold'}
                    >
                      <FlexDiv>
                        <Label>{t('label:barn-i-hustand-spørsmål-3')}:</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {barnetilhoerighet?.borIAnnenPersonsHushold ? t('label:' + barnetilhoerighet?.borIAnnenPersonsHushold) : '-'}
                      </FlexDiv>
                    </FormText>
                    <FormText
                      error={_v[_namespace + '-borPaaInstitusjon']?.feilmelding}
                      id={_namespace + '-borPaaInstitusjon'}
                    >
                      <FlexDiv>
                        <Label>{t('label:barn-i-hustand-spørsmål-4')}:</Label>
                        <HorizontalSeparatorDiv size='0.5' />
                        {barnetilhoerighet?.borPaaInstitusjon ? t('label:' + barnetilhoerighet?.borPaaInstitusjon) : '-'}
                      </FlexDiv>
                    </FormText>
                  </PileDiv>
                </Column>
                <AlignEndColumn>
                  <AddRemovePanel<Barnetilhoerighet>
                    item={barnetilhoerighet}
                    marginTop={false}
                    index={index}
                    inEditMode={inEditMode}
                    onRemove={onRemove}
                    onAddNew={onAddNew}
                    onCancelNew={onCloseNew}
                    onStartEdit={onStartEdit}
                    onConfirmEdit={onSaveEdit}
                    onCancelEdit={() => onCloseEdit(_namespace)}
                  />
                </AlignEndColumn>
              </AlignEndRow>
            </>
            )}
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {t('label:relasjon-til-barn')}
        </Heading>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      {_.isEmpty(barnetilhoerigheter)
        ? (
          <PaddedHorizontallyDiv>
            <SpacedHr />
            <BodyLong>
              {t('message:warning-no-relasjon')}
            </BodyLong>
            <SpacedHr />
          </PaddedHorizontallyDiv>
          )
        : barnetilhoerigheter?.map(renderRow)}
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
            >
              <AddCircle />
              {t('el:button-add-new-x', { x: t('label:relasjon').toLowerCase() })}
            </Button>
          </PaddedDiv>
          )}
    </>
  )
}

export default Relasjon
