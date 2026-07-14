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
import { AdresseMedVarighet } from 'declarations/hbuc02a'
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
  validateAdresseBostedItem,
  validateAdresserBosted,
  ValidationAdresseBostedItemProps,
  ValidationAdresserBostedProps
} from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

// An address list item. H005 wraps the address with «varighet» fields
// (AdresseMedVarighet); H006 stores a plain Adresse. The `showVarighet` option
// selects between the two shapes.
type AdresseItem = AdresseMedVarighet | Adresse

// Shared H_BUC_02a address list, used by both H005 (target
// «informasjonFastslaaBosted», addresses with «varighet») and H006 (target
// «positivtSvar», plain addresses). The SED-specific target key, namespace infix
// and whether the «varighet» fields are shown are supplied via `options` by the
// FastslaaBosted / PositivtSvar containers.
const AdresserBosted: React.FC<MainFormProps> = ({
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
  const target = `${parentKey}.adresser`
  const adresser: Array<AdresseItem> | undefined = _.get(replySed, target)

  // Reads the underlying Adresse whether the item is wrapped (H005) or plain (H006).
  const getAdresse = (item: AdresseItem | null | undefined): Adresse | undefined =>
    showVarighet
      ? (item as AdresseMedVarighet | null | undefined)?.adresse
      : ((item as Adresse | null | undefined) ?? undefined)

  const getId = (item: AdresseItem | null | undefined): string => {
    const adresse = getAdresse(item)
    return item
      ? (adresse?.type ?? '') + '-' + (adresse?.by ?? '') + '-' + (adresse?.landkode ?? '')
      : 'new'
  }

  const [_newItem, _setNewItem] = useState<AdresseItem | undefined>(undefined)
  const [_editItem, _setEditItem] = useState<AdresseItem | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_seeNewForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAdresseBostedItemProps>(validateAdresseBostedItem, namespace)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAdresserBostedProps>(
      clonedvalidation, namespace, validateAdresserBosted, {
        adresser,
        showVarighet,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  // Writes the Adresse back into the item, preserving any «varighet» fields (H005)
  // or replacing the plain item (H006).
  const setItemAdresse = (adresse: Adresse, index: number) => {
    const merge = (prev: AdresseItem | undefined): AdresseItem =>
      showVarighet ? { ...(prev as AdresseMedVarighet | undefined), adresse } : adresse
    if (index < 0) {
      _setNewItem(merge)
      _resetValidation(namespace)
      return
    }
    _setEditItem(merge)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const setItemVarighet = (changes: Partial<AdresseMedVarighet>, fieldId: string, index: number) => {
    if (index < 0) {
      _setNewItem((prev) => ({ ...(prev as AdresseMedVarighet | undefined), ...changes }))
      _resetValidation(namespace + '-' + fieldId)
      return
    }
    _setEditItem((prev) => ({ ...(prev as AdresseMedVarighet | undefined), ...changes }))
    if (validation[namespace + getIdx(index) + '-' + fieldId]) {
      dispatch(resetValidation(namespace + getIdx(index) + '-' + fieldId))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditItem(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewItem(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (item: AdresseItem, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditItem(item)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationAdresseBostedItemProps>(
      clonedvalidation, namespace, validateAdresseBostedItem, {
        item: _editItem,
        showVarighet,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editItem))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemove = (removedItem: AdresseItem) => {
    const newItems: Array<AdresseItem> = _.reject(adresser, (a: AdresseItem) => _.isEqual(removedItem, a))
    dispatch(updateReplySed(target, newItems))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      item: _newItem,
      showVarighet,
      personName
    })
    if (!!_newItem && valid) {
      let newItems: Array<AdresseItem> | undefined = _.cloneDeep(adresser)
      if (_.isNil(newItems)) {
        newItems = []
      }
      newItems.push(_newItem!)
      dispatch(updateReplySed(target, newItems))
      onCloseNew()
    }
  }

  const renderRow = (item: AdresseItem | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _item = index < 0 ? _newItem : (inEditMode ? _editItem : item)
    const _varighet = _item as AdresseMedVarighet | undefined

    const addremovepanel = (
      <AddRemovePanel<AdresseItem>
        item={item}
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
        key={getId(item)}
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
                  adresse={getAdresse(_item)}
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
                      value={_varighet?.oppholdetsVarighet}
                    />
                    <Input
                      error={_v[_namespace + '-varighetUavbruttOpphold']?.feilmelding}
                      namespace={_namespace}
                      id='varighetUavbruttOpphold'
                      label={t('label:varighet-uavbrutt-opphold')}
                      onChanged={(value: string) => setItemVarighet({ varighetUavbruttOpphold: value.trim() || undefined }, 'varighetUavbruttOpphold', index)}
                      value={_varighet?.varighetUavbruttOpphold}
                    />
                  </HGrid>
                )}
              </VStack>
              )
            : (
              <HStack gap="space-16">
                <Box width="65%">
                  <VStack gap="space-8">
                    <AdresseBox adresse={getAdresse(_item)} seeType />
                    {showVarighet && _varighet?.oppholdetsVarighet && (
                      <FormText id={_namespace + '-oppholdetsVarighet'} error={undefined}>
                        {t('label:oppholdets-varighet') + ': ' + _varighet.oppholdetsVarighet}
                      </FormText>
                    )}
                    {showVarighet && _varighet?.varighetUavbruttOpphold && (
                      <FormText id={_namespace + '-varighetUavbruttOpphold'} error={undefined}>
                        {t('label:varighet-uavbrutt-opphold') + ': ' + _varighet.varighetUavbruttOpphold}
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
        {_.isEmpty(adresser)
          ? (
            <Box borderWidth={"1 0"} paddingBlock="space-8" id="ingenAdresse">
              <BodyLong>
                {t('message:warning-no-address')}
              </BodyLong>
            </Box>
            )
          : adresser?.map(renderRow)}
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

export default AdresserBosted
