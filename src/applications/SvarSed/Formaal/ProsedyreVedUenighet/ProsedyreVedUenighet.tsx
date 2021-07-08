import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { FormålManagerFormProps, FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import { HorizontalLineSeparator, TextAreaDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { F002Sed, ProsedyreVedUenighet as IProsedyreVedUenighet, Grunn } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
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
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OptionTypeBase } from 'react-select'
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

const ProsedyreVedUenighet: React.FC<FormålManagerFormProps> = ({
  parentNamespace
}: FormålManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation
  }: any = useSelector<State, ProsedyreVedUenighetSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'uenighet'
  const prosedyreveduenighet: IProsedyreVedUenighet | undefined = (replySed as F002Sed).uenighet
  const namespace = `${parentNamespace}-prosedyreveduenighet`

  const [_newGrunn, _setNewGrunn] = useState<string>('')
  const [_newPerson, _setNewPerson] = useState<string>('')
  const [_grunns, _setGrunns] = useState<Array<Grunn>>([])

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Grunn>((grunn: Grunn): string => {
    return grunn.grunn
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationProsedyreVedUenighetGrunnProps>({}, validateProsedyreVedUenighetGrunn)

  const availableGrunns: Array<string> = ['ansettelse', 'pensjon', 'medlemsperiode', 'oppholdetsVarighet', 'bosted', 'personligSituasjon']

  const grunnOptions: Options = [
    { label: t('el:option-grunn-ansettelse'), value: 'ansettelse' },
    { label: t('el:option-grunn-pensjon'), value: 'pensjon' },
    { label: t('el:option-grunn-medlemsperiode'), value: 'medlemsperiode' },
    { label: t('el:option-grunn-oppholdetsVarighet'), value: 'oppholdetsVarighet' },
    { label: t('el:option-grunn-bosted'), value: 'bosted' },
    { label: t('el:option-grunn-personligSituasjon'), value: 'personligSituasjon' }
  ]

  const personOptions: Options = [
    { label: t('el:option-person-søker'), value: 'søker' },
    { label: t('el:option-person-ektefelle_partner'), value: 'ektefelle_partner' },
    { label: t('el:option-person-avdød'), value: 'avdød' },
    { label: t('el:option-person-annen-person'), value: 'annen-person' }
  ]

  useEffect(() => {
    if (!_.isNil((replySed as F002Sed)?.uenighet)) {
      const newGrunns: Array<Grunn> = []
      Object.keys((replySed as F002Sed).uenighet!).forEach(key => {
        if (availableGrunns.indexOf(key) >= 0) {
          newGrunns.push({
            grunn: key,
            person: _.get((replySed as F002Sed).uenighet, key)
          })
        }
      })
      _setGrunns(newGrunns.sort((a: Grunn, b: Grunn) => a.grunn.localeCompare(b.grunn)))
    }
  }, [replySed])

  const setGrunn = (newGrunn: string, index: number, oldGrunn : string | undefined) => {
    if (index < 0) {
      _setNewGrunn(newGrunn.trim())
      _resetValidation(namespace + '-grunn')
    } else {
      const newProsedyreveduenighet = _.cloneDeep(prosedyreveduenighet)
      // @ts-ignore
      newProsedyreveduenighet[newGrunn] = newProsedyreveduenighet[oldGrunn]
      // @ts-ignore
      delete newProsedyreveduenighet[oldGrunn]
      dispatch(updateReplySed(target, newProsedyreveduenighet))
      if (validation[namespace + '-[' + oldGrunn + ']-grunn']) {
        dispatch(resetValidation(namespace + '-[' + oldGrunn + ']-grunn'))
      }
    }
  }

  const setPerson = (newPerson: string, index: number, grunn: string | undefined) => {
    if (index < 0) {
      _setNewPerson(newPerson.trim())
      _resetValidation(namespace + '-person')
    } else {
      dispatch(updateReplySed(`${target}.${grunn}`, newPerson.trim()))
      if (validation[namespace + '-[' + grunn + ']-person']) {
        dispatch(resetValidation(namespace + '-[' + grunn + ']-person'))
      }
    }
  }

  const setYtterligereGrunner = (newYtterligereInfo: string) => {
    dispatch(updateReplySed(`${target}.ytterligereGrunner`, newYtterligereInfo.trim()))
    if (validation[namespace + '-ytterligereGrunner']) {
      dispatch(resetValidation(namespace + '-ytterligereGrunner'))
    }
  }

  const resetForm = () => {
    _setNewPerson('')
    _setNewGrunn('')
    resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (grunn: Grunn) => {
    const newProsedyreveduenighet: IProsedyreVedUenighet | undefined = _.cloneDeep(prosedyreveduenighet)
    if (!_.isEmpty(newProsedyreveduenighet)) {
      // @ts-ignore
      delete newProsedyreveduenighet[grunn.grunn]
      removeFromDeletion(grunn)
      dispatch(updateReplySed(target, newProsedyreveduenighet))
    }
  }

  const onAdd = () => {
    const newGrunn: Grunn = {
      grunn: _newGrunn.trim(),
      person: _newPerson.trim()
    }

    const valid: boolean = performValidation({
      grunn: newGrunn,
      prosedyreveduenighet: prosedyreveduenighet,
      namespace: namespace
    })

    if (valid) {
      let newProsedyreveduenighet = _.cloneDeep(prosedyreveduenighet)
      if (_.isNil(newProsedyreveduenighet)) {
        newProsedyreveduenighet = {}
      }
      // @ts-ignore
      newProsedyreveduenighet[_newGrunn.trim()] = _newPerson.trim()
      dispatch(updateReplySed(target, newProsedyreveduenighet))
      resetForm()
    }
  }

  const renderRow = (grunn: Grunn | null, grunns: Array<Grunn>, index: number) => {
    const candidateForDeletion = grunn === null ? false : isInDeletion(grunn)
    const idx = grunn === null ? '' : '[' + grunn + ']'
    // disable the options for this select box, that already exist in prosedyreveduenighet
    const thisGrunnOptions = _.map(grunnOptions, o => ({
      ...o,
      isDisabled: _grunns.map(g => g.grunn).indexOf(o.value) >= 0
    }))

    const getErrorFor = (el: string): string | undefined => (
      grunn !== null
        ? validation[namespace + idx + '-' + el]?.feilmelding
        : _validation[namespace + '-' + el]?.feilmelding
    )

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: (index * 0.1) + 's' }}
        >
          <Column>
            <Select
              closeMenuOnSelect
              data-test-id={namespace + idx + '-grunn'}
              feil={getErrorFor('grunn')}
              highContrast={highContrast}
              id={namespace + idx + '-grunn'}
              key={namespace + idx + '-grunn-' + (grunn === null ? _newGrunn : grunn?.grunn)}
              label={t('label:velg-grunn-til-uenighet')}
              menuPortalTarget={document.body}
              onChange={(o: OptionTypeBase) => setGrunn(o.value, index, (grunn === null ? _newGrunn : grunn?.grunn))}
              options={thisGrunnOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={_.find(grunnOptions, b => b.value === (grunn === null ? _newGrunn : grunn?.grunn))}
              defaultValue={_.find(grunnOptions, b => b.value === (grunn === null ? _newGrunn : grunn?.grunn))}
            />
          </Column>
          <Column>
            <Select
              closeMenuOnSelect
              data-test-id={namespace + idx + '-person'}
              feil={getErrorFor('person')}
              highContrast={highContrast}
              id={namespace + idx + '-person'}
              key={namespace + idx + '-person-' + (grunn === null ? _newPerson : grunn?.person)}
              label={t('label:personen-det-gjelder') + ' *'}
              menuPortalTarget={document.body}
              onChange={(o: OptionTypeBase) => setPerson(o.value, index, (grunn === null ? _newGrunn : grunn?.grunn))}
              options={personOptions}
              placeholder={t('el:placeholder-select-default')}
              selectedValue={_.find(personOptions, b => b.value === (grunn === null ? _newPerson : grunn?.person))}
              defaultValue={_.find(personOptions, b => b.value === (grunn === null ? _newPerson : grunn?.person))}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={grunn !== null}
              marginTop
              onBeginRemove={() => addToDeletion(grunn)}
              onConfirmRemove={() => onRemove(grunn!)}
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
      {_.isEmpty(_grunns)
        ? (
          <div id={namespace + '-grunner'}>
            {validation[namespace + '-grunner']?.feilmelding
              ? (
                <div className='skjemaelement__feilmelding'>
                  <p className='typo-feilmelding'>
                    {validation[namespace + '-grunner']?.feilmelding}
                  </p>
                </div>
                )
              : (
                <Normaltekst>
                  {t('label:no-grunn')}
                </Normaltekst>
                )}
          </div>
          )
        : _grunns?.map((g, i) => renderRow(g, _grunns, i))}
      <VerticalSeparatorDiv size={2} />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, _grunns, -1)
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
              feil={validation[namespace + '-ytterligereGrunner']?.feilmelding}
              namespace={namespace}
              id='ytterligereGrunner'
              label={t('label:ytterligere-grunner-til-uenighet')}
              onChanged={setYtterligereGrunner}
              value={prosedyreveduenighet?.ytterligereGrunner}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default ProsedyreVedUenighet
