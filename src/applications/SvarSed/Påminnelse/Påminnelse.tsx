import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, Heading, HStack, Radio, RadioGroup, Spacer, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import FormText from 'components/Forms/FormText'
import TextArea from 'components/Forms/TextArea'
import {RepeatableBox, SpacedHr} from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Purring, X009Sed } from 'declarations/sed'
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
import { validatePurring, validatePurringer, ValidationPurringerProps, ValidationPurringProps } from './validation'
import commonStyles from "assets/css/common.module.css"

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Påminnelse: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'purringer'
  const purringer = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-påminnelse`

  const getId = (p: Purring | null): string => p ? p.gjelder + '-' + p.beskrivelse : 'new'

  const [_newPurring, _setNewPurring] = useState<Purring | undefined>(undefined)
  const [_editPurring, _setEditPurring] = useState<Purring | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationPurringProps>(validatePurring, namespace)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationPurringerProps>(
      clonedValidation, namespace, validatePurringer, {
        purringer: (replySed as X009Sed).purringer,
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const setPurringGjelder = (gjelder: string, index: number) => {
    if (index < 0) {
      _setNewPurring({
        ..._newPurring,
        gjelder: gjelder.trim()
      } as Purring)
      _resetValidation(namespace + '-gjelder')
      return
    }
    _setEditPurring({
      ..._editPurring,
      gjelder: gjelder.trim()
    } as Purring)
    if (validation[namespace + getIdx(index) + '-gjelder']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-gjelder'))
    }
  }

  const setPurringBeskrivelse = (beskrivelse: string, index: number) => {
    if (index < 0) {
      _setNewPurring({
        ..._newPurring,
        beskrivelse: beskrivelse.trim()
      } as Purring)
      _resetValidation(namespace + '-beskrivelse')
      return
    }
    _setEditPurring({
      ..._editPurring,
      beskrivelse: beskrivelse.trim()
    } as Purring)
    if (validation[namespace + getIdx(index) + '-beskrivelse']) {
      dispatch(resetValidation(namespace + getIdx(index) + '-beskrivelse'))
    }
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPurring(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = (namespace?: string) => {
    _setNewPurring(undefined)
    _setNewForm(false)
    _resetValidation()
    if (namespace) {
      dispatch(resetValidation(namespace))
    }
  }

  const onStartEdit = (s: Purring, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPurring(s)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationPurringProps>(
      clonedValidation, namespace, validatePurring, {
        purring: _editPurring,
        purringer,
        index: _editIndex,
        personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}[${_editIndex}]`, _editPurring))
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPurring: Purring) => {
    const newPurringer: Array<Purring> = _.reject(purringer,
      (d: Purring) => _.isEqual(removedPurring, d))
    dispatch(updateReplySed(target, newPurringer))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      purring: _newPurring,
      purringer,
      personName
    })
    if (!!_newPurring && valid) {
      let newPurringer: Array<Purring> | undefined = _.cloneDeep(purringer)
      if (_.isNil(newPurringer)) {
        newPurringer = []
      }
      newPurringer.push(_newPurring)
      dispatch(updateReplySed(target, newPurringer))
      onCloseNew(namespace + '-purringer')
    }
  }

  const renderRow = (purring: Purring | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _purring = index < 0 ? _newPurring : (inEditMode ? _editPurring : purring)

    const addremovepanel = (
      <AddRemovePanel<Purring>
        item={purring}
        marginTop={inEditMode}
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
        key={getId(purring)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        {inEditMode
          ? (
            <VStack gap="4">
              <HStack gap="4" align="start">
                <RadioGroup
                  value={_purring?.gjelder}
                  data-no-border
                  data-testid={_namespace + '-gjelder'}
                  error={_v[_namespace + '-gjelder']?.feilmelding}
                  id={_namespace + '-gjelder'}
                  legend={t('label:type') + ' *'}
                  name={_namespace + '-gjelder'}
                  onChange={(gjelder: string) => setPurringGjelder(gjelder, index)}
                >
                  <HStack gap="4">
                    <Radio className={commonStyles.radioPanel} value='dokument'>
                      {t('label:dokument')}
                    </Radio>
                    <Radio className={commonStyles.radioPanel} value='informasjon'>
                      {t('label:informasjon')}
                    </Radio>
                    <Radio className={commonStyles.radioPanel} value='sed'>
                      {t('label:sed')}
                    </Radio>
                  </HStack>
                </RadioGroup>
                <Spacer/>
                {addremovepanel}
              </HStack>
              <TextArea
                error={_v[_namespace + '-beskrivelse']?.feilmelding}
                id='beskrivelse'
                maxLength={65}
                label={t('label:opplysninger') + ' *'}
                namespace={_namespace}
                onChanged={(beskrivelse: string) => setPurringBeskrivelse(beskrivelse, index)}
                value={_purring?.beskrivelse}
              />
            </VStack>
            )
          : (
            <HStack gap="4" align="center">
              <HStack gap="4">
                <FormText
                  error={_v[_namespace + '-gjelder']?.feilmelding}
                  id={_namespace + '-gjelder'}
                >
                  {t('label:' + _purring?.gjelder)}
                </FormText>
                <FormText
                  error={_v[_namespace + '-beskrivelse']?.feilmelding}
                  id={_namespace + '-beskrivelse'}
                >
                  {_purring?.beskrivelse}
                </FormText>
              </HStack>
              <Spacer/>
              {addremovepanel}
            </HStack>
            )}
      </RepeatableBox>
    )
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {t('label:påminnelse-til-å-sende-oss')}
        </Heading>
        {_.isEmpty(purringer)
          ? (
              <FormText
                error={validation[namespace + '-purringer']?.feilmelding}
                id={namespace + '-purringer'}
              >
                <SpacedHr />
                <BodyLong>
                  {t('message:warning-no-påminnelse')}
                </BodyLong>
                <SpacedHr />
              </FormText>
            )
          : purringer?.map(renderRow)
        }
        {_newForm
          ? renderRow(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                icon={<PlusCircleIcon/>}
              >
                {t('el:button-add-new-x', { x: t('label:purring').toLowerCase() })}
              </Button>
            </Box>
            )
        }
      </VStack>
    </Box>
  )
}

export default Påminnelse
