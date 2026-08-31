import { PlusCircleIcon } from '@navikt/aksel-icons'
import { BodyLong, Box, Button, Heading, HGrid, HStack, Spacer, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import commonStyles from 'assets/css/common.module.css'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import FormText from 'components/Forms/FormText'
import Input from 'components/Forms/Input'
import { Oppholdssted } from '../../../declarations/h'
import { State } from 'declarations/reducers'
import { Adresse } from 'declarations/sed'
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
  validateOppholdssted,
  validateOppholdssteder,
  ValidationOppholdsstedProps,
  ValidationOppholdsstederProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

// Both DTOs wrap addresses in oppholdssteder; only H005 exposes duration fields.
const Oppholdssteder: React.FC<MainFormProps> = ({
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
  const { parentKey, namespaceInfix, showVarighet } = options
  const namespace = `${parentNamespace}-${personID}-${namespaceInfix}-adresser`
  const target = `${parentKey}.oppholdssteder`
  const oppholdssteder: Array<Oppholdssted> | undefined = _.get(replySed, target)

  const getAdresse = (oppholdssted: Oppholdssted | null | undefined): Adresse | undefined =>
    oppholdssted?.adresse

  const getId = (oppholdssted: Oppholdssted | null | undefined): string => {
    const adresse = getAdresse(oppholdssted)
    return oppholdssted
      ? (adresse?.type ?? '') + '-' + (adresse?.by ?? '') + '-' + (adresse?.landkode ?? '')
      : 'new'
  }

  const [_newOppholdssted, _setNewOppholdssted] = useState<Oppholdssted | undefined>(undefined)
  const [_editOppholdssted, _setEditOppholdssted] = useState<Oppholdssted | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_seeNewForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationOppholdsstedProps>(validateOppholdssted, namespace)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationOppholdsstederProps>(
      clonedvalidation, namespace, validateOppholdssteder, {
        oppholdssteder,
        showVarighet,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setItemAdresse = (adresse: Adresse, index: number) => {
    const merge = (prev: Oppholdssted | undefined): Oppholdssted =>
      ({ ...prev, adresse })
    if (index < 0) {
      _setNewOppholdssted(merge)
      _resetValidation(namespace)
      return
    }
    _setEditOppholdssted(merge)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const setItemVarighet = (changes: Partial<Oppholdssted>, fieldId: string, index: number) => {
    if (index < 0) {
      _setNewOppholdssted((prev) => ({ ...prev, ...changes }))
      _resetValidation(namespace + '-' + fieldId)
      return
    }
    _setEditOppholdssted((prev) => ({ ...prev, ...changes }))
    if (validation[namespace + getIdx(index) + '-' + fieldId]) {
      dispatch(resetValidation(namespace + getIdx(index) + '-' + fieldId))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditOppholdssted(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewOppholdssted(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (oppholdssted: Oppholdssted, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditOppholdssted(oppholdssted)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationOppholdsstedProps>(
      clonedvalidation, namespace, validateOppholdssted, {
        oppholdssted: _editOppholdssted,
        showVarighet,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editOppholdssted))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemove = (removedOppholdssted: Oppholdssted) => {
    const newOppholdssteder: Array<Oppholdssted> = _.reject(oppholdssteder, (oppholdssted: Oppholdssted) => _.isEqual(removedOppholdssted, oppholdssted))
    dispatch(updateReplySed(target, newOppholdssteder))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      oppholdssted: _newOppholdssted,
      showVarighet,
      personName
    })
    if (!!_newOppholdssted && valid) {
      let newOppholdssteder: Array<Oppholdssted> | undefined = _.cloneDeep(oppholdssteder)
      if (_.isNil(newOppholdssteder)) {
        newOppholdssteder = []
      }
      newOppholdssteder.push(_newOppholdssted)
      dispatch(updateReplySed(target, newOppholdssteder))
      onCloseNew()
    }
  }

  const renderRow = (oppholdssted: Oppholdssted | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _oppholdssted = index < 0 ? _newOppholdssted : (inEditMode ? _editOppholdssted : oppholdssted)

    const addremovepanel = (
      <AddRemovePanel<Oppholdssted>
        item={oppholdssted}
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
        key={getId(oppholdssted)}
        className={classNames(commonStyles.repeatableBox, {
          [commonStyles.new]: index < 0,
          [commonStyles.error]: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VStack gap="space-16">
          {inEditMode
            ? (
              <VStack gap="space-16">
                <AdresseForm
                  namespace={_namespace}
                  adresse={getAdresse(_oppholdssted)}
                  onAdressChanged={(a: Adresse) => setItemAdresse(a, index)}
                  validation={_v}
                />
                {showVarighet && (
                  <HGrid columns={{ xs: 1, md: 2 }} gap="space-16" align="start">
                    <Input
                      error={_v[_namespace + '-oppholdetsVarighet']?.feilmelding}
                      namespace={_namespace}
                      id='oppholdetsVarighet'
                      label={t('label:oppholdets-varighet')}
                      onChanged={(value: string) => setItemVarighet({ oppholdetsVarighet: value.trim() || undefined }, 'oppholdetsVarighet', index)}
                      value={_oppholdssted?.oppholdetsVarighet}
                    />
                    <Input
                      error={_v[_namespace + '-varighetUavbruttOpphold']?.feilmelding}
                      namespace={_namespace}
                      id='varighetUavbruttOpphold'
                      label={t('label:varighet-uavbrutt-opphold')}
                      onChanged={(value: string) => setItemVarighet({ varighetUavbruttOpphold: value.trim() || undefined }, 'varighetUavbruttOpphold', index)}
                      value={_oppholdssted?.varighetUavbruttOpphold}
                    />
                  </HGrid>
                )}
              </VStack>
              )
            : (
              <HStack gap="space-16">
                <Box width="65%">
                  <VStack gap="space-8">
                    <AdresseBox adresse={getAdresse(_oppholdssted)} seeType />
                    {showVarighet && _oppholdssted?.oppholdetsVarighet && (
                      <FormText id={_namespace + '-oppholdetsVarighet'} error={undefined}>
                        {t('label:oppholdets-varighet') + ': ' + _oppholdssted.oppholdetsVarighet}
                      </FormText>
                    )}
                    {showVarighet && _oppholdssted?.varighetUavbruttOpphold && (
                      <FormText id={_namespace + '-varighetUavbruttOpphold'} error={undefined}>
                        {t('label:varighet-uavbrutt-opphold') + ': ' + _oppholdssted.varighetUavbruttOpphold}
                      </FormText>
                    )}
                  </VStack>
                </Box>
                <Spacer/>
                <Box>
                  {addremovepanel}
                </Box>
              </HStack>
              )}
          {inEditMode && (
            <HStack gap="space-16">
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
        {_.isEmpty(oppholdssteder)
          ? (
            <Box borderWidth={"1 0"} paddingBlock="space-8" id="ingenAdresse">
              <BodyLong>
                {t('message:warning-no-address')}
              </BodyLong>
            </Box>
            )
          : oppholdssteder?.map(renderRow)}
        {_seeNewForm
          ? renderRow(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                icon={<PlusCircleIcon/>}
              >
                {t('el:button-add-new-x', { x: t('label:adresse').toLowerCase() })}
              </Button>
            </Box>
            )
        }
      </VStack>
    </Box>
  )
}

export default Oppholdssteder
