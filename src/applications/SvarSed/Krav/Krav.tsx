import { BodyLong, Box, Button, Heading, HGrid, HStack, Label, Radio, RadioGroup, Spacer, VStack } from '@navikt/ds-react'
import { PlusCircleIcon } from '@navikt/aksel-icons'
import { resetValidation, setValidation } from 'actions/validation'
import {
  validateKrav,
  validateRefusjonItem,
  ValidationRefusjonItemProps,
  ValidationKravProps
} from 'applications/SvarSed/Krav/validation'
import { MainFormProps, MainFormSelector, mapState } from 'applications/SvarSed/MainForm'
import DateField, {toDateFormat} from 'components/DateField/DateField'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import ErrorLabel from 'components/Forms/ErrorLabel'
import AddRemove from 'components/AddRemovePanel/AddRemove'
import CurrencyDropdown from 'components/CurrencyDropdown/CurrencyDropdown'
import { Currency } from 'components/land-verktoy'
import { Option, Options } from 'declarations/app'
import { H021Sed, RefusjonItem, AvslagType } from 'declarations/h021'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { sanitizeAmount } from 'utils/amount'
import { getIdx } from 'utils/namespace'
import { hasNamespaceWithErrors } from 'utils/validation'
import useUnmount from 'hooks/useUnmount'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import React, { useState, JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import classNames from 'classnames'
import commonStyles from 'assets/css/common.module.css'
import RadioPanel from "../../../components/RadioPanel/RadioPanel";

const Krav: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'refusjonskrav.refusjoner'
  const sed = replySed as H021Sed
  const refusjoner: Array<RefusjonItem> | undefined = sed.refusjonskrav?.refusjoner
  const namespace = `${parentNamespace}-${personID}-krav`

  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationRefusjonItemProps>(validateRefusjonItem, namespace)

  const [_newItem, _setNewItem] = useState<RefusjonItem | undefined>(undefined)
  const [_editItem, _setEditItem] = useState<RefusjonItem | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationKravProps>(
      clonedValidation, namespace, validateKrav, {
        replySed: _.cloneDeep(replySed as ReplySed),
        formalName: personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const henvisningTilOptions: Options = [
    { label: t('el:option-h021-henvisning-anmodning_om_administrativ_kontroll'), value: 'anmodning_om_administrativ_kontroll' },
    { label: t('el:option-h021-henvisning-anmodning_om_legeundersøkelse'), value: 'anmodning_om_legeundersøkelse' }
  ]

  const avslagOptions: Options = [
    { label: t('el:option-h021-avslag-ikke_avslag'), value: 'ikke_avslag' },
    { label: t('el:option-h021-avslag-delvis_avslag'), value: 'delvis_avslag' },
    { label: t('el:option-h021-avslag-totalt_avslag'), value: 'totalt_avslag' }
  ]

  const avslagGrunnOptions: Options = [
    { label: t('el:option-h021-avslaggrunn-denne_faktura_angår_ikke_oss'), value: 'denne_faktura_angår_ikke_oss' },
    { label: t('el:option-h021-avslaggrunn-ingen_betaling_gjelder_for_denne_faktura'), value: 'ingen_betaling_gjelder_for_denne_faktura' },
    { label: t('el:option-h021-avslaggrunn-ikke_mottatt_svar_på_forespørsel'), value: 'ikke_mottatt_svar_på_forespørsel' },
    { label: t('el:option-h021-avslaggrunn-informasjon_ikke_i_overensstemmelse'), value: 'informasjon_som_er_mottatt_er_ikke_i_overensstemmelse_med_orginalforespørsel' },
    { label: t('el:option-h021-avslaggrunn-annet'), value: 'annet' }
  ]

  const setItemProp = (prop: string, value: any, index: number) => {
    if (index < 0) {
      _setNewItem({ ..._newItem, [prop]: value } as RefusjonItem)
      _resetValidation(namespace + '-' + prop)
      return
    }
    _setEditItem({ ..._editItem, [prop]: value } as RefusjonItem)
    dispatch(resetValidation(namespace + '[' + index + ']-' + prop))
  }

  const setItemNestedProp = (path: string, value: any, index: number) => {
    if (index < 0) {
      const updated = _.cloneDeep(_newItem || {} as RefusjonItem)
      _.set(updated, path, value)
      _setNewItem(updated)
      _resetValidation(namespace + '-' + path.replace(/\./g, '-'))
      return
    }
    const updated = _.cloneDeep(_editItem || {} as RefusjonItem)
    _.set(updated, path, value)
    _setEditItem(updated)
    dispatch(resetValidation(namespace + '[' + index + ']-' + path.replace(/\./g, '-')))
  }

  const setAvslag = (value: AvslagType, index: number) => {
    if (index < 0) {
      const updated = _.cloneDeep(_newItem || {} as RefusjonItem)
      updated.avslag = value
      if (value === 'ikke_avslag') {
        updated.avslagDetaljer = undefined
      }
      _setNewItem(updated)
      _resetValidation(namespace + '-avslag')
      return
    }
    const updated = _.cloneDeep(_editItem || {} as RefusjonItem)
    updated.avslag = value
    if (value === 'ikke_avslag') {
      updated.avslagDetaljer = undefined
    }
    _setEditItem(updated)
    dispatch(resetValidation(namespace + '[' + index + ']-avslag'))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      refusjonItem: _newItem,
      formalName: personName
    })

    if (!!_newItem && valid) {
      let newRefusjoner: Array<RefusjonItem> = _.cloneDeep(refusjoner) || []
      newRefusjoner.push(_.cloneDeep(_newItem))
      dispatch(updateReplySed(target, newRefusjoner))
      onCloseNew()
    }
  }

  const onCloseNew = () => {
    _setNewItem(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onRemove = (index: number) => {
    let newRefusjoner: Array<RefusjonItem> = _.cloneDeep(refusjoner) || []
    newRefusjoner.splice(index, 1)
    dispatch(updateReplySed(target, newRefusjoner))
  }

  const onStartEdit = (item: RefusjonItem, index: number) => {
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + _editIndex))
    }
    _setEditItem(_.cloneDeep(item))
    _setEditIndex(index)
  }

  const onCloseEdit = (ns: string) => {
    _setEditItem(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(ns))
  }

  const onSaveEdit = (index: number) => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationRefusjonItemProps>(
      clonedValidation, namespace, validateRefusjonItem, {
        refusjonItem: _editItem,
        nsIndex: _editIndex,
        formalName: personName
      })

    if (!!_editItem && !hasErrors) {
      let newRefusjoner: Array<RefusjonItem> = _.cloneDeep(refusjoner) || []
      newRefusjoner.splice(index, 1, _.cloneDeep(_editItem))
      dispatch(updateReplySed(target, newRefusjoner))
      onCloseEdit(namespace)
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const renderRefusjonItem = (item: RefusjonItem | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _item = index < 0 ? _newItem : (inEditMode ? _editItem : item)

    const showAvslagDetaljer = _item?.avslag === 'delvis_avslag' || _item?.avslag === 'totalt_avslag'

    const addRemove = (
      <AddRemove<RefusjonItem>
        item={item}
        index={index}
        inEditMode={inEditMode}
        onRemove={() => onRemove(index)}
        onAddNew={() => onAddNew()}
        onCancelNew={() => onCloseNew()}
        onStartEdit={(i: RefusjonItem) => onStartEdit(i, index)}
        onConfirmEdit={() => onSaveEdit(index)}
        onCancelEdit={() => onCloseEdit(_namespace)}
        labels={{ remove: t('el:button-remove-x', { x: t('label:refusjon').toLowerCase() }) }}
      />
    )

    if (inEditMode) {
      return (
        <Box
          key={index}
          padding="space-16"
          background="neutral-soft"
          borderColor="neutral-subtle"
          borderWidth="1"
          className={classNames(commonStyles.repeatableBox, {
            [commonStyles.new]: index < 0,
            [commonStyles.error]: hasNamespaceWithErrors(_v, _namespace),
          })}
        >
          <VStack gap="space-16">
            <RadioGroup
              data-testid={_namespace + '-henvisningTil'}
              error={_v[_namespace + '-henvisningTil']?.feilmelding}
              id={_namespace + '-henvisningTil'}
              legend={t('label:med-henvisning-til')}
              onChange={(value: string | number | boolean) => setItemProp('henvisningTil', value as string, index)}
              value={_item?.henvisningTil ?? ''}
            >
              <HStack gap="space-16">
                {henvisningTilOptions.map((o: Option) => (
                  <RadioPanel key={o.value} value={o.value}>
                    {o.label}
                  </RadioPanel>
                ))}
              </HStack>
            </RadioGroup>

            <HGrid columns={2} gap="space-16" align="start">
              <DateField
                error={_v[_namespace + '-utstedelsesdato']?.feilmelding}
                id='utstedelsesdato'
                namespace={_namespace}
                label={t('label:utstedelsesdato')}
                onChanged={(value: string) => setItemProp('utstedelsesdato', value.trim(), index)}
                required
                dateValue={_item?.utstedelsesdato}
              />
              <Input
                error={_v[_namespace + '-fakturanummer']?.feilmelding}
                id='fakturanummer'
                label={t('label:fakturanummer')}
                namespace={_namespace}
                onChanged={(value: string) => setItemProp('fakturanummer', value.trim(), index)}
                required
                value={_item?.fakturanummer || ''}
              />
            </HGrid>

            <HGrid columns={2} gap="space-16" align="start">
              <Input
                error={_v[_namespace + '-fakturabeloep-beloep']?.feilmelding}
                id='fakturabeloep-beloep'
                label={t('label:fakturabeloep')}
                namespace={_namespace}
                onChanged={(value: string) => setItemNestedProp('fakturabeloep.beloep', sanitizeAmount(value), index)}
                required
                value={_item?.fakturabeloep?.beloep || ''}
              />
              <CurrencyDropdown
                ariaLabel={t('label:valuta')}
                closeMenuOnSelect
                currencyCodeListName="euEftaValuta"
                error={_v[_namespace + '-fakturabeloep-valuta']?.feilmelding}
                id={_namespace + '-fakturabeloep-valuta'}
                label={t('label:valuta')}
                locale='nb'
                onOptionSelected={(currency: Currency) => setItemNestedProp('fakturabeloep.valuta', currency.value, index)}
                includeHistoricCurrencies
                sort={"noeuFirst"}
                required
                values={_item?.fakturabeloep?.valuta}
              />
            </HGrid>

            <RadioGroup
              data-testid={_namespace + '-avslag'}
              error={_v[_namespace + '-avslag']?.feilmelding}
              id={_namespace + '-avslag'}
              legend={t('label:avslag')}
              onChange={(value: string | number | boolean) => setAvslag(value as AvslagType, index)}
              value={_item?.avslag ?? ''}
            >
              <HStack gap="space-16">
                {avslagOptions.map((o: Option) => (
                  <RadioPanel key={o.value} value={o.value}>
                    {o.label}
                  </RadioPanel>
                ))}
              </HStack>
            </RadioGroup>

            {showAvslagDetaljer && (
              <Box padding="space-16" borderWidth="1" borderColor="neutral-subtle">
                <VStack gap="space-16">
                  <Heading size='xsmall'>
                    {t('label:opplysninger-om-avslag')}
                  </Heading>

                  <HGrid columns={2} gap="space-16" align="start">
                    <Input
                      error={_v[_namespace + '-avslagDetaljer-avvistBeloep-beloep']?.feilmelding}
                      id='avslagDetaljer-avvistBeloep-beloep'
                      label={t('label:avvist-fakturabeloep')}
                      namespace={_namespace}
                      onChanged={(value: string) => setItemNestedProp('avslagDetaljer.avvistBeloep.beloep', sanitizeAmount(value), index)}
                      required
                      value={_item?.avslagDetaljer?.avvistBeloep?.beloep || ''}
                    />
                    <CurrencyDropdown
                      ariaLabel={t('label:valuta')}
                      closeMenuOnSelect
                      currencyCodeListName="euEftaValuta"
                      error={_v[_namespace + '-avslagDetaljer-avvistBeloep-valuta']?.feilmelding}
                      id={_namespace + '-avslagDetaljer-avvistBeloep-valuta'}
                      label={t('label:valuta')}
                      locale='nb'
                      onOptionSelected={(currency: Currency) => setItemNestedProp('avslagDetaljer.avvistBeloep.valuta', currency.value, index)}
                      includeHistoricCurrencies
                      sort={"noeuFirst"}
                      required
                      values={_item?.avslagDetaljer?.avvistBeloep?.valuta}
                    />
                  </HGrid>

                  <Select
                    data-testid={_namespace + '-avslagDetaljer-grunn'}
                    error={_v[_namespace + '-avslagDetaljer-grunn']?.feilmelding}
                    id={_namespace + '-avslagDetaljer-grunn'}
                    label={t('label:avslagsgrunn')}
                    menuPortalTarget={document.body}
                    onChange={(o: unknown) => setItemNestedProp('avslagDetaljer.grunn', (o as Option).value, index)}
                    options={avslagGrunnOptions}
                    required
                    value={_.find(avslagGrunnOptions, o => o.value === _item?.avslagDetaljer?.grunn)}
                    defaultValue={_.find(avslagGrunnOptions, o => o.value === _item?.avslagDetaljer?.grunn)}
                  />

                  {_item?.avslagDetaljer?.grunn === 'annet' && (
                    <TextArea
                      error={_v[_namespace + '-avslagDetaljer-grunnAnnet']?.feilmelding}
                      namespace={_namespace}
                      id='avslagDetaljer-grunnAnnet'
                      label={t('label:avslagsgrunn-annet')}
                      maxLength={155}
                      onChanged={(value: string) => setItemNestedProp('avslagDetaljer.grunnAnnet', value.trim(), index)}
                      value={_item?.avslagDetaljer?.grunnAnnet}
                    />
                  )}
                </VStack>
              </Box>
            )}

            <HStack>
              <Spacer />
              {addRemove}
            </HStack>
          </VStack>
        </Box>
      )
    }

    // Read-only view
    return (
      <Box
        key={index}
        padding="space-16"
        background="neutral-soft"
        borderColor="neutral-subtle"
        borderWidth="1"
        className={classNames(commonStyles.repeatableBox, {
          [commonStyles.error]: hasNamespaceWithErrors(_v, _namespace),
        })}
      >
        <VStack gap="space-16">
          <HGrid columns={3} gap="space-32" align="start">
            <VStack>
              <Label>{t('label:med-henvisning-til')}</Label>
              {_.find(henvisningTilOptions, o => o.value === item?.henvisningTil)?.label}
            </VStack>
            <VStack>
              <Label>{t('label:fakturanummer')}</Label>
              {item?.fakturanummer}
            </VStack>
            {addRemove}
          </HGrid>
          <HGrid columns={3} gap="space-32" align="start">
            <VStack>
              <Label>{t('label:utstedelsesdato')}</Label>
              {toDateFormat(item?.utstedelsesdato, "DD.MM.YYYY")}
            </VStack>
            <VStack>
              <Label>{t('label:fakturabeloep')}</Label>
              {item?.fakturabeloep?.beloep} {item?.fakturabeloep?.valuta}
            </VStack>
            <VStack>
              <Label>{t('label:avslag')}</Label>
              {_.find(avslagOptions, o => o.value === item?.avslag)?.label}
            </VStack>
          </HGrid>
          {(item?.avslag === 'delvis_avslag' || item?.avslag === 'totalt_avslag') && item?.avslagDetaljer && (
            <HGrid columns={3} gap="space-32" align="start">
              <VStack>
                <Label>{t('label:avvist-fakturabeloep')}</Label>
                {item.avslagDetaljer.avvistBeloep?.beloep} {item.avslagDetaljer.avvistBeloep?.valuta}
              </VStack>
              <VStack>
                <Label>{t('label:avslagsgrunn')}</Label>
                {_.find(avslagGrunnOptions, o => o.value === item.avslagDetaljer?.grunn)?.label}
                {item.avslagDetaljer.grunn === 'annet' && item.avslagDetaljer.grunnAnnet && (
                  <BodyLong size='small'>{item.avslagDetaljer.grunnAnnet}</BodyLong>
                )}
              </VStack>
            </HGrid>
          )}
        </VStack>
      </Box>
    )
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        {_.isEmpty(refusjoner) && !_newForm
          ? (
            <>
              <Box padding="space-16" borderWidth="1" borderColor="neutral-subtle" background="neutral-soft" id={namespace + '-refusjoner'}>
                <BodyLong>
                  {t('message:warning-no-refusjoner')}
                </BodyLong>
              </Box>
              <ErrorLabel error={validation[namespace + '-refusjoner']?.feilmelding} />
            </>
          )
          : refusjoner?.map((item: RefusjonItem, i: number) => renderRefusjonItem(item, i))
        }

        {_newForm
          ? renderRefusjonItem(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                size='small'
                onClick={() => _setNewForm(true)}
                icon={<PlusCircleIcon />}
              >
                {t('el:button-add-new-x2', { x: t('label:refusjon').toLowerCase() })}
              </Button>
            </Box>
          )
        }
      </VStack>
    </Box>
  )
}

export default Krav
