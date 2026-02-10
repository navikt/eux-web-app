import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, Button, Checkbox, Heading, HGrid, HStack, Label, Radio, RadioGroup, Spacer, VStack } from '@navikt/ds-react'
import { resetAdresse } from 'actions/adresse'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import Select from 'components/Forms/Select'
import { RepeatableBox, SpacedHr } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Barnetilhoerighet, BarnRelasjon, BarnRelasjonType, JaNei, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
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
import commonStyles from 'assets/css/common.module.css'

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
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationBarnetilhoerigheterProps>(
      clonedValidation, namespace, validateBarnetilhoerigheter, {
        barnetilhoerigheter,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
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
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationBarnetilhoerighetProps>(
      clonedValidation, namespace, validateBarnetilhoerighet, {
        barnetilhoerighet: _editBarnetilhoerighet,
        barnetilhoerigheter,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editBarnetilhoerighet))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removed: Barnetilhoerighet) => {
    const newBarnetilhoerighet: Array<Barnetilhoerighet> = _.reject(barnetilhoerigheter, (b: Barnetilhoerighet) => _.isEqual(removed, b))
    dispatch(updateReplySed(target, newBarnetilhoerighet))
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
      onCloseNew()
    }
  }

  const renderRow = (barnetilhoerighet: Barnetilhoerighet | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _barnetilhoerighet = index < 0 ? _newBarnetilhoerighet : (inEditMode ? _editBarnetilhoerighet : barnetilhoerighet)

    return (
      <RepeatableBox
        id={'repeatablerow-' + _namespace}
        key={getId(barnetilhoerighet)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
        padding="4"
        borderWidth="1"
        borderColor="border-default"
        borderRadius="small"
      >
        {inEditMode
          ? (
            <VStack gap="4">
              <RadioGroup
                defaultValue={_barnetilhoerighet?.relasjonTilPerson}
                data-testid={_namespace + '-relasjonTilPerson'}
                error={_v[_namespace + '-relasjonTilPerson']?.feilmelding}
                id={_namespace + '-relasjonTilPerson'}
                legend={t('label:relasjon-med') + ' *'}
                onChange={(e: string) => setRelasjon(e as BarnRelasjon, index)}
              >
                <HStack gap="4">
                  <Radio className={commonStyles.radioPanel} value='søker'>{t('label:søker')}</Radio>
                  <Radio className={commonStyles.radioPanel} value='ektefelle_partner'>{t('label:ektefelle_partner')}</Radio>
                  <Radio className={commonStyles.radioPanel} value='avdød'>{t('label:avdød')}</Radio>
                  <Radio className={commonStyles.radioPanel} value='annen_person'>{t('label:annen_person')}</Radio>
                </HStack>
              </RadioGroup>
              <HGrid columns="1fr 2fr" gap="4" align="start">
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
              </HGrid>
              <HGrid columns={2} gap="4" align="start">
                <RadioGroup
                  value={_barnetilhoerighet?.erDeltForeldreansvar}
                  data-testid={_namespace + '-erDeltForeldreansvar'}
                  error={_v[_namespace + '-erDeltForeldreansvar']?.feilmelding}
                  id={_namespace + '-erDeltForeldreansvar'}
                  legend={t('label:delt-foreldreansvar')}
                  onChange={(e: string) => setErDeltForeldreansvar(e as JaNei, index)}
                >
                  <HStack gap="4">
                    <Radio className={commonStyles.radioPanel} value='ja'>{t('label:ja')}</Radio>
                    <Radio className={commonStyles.radioPanel} value='nei'>{t('label:nei')}</Radio>
                  </HStack>
                </RadioGroup>
              </HGrid>
              <Label>
                {t('label:hvor-bor-barnet')}
              </Label>
              <HStack gap="4" align="end">
                <VStack gap="2">
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
                </VStack>
                <Spacer />
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
              </HStack>
            </VStack>
            )
          : (
            <VStack gap="4">
              <HStack gap="2" wrap>
                <FormText
                  error={_v[_namespace + '-relasjonTilPerson']?.feilmelding}
                  id={_namespace + '-relasjonTilPerson'}
                >
                  <HStack gap="1">
                    {t('label:relasjon-med')}
                    {t('label:' + _barnetilhoerighet?.relasjonTilPerson).toLowerCase()},
                  </HStack>
                </FormText>
                <FormText
                  error={_v[_namespace + '-relasjonType']?.feilmelding}
                  id={_namespace + '-relasjonType'}
                >
                  {t('el:option-relasjon-' + _barnetilhoerighet?.relasjonType).toLowerCase()},
                </FormText>
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace}
                  periode={barnetilhoerighet?.periode}
                />
              </HStack>
              <HStack gap="4" align="start">
                <VStack gap="1">
                  <FormText
                    error={_v[_namespace + '-erDeltForeldreansvar']?.feilmelding}
                    id={_namespace + '-erDeltForeldreansvar'}
                  >
                    <HStack gap="1">
                      <Label>{t('label:delt-foreldreansvar')}:</Label>
                      {barnetilhoerighet?.erDeltForeldreansvar ? t('label:' + barnetilhoerighet?.erDeltForeldreansvar) : '-'}
                    </HStack>
                  </FormText>
                  <FormText
                    error={_v[_namespace + '-borIBrukersHushold']?.feilmelding}
                    id={_namespace + '-borIBrukersHushold'}
                  >
                    <HStack gap="1">
                      <Label>{t('label:barn-i-hustand-spørsmål-1')}:</Label>
                      {barnetilhoerighet?.borIBrukersHushold ? t('label:' + barnetilhoerighet?.borIBrukersHushold) : '-'}
                    </HStack>
                  </FormText>
                  <FormText
                    error={_v[_namespace + '-borIEktefellesHushold']?.feilmelding}
                    id={_namespace + '-borIEktefellesHushold'}
                  >
                    <HStack gap="1">
                      <Label>{t('label:barn-i-hustand-spørsmål-2')}:</Label>
                      {barnetilhoerighet?.borIEktefellesHushold ? t('label:' + barnetilhoerighet?.borIEktefellesHushold) : '-'}
                    </HStack>
                  </FormText>
                  <FormText
                    error={_v[_namespace + '-borIAnnenPersonsHushold']?.feilmelding}
                    id={_namespace + '-borIAnnenPersonsHushold'}
                  >
                    <HStack gap="1">
                      <Label>{t('label:barn-i-hustand-spørsmål-3')}:</Label>
                      {barnetilhoerighet?.borIAnnenPersonsHushold ? t('label:' + barnetilhoerighet?.borIAnnenPersonsHushold) : '-'}
                    </HStack>
                  </FormText>
                  <FormText
                    error={_v[_namespace + '-borPaaInstitusjon']?.feilmelding}
                    id={_namespace + '-borPaaInstitusjon'}
                  >
                    <HStack gap="1">
                      <Label>{t('label:barn-i-hustand-spørsmål-4')}:</Label>
                      {barnetilhoerighet?.borPaaInstitusjon ? t('label:' + barnetilhoerighet?.borPaaInstitusjon) : '-'}
                    </HStack>
                  </FormText>
                </VStack>
              </HStack>
              <HStack>
                <Spacer />
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

              </HStack>
            </VStack>
          )
        }
      </RepeatableBox>
    )
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {t('label:relasjon-til-barn')}
        </Heading>
        {_.isEmpty(barnetilhoerigheter)
          ? (
            <Box>
              <SpacedHr />
              <BodyLong>
                {t('message:warning-no-relasjon')}
              </BodyLong>
              <SpacedHr />
            </Box>
            )
          : barnetilhoerigheter?.map(renderRow)}
        {_seeNewForm
          ? renderRow(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                icon={<PlusCircleIcon/>}
              >
                {t('el:button-add-new-x', { x: t('label:relasjon').toLowerCase() })}
              </Button>
            </Box>
            )}
      </VStack>
    </Box>
  )
}

export default Relasjon
