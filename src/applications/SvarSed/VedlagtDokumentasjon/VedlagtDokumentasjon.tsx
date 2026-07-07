import { PlusCircleIcon } from '@navikt/aksel-icons'
import { Box, Button, Checkbox, Heading, HStack, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import commonStyles from 'assets/css/common.module.css'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import TextArea from 'components/Forms/TextArea'
import { Options } from 'declarations/app'
import { ForhaandsdefinertDokumentType, H070Sed } from 'declarations/h070'
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
import { validateAnnetDokument, validateVedlagtDokumentasjon, ValidationAnnetDokumentProps, ValidationVedlagtDokumentasjonProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const VedlagtDokumentasjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-vedlagtdokumentasjon`
  const sed = replySed as H070Sed

  const dokumentTypeOptions: Options = [
    { label: t('el:option-forhaandsdefinertdokument-doedsattest'), value: 'dødsattest' },
    { label: t('el:option-forhaandsdefinertdokument-medisinsk-informasjon'), value: 'medisinsk_informasjon' },
    { label: t('el:option-forhaandsdefinertdokument-annet'), value: 'annet' }
  ]

  const [_newAnnetDokument, _setNewAnnetDokument] = useState<string | undefined>(undefined)
  const [_editAnnetDokument, _setEditAnnetDokument] = useState<string | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAnnetDokumentProps>(validateAnnetDokument, namespace)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationVedlagtDokumentasjonProps>(
      clonedvalidation, namespace, validateVedlagtDokumentasjon, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const forhaandsdefinerteDokumenter = sed.doedsfall?.forhaandsdefinerteDokumenter ?? []
  const annetDokumenter: Array<string> = sed.doedsfall?.annetDokument ?? []

  const setForhaandsdefinertDokument = (value: ForhaandsdefinertDokumentType, checked: boolean) => {
    const updated = checked
      ? [...forhaandsdefinerteDokumenter, value]
      : forhaandsdefinerteDokumenter.filter(v => v !== value)
    dispatch(updateReplySed('doedsfall.forhaandsdefinerteDokumenter', updated.length > 0 ? updated : undefined))
    if (value === 'annet' && !checked) {
      dispatch(updateReplySed('doedsfall.annetDokument', undefined))
    }
  }

  const setAnnetDokument = (value: string, index: number) => {
    if (index < 0) {
      _setNewAnnetDokument(value)
      _resetValidation(namespace + '-annetDokument')
      return
    }
    _setEditAnnetDokument(value)
    dispatch(resetValidation(namespace + getIdx(index) + '-annetDokument'))
  }

  const onCloseEdit = (clearNamespace: string) => {
    _setEditAnnetDokument(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(clearNamespace))
  }

  const onCloseNew = () => {
    _setNewAnnetDokument(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (annetDokument: string, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditAnnetDokument(annetDokument)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const trimmed = _editAnnetDokument?.trim()
    const hasErrors = performValidation<ValidationAnnetDokumentProps>(
      clonedValidation, namespace, validateAnnetDokument, {
        annetDokument: trimmed,
        index: _editIndex,
        personName
      })
    if (!_.isEmpty(trimmed) && !hasErrors) {
      const newAnnetDokumenter: Array<string> = _.cloneDeep(annetDokumenter)
      newAnnetDokumenter[_editIndex!] = trimmed!
      dispatch(updateReplySed('doedsfall.annetDokument', newAnnetDokumenter))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (index: number) => {
    const newAnnetDokumenter: Array<string> = _.cloneDeep(annetDokumenter)
    newAnnetDokumenter.splice(index, 1)
    dispatch(updateReplySed('doedsfall.annetDokument', newAnnetDokumenter.length > 0 ? newAnnetDokumenter : undefined))
  }

  const onAddNew = () => {
    const trimmed = _newAnnetDokument?.trim()
    const valid: boolean = _performValidation({
      annetDokument: trimmed,
      personName
    })
    if (!_.isEmpty(trimmed) && valid) {
      const newAnnetDokumenter: Array<string> = _.cloneDeep(annetDokumenter)
      newAnnetDokumenter.push(trimmed!)
      dispatch(updateReplySed('doedsfall.annetDokument', newAnnetDokumenter))
      dispatch(resetValidation(namespace + '-annetDokument'))
      onCloseNew()
    }
  }

  const renderRow = (annetDokument: string | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _annetDokument = index < 0 ? _newAnnetDokument : (inEditMode ? _editAnnetDokument : annetDokument)
    return (
      <Box
        id={'repeatablerow-' + _namespace}
        key={'annetDokument-' + (index < 0 ? 'new' : index)}
        className={classNames(commonStyles.repeatableBox, {
          [commonStyles.new]: index < 0,
          [commonStyles.error]: hasNamespaceWithErrors(_v, _namespace)
        })}
        padding="space-16"
      >
        <HStack gap="space-16" align="start">
          <Box flexGrow="1">
            {inEditMode
              ? (
                <TextArea
                  error={_v[_namespace + '-annetDokument']?.feilmelding}
                  namespace={_namespace}
                  id='annetDokument'
                  label={t('label:annet-dokument')}
                  maxLength={255}
                  onChanged={(value: string) => setAnnetDokument(value, index)}
                  value={_annetDokument ?? ''}
                />
                )
              : (
                <FormText
                  error={_v[_namespace + '-annetDokument']?.feilmelding}
                  id={_namespace + '-annetDokument'}
                >
                  {_annetDokument}
                </FormText>
                )}
          </Box>
          <AddRemovePanel<string>
            item={index < 0 ? null : annetDokument}
            marginTop={inEditMode}
            index={index}
            inEditMode={inEditMode}
            onRemove={() => onRemove(index)}
            onAddNew={onAddNew}
            onCancelNew={onCloseNew}
            onStartEdit={onStartEdit}
            onConfirmEdit={onSaveEdit}
            onCancelEdit={() => onCloseEdit(_namespace)}
          />
        </HStack>
      </Box>
    )
  }

  const hasError = validation[namespace + '-annetDokument']?.feilmelding

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Box
          tabIndex={0}
          id={namespace + '-forhaandsdefinerteDokumenter'}
        >
          {dokumentTypeOptions.map(f => (
            <Checkbox
              key={f.value}
              checked={forhaandsdefinerteDokumenter.indexOf(f.value as ForhaandsdefinertDokumentType) >= 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForhaandsdefinertDokument(f.value as ForhaandsdefinertDokumentType, e.target.checked)}
            >
              {f.label}
            </Checkbox>
          ))}
        </Box>

        {forhaandsdefinerteDokumenter.indexOf('annet') >= 0 && (
          <VStack gap="space-8">
            {annetDokumenter.map((annetDokument, index) => renderRow(annetDokument, index))}
            {hasError && (
              <div role='alert' aria-live='assertive' className='aksel-error-message aksel-error-message--medium aksel-label'>
                {hasError}
              </div>
            )}
            {_newForm
              ? renderRow(null, -1)
              : (
                <Box>
                  <Button
                    variant='tertiary'
                    data-testid={namespace + '-new'}
                    onClick={() => _setNewForm(true)}
                    icon={<PlusCircleIcon/>}
                  >
                    {t('el:button-add-x', { x: t('label:annet-dokument').toLowerCase() })}
                  </Button>
                </Box>
                )}
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

export default VedlagtDokumentasjon
