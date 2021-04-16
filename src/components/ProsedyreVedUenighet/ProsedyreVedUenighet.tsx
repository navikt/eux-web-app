import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Select/Select'
import { AlignStartRow, PileDiv, TextAreaDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastPanel,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateProsedyre } from 'validation/prosedyre'

export interface ProsedyreVedUenighetProps {
  highContrast: boolean
  replySed: ReplySed
  validation: Validation
}

export interface Prosedyre {
  grunn: string
  person: Array<string>
}

const ProsedyreVedUenighet: React.FC<ProsedyreVedUenighetProps> = ({
  highContrast,
  // replySed,
  validation
}: ProsedyreVedUenighetProps): JSX.Element => {
  const { t } = useTranslation()
  const [_confirmDelete, _setConfirmDelete] = useState<Array<string>>([])
  const [_prosedyrer, _setProsedyrer] = useState<Array<Prosedyre>>([])

  const [_newGrunn, _setNewGrunn] = useState<string>('')
  const [_newPerson, _setNewPerson] = useState<Array<string>>([])

  const [_ytterligere, _setYtterligere] = useState<string>('')
  const [_validation, _setValidation] = useState<Validation>({})
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)

  const namespace = 'prosedyreveduenighet'

  const grunnOptions: Options = [
    { label: t('el:option-grunn-1'), value: '1' },
    { label: t('el:option-grunn-2'), value: '2' },
    { label: t('el:option-grunn-3'), value: '3' },
    { label: t('el:option-grunn-4'), value: '4' },
    { label: t('el:option-grunn-5'), value: '5' },
    { label: t('el:option-grunn-6'), value: '6' }
  ]

  const resetValidation = (key: string): void => {
    _setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const newValidation: Validation = {}
    validateProsedyre(
      newValidation,
      {
        grunn: _newGrunn,
        person: _newPerson
      } as Prosedyre,
      -1,
      t,
      namespace + '-prosedyre'
    )
    _setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }
  const onAddNewClicked = () => _setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const setGrunn = (s: string, i: number) => {
    if (i < 0) {
      _setNewGrunn(s)
      resetValidation(namespace + '-prosedyre-grunn')
    } else {
      const newProsedyrer = _.cloneDeep(_prosedyrer)
      newProsedyrer[i].grunn = s
      _setProsedyrer(newProsedyrer)
    }
  }

  const setPerson = (person: string, checked: boolean, i: number) => {
    if (i < 0) {
      let newPerson = _.cloneDeep(_newPerson)
      if (checked) {
        newPerson = newPerson.concat(person)
      } else {
        newPerson = _.filter(newPerson, p => p !== person)
      }
      _setNewPerson(newPerson)
      resetValidation(namespace + '-prosedyre-person')
    } else {
      const newProsedyrer = _.cloneDeep(_prosedyrer)
      let newPerson = _.cloneDeep(newProsedyrer[i].person)
      if (checked) {
        newPerson = newPerson.concat(person)
      } else {
        newPerson = _.filter(newPerson, p => p !== person)
      }
      newProsedyrer[i].person = newPerson
      _setProsedyrer(newProsedyrer)
    }
  }

  const resetForm = () => {
    _setNewPerson([])
    _setNewGrunn('')
    _setValidation({})
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const getKey = (p: Prosedyre): string => {
    return p?.grunn
  }

  const onRemove = (i: number) => {
    const newProsedyrer = _.cloneDeep(_prosedyrer)
    const deletedProsedyrer: Array<Prosedyre> = newProsedyrer.splice(i, 1)
    if (deletedProsedyrer && deletedProsedyrer.length > 0) {
      removeCandidateForDeletion(getKey(deletedProsedyrer[0]))
    }
    _setProsedyrer(newProsedyrer)
  }

  const onAdd = () => {
    if (performValidation()) {
      let newProsedyrer = _.cloneDeep(_prosedyrer)
      if (_.isNil(newProsedyrer)) {
        newProsedyrer = []
      }
      newProsedyrer.push({
        grunn: _newGrunn,
        person: _newPerson
      }as Prosedyre)
      resetForm()
      _setProsedyrer(newProsedyrer)
    }
  }
  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0
      ? _validation[namespace + '-prosedyre-' + el]?.feilmelding
      : validation[namespace + '-prosedyre[' + index + ']-' + el]?.feilmelding
  }

  const renderProsedyre = (p: Prosedyre | null, index: number) => {
    const key = p ? getKey(p) : 'new'
    const candidateForDeletion = index < 0 ? false : !!key && _confirmDelete.indexOf(key) >= 0

    const isChecked = (_p: string) => {
      if (index < 0) {
        return _newPerson.indexOf(_p) >= 0
      } else {
        if (_.isNil(p) || _.isNil(p.person)) {
          return false
        }
        return p?.person.indexOf(_p) >= 0
      }
    }

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.1s' }}
        >
          <Column data-flex='2'>
            <Select
              data-test-id={'c-' + namespace + '-prosedyre' + (index >= 0 ? '[' + index + ']' : '') + '-grunn-text'}
              feil={getErrorFor(index, 'grunn')}
              highContrast={highContrast}
              id={'c-' + namespace + '-prosedyre' + (index >= 0 ? '[' + index + ']' : '') + '-grunn-text'}
              label={t('label:reason-for-disagreement')}
              menuPortalTarget={document.body}
              onChange={(e: any) => setGrunn(e.value, index)}
              options={grunnOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={_.find(grunnOptions, b => b.value === (index < 0 ? _newGrunn : p?.grunn))}
              defaultValue={_.find(grunnOptions, b => b.value === (index < 0 ? _newGrunn : p?.grunn))}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.1s' }}
        >
          <Column data-flex='2'>

            <VerticalSeparatorDiv />

            <CheckboxGruppe
              legend={t('label:concerning-person')}
              feil={getErrorFor(index, 'person')}
            >

              <Checkbox
                label={t('label:søker')}
                checked={isChecked('søker')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPerson('søker', e.target.checked, index)}
              />
              <VerticalSeparatorDiv data-size='0.5' />
              <Checkbox
                label={t('label:partner')}
                checked={isChecked('partner')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPerson('partner', e.target.checked, index)}
              />
              <VerticalSeparatorDiv data-size='0.5' />
              <Checkbox
                label={t('label:avdød')}
                checked={isChecked('avdød')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPerson('avdød', e.target.checked, index)}
              />
              <VerticalSeparatorDiv data-size='0.5' />
              <Checkbox
                label={t('label:annen-person')}
                checked={isChecked('annen-person')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPerson('annen-person', e.target.checked, index)}
              />
            </CheckboxGruppe>
            <VerticalSeparatorDiv />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <PileDiv>
      <Undertittel>
        {t('el:title-procedure-with-complain')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <HighContrastPanel>
        <VerticalSeparatorDiv />
        {_prosedyrer.map(renderProsedyre)}
        <hr />
        <VerticalSeparatorDiv />
        {_seeNewForm
          ? renderProsedyre(null, -1)
          : (
            <Row className='slideInFromLeft'>
              <Column>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onAddNewClicked}
                >
                  <Add />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('el:button-add-new-x', { x: t('label:reason').toLowerCase() })}
                </HighContrastFlatknapp>
              </Column>
            </Row>
            )}

        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.2s' }}
        >
          <Column>
            <TextAreaDiv>
              <HighContrastTextArea
                className={classNames({
                  'skjemaelement__input--harFeil': validation[namespace + '-ytterligere']?.feilmelding
                })}
                data-test-id={'c-' + namespace + '-ytterligere-text'}
                feil={validation[namespace + '-ytterligere']?.feilmelding}
                id={'c-' + namespace + '-ytterligere-text'}
                label={t('label:reason-information-for-disagreement')}
                placeholder={t('el:placeholder-input-default')}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => _setYtterligere(e.target.value)}
                value={_ytterligere}
              />
            </TextAreaDiv>
          </Column>
        </AlignStartRow>

      </HighContrastPanel>
    </PileDiv>
  )
}

export default ProsedyreVedUenighet
