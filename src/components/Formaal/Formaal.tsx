import { setReplySed } from 'actions/svarpased'
import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { Option } from 'declarations/app'
import { FSed, ReplySed } from 'declarations/sed'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema/lib/feiloppsummering'
import { Feilmelding, Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, HighContrastKnapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

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
  const formaalOptions = [
    {label: t('elements:option-formaal-1'), value: 'mottak_av_søknad_om_familieytelser'},
    {label: t('elements:option-formaal-2'), value: 'informasjon_om_endrede_forhold'},
    {label: t('elements:option-formaal-3'), value: 'svar_på_kontroll_eller_årlig_kontroll'},
    {label: t('elements:option-formaal-4'), value: 'svar_på_anmodning_om_informasjon'},
    {label: t('elements:option-formaal-5'), value: 'vedtak'},
    {label: t('elements:option-formaal-6'), value: 'motregning'},
    {label: t('elements:option-formaal-7'), value: 'prosedyre_ved_uenighet'},
    {label: t('elements:option-formaal-8'), value: 'refusjon_i_henhold_til_artikkel_58_i_forordningen'}
  ]
  const [_formaals, setFormaals] = useState<Array<string>>((replySed as FSed)?.formaal || [])
  const [_addFormaal, setAddFormaal] = useState<boolean>(false)
  const [_newFormaal, setNewFormaal] = useState<Option | undefined>(undefined)
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
  const onRemoveFormaal = (f: any) => {
    const newFormaals = _.filter(_formaals, _f => _f !== f)
    saveFormaalChange(newFormaals)
  }

  const onAddFormaal = () => {
    if (_newFormaal) {
      const newFormaals = _formaals.concat(_newFormaal.value)
      saveFormaalChange(newFormaals)
      setNewFormaal(undefined)
    }
  }

  const addCandidateForDeletion = (p: string) => {
     setConfirmDeleteFormaal(_confirmDeleteFormaal.concat(p))
  }

  const removeCandidateForDeletion = (p: string) => {
    setConfirmDeleteFormaal(_.filter(_confirmDeleteFormaal, _p => _p !== p))
  }

  const onFormaalChanged = (o: Option) => {
    setNewFormaal(o)
  }

  if (!_hasFormaal) {
    return <div/>
  }

  return (
    <>
      <Undertittel>
        {t('ui:title-chooseFormaal')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_formaals && _formaals.map((p: string) => {
        const candidateForDeletion = _confirmDeleteFormaal.indexOf(p) >= 0
        return (
          <FlexDiv className='slideInFromLeft' key={p}>
            <Normaltekst>
              {_.find(formaalOptions, _p => _p.value === p)?.label}
            </Normaltekst>
            {candidateForDeletion ? (
              <FlexDiv>
                <Normaltekst>
                  {t('label:areYouSure')}
                </Normaltekst>
                <HorizontalSeparatorDiv data-size='0.5'/>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => onRemoveFormaal(p)}
                >
                  {t('label:yes')}
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv data-size='0.5'/>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => removeCandidateForDeletion(p)}
                >
                  {t('label:no')}
                </HighContrastFlatknapp>
              </FlexDiv>
              ) :
              (
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => addCandidateForDeletion(p)}
                >
                  <Trashcan/>
                  <HorizontalSeparatorDiv data-size='0.5'/>
                  {t('label:remove')}
                </HighContrastFlatknapp>
              )
            }
          </FlexDiv>
        )
      })}
      <VerticalSeparatorDiv />
      {!_addFormaal
        ? (
          <>
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setAddFormaal(!_addFormaal)}
            >
              <Add />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('label:add-new-formaal')}
            </HighContrastFlatknapp>
          </>
          )
        : (
          <FlexDiv>
            <div style={{ flex: 2 }}>
              <Select
                data-test-id='c-formaal-select'
                id='c-formaal-select'
                highContrast={highContrast}
                value={_newFormaal}
                onChange={onFormaalChanged}
                options={_formaalValues}
              />
            </div>
            <HorizontalSeparatorDiv data-size='0.5' />
            <FlexDiv>
              <HighContrastKnapp
                mini
                kompakt
                onClick={onAddFormaal}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('label:add')}
              </HighContrastKnapp>
              <HorizontalSeparatorDiv data-size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setAddFormaal(!_addFormaal)}
              >
                {t('label:cancel')}
              </HighContrastFlatknapp>
            </FlexDiv>
          </FlexDiv>
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
