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
import { AdresseMedVarighet, H005Sed } from 'declarations/h005'
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

const AdresserBosted: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-fastslaabosted-adresser`
  const target = 'informasjonFastslaaBosted.adresser'
  const sed = replySed as H005Sed
  const adresser: Array<AdresseMedVarighet> | undefined = sed.informasjonFastslaaBosted?.adresser

  const getId = (item: AdresseMedVarighet | null | undefined): string => item
    ? (item?.adresse?.type ?? '') + '-' + (item?.adresse?.by ?? '') + '-' + (item?.adresse?.landkode ?? '')
    : 'new'

  const [_newItem, _setNewItem] = useState<AdresseMedVarighet | undefined>(undefined)
  const [_editItem, _setEditItem] = useState<AdresseMedVarighet | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_seeNewForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAdresseBostedItemProps>(validateAdresseBostedItem, namespace)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAdresserBostedProps>(
      clonedvalidation, namespace, validateAdresserBosted, {
        adresser,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setItemAdresse = (adresse: Adresse, index: number) => {
    if (index < 0) {
      _setNewItem((prev) => ({ ...prev, adresse }))
      _resetValidation(namespace)
      return
    }
    _setEditItem((prev) => ({ ...prev, adresse }))
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const setItemVarighet = (changes: Partial<AdresseMedVarighet>, fieldId: string, index: number) => {
    if (index < 0) {
      _setNewItem((prev) => ({ ...prev, ...changes }))
      _resetValidation(namespace + '-' + fieldId)
      return
    }
    _setEditItem((prev) => ({ ...prev, ...changes }))
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

  const onStartEdit = (item: AdresseMedVarighet, index: number) => {
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

  const onRemove = (removedItem: AdresseMedVarighet) => {
    const newItems: Array<AdresseMedVarighet> = _.reject(adresser, (a: AdresseMedVarighet) => _.isEqual(removedItem, a))
    dispatch(updateReplySed(target, newItems))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      item: _newItem,
      personName
    })
    if (!!_newItem && valid) {
      let newItems: Array<AdresseMedVarighet> | undefined = _.cloneDeep(adresser)
      if (_.isNil(newItems)) {
        newItems = []
      }
      newItems.push(_newItem!)
      dispatch(updateReplySed(target, newItems))
      onCloseNew()
    }
  }

  const renderRow = (item: AdresseMedVarighet | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _item = index < 0 ? _newItem : (inEditMode ? _editItem : item)

    const addremovepanel = (
      <AddRemovePanel<AdresseMedVarighet>
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
                  type
                  required={['type', 'by', 'land']}
                  options={{ bygning: true, region: true }}
                  namespace={_namespace}
                  adresse={_item?.adresse}
                  onAdressChanged={(a: Adresse) => setItemAdresse(a, index)}
                  validation={_v}
                  typeLabelKey='adresse-fastslaabosted'
                  bostedLabelKey='adresse-bostedsland'
                  oppholdLabelKey='adresse-oppholdsland'
                  kontaktLabelKey='adresse-personens-kontaktadresse'
                  gateLabelKey='adresse-gate-fastslaabosted'
                  bygningLabelKey='adresse-bygning-fastslaabosted'
                  labelforZipCode='adresse-postnummer-fastslaabosted'
                />
                <HGrid columns={{ xs: 1, md: 2 }} gap="space-16" align="start">
                  <Input
                    error={_v[_namespace + '-oppholdetsVarighet']?.feilmelding}
                    namespace={_namespace}
                    id='oppholdetsVarighet'
                    label={t('label:oppholdets-varighet')}
                    onChanged={(value: string) => setItemVarighet({ oppholdetsVarighet: value.trim() || undefined }, 'oppholdetsVarighet', index)}
                    value={_item?.oppholdetsVarighet}
                  />
                  <Input
                    error={_v[_namespace + '-varighetUavbruttOpphold']?.feilmelding}
                    namespace={_namespace}
                    id='varighetUavbruttOpphold'
                    label={t('label:varighet-uavbrutt-opphold')}
                    onChanged={(value: string) => setItemVarighet({ varighetUavbruttOpphold: value.trim() || undefined }, 'varighetUavbruttOpphold', index)}
                    value={_item?.varighetUavbruttOpphold}
                  />
                </HGrid>
              </VStack>
              )
            : (
              <HStack gap="space-16">
                <Box width="65%">
                  <VStack gap="space-8">
                    <AdresseBox adresse={_item?.adresse} seeType />
                    {_item?.oppholdetsVarighet && (
                      <FormText id={_namespace + '-oppholdetsVarighet'} error={undefined}>
                        {t('label:oppholdets-varighet') + ': ' + _item.oppholdetsVarighet}
                      </FormText>
                    )}
                    {_item?.varighetUavbruttOpphold && (
                      <FormText id={_namespace + '-varighetUavbruttOpphold'} error={undefined}>
                        {t('label:varighet-uavbrutt-opphold') + ': ' + _item.varighetUavbruttOpphold}
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
