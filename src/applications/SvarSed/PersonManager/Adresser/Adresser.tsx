import { Add, Search } from '@navikt/ds-icons'
import { resetAdresse, searchAdresse } from 'actions/adresse'
import { resetValidation } from 'actions/validation'
import AdresseModal from 'applications/SvarSed/PersonManager/Adresser/AdresseModal'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { BodyLong, Button, Loader, Heading } from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import AdresseForm from './AdresseForm'
import { validateAdresse, ValidationAddressProps } from './validation'

interface AdresserSelector extends PersonManagerFormSelector {
  adresse: Array<IAdresse> | null | undefined
  gettingAdresse: boolean
}

const mapState = (state: State): AdresserSelector => ({
  validation: state.validation.status,
  adresse: state.adresse.adresse,
  gettingAdresse: state.loading.gettingAdresse
})

const Adresser: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    validation,
    adresse,
    gettingAdresse
  }: AdresserSelector = useSelector<State, AdresserSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.adresser`
  const adresses: Array<IAdresse> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-adresser`
  const fnr = getFnr(replySed, personID)
  const [_newAdresse, _setNewAdresse] = useState<IAdresse | undefined>(undefined)
  const [_newAdresseMessage, _setNewAdresseMessage] = useState<string | undefined>(undefined)
  const [_searchingAdresse, _setSearchingAdresse] = useState<boolean>(false)
  const [_showModal, _setShowModal] = useState<boolean>(false)

  const getId = (a: IAdresse | null | undefined): string => (a?.type ?? '') + '-' + (a?.by ?? '') + '-' + (a?.land ?? '')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<IAdresse>(getId)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationAddressProps>({}, validateAdresse)

  useEffect(() => {
    if (adresse && !_showModal && _searchingAdresse) {
      if (adresse.length > 1) {
        _setShowModal(true)
      } else if (adresse.length === 1) {
        _setNewAdresse(adresse[0])
        _setNewAdresseMessage(t('label:draft-address-filled'))
        onCleanupFillAdresse()
      }
    }
  }, [adresse, _showModal, _searchingAdresse])

  const setAdresse = (adresse: IAdresse, id: string | undefined, index: number) => {
    if (index < 0) {
      _setNewAdresse(adresse)
      if (id) {
        _resetValidation(namespace + '-' + id)
      }
    } else {
      dispatch(updateReplySed(`${target}[${index}]`, adresse))
      if (id && validation[namespace + getIdx(index) + '-' + id]) {
        dispatch(resetValidation(namespace + getIdx(index) + '-' + id))
      }
    }
  }

  const resetForm = () => {
    _setNewAdresse(undefined)
    _setNewAdresseMessage(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newAdresses: Array<IAdresse> = _.cloneDeep(adresses)
    const deletedAddresses: Array<IAdresse> = newAdresses.splice(index, 1)
    if (deletedAddresses && deletedAddresses.length > 0) {
      removeFromDeletion(deletedAddresses[0])
    }
    dispatch(updateReplySed(target, newAdresses))
    standardLogger('svarsed.editor.adresse.remove')
  }

  const getAdresse = () => {
    _setSearchingAdresse(true)
    _setNewAdresseMessage(undefined)
    dispatch(searchAdresse(fnr))
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      adresse: _newAdresse,
      namespace: namespace,
      checkAdresseType: true,
      personName: personName
    })
    if (valid) {
      let newAdresses: Array<IAdresse> = _.cloneDeep(adresses)
      if (_.isNil(newAdresses)) {
        newAdresses = []
      }
      newAdresses = newAdresses.concat(_newAdresse!)
      dispatch(updateReplySed(target, newAdresses))
      standardLogger('svarsed.editor.adresse.add')
      onCancel()
    }
  }

  const onFillAdresse = (selectedAdresses: Array<IAdresse>) => {
    let newAdresses: Array<IAdresse> = _.cloneDeep(adresses)
    if (_.isNil(newAdresses)) {
      newAdresses = []
    }
    newAdresses = newAdresses.concat(selectedAdresses!)
    dispatch(updateReplySed(target, newAdresses))
    onCleanupFillAdresse()
  }

  const onCleanupFillAdresse = () => {
    dispatch(resetAdresse())
    _setShowModal(false)
    _setSearchingAdresse(false)
  }

  const renderRow = (_adresse: IAdresse | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(_adresse)
    const idx = getIdx(index)
    return (
      <>
        {index < 0 && (
          <>
            <AlignStartRow>
              <Column>
                <Button
                  variant='primary'
                  disabled={gettingAdresse || _.isNil(fnr)}
                  onClick={getAdresse}
                >
                  <Search />
                  <HorizontalSeparatorDiv size='0.5' />
                  {gettingAdresse
                    ? t('message:loading-searching')
                    : t('label:søk-pdl-adresse-til', { person: personName })}
                  {gettingAdresse && <Loader />}
                </Button>
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        <RepeatableRow className={classNames({ new: index < 0 })}>
          {index < 0 && _newAdresseMessage && (
            <div>
              <BodyLong>{_newAdresseMessage}</BodyLong>
              <VerticalSeparatorDiv />
            </div>
          )}
          <AdresseForm
            key={namespace + idx + getId(index < 0 ? _newAdresse : _adresse)}
            namespace={namespace + idx}
            adresse={index < 0 ? _newAdresse : _adresse}
            onAdressChanged={(a: IAdresse, type: string | undefined) => setAdresse(a, type, index)}
            validation={index < 0 ? _validation : validation}
          />
          <AlignStartRow>
            <AlignEndColumn>
              <AddRemovePanel
                candidateForDeletion={candidateForDeletion}
                existingItem={(index >= 0)}
                marginTop
                onBeginRemove={() => addToDeletion(_adresse)}
                onConfirmRemove={() => onRemove(index)}
                onCancelRemove={() => removeFromDeletion(_adresse)}
                onAddNew={onAdd}
                onCancelNew={onCancel}
              />
            </AlignEndColumn>
          </AlignStartRow>
          <VerticalSeparatorDiv size='2' />
        </RepeatableRow>
      </>
    )
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Heading size='small'>
        {t('label:adresser')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(adresses)
        ? (
          <BodyLong>
            {t('message:warning-no-address')}
          </BodyLong>
          )
        : adresses?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      <AdresseModal
        open={_showModal}
        adresser={adresse}
        personName={personName}
        onAcceptAdresser={onFillAdresse}
        onRejectAdresser={onCleanupFillAdresse}
      />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:adresse').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Adresser
