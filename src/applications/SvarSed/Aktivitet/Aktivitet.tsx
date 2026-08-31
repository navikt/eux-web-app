import { PlusCircleIcon } from '@navikt/aksel-icons'
import { BodyLong, Box, Button, Heading, HGrid, HStack, Select, Spacer, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import commonStyles from 'assets/css/common.module.css'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { Options } from 'declarations/app'
import { Presisering, AktivitetType, BostedOpplysninger, PersonensStatus } from '../../../declarations/h'
import { State } from 'declarations/reducers'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState, JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import {
  validatePresisering,
  validateAktivitet,
  ValidationPresiseringProps,
  ValidationAktivitetProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Aktivitet: React.FC<MainFormProps> = ({
  label,
  options,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const { parentKey, namespaceInfix, inntektskildeHvisStudentMaxLength, skattemessigGrunnKey } = options
  const namespace = `${parentNamespace}-${personID}-${namespaceInfix}-status`
  const presiseringerTarget = `${parentKey}.aktivitet.presiseringer`
  const bostedOpplysninger = _.get(replySed, parentKey) as BostedOpplysninger | undefined
  const presiseringer: Array<Presisering> | undefined = bostedOpplysninger?.aktivitet?.presiseringer

  const personensStatusOptions: Options = [
    { label: t('el:option-personens-status-ansatt'), value: 'ansatt' },
    { label: t('el:option-personens-status-selvstendig_næringsdrivende'), value: 'selvstendig_næringsdrivende' },
    { label: t('el:option-personens-status-grensearbeider'), value: 'grensearbeider' },
    { label: t('el:option-personens-status-pensjonist'), value: 'pensjonist' },
    { label: t('el:option-personens-status-person_som_krever_pensjon'), value: 'person_som_krever_pensjon' },
    { label: t('el:option-personens-status-arbeidsledig'), value: 'arbeidsledig' },
    { label: t('el:option-personens-status-familiemedlem_forsørget'), value: 'familiemedlem_forsørget' },
    { label: t('el:option-personens-status-student'), value: 'student' },
    { label: t('el:option-personens-status-annet'), value: 'annet' }
  ]

  const aktivitetTypeOptions: Options = [
    { label: t('el:option-aktivitet-type-inntektsgivende_virksomhet'), value: 'inntektsgivende_virksomhet' },
    { label: t('el:option-aktivitet-type-ikke_inntektsgivende_virksomhet'), value: 'ikke_inntektsgivende_virksomhet' }
  ]

  const getId = (presisering: Presisering | null | undefined): string => presisering
    ? (presisering.beskrivelse ?? '') + '-' + (presisering.sted ?? '')
    : 'new'

  const [_newPresisering, _setNewPresisering] = useState<Presisering | undefined>(undefined)
  const [_editPresisering, _setEditPresisering] = useState<Presisering | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_seeNewForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPresiseringProps>(validatePresisering, namespace)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAktivitetProps>(
      clonedvalidation, namespace, validateAktivitet, {
        bostedOpplysninger,
        inntektskildeHvisStudentMaxLength,
        skattemessigGrunn: _.get(bostedOpplysninger, skattemessigGrunnKey),
        skattemessigGrunnId: skattemessigGrunnKey,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setPersonensStatus = (value: string) => {
    const newStatus = (value.trim() || undefined) as PersonensStatus | undefined
    dispatch(updateReplySed(`${parentKey}.aktivitet.type`, newStatus))
    if (newStatus !== 'annet') {
      dispatch(updateReplySed(`${parentKey}.aktivitet.annet`, undefined))
    }
    if (validation[namespace + '-aktivitetType']) {
      dispatch(resetValidation(namespace + '-aktivitetType'))
    }
  }

  const setPersonensStatusAnnet = (value: string) => {
    dispatch(updateReplySed(`${parentKey}.aktivitet.annet`, value.trim() || undefined))
    if (validation[namespace + '-aktivitetAnnet']) {
      dispatch(resetValidation(namespace + '-aktivitetAnnet'))
    }
  }

  const setBostedOpplysning = (id: string, value: string) => {
    dispatch(updateReplySed(`${parentKey}.${id}`, value.trim() || undefined))
    if (validation[namespace + '-' + id]) {
      dispatch(resetValidation(namespace + '-' + id))
    }
  }

  const setPresisering = (changes: Partial<Presisering>, fieldId: string, index: number) => {
    if (index < 0) {
      _setNewPresisering((prev) => ({ ...prev, ...changes }))
      _resetValidation(namespace + '-' + fieldId)
      return
    }
    _setEditPresisering((prev) => ({ ...prev, ...changes }))
    if (validation[namespace + getIdx(index) + '-' + fieldId]) {
      dispatch(resetValidation(namespace + getIdx(index) + '-' + fieldId))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPresisering(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPresisering(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (presisering: Presisering, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPresisering(presisering)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationPresiseringProps>(
      clonedvalidation, namespace, validatePresisering, {
        presisering: _editPresisering,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${presiseringerTarget}[${_editIndex}]`, _editPresisering))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemove = (removedPresisering: Presisering) => {
    const newPresiseringer: Array<Presisering> = _.reject(presiseringer, (presisering: Presisering) => _.isEqual(removedPresisering, presisering))
    dispatch(updateReplySed(presiseringerTarget, newPresiseringer))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      presisering: _newPresisering,
      personName
    })
    if (!!_newPresisering && valid) {
      let newPresiseringer: Array<Presisering> | undefined = _.cloneDeep(presiseringer)
      if (_.isNil(newPresiseringer)) {
        newPresiseringer = []
      }
      newPresiseringer.push(_newPresisering)
      dispatch(updateReplySed(presiseringerTarget, newPresiseringer))
      onCloseNew()
    }
  }

  const renderRow = (presisering: Presisering | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _presisering = index < 0 ? _newPresisering : (inEditMode ? _editPresisering : presisering)

    const addremovepanel = (
      <AddRemovePanel<Presisering>
        item={presisering}
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
    )

    return (
      <Box
        padding="space-16"
        id={'repeatablerow-' + _namespace}
        key={getId(presisering)}
        className={classNames(commonStyles.repeatableBox, {
          [commonStyles.new]: index < 0,
          [commonStyles.error]: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VStack gap="space-16">
          {inEditMode
            ? (
              <VStack gap="space-16">
                <Select
                  id={_namespace + '-inntektsgivende'}
                  name={_namespace + '-inntektsgivende'}
                  error={_v[_namespace + '-inntektsgivende']?.feilmelding}
                  label={t('label:aktivitet-type')}
                  value={_presisering?.inntektsgivende ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPresisering({ inntektsgivende: (e.target.value || undefined) as AktivitetType | undefined }, 'inntektsgivende', index)}
                >
                  <option value="" key="">{t('el:placeholder-select-default')}</option>
                  {aktivitetTypeOptions.map((o) => (
                    <option value={o.value} key={o.value}>{o.label}</option>
                  ))}
                </Select>
                <TextArea
                  error={_v[_namespace + '-beskrivelse']?.feilmelding}
                  namespace={_namespace}
                  id='beskrivelse'
                  label={t('label:aktivitet-beskrivelse')}
                  maxLength={155}
                  onChanged={(value: string) => setPresisering({ beskrivelse: value.trim() || undefined }, 'beskrivelse', index)}
                  value={_presisering?.beskrivelse}
                />
                <HGrid columns={{ xs: 1, md: 2 }} gap="space-16" align="start">
                  <Input
                    error={_v[_namespace + '-sted']?.feilmelding}
                    namespace={_namespace}
                    id='sted'
                    label={t('label:aktivitet-sted')}
                    onChanged={(value: string) => setPresisering({ sted: value.trim() || undefined }, 'sted', index)}
                    value={_presisering?.sted}
                  />
                  <Input
                    error={_v[_namespace + '-varighet']?.feilmelding}
                    namespace={_namespace}
                    id='varighet'
                    label={t('label:aktivitet-varighet')}
                    onChanged={(value: string) => setPresisering({ varighet: value.trim() || undefined }, 'varighet', index)}
                    value={_presisering?.varighet}
                  />
                </HGrid>
                <TextArea
                  error={_v[_namespace + '-art']?.feilmelding}
                  namespace={_namespace}
                  id='art'
                  label={t('label:aktivitet-art')}
                  maxLength={255}
                  onChanged={(value: string) => setPresisering({ art: value.trim() || undefined }, 'art', index)}
                  value={_presisering?.art}
                />
                <HStack gap="space-16">
                  <Spacer/>
                  <Box>
                    {addremovepanel}
                  </Box>
                </HStack>
              </VStack>
              )
            : (
              <HStack gap="space-16" align="center">
                <FormText id={_namespace} error={undefined}>
                  {(_presisering?.inntektsgivende ? t('el:option-aktivitet-type-' + _presisering.inntektsgivende) : '') +
                    (_presisering?.beskrivelse ? ' - ' + _presisering.beskrivelse : '')}
                </FormText>
                <Spacer/>
                <Box>
                  {addremovepanel}
                </Box>
              </HStack>
              )}
        </VStack>
      </Box>
    )
  }

  return (
    <Box padding="space-16" borderWidth="1" borderColor="neutral-subtle" borderRadius="8">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Select
          id={namespace + '-aktivitetType'}
          name={namespace + '-aktivitetType'}
          error={validation[namespace + '-aktivitetType']?.feilmelding}
          label={t('label:personens-status')}
          value={bostedOpplysninger?.aktivitet?.type ?? ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPersonensStatus(e.target.value)}
        >
          <option value="" key="">{t('el:placeholder-select-default')}</option>
          {personensStatusOptions.map((o) => (
            <option value={o.value} key={o.value}>{o.label}</option>
          ))}
        </Select>

        {bostedOpplysninger?.aktivitet?.type === 'annet' && (
          <TextArea
            error={validation[namespace + '-aktivitetAnnet']?.feilmelding}
            namespace={namespace}
            id='aktivitetAnnet'
            label={t('label:personens-status-annet')}
            maxLength={500}
            onChanged={setPersonensStatusAnnet}
            value={bostedOpplysninger?.aktivitet?.annet}
            required
          />
        )}

        <Heading size='xsmall'>
          {t('label:aktiviteter')}
        </Heading>
        {_.isEmpty(presiseringer)
          ? (
            <Box borderWidth={"1 0"} paddingBlock="space-8">
              <BodyLong>
                {t('message:warning-no-aktivitet')}
              </BodyLong>
            </Box>
            )
          : presiseringer?.map(renderRow)}
        {_seeNewForm
          ? renderRow(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                icon={<PlusCircleIcon/>}
              >
                {t('el:button-add-new-x', { x: t('label:aktivitet').toLowerCase() })}
              </Button>
            </Box>
            )
        }

        <TextArea
          error={validation[namespace + '-inntektskildeHvisStudent']?.feilmelding}
          namespace={namespace}
          id='inntektskildeHvisStudent'
          label={t('label:inntektskilde-studenter')}
          maxLength={inntektskildeHvisStudentMaxLength}
          onChanged={(value: string) => setBostedOpplysning('inntektskildeHvisStudent', value)}
          value={bostedOpplysninger?.inntektskildeHvisStudent}
        />
        <TextArea
          error={validation[namespace + '-hvorPermanentBostedetEr']?.feilmelding}
          namespace={namespace}
          id='hvorPermanentBostedetEr'
          label={t('label:bosituasjon-hvor-permanent')}
          maxLength={155}
          onChanged={(value: string) => setBostedOpplysning('hvorPermanentBostedetEr', value)}
          value={bostedOpplysninger?.hvorPermanentBostedetEr}
        />
        <HGrid columns={{ xs: 1, md: 2 }} gap="space-16" align="start">
          <Input
              error={validation[namespace + '-' + skattemessigGrunnKey]?.feilmelding}
            namespace={namespace}
              id={skattemessigGrunnKey}
            label={t('label:permanent-opphold-skattemessig')}
              onChanged={(value: string) => setBostedOpplysning(skattemessigGrunnKey, value)}
              value={_.get(bostedOpplysninger, skattemessigGrunnKey)}
          />
        </HGrid>
      </VStack>
    </Box>
  )
}

export default Aktivitet
