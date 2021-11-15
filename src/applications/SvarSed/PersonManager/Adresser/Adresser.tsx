import { Add, Search } from '@navikt/ds-icons'
import { resetAdresse, searchAdresse } from 'actions/adresse'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import AdresseBox from 'components/AdresseBox/AdresseBox'
import Modal from 'components/Modal/Modal'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastRadio,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getFnr } from 'utils/fnr'
import { getIdx } from 'utils/namespace'
import Adresse from './Adresse'
import { validateAdresse, ValidationAddressProps } from './validation'

interface AdresserSelector extends PersonManagerFormSelector {
  highContrast: boolean
  adresse: Array<IAdresse> | null | undefined
  gettingAdresse: boolean
}

const mapState = (state: State): AdresserSelector => ({
  highContrast: state.ui.highContrast,
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
    highContrast,
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

  const [_searchingAdresse, _setSearchingAdresse] = useState<boolean>(false)
  const [_showModal, _setShowModal] = useState<boolean>(false)
  const [_selectedAdresse, _setSelectedAdresse] = useState<IAdresse | undefined>(undefined)

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
        onCleanupFillAdresse()
      }
    }
  }, [adresse, _showModal, _searchingAdresse])

  const setAdresse = (adresse: IAdresse, index: number) => {
    if (index < 0) {
      _setNewAdresse(adresse)
    } else {
      dispatch(updateReplySed(`${target}[${index}]`, adresse))
    }
  }

  const resetForm = () => {
    _setNewAdresse(undefined)
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

  const onValidationReset = (fullnamespace: string, index: number) => {
    if (index < 0) {
      _resetValidation(fullnamespace)
    } else {
      if (validation[fullnamespace]) {
        dispatch(resetValidation(fullnamespace))
      }
    }
  }

  const getAdresse = () => {
    _setSearchingAdresse(true)
    dispatch(searchAdresse(fnr))
  }

  const onAdd = () => {
    const valid: boolean = performValidation({
      adresse: _newAdresse,
      namespace: namespace,
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
      resetForm()
    }
  }

  const onFillAdresse = () => {
    _setNewAdresse(_selectedAdresse)
    onCleanupFillAdresse()
  }

  const onCleanupFillAdresse = () => {
    dispatch(resetAdresse())
    _setSelectedAdresse(undefined)
    _setShowModal(false)
    _setSearchingAdresse(false)
  }

  const renderRow = (_adresse: IAdresse | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(_adresse)
    const idx = getIdx(index)
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <Modal
          open={_showModal}
          highContrast={highContrast} modal={{
            modalTitle: t('label:pdl-adresse-til', { person: personName }),
            modalContent: (
              <div style={{ padding: '1rem' }}>
                <HighContrastRadioGroup
                  key={JSON.stringify(_selectedAdresse)}
                  legend={t('label:adresser')}
                >
                  {adresse?.map(a => (
                    <HighContrastRadio
                      key={a.type + '-' + a.gate}
                      name='adresser'
                      checked={_.isEqual(_selectedAdresse, a)}
                      label={(<AdresseBox adresse={a} />)}
                      onClick={() => _setSelectedAdresse(a)}
                    />
                  ))}
                </HighContrastRadioGroup>
              </div>
            ),
            modalButtons: [{
              main: true,
              text: t('label:fyll-inn-adresse'),
              onClick: onFillAdresse
            }, {
              text: t('el:button-cancel'),
              onClick: onCleanupFillAdresse
            }]
          }}
        />
        {index < 0 && (
          <>
            <AlignStartRow>
              <Column>
                <HighContrastHovedknapp
                  disabled={gettingAdresse || _.isNil(fnr)}
                  spinner={gettingAdresse}
                  onClick={getAdresse}
                >
                  <Search />
                  <HorizontalSeparatorDiv size='0.5' />
                  {gettingAdresse
                    ? t('message:loading-searching')
                    : t('label:søk-pdl-adresse-til', { person: personName })}
                </HighContrastHovedknapp>
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        <Adresse
          key={namespace + idx + getId(index < 0 ? _newAdresse : _adresse)}
          namespace={namespace + idx}
          adresse={index < 0 ? _newAdresse : _adresse}
          onAdressChanged={(a: IAdresse) => setAdresse(a, index)}
          validation={index < 0 ? _validation : validation}
          resetValidation={(n: string) => onValidationReset(n, index)}
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
    )
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Undertittel>
        {t('label:adresser')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      {_.isEmpty(adresses)
        ? (
          <Normaltekst>
            {t('message:warning-no-address')}
          </Normaltekst>
          )
        : adresses?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:adresse').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Adresser
