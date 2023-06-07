import { Cancel, Edit, SuccessStroke } from '@navikt/ds-icons'
import { BodyLong, Button, Label } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import { FlexBaseDiv, FlexDiv, HorizontalSeparatorDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { getFagsaker } from 'actions/svarsed'
import { resetValidation } from 'actions/validation'
import Select from 'components/Forms/Select'
import { Options } from 'declarations/app'
import { Option } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { HSed, ReplySed } from 'declarations/sed'
import {Fagsaker, UpdateReplySedPayload, Validation, Fagsak} from 'declarations/types'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getFnr } from 'utils/fnr'
import classNames from 'classnames'

interface TemaProps {
  replySed: ReplySed | null | undefined
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

interface TemaSelector {
  validation: Validation
  gettingFagsaker: boolean
  fagsaker: Fagsaker | null | undefined
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
  }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace: string = 'editor-tema'
  const [_tema, _setTema] = useState<string | undefined>(() => (replySed as HSed).tema)
  const [_fagsak, _setFagsak] = useState<string | undefined>(() => (replySed as HSed).fagsakId)
  const [editMode, setEditMode] = useState<boolean>(false)
  const fnr = getFnr(replySed, 'bruker')

  const [viewButton, setViewButton] = useState<boolean>(false)
  const onMouseEnter = () => setViewButton(true)
  const onMouseLeave = () => setViewButton(false)

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

  const setTema = (o: unknown) => {
    if (validation[namespace]) {
      dispatch(resetValidation(namespace))
    }
    _setTema((o as Option).value)
    if (fnr) {
      dispatch(getFagsaker(fnr, 'HZ', (o as Option).value))
    }
  }

  const setFagsak = (o: unknown): void => {
    if (validation[namespace + '-fagsak']) {
      dispatch(resetValidation(namespace + '-fagsak'))
    }
    _setFagsak((o as Option).value)
  }

  const onCancelChangesClicked = () => setEditMode(false)

  const onEditModeClicked = () => setEditMode(true)

  const fagsakIdOptions: Options = fagsaker?.map((f: Fagsak) => ({
    value: f.id,
    label: f.id
  })) ?? []

  useEffect(() => {
    if (fagsaker === undefined && !_.isNil(fnr) && !gettingFagsaker && !_.isEmpty(_tema)) {
      dispatch(getFagsaker(fnr, 'HZ', _tema!))
    }
  }, [fagsaker, gettingFagsaker, fnr, _tema])

  return (

    <FlexDiv onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <PileDiv>
        {!editMode
          ? (
            <FlexBaseDiv>
              <Label>{t('label:tema') + ': '}</Label>
              <HorizontalSeparatorDiv />
              <BodyLong>{_tema
                ? t('tema:' + (replySed as HSed).tema)
                : t('label:ukjent')}
              </BodyLong>
            </FlexBaseDiv>
            )
          : (
            <>
              <Select
                defaultValue={_.find(temaOptions, { value: _tema })}
                error={validation[namespace]?.feilmelding}
                id={namespace + '-select'}
                onChange={setTema}
                options={temaOptions}
                label={t('label:tema')}
                value={_.find(temaOptions, { value: _tema })}
                style={{ minWidth: '300px' }}
              />
              <VerticalSeparatorDiv size='0.5' />
            </>
            )}
        <VerticalSeparatorDiv size='0.5' />
        {!editMode
          ? (
            <FlexBaseDiv>
              <Label>{t('label:fagsak') + ': '}</Label>
              <HorizontalSeparatorDiv />
              <BodyLong>{_fagsak
                ? _.find(fagsakIdOptions, { value: _fagsak })?.label ?? _fagsak
                : t('label:ukjent')}
              </BodyLong>
            </FlexBaseDiv>
            )
          : (
            <>
              <Select
                defaultValue={_.find(fagsakIdOptions, { value: _fagsak })}
                error={validation[namespace + '-fagsak']?.feilmelding}
                id={namespace + '-fagsak-select'}
                onChange={setFagsak}
                isLoading={gettingFagsaker}
                isDisabled={gettingFagsaker}
                label={t('label:fagsak')}
                options={fagsakIdOptions}
                value={_.find(fagsakIdOptions, { value: _fagsak })}
                style={{ minWidth: '300px' }}
              />
              <VerticalSeparatorDiv size='0.5' />

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

        <VerticalSeparatorDiv size='0.5' />
      </PileDiv>
      <PileDiv style={{ paddingLeft: '1rem' }}>
        {editMode
          ? (
            <PileDiv className='nolabel'>
              <Button
                variant='primary'
                onClick={onSaveChangesClicked}
              >
                <SuccessStroke />
                {t('el:button-save')}
              </Button>
              <VerticalSeparatorDiv />
              <Button
                variant='secondary'
                onClick={onCancelChangesClicked}
              >
                <Cancel />
                {t('el:button-cancel')}
              </Button>
            </PileDiv>
            )
          : (
            <PileDiv style={{ minWidth: '120px' }}>
              <div className={classNames({ hide: !viewButton })}>
                <Button
                  variant='tertiary'
                  onClick={onEditModeClicked}
                >
                  <Edit />
                  {t('el:button-edit')}
                </Button>
              </div>
            </PileDiv>
            )}
      </PileDiv>
    </FlexDiv>
  )
}

export default Tema
