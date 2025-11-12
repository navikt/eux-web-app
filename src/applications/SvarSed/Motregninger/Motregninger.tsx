import React, {useState} from "react";
import {MainFormProps, MainFormSelector, mapState} from "../MainForm";
import {BodyLong, Box, Button, Checkbox, Heading, HGrid, HStack, Label, Radio, RadioGroup, Select, Spacer, Tabs, VStack} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../../store";
import _ from "lodash";
import {Barn, BarnYtelse, F001Sed, Motregning, Motregninger, ReplySed} from "../../../declarations/sed";
import {SpacedHr} from "../../../components/StyledComponents";
import {isF001Sed, isF002Sed} from "../../../utils/sed";
import PeriodeText from "../../../components/Forms/PeriodeText";
import DateField, {toDateFormat} from "../../../components/DateField/DateField";
import AddRemove from "../../../components/AddRemovePanel/AddRemove";
import {resetValidation, setValidation} from "../../../actions/validation";
import Input from "../../../components/Forms/Input";
import {Validation} from "../../../declarations/types";
import useLocalValidation from "../../../hooks/useLocalValidation";
import {validateMotregning, validateMotregninger, ValidationMotregningerProps, ValidationMotregningProps} from "./validation";
import CountrySelect from "@navikt/landvelger";
import PeriodeInput from "../../../components/Forms/PeriodeInput";
import TextArea from "../../../components/Forms/TextArea";
import {Currency} from "@navikt/land-verktoy";
import performValidation from "../../../utils/performValidation";
import {periodeSort} from "../../../utils/sort";
import {updateReplySed} from "../../../actions/svarsed";
import {ArrowRightLeftIcon, PlusCircleIcon} from "@navikt/aksel-icons";
import TransferToMotregningOppsummertModal from "./TransferToMotregningOppsummertModal/TransferToMotregningOppsummertModal";
import styles from "./Motregninger.module.css";
import {hasNamespaceWithErrors} from "../../../utils/validation";
import classNames from "classnames";
import ErrorLabel from "../../../components/Forms/ErrorLabel";
import useUnmount from "../../../hooks/useUnmount";
import {resetAdresse} from "../../../actions/adresse";

const MotregningerFC: React.FC<MainFormProps> = ({
 label,
 parentNamespace,
 replySed,
 personName,
 CDM_VERSION
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-motregninger`
  const target = 'motregninger'
  const motregninger: Motregninger | undefined = _.get((replySed as F001Sed), target)
  const barn: Array<Barn> = _.get((replySed as F001Sed), 'barn') || []

  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationMotregningProps>(validateMotregning, namespace)

  const [_currentMotregningType, _setCurrentMotregningType] = useState<string>("barnMotregninger")

  const [_newMotregning, _setNewMotregning] = useState<Motregning | undefined>(undefined)
  const [_editMotregning, _setEditMotregning] = useState<Motregning | undefined>(undefined)

  const [_newBarnForm, _setNewBarnForm] = useState<boolean>(false)
  const [_newHelefamilienForm, _setNewHelefamilienForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<string | undefined>(undefined)

  const [_showTransferToMotregningOppsummertBarnModal, _setShowTransferToMotregningOppsummertBarnModal] = useState<boolean>(false)
  const [_showTransferToMotregningOppsummertHeleFamilienModal, _setShowTransferToMotregningOppsummertHeleFamilienModal] = useState<boolean>(false)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationMotregningerProps>(
      clonedValidation, namespace, validateMotregninger, {
        replySed: _.cloneDeep(replySed as ReplySed),
        formalName: personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const onTabChange = (motregningType: string) => {
    _setCurrentMotregningType(motregningType)
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationMotregningerProps>(
      clonedValidation, namespace, validateMotregninger, {
        replySed: _.cloneDeep(replySed as ReplySed),
        formalName: personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  }

  const onAddNew = (type: string) => {
    const valid: boolean = _performValidation({
      replySed: _.cloneDeep(replySed as ReplySed),
      type: type,
      motregning: _newMotregning,
      formalName: personName
    })

    if (!!_newMotregning && valid) {
      let clonedNewMotregning = _.cloneDeep(_newMotregning)
      let newMotregninger: Array<Motregning> | undefined = (_.cloneDeep(motregninger) as Motregninger)[type === "barn" ? "barn" : "heleFamilien"]
      if (_.isNil(newMotregninger)) {
        newMotregninger = []
      }

      if(clonedNewMotregning.__barn){
        clonedNewMotregning.__barn.forEach((b) => {
          if(b.barnetsNavn) {
            let copyNewMotregning = {
              ...clonedNewMotregning,
              barnetsNavn: b.barnetsNavn,
              ytelseNavn: b.ytelseNavn
            }
            delete copyNewMotregning.__barn
            newMotregninger?.push(copyNewMotregning)
          }
        })
      } else {
        newMotregninger.push(clonedNewMotregning)
      }
      newMotregninger = newMotregninger.sort(periodeSort)

      dispatch(updateReplySed("motregninger." + type, newMotregninger))
      onCloseNew(type)
    }
  }

  const onCloseNew = (type: string) => {
    _setNewMotregning(undefined)
    type === "barn" ? _setNewBarnForm(false) : _setNewHelefamilienForm(false)
    _resetValidation()
  }

  const onStartEdit = (motregning: Motregning, index: string) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + _editIndex))
    }
    _setEditMotregning(motregning)
    _setEditIndex(index)
  }

  const onCloseEdit = (namespace: string) => {
    _setEditMotregning(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onSaveEdit = (type: string, index: number) => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationMotregningProps>(
      clonedValidation, namespace, validateMotregning, {
        replySed: _.cloneDeep(replySed as ReplySed),
        type: type,
        motregning: _editMotregning,
        nsIndex: _editIndex,
        formalName: personName
      })


    if (!!_editMotregning && !hasErrors) {
      const newEditMotregning = _.cloneDeep(_editMotregning)
      let newMotregninger: Array<Motregning> | undefined = (_.cloneDeep(motregninger) as Motregninger)[type === "barn" ? "barn" : "heleFamilien"]
      if (_.isNil(newMotregninger)) {
        newMotregninger = []
      }

      newMotregninger.splice(index, 1, newEditMotregning)
      newMotregninger = newMotregninger.sort(periodeSort)

      dispatch(updateReplySed("motregninger." + type, newMotregninger))
      onCloseEdit(namespace + type + "-" + index)
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (type: string, index: number) => {
    let newMotregninger: Array<Motregning> | undefined = (_.cloneDeep(motregninger) as Motregninger)[type === "barn" ? "barn" : "heleFamilien"]
    if (!_.isNil(newMotregninger)) {
      newMotregninger.splice(index, 1)
      dispatch(updateReplySed("motregninger." + type, newMotregninger))
    }
  }

  const setMotregningProp = (prop: string, value: string, index: number) => {
    if (index < 0) {
      _setNewMotregning({
        ..._newMotregning,
        [prop]: value.trim()
      } as Motregning)
      _resetValidation(namespace + '-' + prop)
      return
    }
    _setEditMotregning({
      ..._editMotregning,
      [prop]: value.trim()
    } as Motregning)
    dispatch(resetValidation(namespace + '[' + index + ']-' + prop))
  }

  const setPeriode = (motregning: Motregning, index: number) => {
    if (index < 0) {
      _setNewMotregning(motregning)
      _resetValidation([namespace + '-startdato', namespace + '-sluttdato'])
      return
    }
    _setEditMotregning(motregning)
    dispatch(resetValidation([
      namespace + '[' + index + ']-startdato',
      namespace + '[' + index + ']-sluttdato'
    ]))
  }

  const setBarnYtelse = (prop: string, value: string, index: number) => {
    let barnArray: Array<BarnYtelse> | undefined = _.cloneDeep(_newMotregning?.__barn)
    if (_.isNil(barnArray)) {
      barnArray = []
      barn.forEach(() => {
        barnArray!.push({} as BarnYtelse)
      })
    }

    let barnYtelse = barnArray[index]
    if (_.isNil(barnYtelse)) {
      barnYtelse = {}
    }

    if(prop === "barnetsNavn" && value === "") {
      barnYtelse = {
        ...barnYtelse,
        "barnetsNavn": undefined,
        "ytelseNavn": undefined
      }
    } else {
      barnYtelse = {
        ...barnYtelse,
        [prop]: value.trim()
      }
    }

    barnArray.splice(index,1 , barnYtelse)

    _setNewMotregning({
      ..._newMotregning,
      __barn: barnArray
    } as Motregning)

    _resetValidation(namespace + '-' + prop)
  }

  const setOppsummeringProp = (prop: string, value: string, type: string) => {
    const target = type === "barn" ? "barnOppsummert" : "heleFamilienOppsummert"
    dispatch(updateReplySed("motregninger." + target + "." + prop, value))
    dispatch(resetValidation(namespace + '-' + target + '-' + prop))
  }

  const renderMotregning = (motregning: Motregning | null, index: number, type: string) => {
    const idx: string = index < 0 ? type : type + '-' + index.toString()
    const _namespace = namespace + idx
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === type + '-' + index
    const _motregning = index < 0 ? _newMotregning : (inEditMode ? _editMotregning : motregning)
    const addingNewBarnMotregning = type === "barn" && index < 0

    let svarType = type === "barn" ? t('label:anmodning') : t('label:anmodning')

    if(isF002Sed(replySed)) {
      if(_motregning?.svarType === 'anmodning_om_motregning_per_barn') svarType =  t('label:anmodning')
      if(_motregning?.svarType === 'svar_på_anmodning_om_motregning_per_barn') svarType =  t('label:anmodning-svar')
      if(_motregning?.svarType === 'anmodning_om_motregning_for_hele_familien') svarType =  t('label:anmodning')
      if(_motregning?.svarType === 'svar_på_anmodning_om_motregning_for_hele_familien') svarType =  t('label:anmodning-svar')
    }

    const addRemove = (
      <AddRemove<Motregning>
        item={motregning}
        index={index}
        inEditMode={inEditMode}
        onRemove={()=>onRemove(type, index)}
        onAddNew={() => onAddNew(type)}
        onCancelNew={() => onCloseNew(type)}
        onStartEdit={(item: Motregning) => onStartEdit(item, type + '-' + index)}
        onConfirmEdit={()=>onSaveEdit(type, index)}
        onCancelEdit={() => onCloseEdit(_namespace)}
        labels={{remove: "Fjern motregning"}}
      />
    )

    if (inEditMode) {
      return (
        <Box
          padding="4"
          background="surface-subtle"
          borderColor="border-subtle"
          borderWidth="1"
          className={classNames(
            styles.motregningBox,
            {
              [styles.new]: index < 0,
              [styles.error]: hasNamespaceWithErrors(_v, _namespace),
            }
          )}
        >
          <VStack gap="4">
            <HStack gap="4">
              {isF001Sed(replySed) && <Label>{svarType}</Label>}
              {isF002Sed(replySed) &&
                <RadioGroup
                  legend="Svartype"
                  hideLegend={true}
                  value={_motregning?.svarType}
                  onChange={(value: string) => setMotregningProp("svarType", value, index)}
                  error={_v[_namespace + '-svarType']?.feilmelding}
                >
                  <HStack gap="4">
                    {type === "barn" && <Radio value="anmodning_om_motregning_per_barn">{t('label:anmodning')}</Radio>}
                    {type === "barn" && <Radio value="svar_på_anmodning_om_motregning_per_barn">{t('label:anmodning-svar')}</Radio>}
                    {type === "heleFamilien" && <Radio value="anmodning_om_motregning_for_hele_familien">{t('label:anmodning')}</Radio>}
                    {type === "heleFamilien" && <Radio value="svar_på_anmodning_om_motregning_for_hele_familien">{t('label:anmodning-svar')}</Radio>}
                  </HStack>
                </RadioGroup>
              }
              <Spacer/>
              {addRemove}
            </HStack>
            {addingNewBarnMotregning &&
              <VStack gap="1">
                <HGrid columns={3} gap="4" align="start">
                  <Label>Velg barn</Label>
                  <Label>{t('label:betegnelse-på-ytelse')}</Label>
                </HGrid>
                {barn.map((b, idx) => {
                  return (
                    <HGrid columns={3} gap="4" align="start">
                      <Checkbox
                        value={b.personInfo.fornavn + ' ' + b.personInfo.etternavn}
                        onChange={(e) => setBarnYtelse("barnetsNavn", e.target.checked ? e.target.value : "", idx)}
                      >
                        {b.personInfo.fornavn + ' ' + b.personInfo.etternavn}
                      </Checkbox>
                      <Input
                        error={_v[_namespace + idx + '-ytelseNavn']?.feilmelding}
                        id='ytelseNavn'
                        label={t('label:betegnelse-på-ytelse')}
                        hideLabel={true}
                        namespace={_namespace + idx}
                        onChanged={(value: string) => setBarnYtelse("ytelseNavn", value, idx)}
                        disabled={!_motregning || (_motregning && !_motregning.__barn) || !!(_motregning && _motregning.__barn && _motregning.__barn[idx] && !_motregning.__barn[idx].barnetsNavn)}
                        value={_motregning && _motregning.__barn && _motregning.__barn[idx] ? _motregning.__barn[idx].ytelseNavn : ''}
                      />
                    </HGrid>
                  )
                })}
                <ErrorLabel error={_v[_namespace + '-barn']?.feilmelding}/>
              </VStack>
            }
            {!addingNewBarnMotregning && type === "barn" && // TODO: bytt ut med dropdown for å velge barnets navn fra sed
              <HGrid columns={2} gap="4" align="start">
                <Select
                  error={_v[_namespace + '-barnetsNavn']?.feilmelding}
                  id='barnetsNavn'
                  label="Barnets navn"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMotregningProp("barnetsNavn", e.currentTarget.value, index)}
                  value={_motregning?.barnetsNavn}
                >
                  {barn.map((b, idx) => {
                    return (<option key={idx} value={b.personInfo.fornavn + ' ' + b.personInfo.etternavn}>{b.personInfo.fornavn + ' ' + b.personInfo.etternavn}</option>)
                  })}
                </Select>
                <Input
                  error={_v[_namespace + '-ytelseNavn']?.feilmelding}
                  id='ytelseNavn'
                  label={t('label:betegnelse-på-ytelse')}
                  namespace={_namespace}
                  onChanged={(value: string) => setMotregningProp("ytelseNavn", value, index)}
                  value={_motregning?.ytelseNavn}
                  required={true}
                />
              </HGrid>
            }
            {type === "heleFamilien" &&
              <HGrid columns={2} gap="4" align="start">
                <Input
                  error={_v[_namespace + '-antallPersoner']?.feilmelding}
                  id='antallPersoner'
                  label="Antall personer det innvilges ytelse for"
                  namespace={_namespace}
                  onChanged={(value: string) => setMotregningProp("antallPersoner", value, index)}
                  value={_motregning?.antallPersoner}
                />
                <Input
                  error={_v[_namespace + '-ytelseNavn']?.feilmelding}
                  id='ytelseNavn'
                  label={t('label:betegnelse-på-ytelse')}
                  namespace={_namespace}
                  onChanged={(value: string) => setMotregningProp("ytelseNavn", value, index)}
                  value={_motregning?.ytelseNavn}
                  required={true}
                />
              </HGrid>
            }
            <HGrid columns={3} gap="4" align="start">
              <DateField
                error={_v[_namespace + '-vedtaksdato']?.feilmelding}
                id='vedtaksdato'
                label={t('label:vedtaksdato')}
                namespace={_namespace}
                onChanged={(value: string) => setMotregningProp("vedtaksdato", value, index)}
                dateValue={_motregning?.vedtaksdato}
              />
              <Input
                error={_v[_namespace + '-beloep']?.feilmelding}
                id='beloep'
                label={t('label:beløp')}
                namespace={_namespace}
                required={true}
                onChanged={(value: string) => setMotregningProp("beloep", value, index)}
                value={_motregning?.beloep}
              />
              <CountrySelect
                ariaLabel={t('label:valuta')}
                closeMenuOnSelect
                data-testid={_namespace + '-valuta'}
                error={_v[_namespace + '-valuta']?.feilmelding}
                id={_namespace + '-valuta'}
                label={t('label:valuta')}
                locale='nb'
                menuPortalTarget={document.body}
                onOptionSelected={(currency: Currency) => setMotregningProp("valuta", currency.value, index)}
                type='currency'
                required={true}
                values={_motregning?.valuta}
              />
            </HGrid>
            <HGrid columns={3} gap="4" align="start">
              <Input
                error={_v[_namespace + '-mottakersNavn']?.feilmelding}
                namespace={_namespace}
                id='mottakersNavn'
                label={t('label:mottakers-navn')}
                onChanged={(value: string) => setMotregningProp("mottakersNavn", value, index)}
                value={_motregning?.mottakersNavn}
              />
              <RadioGroup
                value={_motregning?.utbetalingshyppighet}
                id={_namespace + '-utbetalingshyppighet'}
                error={_v[_namespace + '-utbetalingshyppighet']?.feilmelding}
                name={_namespace + '-utbetalingshyppighet'}
                legend={t('label:periode-avgrensing')}
                onChange={(value: string) => setMotregningProp("utbetalingshyppighet", value, index)}
              >
                <HStack gap="2">
                  <Radio value='Månedlig'>{t('label:månedlig')}</Radio>
                  <Radio value='Årlig'>{t('label:årlig')}</Radio>
                </HStack>
              </RadioGroup>
            </HGrid>
            <PeriodeInput
              asGrid={true}
              namespace={_namespace}
              error={{
                startdato: _v[_namespace + '-startdato']?.feilmelding,
                sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
              }}
              label={{
                startdato: t('label:startdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')',
                sluttdato: t('label:sluttdato') + ' (' + t('label:innvilgelse').toLowerCase() + ')'
              }}
              hideLabel={false}
              periodeType='simple'
              requiredStartDato
              requiredSluttDato
              setPeriode={(m: Motregning)=> setPeriode(m, index)}
              value={_motregning}
            />
            <TextArea
              error={_v[_namespace + '-begrunnelse']?.feilmelding}
              namespace={_namespace}
              id='begrunnelse'
              label={t('label:anmodning-grunner')}
              onChanged={(value: string) => setMotregningProp("begrunnelse", value, index)}
              value={_motregning?.begrunnelse}
            />
            <TextArea
              error={_v[_namespace + '-ytterligereInfo']?.feilmelding}
              namespace={_namespace}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon')}
              onChanged={(value: string) => setMotregningProp("ytterligereInfo", value, index)}
              value={_motregning?.ytterligereInfo}
            />
          </VStack>
        </Box>
      )
    }

    return (
      <Box padding="4" background="surface-subtle" borderColor="border-subtle" borderWidth="1">
        <VStack gap="4">
          <HStack gap="4">
            <Label>{svarType}</Label>
            <Spacer/>
            {addRemove}
          </HStack>
          <HGrid columns={2} gap="4">
            {type === "barn" && <VStack><Label>Barnets navn</Label>{_motregning?.barnetsNavn}</VStack>}
            {type === "heleFamilien" && <VStack><Label>Antall personer det innvilges ytelse for</Label>{_motregning?.antallPersoner}</VStack>}
            <VStack><Label>{t('label:betegnelse-på-ytelse')}</Label>{_motregning?.ytelseNavn}</VStack>
          </HGrid>
          <HGrid columns={2} gap="4">
            <VStack><Label>{t('label:vedtaksdato')}</Label>{toDateFormat(_motregning?.vedtaksdato, "DD.MM.YYYY")}</VStack>
            <VStack><Label>{t('label:beløp')}</Label>{_motregning?.beloep} {_motregning?.valuta} ({_motregning?.utbetalingshyppighet})</VStack>
          </HGrid>
          <HGrid columns={2} gap="4">
            <VStack>
              <Label>Periode</Label>
              <PeriodeText
                error={{
                  startdato: _v[_namespace + '-startdato']?.feilmelding,
                  sluttdato: _v[_namespace + '-sluttdato']?.feilmelding
                }}
                namespace={_namespace}
                periode={_motregning}
              />
            </VStack>
            <VStack><Label>{t('label:mottakers-navn')}</Label>{_motregning?.mottakersNavn}</VStack>
          </HGrid>
          <VStack>
            <Label>{t('label:anmodning-grunner')}</Label>
            {_motregning?.begrunnelse}
          </VStack>
          <VStack>
            <Label>{t('label:ytterligere-informasjon')}</Label>
            {_motregning?.ytterligereInfo}
          </VStack>
        </VStack>
      </Box>
    )
  }

  const renderTotalBeloep = (type: string) => {
    const target = type === "barn" ? "barnOppsummert" : "heleFamilienOppsummert"
    return (
      <Box borderWidth="1" borderColor="border-subtle" padding="4">
        <VStack gap="4">
          <HGrid columns={2} gap="4" align="start">
            <Input
              error={validation[namespace + '-' + target + '-totalbeloep']?.feilmelding}
              id= {target + '-totalbeloep'}
              label={t('label:totalbeloep')}
              namespace={namespace}
              onChanged={(value: string) => setOppsummeringProp("totalbeloep", value, type)}
              value={(motregninger as any)?.[target]?.totalbeloep || ''}
            />
            <CountrySelect
              ariaLabel={t('label:valuta')}
              closeMenuOnSelect
              error={validation[namespace + '-' + target + '-valuta']?.feilmelding}
              id={namespace + '-' + target + '-valuta'}
              label={t('label:valuta')}
              locale='nb'
              menuPortalTarget={document.body}
              onOptionSelected={(currency: Currency) => setOppsummeringProp("valuta", currency.value, type)}
              type='currency'
              values={(motregninger as any)?.[target]?.valuta}
            />
          </HGrid>
          <HGrid columns={2} gap="4" align="start">
            <Input
              error={validation[namespace + '-' + target + '-betalingsreferanse']?.feilmelding}
              id={target + '-betalingsreferanse'}
              label={t('label:betalingsref')}
              namespace={namespace}
              onChanged={(value: string) => setOppsummeringProp("betalingsreferanse", value, type)}
              value={(motregninger as any)?.[target]?.betalingsreferanse || ''}
            />
            <Input
              error={validation[namespace + '-' + target + '-melding']?.feilmelding}
              id={target + '-melding'}
              label={t('label:melding-til-mottaker')}
              namespace={namespace}
              onChanged={(value: string) => setOppsummeringProp("melding", value, type)}
              value={(motregninger as any)?.[target]?.melding || ''}
            />
          </HGrid>
        </VStack>
      </Box>
    )
  }

  return (
    <>
      <TransferToMotregningOppsummertModal
        namespace={namespace}
        title="Overføre til totalbeløp"
        modalOpen={_showTransferToMotregningOppsummertBarnModal}
        setModalOpen={_setShowTransferToMotregningOppsummertBarnModal}
        target={target + ".barnOppsummert"}
        motregninger={motregninger?.barn}
      />
      <TransferToMotregningOppsummertModal
        namespace={namespace}
        title="Overføre til totalbeløp"
        modalOpen={_showTransferToMotregningOppsummertHeleFamilienModal}
        setModalOpen={_setShowTransferToMotregningOppsummertHeleFamilienModal}
        target={target + ".heleFamilienOppsummert"}
        motregninger={motregninger?.heleFamilien}
      />
      <Box padding="4">
        <VStack gap="4">
          <Heading size='small'>
            {label}
          </Heading>
          <Tabs value={_currentMotregningType} onChange={(value) => onTabChange(value)}>
            <Tabs.List>
              <HStack align="center" width="100%">
                <Tabs.Tab value="barnMotregninger" label={t('label:barn')}/>
                <Tabs.Tab value="heleFamilienMotregninger" label={t('label:hele-familien')}/>
                <Spacer/>
              </HStack>
            </Tabs.List>
            <Tabs.Panel value="barnMotregninger">
              <VStack gap="4" marginBlock="4">
                {CDM_VERSION! >= 4.4 &&
                  <HStack>
                    <Spacer/>
                    <Button
                      size={"xsmall"}
                      variant='tertiary'
                      onClick={() => _setShowTransferToMotregningOppsummertBarnModal(true)}
                      icon={<ArrowRightLeftIcon/>}
                      disabled={!motregninger?.barn || motregninger?.barn.length === 0}
                    >
                      Overfør til totalbeløp
                    </Button>
                  </HStack>
                }
                {_.isEmpty(motregninger?.barn) && !_newBarnForm
                  ? (
                    <Box paddingInline="4">
                      <SpacedHr />
                      <BodyLong>
                        {t('message:warning-no-motregning')}
                      </BodyLong>
                      <SpacedHr />
                    </Box>
                  )
                  : motregninger?.barn?.map((m: Motregning, i: number) => {
                    return renderMotregning(m, i, "barn")
                  })
                }
                {_newBarnForm
                  ? renderMotregning(null, -1, "barn")
                  : (
                    <Box>
                      <Button
                        variant='tertiary'
                        size="small"
                        onClick={() => _setNewBarnForm(true)}
                        icon={<PlusCircleIcon/>}
                      >
                        {t('el:button-add-new-x', { x: t('label:motregning').toLowerCase() })}
                      </Button>
                    </Box>
                  )}
                {CDM_VERSION! >= 4.4 && renderTotalBeloep('barn')}
              </VStack>
            </Tabs.Panel>
            <Tabs.Panel value="heleFamilienMotregninger">
              <VStack gap="4" marginBlock="4">
                <HStack>
                  <Spacer/>
                  <Button
                    size={"xsmall"}
                    variant='tertiary'
                    onClick={() => _setShowTransferToMotregningOppsummertHeleFamilienModal(true)}
                    icon={<ArrowRightLeftIcon/>}
                    disabled={!motregninger?.heleFamilien || motregninger?.heleFamilien.length === 0}
                  >
                    Overfør til totalbeløp
                  </Button>
                </HStack>
                {_.isEmpty(motregninger?.heleFamilien) && !_newHelefamilienForm
                  ? (
                    <Box paddingInline="4">
                      <SpacedHr />
                      <BodyLong>
                        {t('message:warning-no-motregning')}
                      </BodyLong>
                      <SpacedHr />
                    </Box>
                  )
                  : motregninger?.heleFamilien?.map((m: Motregning, i: number) => {
                    return renderMotregning(m, i, "heleFamilien")
                  })
                }
                {_newHelefamilienForm
                  ? renderMotregning(null, -1, "heleFamilien")
                  : (
                    <Box>
                      <Button
                        variant='tertiary'
                        size="small"
                        onClick={() => _setNewHelefamilienForm(true)}
                        icon={<PlusCircleIcon/>}
                      >
                        {t('el:button-add-new-x', { x: t('label:motregning').toLowerCase() })}
                      </Button>
                    </Box>
                  )}
                {CDM_VERSION! >= 4.4 && renderTotalBeloep('heleFamilien')}
              </VStack>
            </Tabs.Panel>
          </Tabs>
        </VStack>
      </Box>
    </>
  )
}

export default MotregningerFC
