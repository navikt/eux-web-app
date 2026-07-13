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
import { Aktivitet, AktivitetType, InformasjonFastslaaBosted, PersonensStatus, H005Sed } from 'declarations/h005'
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
  validateAktivitetItem,
  validateAktivitetOgStatus,
  ValidationAktivitetItemProps,
  ValidationAktivitetOgStatusProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const AktivitetOgStatus: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-fastslaabosted-status`
  const target = 'informasjonFastslaaBosted.aktiviteter'
  const sed = replySed as H005Sed
  const informasjonFastslaaBosted: InformasjonFastslaaBosted | undefined = sed.informasjonFastslaaBosted
  const aktiviteter: Array<Aktivitet> | undefined = informasjonFastslaaBosted?.aktiviteter

  const personensStatusOptions: Options = [
    { label: t('el:option-h005-status-ansatt'), value: 'ansatt' },
    { label: t('el:option-h005-status-selvstendig_næringsdrivende'), value: 'selvstendig_næringsdrivende' },
    { label: t('el:option-h005-status-grensearbeider'), value: 'grensearbeider' },
    { label: t('el:option-h005-status-pensjonist'), value: 'pensjonist' },
    { label: t('el:option-h005-status-person_som_krever_pensjon'), value: 'person_som_krever_pensjon' },
    { label: t('el:option-h005-status-arbeidsledig'), value: 'arbeidsledig' },
    { label: t('el:option-h005-status-familiemedlem_forsørget'), value: 'familiemedlem_forsørget' },
    { label: t('el:option-h005-status-student'), value: 'student' },
    { label: t('el:option-h005-status-annet'), value: 'annet' }
  ]

  const aktivitetTypeOptions: Options = [
    { label: t('el:option-h005-aktivitettype-inntektsgivende_virksomhet'), value: 'inntektsgivende_virksomhet' },
    { label: t('el:option-h005-aktivitettype-ikke_inntektsgivende_virksomhet'), value: 'ikke_inntektsgivende_virksomhet' }
  ]

  const getId = (a: Aktivitet | null | undefined): string => a
    ? (a?.beskrivelse ?? '') + '-' + (a?.sted ?? '')
    : 'new'

  const [_newAktivitet, _setNewAktivitet] = useState<Aktivitet | undefined>(undefined)
  const [_editAktivitet, _setEditAktivitet] = useState<Aktivitet | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_seeNewForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAktivitetItemProps>(validateAktivitetItem, namespace)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAktivitetOgStatusProps>(
      clonedvalidation, namespace, validateAktivitetOgStatus, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setPersonensStatus = (value: string) => {
    const newStatus = (value.trim() || undefined) as PersonensStatus | undefined
    dispatch(updateReplySed('informasjonFastslaaBosted.personensStatus', newStatus))
    if (newStatus !== 'annet') {
      dispatch(updateReplySed('informasjonFastslaaBosted.personensStatusAnnet', undefined))
    }
    if (validation[namespace + '-personensStatus']) {
      dispatch(resetValidation(namespace + '-personensStatus'))
    }
  }

  const setPersonensStatusAnnet = (value: string) => {
    dispatch(updateReplySed('informasjonFastslaaBosted.personensStatusAnnet', value.trim() || undefined))
    if (validation[namespace + '-personensStatusAnnet']) {
      dispatch(resetValidation(namespace + '-personensStatusAnnet'))
    }
  }

  const setAktivitetField = (changes: Partial<Aktivitet>, fieldId: string, index: number) => {
    if (index < 0) {
      _setNewAktivitet((prev) => ({ ...prev, ...changes }))
      _resetValidation(namespace + '-' + fieldId)
      return
    }
    _setEditAktivitet((prev) => ({ ...prev, ...changes }))
    if (validation[namespace + getIdx(index) + '-' + fieldId]) {
      dispatch(resetValidation(namespace + getIdx(index) + '-' + fieldId))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditAktivitet(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewAktivitet(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (aktivitet: Aktivitet, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditAktivitet(aktivitet)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationAktivitetItemProps>(
      clonedvalidation, namespace, validateAktivitetItem, {
        aktivitet: _editAktivitet,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editAktivitet))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemove = (removedAktivitet: Aktivitet) => {
    const newAktiviteter: Array<Aktivitet> = _.reject(aktiviteter, (a: Aktivitet) => _.isEqual(removedAktivitet, a))
    dispatch(updateReplySed(target, newAktiviteter))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      aktivitet: _newAktivitet,
      personName
    })
    if (!!_newAktivitet && valid) {
      let newAktiviteter: Array<Aktivitet> | undefined = _.cloneDeep(aktiviteter)
      if (_.isNil(newAktiviteter)) {
        newAktiviteter = []
      }
      newAktiviteter.push(_newAktivitet!)
      dispatch(updateReplySed(target, newAktiviteter))
      onCloseNew()
    }
  }

  const renderRow = (aktivitet: Aktivitet | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _aktivitet = index < 0 ? _newAktivitet : (inEditMode ? _editAktivitet : aktivitet)

    const addremovepanel = (
      <AddRemovePanel<Aktivitet>
        item={aktivitet}
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
        key={getId(aktivitet)}
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
                  id={_namespace + '-type'}
                  name={_namespace + '-type'}
                  error={_v[_namespace + '-type']?.feilmelding}
                  label={t('label:aktivitet-type')}
                  value={_aktivitet?.type ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAktivitetField({ type: (e.target.value || undefined) as AktivitetType | undefined }, 'type', index)}
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
                  onChanged={(value: string) => setAktivitetField({ beskrivelse: value.trim() || undefined }, 'beskrivelse', index)}
                  value={_aktivitet?.beskrivelse}
                />
                <HGrid columns={{ xs: 1, md: 2 }} gap="space-16" align="start">
                  <Input
                    error={_v[_namespace + '-sted']?.feilmelding}
                    namespace={_namespace}
                    id='sted'
                    label={t('label:aktivitet-sted')}
                    onChanged={(value: string) => setAktivitetField({ sted: value.trim() || undefined }, 'sted', index)}
                    value={_aktivitet?.sted}
                  />
                  <Input
                    error={_v[_namespace + '-varighet']?.feilmelding}
                    namespace={_namespace}
                    id='varighet'
                    label={t('label:aktivitet-varighet')}
                    onChanged={(value: string) => setAktivitetField({ varighet: value.trim() || undefined }, 'varighet', index)}
                    value={_aktivitet?.varighet}
                  />
                </HGrid>
                <TextArea
                  error={_v[_namespace + '-art']?.feilmelding}
                  namespace={_namespace}
                  id='art'
                  label={t('label:aktivitet-art')}
                  maxLength={255}
                  onChanged={(value: string) => setAktivitetField({ art: value.trim() || undefined }, 'art', index)}
                  value={_aktivitet?.art}
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
                  {(_aktivitet?.type ? t('el:option-h005-aktivitettype-' + _aktivitet.type) : '') +
                    (_aktivitet?.beskrivelse ? ' - ' + _aktivitet.beskrivelse : '')}
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
          id={namespace + '-personensStatus'}
          name={namespace + '-personensStatus'}
          error={validation[namespace + '-personensStatus']?.feilmelding}
          label={t('label:personens-status')}
          value={informasjonFastslaaBosted?.personensStatus ?? ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPersonensStatus(e.target.value)}
        >
          <option value="" key="">{t('el:placeholder-select-default')}</option>
          {personensStatusOptions.map((o) => (
            <option value={o.value} key={o.value}>{o.label}</option>
          ))}
        </Select>

        {informasjonFastslaaBosted?.personensStatus === 'annet' && (
          <TextArea
            error={validation[namespace + '-personensStatusAnnet']?.feilmelding}
            namespace={namespace}
            id='personensStatusAnnet'
            label={t('label:personens-status-annet')}
            maxLength={500}
            onChanged={setPersonensStatusAnnet}
            value={informasjonFastslaaBosted?.personensStatusAnnet}
            required
          />
        )}

        <Heading size='xsmall'>
          {t('label:aktiviteter')}
        </Heading>
        {_.isEmpty(aktiviteter)
          ? (
            <Box borderWidth={"1 0"} paddingBlock="space-8">
              <BodyLong>
                {t('message:warning-no-aktivitet')}
              </BodyLong>
            </Box>
            )
          : aktiviteter?.map(renderRow)}
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
      </VStack>
    </Box>
  )
}

export default AktivitetOgStatus
