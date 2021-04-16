import { setReplySed } from 'actions/svarpased'
import Add from 'assets/icons/Add'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Select from 'components/Select/Select'
import { Etikett, FlexCenterDiv } from 'components/StyledComponents'
import { Option, Options } from 'declarations/app'
import { FSed, ReplySed } from 'declarations/sed'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema/lib/feiloppsummering'
import { Feilmelding, Undertittel } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, HighContrastKnapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

interface FormaalProps {
  feil: FeiloppsummeringFeil | undefined
  highContrast: boolean
  replySed: ReplySed
}

const Formaal: React.FC<FormaalProps> = ({
  feil,
  highContrast,
  replySed
}: FormaalProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const formaalOptions: Options = [
    { label: t('el:option-formaal-1'), value: 'mottak_av_søknad_om_familieytelser' },
    { label: t('el:option-formaal-2'), value: 'informasjon_om_endrede_forhold' },
    { label: t('el:option-formaal-3'), value: 'svar_på_kontroll_eller_årlig_kontroll' },
    { label: t('el:option-formaal-4'), value: 'svar_på_anmodning_om_informasjon' },
    { label: t('el:option-formaal-5'), value: 'vedtak' },
    { label: t('el:option-formaal-6'), value: 'motregning' },
    { label: t('el:option-formaal-7'), value: 'prosedyre_ved_uenighet' },
    { label: t('el:option-formaal-8'), value: 'refusjon_i_henhold_til_artikkel_58_i_forordningen' }
  ]
  const [_formaals, setFormaals] = useState<Array<string>>((replySed as FSed)?.formaal || [])
  const [_addFormaal, setAddFormaal] = useState<boolean>(false)
  const [_newFormaal, setNewFormaal] = useState<Option | undefined>(undefined)
  const [_newFormaalIndex, setNewFormaalIndex] = useState<number | undefined>(undefined)
  const [_confirmDeleteFormaal, setConfirmDeleteFormaal] = useState<Array<string>>([])
  const [_formaalValues, setFormaalValues] = useState<Array<Option>>(
    _.filter(formaalOptions, p => _formaals.indexOf(p.value) < 0)
  )
  const _hasFormaal = !!(replySed as FSed)?.formaal

  const saveFormaalChange = (newFormaals: Array<string>) => {
    const newFormaalValues = _.filter(formaalOptions, p => newFormaals.indexOf(p.value) < 0)
    setFormaals(newFormaals)
    setFormaalValues(newFormaalValues)
    dispatch(setReplySed({
      ...replySed,
      formaal: newFormaals
    }))
  }
  const onRemoveFormaal = (formaal: string) => {
    removeCandidateForDeletion(formaal)
    const newFormaals = _.filter(_formaals, _f => _f !== formaal)
    saveFormaalChange(newFormaals)
  }

  const onAddFormaal = () => {
    if (_newFormaal) {
      const newFormaals = _formaals.concat(_newFormaal.value)
      setNewFormaalIndex(newFormaals.length - 1)
      saveFormaalChange(newFormaals)
      setNewFormaal(undefined)
    }
  }

  const addCandidateForDeletion = (formaal: string) => {
    setConfirmDeleteFormaal(_confirmDeleteFormaal.concat(formaal))
  }

  const removeCandidateForDeletion = (formaal: string) => {
    setConfirmDeleteFormaal(_.filter(_confirmDeleteFormaal, _f => _f !== formaal))
  }

  const onFormaalChanged = (option: Option) => {
    setNewFormaal(option)
  }

  if (!_hasFormaal) {
    return <div />
  }

  return (
    <>
      <Undertittel>
        {t('el:title-choose-formaal')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_formaals && _formaals
        .sort((a, b) => a.localeCompare(b))
        .map((formaal: string, i: number) => {
          const candidateForDeletion = _confirmDeleteFormaal.indexOf(formaal) >= 0
          return (
            <FlexCenterDiv
              className='slideInFromLeft'
              style={{ animationDelay: i === _newFormaalIndex ? '0s' : (i * 0.1) + 's' }}
              key={formaal}
            >
              <Etikett data-border>
                {_.find(formaalOptions, _f => _f.value === formaal)?.label}
              </Etikett>
              <AddRemovePanel
                candidateForDeletion={candidateForDeletion}
                existingItem
                onBeginRemove={() => addCandidateForDeletion(formaal)}
                onConfirmRemove={() => onRemoveFormaal(formaal)}
                onCancelRemove={() => removeCandidateForDeletion(formaal)}
              />
            </FlexCenterDiv>
          )
        })}
      <VerticalSeparatorDiv />
      {!_addFormaal
        ? (
          <div className='slideInFromLeft'>
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setAddFormaal(!_addFormaal)}
            >
              <Add />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('el:button-add-new-x', { x: t('label:formaal').toLowerCase() })}
            </HighContrastFlatknapp>
          </div>
          )
        : (
          <FlexCenterDiv>
            <div style={{ flex: 2 }}>
              <Select
                data-test-id='c-formaal-text'
                id='c-formaal-text'
                highContrast={highContrast}
                value={_newFormaal}
                menuPortalTarget={document.body}
                onChange={onFormaalChanged}
                options={_formaalValues}
              />
            </div>
            <HorizontalSeparatorDiv data-size='0.5' />
            <FlexCenterDiv>
              <HighContrastKnapp
                mini
                kompakt
                onClick={onAddFormaal}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add')}
              </HighContrastKnapp>
              <HorizontalSeparatorDiv data-size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setAddFormaal(!_addFormaal)}
              >
                {t('el:button-cancel')}
              </HighContrastFlatknapp>
            </FlexCenterDiv>
          </FlexCenterDiv>
          )}
      {feil && (
        <div role='alert' aria-live='assertive' className='feilmelding skjemaelement__feilmelding'>
          <Feilmelding>
            {feil.feilmelding}
          </Feilmelding>
        </div>
      )}
    </>
  )
}

export default Formaal
