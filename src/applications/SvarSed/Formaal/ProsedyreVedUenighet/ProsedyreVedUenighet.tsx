import { updateReplySed } from 'actions/svarpased'
import { FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import { HorizontalLineSeparator, TextAreaDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { F002Sed, FormalProsedyreVedUenighet, Grunn } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OptionTypeBase } from 'react-select'
import { getIdx } from 'utils/namespace'
import { validateProsedyreVedUenighetGrunn, ValidationProsedyreVedUenighetGrunnProps } from './validation'

export interface ProsedyreVedUenighetSelector extends FormålManagerFormSelector {
  highContrast: boolean
}

const mapState = (state: State): ProsedyreVedUenighetSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status,
  viewValidation: state.validation.view
})

const ProsedyreVedUenighet: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    resetValidation,
    validation
  }: any = useSelector<State, ProsedyreVedUenighetSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'formaalx.prosedyreveduenighet'
  const prosedyreveduenighet: FormalProsedyreVedUenighet | undefined = (replySed as F002Sed).formaalx?.prosedyreveduenighet
  const namespace = 'prosedyreveduenighet'

  const [_newGrunn, _setNewGrunn] = useState<string>('')
  const [_newPerson, _setNewPerson] = useState<Array<string>>([])

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Grunn>((grunn: Grunn): string => {
    return grunn.grunn
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationProsedyreVedUenighetGrunnProps>({}, validateProsedyreVedUenighetGrunn)

  const grunnOptions: Options = [
    { label: t('el:option-grunn-01'), value: '01' },
    { label: t('el:option-grunn-02'), value: '02' },
    { label: t('el:option-grunn-03'), value: '03' },
    { label: t('el:option-grunn-04'), value: '04' },
    { label: t('el:option-grunn-05'), value: '05' },
    { label: t('el:option-grunn-06'), value: '06' }
  ]

  const setGrunn = (newGrunn: string, index: number) => {
    if (index < 0) {
      _setNewGrunn(newGrunn.trim())
      resetValidation(namespace + '-grunner-grunn')
    } else {
      dispatch(updateReplySed(`${target}.grunner[${index}].grunn`, newGrunn.trim()))
      if (validation[namespace + '-grunner' + getIdx(index) + '-grunn']) {
        resetValidation(namespace + '-grunner' + getIdx(index) + '-grunn')
      }
    }
  }

  const setPerson = (person: string, checked: boolean, index: number) => {
    if (index < 0) {
      let newPerson = _.cloneDeep(_newPerson)
      if (checked) {
        newPerson = newPerson.concat(person.trim())
      } else {
        newPerson = _.filter(newPerson, p => p !== person.trim())
      }
      _setNewPerson(newPerson)
      _resetValidation(namespace + '-grunner-person')
    } else {
      let newPerson: Array<string> = _.cloneDeep(prosedyreveduenighet?.grunner[index].person) as Array<string>
      if (checked) {
        newPerson = newPerson.concat(person.trim())
      } else {
        newPerson = _.filter(newPerson, p => p !== person.trim())
      }
      dispatch(updateReplySed(`${target}.grunner[${index}].person`, newPerson))
      if (validation[namespace + '-grunner' + getIdx(index) + '-person']) {
        resetValidation(namespace + '-grunner' + getIdx(index) + '-person')
      }
    }
  }

  const setYtterligereInfo = (newYtterligereInfo: string) => {
    dispatch(updateReplySed(`${target}.ytterligereInfo`, newYtterligereInfo.trim()))
    if (validation[namespace + '-ytterligereInfo']) {
      resetValidation(namespace + '-ytterligereInfo')
    }
  }

  const resetForm = () => {
    _setNewPerson([])
    _setNewGrunn('')
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newGrunner: Array<Grunn> = _.cloneDeep(prosedyreveduenighet?.grunner) as Array<Grunn>
    const deletedGrunner: Array<Grunn> = newGrunner.splice(index, 1)
    if (deletedGrunner && deletedGrunner.length > 0) {
      removeFromDeletion(deletedGrunner[0])
    }
    dispatch(updateReplySed(`${target}.grunner`, newGrunner))
  }

  const onAdd = () => {
    const newGrunn: Grunn | any = {
      grunn: _newGrunn.trim(),
      person: _newPerson
    }

    const valid: boolean = performValidation({
      grunn: newGrunn,
      namespace: namespace
    })

    if (valid) {
      let newGrunner: Array<Grunn> = _.cloneDeep(prosedyreveduenighet?.grunner) as Array<Grunn>
      if (_.isNil(newGrunner)) {
        newGrunner = []
      }
      newGrunner.push(newGrunn)
      dispatch(updateReplySed(`${target}.grunner`, newGrunner))
      resetForm()
    }
  }

  const renderRow = (grunn: Grunn | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(grunn)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-grunner' + idx + '-' + el]?.feilmelding
        : validation[namespace + '-grunner' + idx + '-' + el]?.feilmelding
    )
    const isChecked = (person: string) => {
      if (index < 0) {
        return _newPerson.indexOf(person) >= 0
      } else {
        return !!grunn && grunn?.person?.indexOf(person) >= 0
      }
    }

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: (index * 0.1) + 's' }}
        >
          <Column flex='2'>
            <Select
              data-test-id={namespace + '-grunner' + idx + '-grunn'}
              feil={getErrorFor(index, 'grunn')}
              highContrast={highContrast}
              id={namespace + '-grunner' + idx + '-grunn'}
              label={t('label:velg-grunn-til-uenighet')}
              menuPortalTarget={document.body}
              onChange={(o: OptionTypeBase) => setGrunn(o.value, index)}
              options={grunnOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={_.find(grunnOptions, b => b.value === (index < 0 ? _newGrunn : grunn?.grunn))}
              defaultValue={_.find(grunnOptions, b => b.value === (index < 0 ? _newGrunn : grunn?.grunn))}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: '0.1s' }}
        >
          <Column flex='2'>
            <VerticalSeparatorDiv />
            <CheckboxGruppe
              data-test-id={namespace + '-grunner' + idx + '-person'}
              id={namespace + '-grunner' + idx + '-person'}
              legend={t('label:personen-det-gjelder') + ':'}
              feil={getErrorFor(index, 'person')}
            >
              {!_.isNil(replySed.bruker) && (
                <>
                  <Checkbox
                    label={t('label:søker')}
                    checked={isChecked('søker')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPerson('søker', e.target.checked, index)}
                  />
                  <VerticalSeparatorDiv size='0.5' />
                </>
              )}
              {!_.isNil((replySed as F002Sed).ektefelle) && (
                <>
                  <Checkbox
                    label={t('label:partner')}
                    checked={isChecked('partner')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPerson('partner', e.target.checked, index)}
                  />
                  <VerticalSeparatorDiv size='0.5' />
                </>
              )}
              {!_.isNil((replySed as F002Sed).ektefelle) && (
                <>
                  <Checkbox
                    label={t('label:annen-person')}
                    checked={isChecked('annen-person')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPerson('annen-person', e.target.checked, index)}
                  />
                  <VerticalSeparatorDiv size='0.5' />
                </>
              )}
              <>
                <Checkbox
                  label={t('label:avdød')}
                  checked={isChecked('avdød')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPerson('avdød', e.target.checked, index)}
                />
                <VerticalSeparatorDiv size='0.5' />
              </>
            </CheckboxGruppe>
            <VerticalSeparatorDiv />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(grunn)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(grunn)}
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
    <PaddedDiv>
      <Undertittel>
        {t('label:prosedyre-ved-uenighet')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <VerticalSeparatorDiv />
      {_.isEmpty(prosedyreveduenighet?.grunner)
        ? (
          <Normaltekst>
            {t('label:no-grunn')}
          </Normaltekst>
          )
        : prosedyreveduenighet?.grunner?.map(renderRow)}
      <VerticalSeparatorDiv size={2} />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
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
            <TextArea
              feil={validation[namespace + '-ytterligereInfo']?.feilmelding}
              namespace={namespace}
              id='ytterligereInfo'
              label={t('label:ytterligere-grunner-til-uenighet')}
              onChanged={setYtterligereInfo}
              value={prosedyreveduenighet?.ytterligereInfo}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      {validation[namespace]?.feilmelding && (
        <div className='skjemaelement__feilmelding'>
          <p className='typo-feilmelding'>
            {validation[namespace]?.feilmelding}
          </p>
        </div>
      )}
    </PaddedDiv>
  )
}

export default ProsedyreVedUenighet
