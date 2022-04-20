import { ActionWithPayload } from '@navikt/fetch'
import { getFagsaker } from 'actions/svarsed'
import { resetValidation } from 'actions/validation'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { HSed, ReplySed } from 'declarations/sed'
import { FagSak, FagSaker, UpdateReplySedPayload, Validation } from 'declarations/types'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Loader, Button } from '@navikt/ds-react'
import { Column, FlexBaseDiv, HorizontalSeparatorDiv, Row } from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Option } from 'declarations/app.d'
import { getFnr } from 'utils/fnr'
import { Edit } from '@navikt/ds-icons'

interface TemaProps {
  replySed: ReplySed | null | undefined
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

interface TemaSelector {
  validation: Validation
  gettingFagsaker: boolean
  fagsaker: FagSaker | null | undefined
}

const mapState = (state: State): TemaSelector => ({
  validation: state.validation.status,
  gettingFagsaker: state.loading.gettingFagsaker,
  fagsaker: state.svarsed.fagsaker
})

const Tema: React.FC<TemaProps> = ({ replySed, updateReplySed }: TemaProps) => {
  const { t } = useTranslation()
  const {
    validation,
    gettingFagsaker,
    fagsaker
  }: any = useSelector<State, TemaSelector>(mapState)
  const dispatch = useDispatch()
  const namespace: string = 'editor-tema'
  const [_tema, setTema] = useState<string | undefined>(() => (replySed as HSed).tema)
  const [_fagsak, setFagsak] = useState<string | undefined>(() => (replySed as HSed).fagsakId)
  const [editMode, setEditMode] = useState<boolean>(false)
  const fnr = getFnr(replySed, 'bruker')

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
    standardLogger('svarsed.editor.tema.add', { tema: _tema })
    setEditMode(false)
  }

  const onTemaChanged = (o: unknown) => {
    if (validation[namespace]) {
      dispatch(resetValidation(namespace))
    }
    setTema((o as Option).value)
    if (fnr) {
      dispatch(getFagsaker(fnr, 'HZ', (o as Option).value))
    }
  }

  const onSakIDChange = (o: unknown): void => {
    if (validation[namespace + '-fagsak']) {
      dispatch(resetValidation(namespace + '-fagsak'))
    }
    setFagsak((o as Option).value)
  }

  const onCancelChangesClicked = () => setEditMode(false)

  const onEditModeClicked = () => setEditMode(true)

  const fagsakIdOptions: Options = fagsaker?.map((f: FagSak) => ({
    value: f.saksID,
    label: f.saksID
  })) ?? []

  useEffect(() => {
    if (fagsaker === undefined && !_.isNil(fnr) && !gettingFagsaker && !_.isEmpty(_tema)) {
      dispatch(getFagsaker(fnr, 'HZ', _tema!))
    }
  }, [fagsaker, gettingFagsaker, fnr, _tema])

  return (

    <Row>
      <Column>
        <FlexBaseDiv id='editor-tema' className={namespace}>
          <label
            htmlFor={namespace}
            className='navds-text-field__label navds-label'
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
                error={validation[namespace]?.feilmelding}
                key={namespace + '-' + _tema + '-select'}
                id={namespace + '-select'}
                onChange={onTemaChanged}
                options={temaOptions}
                value={_.find(temaOptions, { value: _tema })}
                style={{ minWidth: '300px' }}
              />
              )}
          <HorizontalSeparatorDiv size='0.5' />
          <label
            htmlFor={namespace}
            className='navds-text-field__label navds-label'
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
                  ? <Loader />
                  : (
                    <Select
                      defaultValue={_.find(fagsakIdOptions, { value: _fagsak })}
                      error={validation[namespace + '-fagsak']?.feilmelding}
                      key={namespace + '-' + _fagsak + '-select'}
                      id={namespace + '-fagsak-select'}
                      onChange={onSakIDChange}
                      options={fagsakIdOptions}
                      value={_.find(fagsakIdOptions, { value: _fagsak })}
                      style={{ minWidth: '300px' }}
                    />
                    )}
              </>
              )}
          {editMode && (
            <>
              <HorizontalSeparatorDiv size='0.5' />
              <Button
                variant='tertiary'
                onClick={onSaveChangesClicked}
              >
                {t('el:button-save')}
              </Button>
              <HorizontalSeparatorDiv size='0.5' />
              <Button
                variant='tertiary'
                onClick={onCancelChangesClicked}
              >
                {t('el:button-cancel')}
              </Button>
            </>
          )}
          {!editMode && validation[namespace]?.feilmelding && (
            <>
              <HorizontalSeparatorDiv />
              <label className='navds-error-message navds-error-message--medium navds-label' style={{ marginTop: '0px' }}>
                {validation[namespace].feilmelding}
              </label>
            </>
          )}
          <HorizontalSeparatorDiv />
          {!editMode && (
            <Button
              variant='tertiary'
              onClick={onEditModeClicked}
            >
              <Edit />
              {t('el:button-edit')}
            </Button>
          )}
        </FlexBaseDiv>
      </Column>
    </Row>

  )
}

export default Tema
