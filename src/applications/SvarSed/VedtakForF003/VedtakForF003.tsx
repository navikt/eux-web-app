import { PlusCircleIcon } from '@navikt/aksel-icons';
import {BodyLong, Box, Button, Checkbox, Heading, HStack, Label, Radio, RadioGroup, Spacer, VStack} from '@navikt/ds-react'
import { resetAdresse } from 'actions/adresse'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import {
  validateVedtak,
  validateVedtakPeriode,
  ValidationVedtakPeriodeProps,
  ValidationVedtakProps
} from 'applications/SvarSed/VedtakForF003/validation'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import PeriodeInput from 'components/Forms/PeriodeInput'
import PeriodeText from 'components/Forms/PeriodeText'
import TextArea from 'components/Forms/TextArea'
import {RepeatableBox} from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import {F003Sed, JaNei, Periode, VedtakBarn, VedtakF003} from 'declarations/sed'
import { Validation } from 'declarations/types'
import useLocalValidation from 'hooks/useLocalValidation'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import moment from 'moment'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getIdx } from 'utils/namespace'
import performValidation from 'utils/performValidation'
import { periodeSort } from 'utils/sort'
import { hasNamespaceWithErrors } from 'utils/validation'
import BeløpNavnOgValuta from "../BeløpNavnOgValuta/BeløpNavnOgValuta";
import {setReplySed} from "../../../actions/svarsed";
import ErrorLabel from "../../../components/Forms/ErrorLabel";
import styles from "./VedtakForF003.module.css";
import commonStyles from "../../../assets/css/common.module.css";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const VedtakForF003: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  personName
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}-vedtak`
  const target = 'vedtak'
  const vedtak: VedtakF003 | undefined = _.get(replySed, target) as VedtakF003
  const getVedtakPeriodeId = (p: Periode | null): string => p ? p.startdato + '-' + (p.sluttdato ?? p.aapenPeriodeType) : 'new-peridoe'

  const [_newVedtakPeriode, _setNewVedtakPeriode] = useState<Periode | undefined>(undefined)
  const [_editVedtakPeriode, _setEditVedtakPeriode] = useState<Periode | undefined>(undefined)

  const [_newVedtakPeriodeForm, _setNewVedtakPeriodeForm] = useState<boolean>(false)
  const [_editVedtakPeriodeIndex, _setEditVedtakPeriodeIndex] = useState<number | undefined>(undefined)
  const [_validationVedtakPeriode, _resetValidationVedtakPeriode, _performValidationVedtakPeriode] = useLocalValidation<ValidationVedtakPeriodeProps>(validateVedtakPeriode, namespace)

  const [_utvidetBarneTrygd, _setUtvidetBarneTrygd] = useState<string>("")

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationVedtakProps>(
      clonedValidation, namespace, validateVedtak, {
        vedtak: _.cloneDeep(vedtak),
        formalName: personName
      }
    )
    dispatch(setValidation(clonedValidation))
    dispatch(resetAdresse())
  })

  useEffect(() => {
    if(vedtak?.gjelderAlleBarn === "nei")  {
      const familieYtelserUtvidetBarnetrygd = (replySed as F003Sed)?.familie?.ytelser?.filter((y) => {
        return y.ytelseNavn === "Utvidet barnetrygd"
      })
      dispatch(updateReplySed("familie.ytelser", familieYtelserUtvidetBarnetrygd))
      if(familieYtelserUtvidetBarnetrygd && familieYtelserUtvidetBarnetrygd.length > 0){
        _setUtvidetBarneTrygd("ja")
      }
    }

    if(vedtak?.gjelderAlleBarn === "ja") {
      dispatch(updateReplySed("vedtak.barnVedtaketOmfatter", []));
      (replySed as F003Sed)?.barn?.forEach((b, barnIndex) => {
        dispatch(updateReplySed("barn[" + barnIndex + "].ytelser", undefined))
      });
    }
}, [])

  const setUtvidetBarnetrygd = (hasUtvidetBarneTrygd: JaNei) => {
    _setUtvidetBarneTrygd(hasUtvidetBarneTrygd)
    if(hasUtvidetBarneTrygd === "nei"){
      dispatch(updateReplySed("familie.ytelser", []))
    }
  }

  const setGjelderAlleBarn = (newGjelderAlleBarn: JaNei) => {
    let newVedtak: VedtakF003 | undefined = _.cloneDeep(vedtak)
    if (_.isUndefined(newVedtak) || _.isNull(newVedtak)) {
      newVedtak = {} as VedtakF003
    }
    _.set(newVedtak, 'gjelderAlleBarn', newGjelderAlleBarn.trim())
    if (newGjelderAlleBarn.trim() === 'ja') {
      _.set(newVedtak, 'barnVedtaketOmfatter', []);
      (replySed as F003Sed)?.barn?.forEach((b, barnIndex) => {
        dispatch(updateReplySed("barn[" + barnIndex + "].ytelser", undefined))
      })
      _setUtvidetBarneTrygd("")
    }

    if (newGjelderAlleBarn.trim() === 'nei') {
      const familieYtelserUtvidetBarnetrygd = (replySed as F003Sed)?.familie?.ytelser?.filter((y) => {
        return y.ytelseNavn === "Utvidet barnetrygd"
      })
      dispatch(updateReplySed("familie.ytelser", familieYtelserUtvidetBarnetrygd))
      if(familieYtelserUtvidetBarnetrygd && familieYtelserUtvidetBarnetrygd.length > 0){
        _setUtvidetBarneTrygd("ja")
      }
    }

    dispatch(updateReplySed(target, newVedtak))
    if (validation[namespace + '-gjelderAlleBarn']) {
      dispatch(resetValidation([namespace + '-gjelderAlleBarn', namespace + '-barnVedtaketOmfatter']))
    }
  }

  const setBegrunnelse = (newBegrunnelse: string) => {
    dispatch(updateReplySed(`${target}.begrunnelse`, newBegrunnelse.trim()))
    if (validation[namespace + '-begrunnelse']) {
      dispatch(resetValidation(namespace + '-begrunnelse'))
    }
  }

  const setYtterligeInfo = (newInfo: string) => {
    dispatch(updateReplySed(`${target}.ytterligereInfo`, newInfo.trim()))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  const setKompetanse = (newKompetanse: string) => {
    dispatch(updateReplySed(`${target}.kompetanse`, newKompetanse.trim()))
    if (validation[namespace + '-kompetanse']) {
      dispatch(resetValidation(namespace + '-kompetanse'))
    }
  }

  const onCheckBarn = (vedtakBarn: VedtakBarn, barnIndex: number, checked: boolean) => {
    let newBarnVedtaketOmfatter: Array<VedtakBarn> | undefined = _.cloneDeep(vedtak?.barnVedtaketOmfatter)
    if (_.isNil(newBarnVedtaketOmfatter)) {
      newBarnVedtaketOmfatter = []
    }
    if (checked) {
      newBarnVedtaketOmfatter.push(vedtakBarn)
      newBarnVedtaketOmfatter = newBarnVedtaketOmfatter.sort((a: VedtakBarn, b: VedtakBarn) =>
        moment(a.foedselsdato).isSameOrBefore(moment(b.foedselsdato)) ? -1 : 1
      )
    } else {
      newBarnVedtaketOmfatter = _.reject(newBarnVedtaketOmfatter, vb => _.isEqual(vb, vedtakBarn))
      dispatch(updateReplySed("barn[" + barnIndex + "].ytelser", undefined))
    }
    dispatch(updateReplySed(`${target}.barnVedtaketOmfatter`, newBarnVedtaketOmfatter))
    if (validation[namespace + '-barnVedtaketOmfatter']) {
      dispatch(resetValidation(namespace + '-barnVedtaketOmfatter'))
    }
  }

  const setVedtakPeriode = (periode: Periode, index: number) => {
    if (index < 0) {
      _setNewVedtakPeriode(periode)
      _resetValidationVedtakPeriode(namespace + '-vedtaksperioder')
      return
    }
    _setEditVedtakPeriode(periode)
    dispatch(resetValidation(namespace + '-vedtaksperioder' + getIdx(index)))
  }


  const onCloseVedtakPeriodeEdit = (namespace: string) => {
    _setEditVedtakPeriode(undefined)
    _setEditVedtakPeriodeIndex(undefined)
    dispatch(resetValidation(namespace))
  }


  const onCloseVedtakPeriodeNew = () => {
    _setNewVedtakPeriode(undefined)
    _setNewVedtakPeriodeForm(false)
    _resetValidationVedtakPeriode()
  }

  const onStartVedtakPeriodeEdit = (periode: Periode, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editVedtakPeriodeIndex !== undefined) {
      dispatch(resetValidation(namespace + '-vedtaksperioder' + getIdx(_editVedtakPeriodeIndex)))
    }
    _setEditVedtakPeriode(periode)
    _setEditVedtakPeriodeIndex(index)
  }

  const onSaveVedtakPeriodeEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationVedtakPeriodeProps>(
      clonedValidation, namespace, validateVedtakPeriode, {
        periode: _editVedtakPeriode,
        perioder: vedtak?.vedtaksperioder,
        index: _editVedtakPeriodeIndex,
        formalName: personName
      })
    if (!hasErrors) {
      dispatch(updateReplySed(`${target}.vedtaksperioder[${_editVedtakPeriodeIndex}]`, _editVedtakPeriode))
      onCloseVedtakPeriodeEdit(namespace + '-vedtaksperioder' + getIdx(_editVedtakPeriodeIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemoveVedtakPeriode = (removed: Periode) => {
    const newPerioder: Array<Periode> = _.reject(vedtak?.vedtaksperioder, (p: Periode) => _.isEqual(removed, p))
    dispatch(updateReplySed(`${target}.vedtaksperioder`, newPerioder))
  }

  const onAddVedtakPeriodeNew = () => {
    const valid: boolean = _performValidationVedtakPeriode({
      periode: _newVedtakPeriode,
      perioder: vedtak?.vedtaksperioder,
      formalName: personName
    })

    if (!!_newVedtakPeriode && valid) {
      let newPerioder: Array<Periode> | undefined = _.cloneDeep(vedtak?.vedtaksperioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder.push(_newVedtakPeriode)
      newPerioder = newPerioder.sort(periodeSort)
      dispatch(updateReplySed(`${target}.vedtaksperioder`, newPerioder))
      onCloseVedtakPeriodeNew()
    }
  }

  const addVedtakPeriode = () => {
    dispatch(resetValidation(namespace + '-vedtaksperioder'))
    _setNewVedtakPeriodeForm(true)
  }

  const renderVedtakPeriodeRow = (periode: Periode | null, index: number) => {
    const _namespace = namespace + '-vedtaksperioder' + getIdx(index)
    const _v: Validation = index < 0 ? _validationVedtakPeriode : validation
    const inEditMode = index < 0 || _editVedtakPeriodeIndex === index
    const _periode = index < 0 ? _newVedtakPeriode : (inEditMode ? _editVedtakPeriode : periode)
    return (
      <RepeatableBox
        padding="4"
        id={'repeatablerow-' + _namespace}
        key={getVedtakPeriodeId(periode)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <HStack gap="4">
          {inEditMode
            ? (
                <PeriodeInput
                  namespace={_namespace}
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  breakInTwo
                  hideLabel={index >= 0}
                  setPeriode={(p: Periode) => setVedtakPeriode(p, index)}
                  value={_periode}
                />
              )
            : (
                <PeriodeText
                  error={{
                    startdato: _v[_namespace + '-startdato']?.feilmelding,
                    sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                  }}
                  namespace={_namespace}
                  periode={_periode}
                />
              )
          }
          <Spacer/>
          <AddRemovePanel<Periode>
            item={periode}
            marginTop={index < 0}
            index={index}
            inEditMode={inEditMode}
            onRemove={onRemoveVedtakPeriode}
            onAddNew={onAddVedtakPeriodeNew}
            onCancelNew={onCloseVedtakPeriodeNew}
            onStartEdit={onStartVedtakPeriodeEdit}
            onConfirmEdit={onSaveVedtakPeriodeEdit}
            onCancelEdit={() => onCloseVedtakPeriodeEdit(_namespace)}
          />
        </HStack>
      </RepeatableBox>
    )
  }

  return (
    <>
      <Box padding="4">
        <VStack gap="4">
          <Heading size='small'>
            {label}
          </Heading>
          <HStack>
            <RadioGroup
              value={vedtak?.gjelderAlleBarn}
              data-no-border
              data-testid={namespace + '-gjelderAlleBarn'}
              error={validation[namespace + '-gjelderAlleBarn']?.feilmelding}
              id={namespace + '-gjelderAlleBarn'}
              legend={t('label:vedtak-angående-alle-barn') + ' *'}
              name={namespace + '-gjelderAlleBarn'}
              onChange={(e: string) => setGjelderAlleBarn(e as JaNei)}
            >
              <HStack gap="4">
                <Radio className={commonStyles.radioPanel} value='ja'>{t('label:ja')}</Radio>
                <Radio className={commonStyles.radioPanel} value='nei'>{t('label:nei')}</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
          <Label>
            {t('label:vedtaksperioder')}
          </Label>
          <Box
            borderWidth="1"
            padding="4"
            background="surface-subtle"
            id={namespace + '-vedtaksperioder'}
            className={classNames({
              [styles.error]: hasNamespaceWithErrors(validation, namespace + "-vedtaksperioder")
            })}
          >
            {_.isEmpty(vedtak?.vedtaksperioder)
              ? (
                <Box padding="4">
                  <BodyLong>
                    {t('message:warning-no-periods')}
                  </BodyLong>
                </Box>
              )
              : vedtak?.vedtaksperioder?.map(renderVedtakPeriodeRow)}
            {_newVedtakPeriodeForm
              ? renderVedtakPeriodeRow(null, -1)
              : (
                <Button
                  variant='tertiary'
                  onClick={addVedtakPeriode}
                  icon={<PlusCircleIcon/>}
                >
                  {t('el:button-add-new-x', { x: t('label:vedtaksperiode').toLowerCase() })}
                </Button>
              )}
          </Box>
          {validation[namespace + '-vedtaksperioder']?.feilmelding &&
            <ErrorLabel error={validation[namespace + '-vedtaksperioder']?.feilmelding}/>
          }
          {vedtak?.gjelderAlleBarn === 'nei' && (
            <VStack gap="4">
              <span>{t('label:avhuk-de-barn-vedtaket') + ':' } </span>
              <VStack gap="4">
                {(replySed as F003Sed)?.barn?.map((b, index) => {
                  const vedtakBarn: VedtakBarn = {
                    fornavn: b.personInfo?.fornavn,
                    etternavn: b.personInfo?.etternavn,
                    foedselsdato: b.personInfo?.foedselsdato
                  }
                  const checked: boolean = _.find(vedtak?.barnVedtaketOmfatter, vb => _.isEqual(vb, vedtakBarn)) !== undefined
                  return (
                      <Box
                        borderWidth="1"
                        padding="4"
                        background="surface-subtle"
                        key={`${vedtakBarn.fornavn}-${vedtakBarn.etternavn}-${vedtakBarn.foedselsdato}`}
                        className={classNames({
                          [styles.error]: hasNamespaceWithErrors(validation, namespace + "-barnVedtaketOmfatter")
                        })}
                      >
                        <Checkbox
                          checked={checked}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckBarn(vedtakBarn, index, e.target.checked)}
                        >
                          {vedtakBarn.fornavn + ' ' + (vedtakBarn.etternavn ?? '') + ' (' + vedtakBarn.foedselsdato + ')'}
                        </Checkbox>
                        {checked &&
                          <BeløpNavnOgValuta
                            replySed={replySed}
                            parentNamespace="vedtak"
                            setReplySed={setReplySed}
                            updateReplySed={updateReplySed}
                            personID={"barn[" + index + "]"}
                            options={{showHeading: false}}
                          />
                        }
                      </Box>
                  )
                })}
              </VStack>
              {validation[namespace + '-barnVedtaketOmfatter']?.feilmelding &&
                <ErrorLabel error={validation[namespace + '-barnVedtaketOmfatter']?.feilmelding}/>
              }
            </VStack>
          )}
          {vedtak?.gjelderAlleBarn === 'nei' &&
            <HStack>
              <RadioGroup
                value={_utvidetBarneTrygd}
                data-no-border
                data-testid={namespace + '-utvidet-barnetrygd'}
                error={validation[namespace + '-utvidet-barnetrygd']?.feilmelding}
                id={namespace + '-utvidet-barnetrygd'}
                legend={t('label:utbetales-det-utvidet-barnetrygd')}
                name={namespace + '-utvidet-barnetrygd'}
                onChange={setUtvidetBarnetrygd}
              >
                <HStack gap="4">
                  <Radio className={commonStyles.radioPanel} value='ja'>{t('label:ja')}</Radio>
                  <Radio className={commonStyles.radioPanel}value='nei'>{t('label:nei')}</Radio>
                </HStack>
              </RadioGroup>
            </HStack>
          }
          {_utvidetBarneTrygd === "ja" && vedtak?.gjelderAlleBarn === 'nei' &&
            <Box borderWidth="1" padding="4" background="surface-subtle">
              <BeløpNavnOgValuta
                replySed={replySed}
                parentNamespace="vedtak"
                setReplySed={setReplySed}
                updateReplySed={updateReplySed}
                personID="familie"
                options={{showHeading: false, utvidetBarneTrygd: true}}
              />
            </Box>
          }
          {vedtak?.gjelderAlleBarn === 'ja' &&
            <Box borderWidth="1" padding="4" background="surface-subtle">
              <BeløpNavnOgValuta
                replySed={replySed}
                parentNamespace="vedtak"
                setReplySed={setReplySed}
                updateReplySed={updateReplySed}
                personID="familie"
                options={{showHeading: false}}
              />
            </Box>
          }
          <TextArea
            error={validation[namespace + '-begrunnelse']?.feilmelding}
            namespace={namespace}
            id='begrunnelse'
            label={t('label:begrunnelse')}
            onChanged={setBegrunnelse}
            value={vedtak?.begrunnelse}
          />
          <TextArea
            error={validation[namespace + '-kompetanse']?.feilmelding}
            namespace={namespace}
            id='kompetanse'
            label={t('label:vedtak-om-kompetanse-angaaende-prioritet')}
            onChanged={setKompetanse}
            value={vedtak?.kompetanse}
          />
          <TextArea
            error={validation[namespace + '-ytterligereInfo']?.feilmelding}
            namespace={namespace}
            id='ytterligereInfo'
            label={t('label:ytterligere-informasjon-til-sed')}
            onChanged={setYtterligeInfo}
            value={vedtak?.ytterligereInfo}
          />
        </VStack>
      </Box>
    </>
  )
}

export default VedtakForF003
