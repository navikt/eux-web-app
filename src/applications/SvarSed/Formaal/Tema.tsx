import { getFagsaker, updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import Edit from 'assets/icons/Edit'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { HSed, ReplySed } from 'declarations/sed'
import { FagSak, FagSaker, Validation } from 'declarations/types'
import _ from 'lodash'
import NavFrontendSpinner from 'nav-frontend-spinner'
import { Column, FlexBaseDiv, HighContrastFlatknapp, HorizontalSeparatorDiv, Row } from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OptionTypeBase } from 'react-select'
import { getFnr } from 'utils/fnr'

interface TemaSelector {
  highContrast: boolean
  replySed: ReplySed | undefined
  validation: Validation
  gettingFagsaker: boolean
  fagsaker: FagSaker | null | undefined
}

const mapState = (state: State): TemaSelector => ({
  highContrast: state.ui.highContrast,
  replySed: state.svarpased.replySed,
  validation: state.validation.status,
  gettingFagsaker: state.loading.gettingFagsaker,
  fagsaker: state.svarpased.fagsaker
})

const Tema: React.FC = () => {
  const { t } = useTranslation()
  const {
    highContrast,
    replySed,
    validation,
    gettingFagsaker,
    fagsaker
  }: any = useSelector<State, TemaSelector>(mapState)
  const dispatch = useDispatch()
  const namespace: string = 'editor-tema'
  const [_tema, setTema] = useState<string | undefined>(() => (replySed as HSed).tema)
  const [_fagsak, setFagsak] = useState<string | undefined>(() => (replySed as HSed).fagsakId)
  const [editMode, setEditMode] = useState<boolean>(false)
  const fnr = getFnr(replySed)

  const temaOptions: Options = [
    { label: t('tema:GEN'), value: 'GEN' },
    { label: t('tema:AAP'), value: 'AAP' },
    { label: t('tema:BAR'), value: 'BAR' },
    { label: t('tema:DAG'), value: 'DAG' },
    { label: t('tema:FEI'), value: 'FEI' },
    { label: t('tema:FOR'), value: 'FOR' },
    { label: t('tema:GRA'), value: 'GRA' },
    { label: t('tema:KON'), value: 'KON' },
    { label: t('tema:MED'), value: 'MED' },
    { label: t('tema:OMS'), value: 'OMS' },
    { label: t('tema:PEN'), value: 'PEN' },
    { label: t('tema:SYK'), value: 'SYK' },
    { label: t('tema:YRK'), value: 'YRK' },
    { label: t('tema:UFO'), value: 'UFO' },
    { label: t('tema:GRU'), value: 'GRU' },
    { label: t('tema:KTR'), value: 'KTR' },
    { label: t('tema:TRY'), value: 'TRY' },
    { label: t('tema:SUP'), value: 'SUP' },
    { label: t('tema:UFM'), value: 'UFM' }
  ]

  const onSaveChangesClicked = () => {
    dispatch(updateReplySed('tema', _tema))
    dispatch(updateReplySed('fagsakId', _fagsak))
    setEditMode(false)
  }

  const onTemaChanged = (o: OptionTypeBase) => {
    if (validation[namespace]) {
      dispatch(resetValidation(namespace))
    }
    setTema(o.value)
    dispatch(getFagsaker(fnr, 'HZ', o.value))
  }

  const onSakIDChange = (o: OptionTypeBase): void => {
    if (validation[namespace + '-fagsak']) {
      dispatch(resetValidation(namespace + '-fagsak'))
    }
    setFagsak(o.value)
  }

  const onCancelChangesClicked = () => setEditMode(false)

  const onEditModeClicked = () => setEditMode(true)

  const fagsakIdOptions: Options = fagsaker?.map((f: FagSak) => ({
    value: f.saksID,
    label: f.saksID
  })) ?? []

  useEffect(() => {
    if (fagsaker === undefined && !gettingFagsaker && !_.isEmpty(_tema)) {
      dispatch(getFagsaker(fnr, 'HZ', _tema))
    }
  }, [fagsaker, gettingFagsaker, _tema])

  return (

    <Row>
      <Column>
        <FlexBaseDiv id='editor-tema' className={namespace}>
          <label
            htmlFor={namespace}
            className='skjemaelement__label'
            style={{ margin: '0px' }}
          >
            {t('label:tema')}:
          </label>
          <HorizontalSeparatorDiv size='0.35' />
          {!editMode
            ? _tema
                ? t('tema:' + (replySed as HSed).tema)
                : t('label:ukjent')
            : (
              <Select
                defaultValue={_.find(temaOptions, { value: _tema })}
                feil={validation[namespace]?.feilmelding}
                highContrast={highContrast}
                key={namespace + '-' + _tema + '-select'}
                id={namespace + '-select'}
                onChange={onTemaChanged}
                options={temaOptions}
                selectedValue={_.find(temaOptions, { value: _tema })}
                style={{ minWidth: '300px' }}
              />
              )}
          <HorizontalSeparatorDiv size='0.5' />
          <label
            htmlFor={namespace}
            className='skjemaelement__label'
            style={{ margin: '0px' }}
          >
            {t('label:fagsak')}:
          </label>
          <HorizontalSeparatorDiv size='0.35' />
          {!editMode
            ? _fagsak
                ? _.find(fagsakIdOptions, { value: _fagsak })?.label ?? _fagsak
                : t('label:ukjent')
            : (
              <>
                {gettingFagsaker
                  ? <NavFrontendSpinner />
                  : (
                    <Select
                      defaultValue={_.find(fagsakIdOptions, { value: _fagsak })}
                      feil={validation[namespace + '-fagsak']?.feilmelding}
                      highContrast={highContrast}
                      key={namespace + '-' + _fagsak + '-select'}
                      id={namespace + '-fagsak-select'}
                      onChange={onSakIDChange}
                      options={fagsakIdOptions}
                      selectedValue={_.find(fagsakIdOptions, { value: _fagsak })}
                      style={{ minWidth: '300px' }}
                    />
                    )}
              </>
              )}
          {editMode && (
            <>
              <HorizontalSeparatorDiv size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onSaveChangesClicked}
              >
                {t('el:button-save')}
              </HighContrastFlatknapp>
              <HorizontalSeparatorDiv size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onCancelChangesClicked}
              >
                {t('el:button-cancel')}
              </HighContrastFlatknapp>
            </>
          )}
          {!editMode && validation[namespace]?.feilmelding && (
            <>
              <HorizontalSeparatorDiv />
              <div className='skjemaelement__feilmelding' style={{ marginTop: '0px' }}>
                <p className='typo-feilmelding'>
                  {validation[namespace].feilmelding}
                </p>
              </div>
            </>
          )}
          <HorizontalSeparatorDiv />
          {!editMode && (
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={onEditModeClicked}
            >
              <Edit />
              <HorizontalSeparatorDiv size='0.5' />
              {t('el:button-edit')}
            </HighContrastFlatknapp>
          )}
        </FlexBaseDiv>
      </Column>
    </Row>

  )
}

export default Tema
