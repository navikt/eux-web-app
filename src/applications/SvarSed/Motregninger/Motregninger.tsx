import React, {useState} from "react";
import {MainFormProps, MainFormSelector, mapState} from "../MainForm";
import {BodyLong, Box, Heading, HGrid, HStack, Label, Radio, RadioGroup, Spacer, Tabs, VStack} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../../store";
import _ from "lodash";
import {Barn, F001Sed, Motregning, Motregninger} from "../../../declarations/sed";
import {SpacedHr} from "../../../components/StyledComponents";
import {isF002Sed} from "../../../utils/sed";
import PeriodeText from "../../../components/Forms/PeriodeText";
import DateField, {toDateFormat} from "../../../components/DateField/DateField";
import AddRemove from "../../../components/AddRemovePanel/AddRemove";
import {resetValidation} from "../../../actions/validation";
import Input from "../../../components/Forms/Input";
import {Validation} from "../../../declarations/types";
import useLocalValidation from "../../../hooks/useLocalValidation";
import {validateMotregning, ValidationMotregningProps} from "../Motregning/validation";
import CountrySelect from "@navikt/landvelger";
import PeriodeInput from "../../../components/Forms/PeriodeInput";
import TextArea from "../../../components/Forms/TextArea";

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
                onConfirmEdit={()=>{}}
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
                  onChanged={()=>{}}
                  value={_motregning?.barnetsNavn}
                />
              }
              {type === "familie" &&
                <Input
                  error={_v[_namespace + '-antallPersoner']?.feilmelding}
                  id='antallPersoner'
                  label="Antall personer det innvilges ytelse for"
                  namespace={_namespace}
                  onChanged={()=>{}}
                  value={_motregning?.antallPersoner}
                />
              }
              <Input
                error={_v[_namespace + '-ytelseNavn']?.feilmelding}
                id='ytelseNavn'
                label={t('label:betegnelse-på-ytelse')}
                namespace={_namespace}
                onChanged={()=>{}}
                value={_motregning?.ytelseNavn}
              />
            </HGrid>
            <HGrid columns={3} gap="4">
              <DateField
                error={_v[_namespace + '-vedtaksdato']?.feilmelding}
                id='vedtaksdato'
                label={t('label:vedtaksdato')}
                namespace={_namespace}
                onChanged={()=>{}}
                dateValue={_motregning?.vedtaksdato}
              />
              <Input
                error={_v[_namespace + '-beloep']?.feilmelding}
                id='beloep'
                label={t('label:beløp')}
                namespace={_namespace}
                onChanged={()=>{}}
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
                onOptionSelected={()=>{}}
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
                onChanged={() => {}}
                value={_motregning?.mottakersNavn}
              />
              <RadioGroup
                value={_motregning?.utbetalingshyppighet}
                id={_namespace + '-utbetalingshyppighet'}
                error={_v[_namespace + '-utbetalingshyppighet']?.feilmelding}
                name={_namespace + '-utbetalingshyppighet'}
                legend={t('label:periode-avgrensing')}
                onChange={()=> {}}
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
              setPeriode={()=> {}}
              value={_motregning}
            />
            <TextArea
              error={_v[_namespace + '-begrunnelse']?.feilmelding}
              namespace={_namespace}
              id='begrunnelse'
              label={t('label:anmodning-grunner')}
              onChanged={() => {}}
              value={_motregning?.begrunnelse}
            />
            <TextArea
              error={_v[_namespace + '-ytterligereInfo']?.feilmelding}
              namespace={_namespace}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon')}
              onChanged={() => {}}
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
            {type === "familie" && <VStack><Label>Antall personer det innvilges ytelse for</Label>{_motregning?.antallPersoner}</VStack>}
            <VStack><Label>{t('label:betegnelse-på-ytelse')}</Label>{_motregning?.ytelseNavn}</VStack>
          </HGrid>
          <HGrid columns={2} gap="4">
            <VStack><Label>Vedtaksdato</Label>{toDateFormat(_motregning?.vedtaksdato, "DD.MM.YYYY")}</VStack>
            <VStack><Label>Beløp</Label>{_motregning?.beloep} {_motregning?.valuta} ({_motregning?.utbetalingshyppighet})</VStack>
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
            <VStack><Label>Mottakers navn</Label>{_motregning?.mottakersNavn}</VStack>
          </HGrid>
          <VStack>
            <Label>Begrunnelse</Label>
            {_motregning?.begrunnelse}
          </VStack>
          <VStack>
            <Label>Ytterligere informasjon</Label>
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
                  return renderMotregning(m, i, "familie")
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
