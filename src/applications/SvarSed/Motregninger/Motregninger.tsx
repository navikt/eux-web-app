import React, {useState} from "react";
import {MainFormProps, MainFormSelector, mapState} from "../MainForm";
import {BodyLong, Box, Heading, HGrid, HStack, Label, Radio, RadioGroup, Spacer, Tabs, VStack} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../../store";
import _ from "lodash";
import {Barn, F001Sed, Motregning, Motregninger, Periode, ReplySed} from "../../../declarations/sed";
import {SpacedHr} from "../../../components/StyledComponents";
import {isF002Sed} from "../../../utils/sed";
import PeriodeText from "../../../components/Forms/PeriodeText";
import DateField, {toDateFormat} from "../../../components/DateField/DateField";
import AddRemove from "../../../components/AddRemovePanel/AddRemove";
import {resetValidation, setValidation} from "../../../actions/validation";
import Input from "../../../components/Forms/Input";
import {Validation} from "../../../declarations/types";
import useLocalValidation from "../../../hooks/useLocalValidation";
import {validateMotregning, ValidationMotregningProps} from "../Motregning/validation";
import CountrySelect from "@navikt/landvelger";
import PeriodeInput from "../../../components/Forms/PeriodeInput";
import TextArea from "../../../components/Forms/TextArea";
import {Currency} from "@navikt/land-verktoy";
import performValidation from "../../../utils/performValidation";
import {periodeSort} from "../../../utils/sort";
import {KeyAndYtelse} from "../Motregning/Motregning";
import {updateReplySed} from "../../../actions/svarsed";

const MotregningerFC: React.FC<MainFormProps> = ({
 label,
 parentNamespace,
 setReplySed,
 replySed,
 personName
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-motregninger`
  const target = 'motregninger'
  const motregninger: Motregninger | undefined = _.get((replySed as F001Sed), target)
  //const barn: Array<Barn> = _.get((replySed as F001Sed), 'barn') || []

  const [_validation, _resetValidation, _performValidation] = useLocalValidation<ValidationMotregningProps>(validateMotregning, namespace)

  const [_currentMotregningType, _setCurrentMotregningType] = useState<string>("barnMotregninger")

  const [_newMotregning, _setNewMotregning] = useState<Motregning | undefined>(undefined)
  const [_editMotregning, _setEditMotregning] = useState<Motregning | undefined>(undefined)

  //const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_editIndex, _setEditIndex] = useState<string | undefined>(undefined)

  const onTabChange = (motregningType: string) => {
    _setCurrentMotregningType(motregningType)
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
    const hasErrors = false // TODO: implement validation on motregning edit/save

    if (!!_editMotregning && !hasErrors) {
      const newEditMotregning = _.cloneDeep(_editMotregning)

      let newMotregninger: Array<Motregning> | undefined = (_.cloneDeep(motregninger) as Motregninger)[type === "barn" ? "barn" : "helefamilien"]
      if (_.isNil(newMotregninger)) {
        newMotregninger = []
      }

      newMotregninger.splice(index, 1, newEditMotregning)
      newMotregninger = newMotregninger.sort(periodeSort)

      dispatch(updateReplySed("motregninger." + type, newMotregninger))
      onCloseEdit(namespace + index)
    } else {
      dispatch(setValidation(clonedValidation))
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

  const renderMotregning = (motregning: Motregning | null, index: number, type: string) => {
    const _namespace = namespace + index.toString()
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === type + '-' + index
    const _motregning = index < 0 ? _newMotregning : (inEditMode ? _editMotregning : motregning)

    let svarType = type === "barn" ? t('label:anmodning-barn') : t('label:anmodning-hele-familien')

    if(isF002Sed(replySed)) {
      if(_motregning?.svarType === 'anmodning_om_motregning_per_barn') svarType =  t('label:anmodning-barn')
      if(_motregning?.svarType === 'svar_på_anmodning_om_motregning_per_barn') svarType =  t('label:anmodning-svar-barn')
      if(_motregning?.svarType === 'anmodning_om_motregning_for_hele_familien') svarType =  t('label:anmodning-hele-familien')
      if(_motregning?.svarType === 'svar_på_anmodning_om_motregning_for_hele_familien') svarType =  t('label:anmodning-svar-hele-familien')
    }

    if (inEditMode) {
      return (
        <Box padding="4" background="surface-subtle" borderColor="border-subtle" borderWidth="1">
          <VStack gap="4">
            <HStack gap="4">
              <Label>{svarType}</Label>
              <Spacer/>
              <AddRemove<Motregning>
                item={motregning}
                index={index}
                inEditMode={inEditMode}
                onRemove={() => {}}
                onAddNew={()=>{}}
                onCancelNew={()=>{}}
                onStartEdit={(item: Motregning) => onStartEdit(item, type + '-' + index)}
                onConfirmEdit={()=>onSaveEdit(type, index)}
                onCancelEdit={() => onCloseEdit(_namespace)}
                labels={{remove: "Fjern motregning"}}
              />
            </HStack>
            <HGrid columns={2} gap="4">
              {type === "barn" && // TODO: bytt ut med dropdown for å velge barnets navn fra sed
                <Input
                  error={_v[_namespace + '-barnetsNavn']?.feilmelding}
                  id='barnetsNavn'
                  label="Barnets navn"
                  namespace={_namespace}
                  onChanged={(value: string) => setMotregningProp("barnetsNavn", value, index)}
                  value={_motregning?.barnetsNavn}
                />
              }
              {type === "helefamilien" &&
                <Input
                  error={_v[_namespace + '-antallPersoner']?.feilmelding}
                  id='antallPersoner'
                  label="Antall personer det innvilges ytelse for"
                  namespace={_namespace}
                  onChanged={(value: string) => setMotregningProp("antallPersoner", value, index)}
                  value={_motregning?.antallPersoner}
                />
              }
              <Input
                error={_v[_namespace + '-ytelseNavn']?.feilmelding}
                id='ytelseNavn'
                label={t('label:betegnelse-på-ytelse')}
                namespace={_namespace}
                onChanged={(value: string) => setMotregningProp("ytelseNavn", value, index)}
                value={_motregning?.ytelseNavn}
              />
            </HGrid>
            <HGrid columns={3} gap="4">
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
                values={_motregning?.valuta}
              />
            </HGrid>
            <HGrid columns={3} gap="4">
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
            <AddRemove<Motregning>
              item={motregning}
              index={index}
              onRemove={() => {}}
              onStartEdit={(item: Motregning) => onStartEdit(item, type + '-' + index)}
              allowEdit={true}
              labels={{remove: "Fjern motregning"}}
            />
          </HStack>
          <HGrid columns={2} gap="4">
            {type === "barn" && <VStack><Label>Barnets navn</Label>{_motregning?.barnetsNavn}</VStack>}
            {type === "helefamilien" && <VStack><Label>Antall personer det innvilges ytelse for</Label>{_motregning?.antallPersoner}</VStack>}
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

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <Tabs value={_currentMotregningType} onChange={(value) => onTabChange(value)}>
          <Tabs.List>
            <HStack align="center" width="100%">
              <Tabs.Tab value="barnMotregninger" label={t('label:barn')}/>
              <Tabs.Tab value="helefamilienMotregninger" label={t('label:hele-familien')}/>
              <Spacer/>
            </HStack>
          </Tabs.List>
          <Tabs.Panel value="barnMotregninger">
            <VStack gap="4" marginBlock="4">
              {_.isEmpty(motregninger?.barn)
                ? (
                  <Box padding="4">
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
            </VStack>
          </Tabs.Panel>
          <Tabs.Panel value="helefamilienMotregninger">
            <VStack gap="4" marginBlock="4">
              {_.isEmpty(motregninger?.helefamilien)
                ? (
                  <Box padding="4">
                    <SpacedHr />
                    <BodyLong>
                      {t('message:warning-no-motregning')}
                    </BodyLong>
                    <SpacedHr />
                  </Box>
                )
                : motregninger?.helefamilien?.map((m: Motregning, i: number) => {
                  return renderMotregning(m, i, "helefamilien")
                })
              }
            </VStack>
          </Tabs.Panel>
        </Tabs>
      </VStack>
    </Box>
  )
}

export default MotregningerFC
