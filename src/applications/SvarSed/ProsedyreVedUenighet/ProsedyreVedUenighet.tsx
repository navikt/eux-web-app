import { AddCircle } from '@navikt/ds-icons'
import { BodyLong, Button, Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import { HorizontalLineSeparator, RepeatableRow, TextAreaDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { F002Sed, Grunn, ProsedyreVedUenighet as IProsedyreVedUenighet } from 'declarations/sed'
import useAddRemove from 'hooks/useAddRemove'
import useLocalValidation from 'hooks/useLocalValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { validateProsedyreVedUenighetGrunn, ValidationProsedyreVedUenighetGrunnProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const ProsedyreVedUenighet: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'uenighet'
  const prosedyreVedUenighet: IProsedyreVedUenighet | undefined = (replySed as F002Sed).uenighet
  const namespace = `${parentNamespace}-prosedyre_ved_uenighet`

  const [_newGrunn, _setNewGrunn] = useState<string>('')
  const [_newPerson, _setNewPerson] = useState<string>('')
  const [_grunns, _setGrunns] = useState<Array<Grunn>>([])

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Grunn>((grunn: Grunn): string => {
    return grunn.grunn
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useLocalValidation<ValidationProsedyreVedUenighetGrunnProps>(validateProsedyreVedUenighetGrunn, namespace)

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
      const newProsedyreveduenighet = _.cloneDeep(prosedyreVedUenighet)
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

  const setYtterligereGrunner = (newYtterligereGrunner: string) => {
    dispatch(updateReplySed(`${target}.ytterligereGrunner`, newYtterligereGrunner.trim()))
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
    const newProsedyreveduenighet: IProsedyreVedUenighet | undefined = _.cloneDeep(prosedyreVedUenighet)
    if (!_.isEmpty(newProsedyreveduenighet)) {
      // @ts-ignore
      delete newProsedyreveduenighet[grunn.grunn]
      removeFromDeletion(grunn)
      dispatch(updateReplySed(target, newProsedyreveduenighet))
      standardLogger('svarsed.editor.prosedyreveduenighet.grunn.remove')
    }
  }

  const onAdd = () => {
    const newGrunn: Grunn = {
      grunn: _newGrunn.trim(),
      person: _newPerson.trim()
    }

    const valid: boolean = performValidation({
      grunn: newGrunn,
      prosedyreVedUenighet
    })

    if (valid) {
      let newProsedyreveduenighet = _.cloneDeep(prosedyreVedUenighet)
      if (_.isNil(newProsedyreveduenighet)) {
        newProsedyreveduenighet = {}
      }
      // @ts-ignore
      newProsedyreveduenighet[_newGrunn.trim()] = _newPerson.trim()
      dispatch(updateReplySed(target, newProsedyreveduenighet))
      standardLogger('svarsed.editor.prosedyreveduenighet.grunn.add')
      onCancel()
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
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow>
          <Column>
            <Select
              closeMenuOnSelect
              data-testid={namespace + idx + '-grunn'}
              error={getErrorFor('grunn')}
              id={namespace + idx + '-grunn'}
              key={namespace + idx + '-grunn-' + (grunn === null ? _newGrunn : grunn?.grunn)}
              label={t('label:velg-grunn-til-uenighet')}
              menuPortalTarget={document.body}
              onChange={(o: unknown) => setGrunn((o as Option).value, index, (grunn === null ? _newGrunn : grunn?.grunn))}
              options={thisGrunnOptions}
              value={_.find(grunnOptions, b => b.value === (grunn === null ? _newGrunn : grunn?.grunn))}
              defaultValue={_.find(grunnOptions, b => b.value === (grunn === null ? _newGrunn : grunn?.grunn))}
            />
          </Column>
          <Column>
            <Select
              closeMenuOnSelect
              data-testid={namespace + idx + '-person'}
              error={getErrorFor('person')}
              id={namespace + idx + '-person'}
              key={namespace + idx + '-person-' + (grunn === null ? _newPerson : grunn?.person)}
              label={t('label:personen-det-gjelder')}
              menuPortalTarget={document.body}
              onChange={(o: unknown) => setPerson((o as Option).value, index, (grunn === null ? _newGrunn : grunn?.grunn))}
              options={personOptions}
              required
              value={_.find(personOptions, b => b.value === (grunn === null ? _newPerson : grunn?.person))}
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
      </RepeatableRow>
    )
  }

  return (
    <PaddedDiv>
      <Heading size='small'>
        {t('label:prosedyre-ved-uenighet')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <VerticalSeparatorDiv />
      {_.isEmpty(_grunns)
        ? (
          <div id={namespace + '-grunner'}>
            {validation[namespace + '-grunner']?.feilmelding
              ? (
                <label className='navds-error-message navds-error-message--medium navds-label'>
                  {validation[namespace + '-grunner']?.feilmelding}
                </label>
                )
              : (
                <BodyLong>
                  {t('label:no-grunn')}
                </BodyLong>
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
          <Row>
            <Column>
              <Button
                variant='tertiary'
                onClick={() => _setSeeNewForm(true)}
              >
                <AddCircle />
                {t('el:button-add-new-x', { x: t('label:reason').toLowerCase() })}
              </Button>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-ytterligereGrunner']?.feilmelding}
              namespace={namespace}
              id='ytterligereGrunner'
              label={t('label:ytterligere-grunner-til-uenighet')}
              onChanged={setYtterligereGrunner}
              value={prosedyreVedUenighet?.ytterligereGrunner}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default ProsedyreVedUenighet
