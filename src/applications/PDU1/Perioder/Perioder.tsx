import { AddCircle, Employer, Law, Money, Office1, PensionBag } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox, Heading, Ingress } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import {
  PDU1,
  PDPeriode
} from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import {
  AlignStartRow,
  Column,
  FlexDiv,
  FlexEndDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  Row,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getNSIdx } from 'utils/namespace'
import { validatePDPeriode, ValidationPDPeriodeProps } from './validation'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

type Sort = 'time' | 'group'

const Perioder: React.FC<TwoLevelFormProps> = ({
  options,
  parentNamespace,
  replySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: TwoLevelFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-perioder`

  const getId = ({ p, i }: {p: PDPeriode | null, i: number | undefined}): string =>
    p ? (p.__type + '-' + p?.startdato ?? '') + '[' + i + ']-' + (p?.sluttdato ?? p.aapenPeriodeType) : 'new-forsikring'

  const [_newType, _setNewType] = useState<string | undefined>(undefined)
  const [_allPeriods, _setAllPeriods] = useState<Array<PDPeriode>>([])
  const [_newPeriode, _setNewPeriode] = useState<PDPeriode | undefined>(undefined)

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<{p: PDPeriode, i: number}>(getId)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_sort, _setSort] = useState<Sort>('group')
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationPDPeriodeProps>({}, validatePDPeriode)

  const periodeOptions: Options = [
    { label: t('el:option-perioder-perioderAnsattMedForsikring'), value: 'perioderAnsattMedForsikring' },
    { label: t('el:option-perioder-perioderSelvstendigMedForsikring'), value: 'perioderSelvstendigMedForsikring' },
    { label: t('el:option-perioder-perioderAndreForsikringer'), value: 'perioderAndreForsikringer' },
    { label: t('el:option-perioder-perioderAnsettSomForsikret'), value: 'perioderAnsettSomForsikret' },
    { label: t('el:option-perioder-perioderAnsattUtenForsikring'), value: 'perioderAnsattUtenForsikring' },
    { label: t('el:option-perioder-perioderSelvstendigUtenForsikring'), value: 'perioderSelvstendigUtenForsikring' },
    { label: t('el:option-perioder-perioderLoennSomAnsatt'), value: 'perioderLoennSomAnsatt' },
    { label: t('el:option-perioder-perioderInntektSomSelvstendig'), value: 'perioderInntektSomSelvstendig' }
  ].filter(it => options && options.include ? options.include.indexOf(it.value) >= 0 : true)

  const periodeSort = (a: PDPeriode, b: PDPeriode) => moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1

  useEffect(() => {
    const periodes: Array<PDPeriode> = [];
    (replySed as PDU1)?.perioderAnsattMedForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnsattMedForsikring' }));
    (replySed as PDU1)?.perioderSelvstendigMedForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSelvstendigMedForsikring' }));
    (replySed as PDU1)?.perioderAndreForsikringer?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAndreForsikringer' }));
    (replySed as PDU1)?.perioderAnsettSomForsikret?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnsettSomForsikret' }));
    (replySed as PDU1)?.perioderAnsattUtenForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderAnsattUtenForsikring' }));
    (replySed as PDU1)?.perioderSelvstendigUtenForsikring?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderSelvstendigUtenForsikring' }));
    (replySed as PDU1)?.perioderLoennSomAnsatt?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderLoennSomAnsatt' }));
    (replySed as PDU1)?.perioderInntektSomSelvstendig?.forEach((p, i) => periodes.push({ ...p, __index: i, __type: 'perioderInntektSomSelvstendig' }))
    _setAllPeriods(periodes.sort(periodeSort))
  }, [replySed])

  const setType = (type: string) => {
    _setNewType(type)
    _resetValidation(namespace + '-type')
  }

  const setPeriodeComment = (newComment: string, type: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        info: newComment.trim()
      } as PDPeriode)
      _resetValidation(namespace + '-comment')
    } else {
      dispatch(updateReplySed(`${type}[${index}].info`, newComment.trim()))
      if (validation[namespace + getNSIdx(type, index) + '-comment']) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-comment'))
      }
    }
  }

  const setPeriodeStartdato = (newStartdato: string, type: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        startdato: newStartdato.trim()
      } as PDPeriode)
      _resetValidation(namespace + '-startdato')
    } else {
      dispatch(updateReplySed(`${type}[${index}].startdato`, newStartdato.trim()))
      if (validation[namespace + getNSIdx(type, index) + '-startdato']) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-startdato'))
      }
    }
  }

  const setPeriodeSluttdato = (newSluttdato: string, type: string, index: number) => {
    if (index < 0) {
      _setNewPeriode({
        ..._newPeriode,
        sluttdato: newSluttdato.trim()
      } as PDPeriode)
      _resetValidation(namespace + '-sluttdato')
    } else {
      dispatch(updateReplySed(`${type}[${index}].sluttdato`, newSluttdato.trim()))
      if (validation[namespace + getNSIdx(type, index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + getNSIdx(type, index) + '-sluttdato'))
      }
    }
  }

  const resetForm = () => {
    _setNewPeriode(undefined)
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (periode: PDPeriode, index: number) => {
    removeFromDeletion({ p: periode, i: index })
    const newPeriodes: Array<PDPeriode> = _.get(replySed, periode.__type!) as Array<PDPeriode>
    newPeriodes.splice(periode.__index!, 1)
    dispatch(updateReplySed(periode.__type!, newPeriodes))
    standardLogger('pdu1.editor.periode.remove', { type: periode.__type! })
  }

  const onAdd = () => {
    let newPeriodes: Array<PDPeriode> | undefined = _.get(replySed, _newType!)
    if (_.isNil(newPeriodes)) {
      newPeriodes = []
    }
    const valid: boolean = _performValidation({
      periode: _newPeriode as PDPeriode,
      type: _newType,
      namespace
    })
    if (valid && _newType) {
      newPeriodes = newPeriodes.concat(_newPeriode!)
      dispatch(updateReplySed(_newType, newPeriodes))
      standardLogger('pdu1.editor.periode.add', { type: _newType })
      onCancel()
    }
  }

  const getIcon = (type: string, size: string = '32') => (
    <>
      {type === 'perioderAnsattMedForsikring' && (<FlexDiv><PensionBag width={size} height={size} /><Office1 width={size} height={size} /></FlexDiv>)}
      {type === 'perioderSelvstendigMedForsikring' && (<FlexDiv><PensionBag width={size} height={size} /><Employer width={size} height={size} /></FlexDiv>)}
      {type === 'perioderAndreForsikringer' && (<PensionBag width={size} height={size} />)}
      {type === 'perioderAnsettSomForsikret' && (<FlexDiv><PensionBag width={size} height={size} /><Law width={size} height={size} /></FlexDiv>)}
      {type === 'perioderAnsattUtenForsikring' && (<Office1 width={size} height={size} />)}
      {type === 'perioderSelvstendigUtenForsikring' && (<Employer width={size} height={size} />)}
      {type === 'perioderLoennSomAnsatt' && (<FlexDiv><Money width={size} height={size} /><Office1 width={size} height={size} /></FlexDiv>)}
      {type === 'perioderInntektSomSelvstendig' && (<FlexDiv><Money width={size} height={size} /><Employer width={size} height={size} /></FlexDiv>)}
    </>
  )

  const renderRow = (periode: PDPeriode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion({ p: periode!, i: index })
    const _type: string = index < 0 ? _newType! : periode!.__type!
    const _index: number = index < 0 ? index : periode!.__index! // replace index order from map (which is "ruined" by a sort) with real replySed index
    // namespace for index < 0: TwoLevelForm-bruker-forsikring-arbeidsgiver-adresse-gate
    // namespace for index >= 0: TwoLevelForm-bruker-forsikring[perioderSyk][2]-arbeidsgiver-adresse-gate
    const idx = getNSIdx(_type, _index)

    const _v: Validation = index < 0 ? _validation : validation
    // __index is the periode's index order in the replysed; index is the order with sort, thus does not tell the real position in the replysed list
    const _periode: PDPeriode = (index < 0 ? _newPeriode : periode) ?? {} as PDPeriode

    return (
      <RepeatableRow
        className={classNames({ new: index < 0 })}
        key={getId({ p: periode, i: index })}
      >
        {index < 0 && (
          <>
            <AlignStartRow>
              <Column>
                <Select
                  closeMenuOnSelect
                  data-testid={namespace + idx + '-type'}
                  error={_v[namespace + idx + '-type']?.feilmelding}
                  id={namespace + idx + '-type'}
                  key={namespace + idx + '-type-' + _newType}
                  label={t('label:type')}
                  menuPortalTarget={document.body}
                  onChange={(type: any) => setType(type.value)}
                  options={periodeOptions}
                  value={_.find(periodeOptions, o => o.value === _newType)}
                  defaultValue={_.find(periodeOptions, o => o.value === _newType)}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
          </>
        )}
        {_type && (
          <AlignStartRow>
            {index >= 0 && _sort === 'time' && (
              <Column style={{ maxWidth: '40px' }}>
                <div title={_.find(periodeOptions, o => o.value === _type)?.label ?? ''}>
                  {getIcon(_type, '32')}
                </div>
              </Column>
            )}
            <Column>
              <Input
                ariaLabel={t('label:startdato')}
                error={_v[namespace + '-startdato']?.feilmelding}
                id='startdato'
                key={namespace + '-startdato-' + _periode?.startdato}
                hideLabel={index >= 0}
                label={t('label:startdato')}
                namespace={namespace}
                onChanged={(e: string) => setPeriodeStartdato(e, _type, index)}
                value={_periode.startdato}
              />
            </Column>
            <Column>
              <Input
                ariaLabel={t('label:sluttdato')}
                error={_v[namespace + '-sluttdato']?.feilmelding}
                id='sluttdato'
                key={namespace + '-sluttdato-' + _periode?.sluttdato}
                hideLabel={index >= 0}
                label={t('label:sluttdato')}
                namespace={namespace}
                onChanged={(e: string) => setPeriodeSluttdato(e, _type, index)}
                value={_periode.sluttdato}
              />
            </Column>
            {index >= 0
              ? (
                <Column>
                  <FlexEndDiv style={{ justifyContent: 'end' }}>
                    <AddRemovePanel
                      candidateForDeletion={candidateForDeletion}
                      existingItem={(index >= 0)}
                      onBeginRemove={() => addToDeletion({ p: periode!, i: index })}
                      onConfirmRemove={() => onRemove(periode!, index)}
                      onCancelRemove={() => removeFromDeletion({ p: periode!, i: index })}
                      onAddNew={onAdd}
                      onCancelNew={onCancel}
                    />
                  </FlexEndDiv>
                </Column>
                )
              : <Column />}
          </AlignStartRow>
        )}
        <VerticalSeparatorDiv />
        <AlignStartRow>
          {index >= 0 && _sort === 'time' && (<Column style={{ maxWidth: '40px' }} />)}
          <Column>
            <Input
              error={_v[namespace + idx + '-comment']?.feilmelding}
              namespace={namespace + idx}
              id='type'
              key={namespace + idx + '-comment-' + ((_periode as PDPeriode)?.info ?? '')}
              label={_type === 'perioderAndreForsikringer'
                ? t('label:type')
                : _type === 'perioderAnsettSomForsikret'
                  ? t('label:begrunnelse')
                  : ['perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(_type) >= 0
                      ? t('label:aktivitetstype')
                      : _type === 'perioderLoennSomAnsatt'
                        ? t('label:loenn')
                        : _type === 'perioderInntektSomSelvstendig'
                          ? t('label:inntekt')
                          : t('label:comment')}
              onChanged={(newComment: string) => setPeriodeComment(newComment, _type, _index)}
              value={(_periode as PDPeriode)?.info ?? ''}
            />
          </Column>
        </AlignStartRow>
        {index < 0 && (
          <FlexEndDiv style={{ justifyContent: 'end' }}>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion({ p: periode!, i: index })}
              onConfirmRemove={() => onRemove(periode!, index)}
              onCancelRemove={() => removeFromDeletion({ p: periode!, i: index })}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </FlexEndDiv>
        )}
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
  }

  return (
    <div key={namespace + '-div'}>
      <PaddedDiv>
        <Heading size='medium'>
          {t('label:perioder')}
        </Heading>
        <VerticalSeparatorDiv size='2' />
        {!_.isEmpty(_allPeriods) && (
          <>
            <Checkbox
              checked={_sort === 'group'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setSort(e.target.checked ? 'group' : 'time')}
            >
              {t('label:group-by-type')}
            </Checkbox>
            <VerticalSeparatorDiv size='2' />
          </>
        )}
      </PaddedDiv>
      {_.isEmpty(_allPeriods)
        ? (
          <PaddedDiv>
            <BodyLong>
              {t('message:warning-no-periods')}
            </BodyLong>
          </PaddedDiv>
          )
        : _sort === 'time'
          ? (
            <>
              <PaddedHorizontallyDiv>
                <AlignStartRow>
                  <Column style={{ maxWidth: '40px' }} />
                  <Column>
                    <label className='navds-text-field__label navds-label'>
                      {t('label:startdato')}
                    </label>
                  </Column>
                  <Column>
                    <label className='navds-text-field__label navds-label'>
                      {t('label:sluttdato')}
                    </label>
                  </Column>
                  <Column flex='2' />
                </AlignStartRow>
              </PaddedHorizontallyDiv>
              <VerticalSeparatorDiv size='0.8' />
              {_allPeriods.map(renderRow)}
            </>
            )
          : (
            <>
              {periodeOptions.map(o => {
                const periods: Array<PDPeriode> | undefined = _.get(replySed, o.value) as Array<PDPeriode> | undefined
                if (_.isEmpty(periods)) {
                  return null
                }
                return (
                  <div key={o.value}>
                    <PaddedHorizontallyDiv>
                      <FlexEndDiv>
                        {getIcon(o.value, '24')}
                        <HorizontalSeparatorDiv size='0.35' />
                        <Ingress>
                          {o.label}
                        </Ingress>
                      </FlexEndDiv>
                    </PaddedHorizontallyDiv>
                    <VerticalSeparatorDiv />
                    {periods!.map((p, i) => ({ ...p, __type: o.value, __index: i })).sort(periodeSort).map(renderRow)}
                    <VerticalSeparatorDiv size='2' />
                  </div>
                )
              })}
            </>
            )}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Row>
              <Column>
                <Button
                  variant='tertiary'
                  onClick={() => _setSeeNewForm(true)}
                >
                  <AddCircle />
                  {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
                </Button>
              </Column>
            </Row>
          </PaddedDiv>
          )}
    </div>
  )
}

export default Perioder
