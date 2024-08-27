import {State} from "declarations/reducers";
import {MainFormProps, MainFormSelector} from "../MainForm";
import React from "react";
import {useAppDispatch, useAppSelector} from "store";
import {Box, Checkbox, Heading, Label, VStack} from "@navikt/ds-react";
import {PaddedDiv, RadioPanel, RadioPanelGroup, FlexRadioPanels} from "@navikt/hoykontrast";
import useUnmount from "hooks/useUnmount";
import _ from "lodash";
import {AnmodningOmMerInformasjon} from "declarations/sed";
import EtterspurtInformasjonTyper from "./EtterspurtInformasjonTyper";
import TextArea from "../../../components/Forms/TextArea";
import {useTranslation} from "react-i18next";
import Input from "../../../components/Forms/Input";
import {resetValidation} from "../../../actions/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const EtterspurtInformasjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed,
  //personName
}: MainFormProps): JSX.Element => {
  const {t} = useTranslation()
  const {validation}: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  const namespace = `${parentNamespace}`
  const target = 'anmodningOmMerInformasjon'
  const anmodningOmMerInformasjon: AnmodningOmMerInformasjon | undefined = _.get(replySed, target)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    console.log(clonedValidation)
  })

  const setAnmodningOmMerInformasjon = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateReplySed(`${target}.${e.target.value}`, e.target.checked ? {} : undefined))
    if(validation[namespace + '-' + e.target.value + '-etterspurt-informasjon-typer']){
      dispatch(resetValidation(namespace + '-' + e.target.value + '-etterspurt-informasjon-typer'))
    }
  }

  const setYtterligereInfo = (type:string, value: string) => {
    dispatch(updateReplySed(`${target}.${type}.ytterligereInformasjon`, value))
    if(validation[namespace + '-' + type + '-ytterligereinformasjon']){
      dispatch(resetValidation(namespace + '-' + type + '-ytterligereinformasjon'))
    }
  }

  const setUtdanning = (prop:string, value: string) => {
    dispatch(updateReplySed(`${target}.utdanning.${prop}`, value))
    if(validation[namespace + '-utdanning-' + prop.toLowerCase()]){
      dispatch(resetValidation(namespace + '-utdanning-' + prop.toLowerCase()))
    }
  }

  const etterspurtInformasjonsTyperAdopsjon = [
    {label: "Dato da adoptivforeldrene fikk omsorg for det adopterte barnet", value: 'dato_da_adoptivforeldrene_fikk_omsorg_for_det_adopterte_barnet'},
    {label: "Dato da adopsjonsbevillingen ble offentlig registrert", value: 'dato_da_adopsjonsbevillingen_ble_offentlig_registrert'},
    {label: "Dokument som stadfester at adopsjonen er lovlig", value: 'dokument_som_stadfester_at_adopsjonen_er_lovlig'}
  ]

  const etterspurtInformasjonsTyperInntekt = [
    {label: "Type påkrevde data: Inntektskilde (spesifikk inntekt fra ansettelsesforhold eller selvstendig næringsvirksomhet, fra eiendom, verdi av land/eiendom, underholdsbidrag/barnebidrag)", value: "type_påkrevde_data_inntektskilde"},
    {label: "Årlig inntekt", value: "årlig_inntekt"},
    {label: "Periode (fra/til) det kreves opplysninger om", value: "periode_fratil_det_kreves_opplysninger_om"}
  ]

  const etterspurtInformasjonsTyperYtelseTilForeldreLoese = [
    {label: "Identifisering av den avdøde", value: "identifisering_av_den_avdøde"},
    {label: "Identifisering av de berørte barna", value: "identifisering_av_de_berørte_barna"},
    {label: "Identifikasjon av andre personer - en annen slektning/verge som søker på vegne av den foreldreløse/barnet", value: "identifikasjon_av_andre_personer_en_annen_slektning_verge_som_søker_på_vegne_av_den_foreldreløse_barnet"},
    {label: "Den foreldreløses/barnets bosted", value: "den_foreldreløses_barnets_bosted"},
    {label: "Relasjon mellom den foreldreløse/barnet og avdøde", value: "relasjon_mellom_den_foreldreløse_barnet_og_avdøde"},
    {label: "Relasjon mellom annen person og den avdøde", value: "relasjon_mellom_annen_person_og_den_avdøde"},
    {label: "Den foreldreløses/barnets aktivitet", value: "den_foreldreløses_barnets_aktivitet"},
    {label: "Skole", value: "skole"},
    {label: "Opplæring", value: "opplæring"},
    {label: "Uførhet", value: "uførhet"},
    {label: "Arbeidsledighet", value: "qrbeidsledighet"},
    {label: "Inntekt til det foreldreløse barnet", value: "inntekt_til_den_foreldreløse_barnet"}
  ]

  const etterspurtInformasjonsTyperAnnenInformasjonOmBarnet = [
    {label: "Hvem har daglig omsorg for barnet?", value: "hvem_har_daglig_omsorg_for_barnet"},
    {label: "Hvem har foreldreansvar for barnet?", value: "hvem_har_foreldreansvar_for_barnet"},
    {label: "Er barnet adoptert?", value: "er_barnet_adoptert"},
    {label: "Forsørges barnet av det offentlige?", value: "forsørges_barnet_av_det_offentlige"},
    {label: "Går barnet i barnehage. finansieres barnehagen av staten eller det offentlige/antall timer barnet går i barnehage", value: "går_barnet_i_barnehage_finansieres_barnehagen_av_staten_eller_det_offentlige_antall_timer_barnet_går_i_barnehage"},
    {label: "Barnets sivilstand", value: "barnets_sivilstand"},
    {label: "Dato for endrede forhold", value: "dato_for_endrede_forhold"}
  ]


  return (
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
        </Heading>
        <VStack gap="4">
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Checkbox
              value="adopsjon"
              checked={!!anmodningOmMerInformasjon?.adopsjon}
              onChange={setAnmodningOmMerInformasjon}
            >
              Ved adopsjon
            </Checkbox>
            {!!anmodningOmMerInformasjon?.adopsjon &&
              <VStack gap="4">
                <EtterspurtInformasjonTyper
                  target="anmodningOmMerInformasjon.adopsjon"
                  namespace={namespace + '-adopsjon'}
                  error={validation[namespace + '-adopsjon-etterspurt-informasjon-typer']?.feilmelding}
                  initialOptions={etterspurtInformasjonsTyperAdopsjon}
                  etterspurtInformasjon={anmodningOmMerInformasjon?.adopsjon}
                  updateReplySed={updateReplySed}
                />
                <TextArea
                  maxLength={255}
                  error={validation[namespace + '-adopsjon-ytterligereinformasjon']?.feilmelding}
                  namespace={namespace}
                  id='adopsjon-ytterligereinformasjon'
                  label={t('label:ytterligere-informasjon')}
                  onChanged={(v) => setYtterligereInfo("adopsjon", v)}
                  value={anmodningOmMerInformasjon.adopsjon.ytterligereInformasjon ?? ''}
                />
              </VStack>
            }
          </Box>
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Checkbox
              value="inntekt"
              checked={!!anmodningOmMerInformasjon?.inntekt}
              onChange={setAnmodningOmMerInformasjon}
            >
              Inntekt
            </Checkbox>
            {!!anmodningOmMerInformasjon?.inntekt &&
              <VStack gap="4">
                <EtterspurtInformasjonTyper
                  target="anmodningOmMerInformasjon.inntekt"
                  namespace={namespace + '-inntekt'}
                  error={validation[namespace + '-inntekt-etterspurt-informasjon-typer']?.feilmelding}
                  initialOptions={etterspurtInformasjonsTyperInntekt}
                  etterspurtInformasjon={anmodningOmMerInformasjon?.inntekt}
                  updateReplySed={updateReplySed}
                />
                <TextArea
                  maxLength={255}
                  error={validation[namespace + '-inntekt-ytterligereinformasjon']?.feilmelding}
                  namespace={namespace}
                  id='inntekt-ytterligereinformasjon'
                  label={t('label:ytterligere-informasjon')}
                  onChanged={(v) => setYtterligereInfo("inntekt", v)}
                  value={anmodningOmMerInformasjon.inntekt.ytterligereInformasjon ?? ''}
                />
              </VStack>
            }
          </Box>
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Checkbox
              value="ytelseTilForeldreLoese"
              checked={!!anmodningOmMerInformasjon?.ytelseTilForeldreLoese}
              onChange={setAnmodningOmMerInformasjon}
            >
              Ytelse til foreldreløse
            </Checkbox>
            {!!anmodningOmMerInformasjon?.ytelseTilForeldreLoese &&
              <VStack gap="4">
                <EtterspurtInformasjonTyper
                  target="anmodningOmMerInformasjon.ytelseTilForeldreLoese"
                  namespace={namespace + '-ytelseTilForeldreLoese'}
                  error={validation[namespace + '-ytelseTilForeldreLoese-etterspurt-informasjon-typer']?.feilmelding}
                  initialOptions={etterspurtInformasjonsTyperYtelseTilForeldreLoese}
                  etterspurtInformasjon={anmodningOmMerInformasjon?.ytelseTilForeldreLoese}
                  updateReplySed={updateReplySed}
                />
                <TextArea
                  maxLength={255}
                  error={validation[namespace + '-ytelseTilForeldreLoese-ytterligereinformasjon']?.feilmelding}
                  namespace={namespace}
                  id='ytelseTilForeldreLoese-ytterligereinformasjon'
                  label={t('label:ytterligere-informasjon')}
                  onChanged={(v) => setYtterligereInfo("ytelseTilForeldreLoese", v)}
                  value={anmodningOmMerInformasjon.ytelseTilForeldreLoese.ytterligereInformasjon ?? ''}
                />
              </VStack>
            }
          </Box>
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Checkbox
              value="annenInformasjonOmBarnet"
              checked={!!anmodningOmMerInformasjon?.annenInformasjonOmBarnet}
              onChange={setAnmodningOmMerInformasjon}
            >
              Annen informasjon angående barnet
            </Checkbox>
            {!!anmodningOmMerInformasjon?.annenInformasjonOmBarnet &&
              <VStack gap="4">
                <EtterspurtInformasjonTyper
                  target="anmodningOmMerInformasjon.annenInformasjonOmBarnet"
                  namespace={namespace + '-annenInformasjonOmBarnet'}
                  error={validation[namespace + '-annenInformasjonOmBarnet-etterspurt-informasjon-typer']?.feilmelding}
                  initialOptions={etterspurtInformasjonsTyperAnnenInformasjonOmBarnet}
                  etterspurtInformasjon={anmodningOmMerInformasjon?.annenInformasjonOmBarnet}
                  updateReplySed={updateReplySed}
                />
                <TextArea
                  maxLength={255}
                  error={validation[namespace + '-annenInformasjonOmBarnet-ytterligereinformasjon']?.feilmelding}
                  namespace={namespace}
                  id='annenInformasjonOmBarnet-ytterligereinformasjon'
                  label={t('label:ytterligere-informasjon')}
                  onChanged={(v) => setYtterligereInfo("annenInformasjonOmBarnet", v)}
                  value={anmodningOmMerInformasjon.annenInformasjonOmBarnet.ytterligereInformasjon ?? ''}
                />
              </VStack>
            }
          </Box>
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Checkbox
              value="utdanning"
              checked={!!anmodningOmMerInformasjon?.utdanning}
              onChange={setAnmodningOmMerInformasjon}
            >
              Fremmøte på skole/høyskole/opplæring/arbeidsledighet
            </Checkbox>
            {!!anmodningOmMerInformasjon?.utdanning &&
              <VStack gap="4">
                <RadioPanelGroup
                  id={namespace + '-utdanning-type'}
                  value={anmodningOmMerInformasjon?.utdanning.type}
                  legend="Type opplæringsinstitusjon"
                  onChange={(v:string)=>setUtdanning("type", v)}
                  error={validation[namespace + '-utdanning-type']?.feilmelding}
                >
                  <FlexRadioPanels>
                    <RadioPanel value='skole'>Skole</RadioPanel>
                    <RadioPanel value='høyskole'>Høyskole</RadioPanel>
                    <RadioPanel value='universitet'>Universitet</RadioPanel>
                    <RadioPanel value='yrkesrettet_opplæring'>Yrkesrettet opplæring</RadioPanel>
                    <RadioPanel value='barnehage_daghjem'>Barnehage/Daghjem</RadioPanel>
                  </FlexRadioPanels>
                </RadioPanelGroup>
                <RadioPanelGroup
                  id={namespace + '-utdanning-typedeltakelse'}
                  value={anmodningOmMerInformasjon?.utdanning.typeDeltakelse}
                  legend="Type deltakelse"
                  onChange={(v:string)=>setUtdanning("typeDeltakelse", v)}
                  error={validation[namespace + '-utdanning-typedeltakelse']?.feilmelding}
                >
                  <FlexRadioPanels>
                    <RadioPanel value='deltid'>Deltid</RadioPanel>
                    <RadioPanel value='heltid'>Heltid</RadioPanel>
                  </FlexRadioPanels>
                </RadioPanelGroup>
                <Label>Faktisk deltakelse</Label>
                <RadioPanelGroup
                  value={anmodningOmMerInformasjon?.utdanning.timerPr}
                  legend="Timer pr"
                  onChange={(v:string)=>setUtdanning("timerPr", v)}
                >
                  <FlexRadioPanels>
                    <RadioPanel value='dag'>Dag</RadioPanel>
                    <RadioPanel value='uke'>Uke</RadioPanel>
                    <RadioPanel value='maaned'>Måned</RadioPanel>
                  </FlexRadioPanels>
                </RadioPanelGroup>
                <Input
                  error={validation[namespace + '-utdanning-timer']?.feilmelding}
                  namespace={namespace}
                  id='timer'
                  label="Antall timer"
                  onChanged={(v: string) => setUtdanning("timer", v)}
                  value={anmodningOmMerInformasjon?.utdanning.timer}
                />
                <TextArea
                  maxLength={255}
                  error={validation[namespace + '-utdanning-ytterligereinformasjon']?.feilmelding}
                  namespace={namespace}
                  id='utdanning-ytterligereinformasjon'
                  label={t('label:ytterligere-informasjon')}
                  onChanged={(v) => setYtterligereInfo("utdanning", v)}
                  value={anmodningOmMerInformasjon.utdanning.ytterligereInformasjon ?? ''}
                />
              </VStack>
            }
          </Box>
        </VStack>
      </PaddedDiv>
    </>
  )
}

export default EtterspurtInformasjon
