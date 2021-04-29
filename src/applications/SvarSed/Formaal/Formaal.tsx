import { setReplySed } from 'actions/svarpased'
import Add from 'assets/icons/Add'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'hooks/useAddRemove'
import Select from 'components/Forms/Select'
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
  const formaal: Array<string> = (replySed as FSed)?.formaal
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
  const [_formaals, setFormaals] = useState<Array<string>>(formaal || [])
  const [_addFormaal, setAddFormaal] = useState<boolean>(false)
  const [_newFormaal, setNewFormaal] = useState<Option | undefined>(undefined)
  const [_newFormaalIndex, setNewFormaalIndex] = useState<number | undefined>(undefined)

  const [addCandidateForDeletion, removeCandidateForDeletion, hasKey] = useAddRemove<string>((_formaal: string) => { return _formaal })
  const [_formaalValues, setFormaalValues] = useState<Array<Option>>(
    _.filter(formaalOptions, p => _formaals.indexOf(p.value) < 0)
  )

  const saveChanges = (newFormaals: Array<string>) => {
    const newFormaalValues = _.filter(formaalOptions, p => newFormaals.indexOf(p.value) < 0)
    setFormaals(newFormaals)
    setFormaalValues(newFormaalValues)
    dispatch(setReplySed({
      ...replySed,
      formaal: newFormaals
    }))
  }
  const onRemove = (formaal: string) => {
    removeCandidateForDeletion(formaal)
    const newFormaals = _.filter(_formaals, _f => _f !== formaal)
    saveChanges(newFormaals)
  }

  const onAdd = () => {
    if (_newFormaal) {
      const newFormaals = _formaals.concat(_newFormaal.value.trim())
      setNewFormaalIndex(newFormaals.length - 1)
      saveChanges(newFormaals)
      setNewFormaal(undefined)
    }
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
          const candidateForDeletion = hasKey(formaal)
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
                onConfirmRemove={() => onRemove(formaal)}
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
              {t('el:button-add-new-x', { x: t('label:formål').toLowerCase() })}
            </HighContrastFlatknapp>
          </div>
          )
        : (
          <FlexCenterDiv>
            <div style={{ flex: 2 }}>
              <Select
                data-test-id='formaal'
                id='formaal'
                highContrast={highContrast}
                value={_newFormaal}
                menuPortalTarget={document.body}
                onChange={(option: Option) => setNewFormaal(option)}
                options={_formaalValues}
              />
            </div>
            <HorizontalSeparatorDiv data-size='0.5' />
            <FlexCenterDiv>
              <HighContrastKnapp
                mini
                kompakt
                onClick={onAdd}
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
