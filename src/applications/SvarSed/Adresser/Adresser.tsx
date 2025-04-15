import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, Heading, HStack, Spacer, VStack} from '@navikt/ds-react'
import { resetAdresse } from 'actions/adresse'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseFromPDL from 'applications/SvarSed/Adresser/AdresseFromPDL'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import {RepeatableBox, SpacedHr} from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { hasNamespaceWithErrors } from 'utils/validation'
import AdresseForm from './AdresseForm'
import { validateAdresse, validateAdresser, ValidationAdresseProps, ValidationAdresserProps } from './validation'
import {isFSed, isS040Sed} from "../../../utils/sed";
import DateField from "../../../components/DateField/DateField";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Adresser: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  options
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = `${personID}.adresser`
  const adresser: Array<Adresse> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-adresser`
  const singleAdress = options && options.singleAdress ? options.singleAdress : false
  const botidilandetsiden: string | undefined = _.get(replySed, `${personID}.botidilandetsiden`)

  const checkAdresseType: boolean = !isFSed(replySed)
  const fnr = getFnr(replySed, personID)
  const getId = (a: Adresse | null | undefined): string => a ? (a?.type ?? '') + '-' + (a?.by ?? '') + '-' + (a?.landkode ?? '') : 'new'

  const [_newAdresse, _setNewAdresse] = useState<Adresse | undefined>(undefined)
  const [_editAdresse, _setEditAdresse] = useState<Adresse | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_seeNewForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationAdresseProps>(validateAdresse, namespace)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAdresserProps>(
      clonedvalidation, namespace, validateAdresser, {
        adresser,
        checkAdresseType,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
    dispatch(resetAdresse())
  })

  const setAdresse = (adresse: Adresse, index: number) => {
    if (index < 0) {
      _setNewAdresse(adresse)
      _resetValidation(namespace)
      return
    }
    _setEditAdresse(adresse)
    dispatch(resetValidation(namespace + getIdx(index)))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditAdresse(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewAdresse(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (a: Adresse, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditAdresse(a)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationAdresseProps>(
      clonedvalidation, namespace, validateAdresse, {
        adresse: _editAdresse,
        checkAdresseType,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editAdresse))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemove = (removedAdresse: Adresse) => {
    const newAdresser: Array<Adresse> = _.reject(adresser, (a: Adresse) => _.isEqual(removedAdresse, a))
    dispatch(updateReplySed(target, newAdresser))
    standardLogger('svarsed.editor.adresse.remove')
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      adresse: _newAdresse,
      checkAdresseType,
      personName
    })
    if (!!_newAdresse && valid) {
      let newAdresser: Array<Adresse> | undefined = _.cloneDeep(adresser)
      if (_.isNil(newAdresser)) {
        newAdresser = []
      }
      newAdresser.push(_newAdresse!)
      dispatch(updateReplySed(target, newAdresser))
      standardLogger('svarsed.editor.adresse.add')
      onCloseNew()
    }
  }

  const setPDLAdresser = (selectedAdresser: Array<Adresse>) => {
    dispatch(updateReplySed(target, selectedAdresser))
  }

  const setPDLSingleAddress = (selectedAdresser: Array<Adresse>) => {
    dispatch(updateReplySed(target, [selectedAdresser[0]]))
  }

  const onDateChange = (dato: string) => {
    dispatch(updateReplySed(`${personID}.botidilandetsiden`, dato.trim()))
    if (validation[namespace + '-botidilandetsiden']) {
      dispatch(resetValidation(namespace + '-botidilandetsiden'))
    }
  }

  const renderRow = (adresse: Adresse | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _adresse = index < 0 ? _newAdresse : (inEditMode ? _editAdresse : adresse)

    const addremovepanel = (
      <AddRemovePanel<Adresse>
        item={adresse}
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
      <RepeatableBox
        padding="4"
        id={'repeatablerow-' + _namespace}
        key={getId(adresse)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >

        {inEditMode
          ? (
            <AdresseForm
              required={checkAdresseType ? ['type', 'by', 'land'] : ['by', 'land']}
              namespace={_namespace}
              adresse={_adresse}
              onAdressChanged={(a: Adresse) => setAdresse(a, index)}
              validation={_v}
            />
            )
          : (
            <HStack gap="4">
              <Box width="65%">
                <AdresseBox adresse={_adresse} seeType />
              </Box>
              <Spacer/>
              <Box>
                {addremovepanel}
              </Box>
            </HStack>
            )}
        {inEditMode && (
          <HStack gap="4">
            <Spacer/>
            <Box>
              {addremovepanel}
            </Box>
          </HStack>
        )}
      </RepeatableBox>
    )
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <AdresseFromPDL
          fnr={fnr!}
          selectedAdresser={adresser ?? []}
          personName={personName}
          onAdresserChanged={singleAdress ? setPDLSingleAddress : setPDLAdresser}
          singleAdress={singleAdress}
        />
        {_.isEmpty(adresser)
          ? (
            <Box>
              <SpacedHr />
              <BodyLong>
                {t('message:warning-no-address')}
              </BodyLong>
              <SpacedHr />
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
                disabled={singleAdress && adresser ? adresser?.length > 0 : false}
              >
                {t('el:button-add-new-x', { x: t('label:adresse').toLowerCase() })}
              </Button>
            </Box>
          )
        }
        {isS040Sed(replySed) &&
          <DateField
            namespace={namespace}
            error={validation[namespace + '-botidilandetsiden']?.feilmelding}
            id="botidilandetsiden"
            label={t('label:botidilandetsiden')}
            onChanged={onDateChange}
            dateValue={botidilandetsiden}
          />
        }
      </VStack>
    </Box>
  )
}

export default Adresser
