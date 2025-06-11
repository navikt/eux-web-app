import TopContainer from "../../components/TopContainer/TopContainer";
import {FeatureToggles} from "../../declarations/app";
import {State} from "../../declarations/reducers";
import {Alert, BodyLong, Box, Button, ErrorMessage, Heading, HStack, Loader, Textarea, VStack} from "@navikt/ds-react";
import {useAppSelector} from "../../store";
import {adminResetStatus, publishSedEvents} from "../../actions/admin";
import {useDispatch} from "react-redux";
import {useState} from "react";

export interface AdminPageSelector {
  featureToggles: FeatureToggles | null | undefined
  gettingSaksbehandler: boolean
  publishingSedEvents: boolean
  publishingSedEventsStatus: any
}

export const mapState = (state: State): AdminPageSelector => ({
  featureToggles: state.app.featureToggles,
  gettingSaksbehandler: state.loading.gettingSaksbehandler,
  publishingSedEvents: state.admin.publishingSedEvents,
  publishingSedEventsStatus: state.admin.publishingSedEventsStatus
})

export const AdminPage: React.FC = (): JSX.Element => {
  const { gettingSaksbehandler, featureToggles, publishingSedEvents, publishingSedEventsStatus }: AdminPageSelector = useAppSelector(mapState)
  const dispatch = useDispatch()

  const [_dokumentListe, _setDokumentListe] = useState<string>("")
  const [_missingValues, _setMissingValues] = useState<boolean>(false)

  const onPublishSedEvents = () => {
    _setMissingValues(false)
    if(publishingSedEventsStatus) dispatch(adminResetStatus())
    if(_dokumentListe !== ""){
      const documentArray = _dokumentListe.split("\n")
      const sedEvents = documentArray.map((d) => {
        const docParts = d.split("_")
        return {
          rinasakId: docParts[0],
          documentId: docParts[1],
          documentVersion: docParts[2]
        }
      })
      dispatch(publishSedEvents(sedEvents))
    } else {
      _setMissingValues(true)
    }
  }


  if(gettingSaksbehandler){
    return(
      <TopContainer title="Administrative verktøy">
        <VStack gap="4" padding="4">
          <HStack gap="4">
            <Loader/>
            Henter saksbehandlerinfo...
          </HStack>
        </VStack>
      </TopContainer>
    )
  }

  if(!featureToggles?.featureAdmin){
    return(
      <TopContainer title="Administrative verktøy">
        <VStack gap="4" padding="4">
          <Alert variant={"error"}>OBS! Du har ikke tilgang til denne siden</Alert>
        </VStack>
      </TopContainer>
    )
  }
  return (
    <TopContainer title="Administrative verktøy">
      <VStack gap="4">
        <HStack padding="4">
          <Box padding="4" borderWidth="1">
            <VStack gap="4">
              <div>
                <Heading size={"small"}>Publiser SED hendelser</Heading>
                <BodyLong size="small">
                  Publiserer SED hendelser til Kafka emnene <code>eessibasis.sedmottatt-v1</code> eller <code>eessibasis.sedsendt-v1</code>
                </BodyLong>
              </div>
              <HStack gap="4" align="end">
                <Textarea
                  label="SED hendelser"
                  description="<rinasakId>_<documentId>_<documentVersion>"
                  resize
                  style={{width: "28rem", height: ""}}
                  onChange={(e) => {
                    if(publishingSedEventsStatus) dispatch(adminResetStatus())
                    _setDokumentListe(e.target.value)
                  }}
                />
                <Button variant="primary" onClick={onPublishSedEvents} loading={publishingSedEvents} disabled={_dokumentListe === ""}>Publiser</Button>
              </HStack>
              {_missingValues &&
                <ErrorMessage>List cannot be empty</ErrorMessage>
              }
              {publishingSedEventsStatus && (publishingSedEventsStatus.status === "SUCCESS" || publishingSedEventsStatus.status === "PARTIAL SUCCESS") &&
                <Alert variant="success">
                  {publishingSedEventsStatus.message}
                  {publishingSedEventsStatus.status === "SUCCESS" &&
                    <>
                      <p>
                        Antall SED hendelser publisert: {publishingSedEventsStatus.successCount}<br/>
                      </p>
                    </>
                  }
                  {publishingSedEventsStatus.status === "PARTIAL SUCCESS" &&
                    <>
                      <p>
                        Antall SED hendelser uten feil: {publishingSedEventsStatus.successCount}<br/>
                        Antall SED hendelser med feil: {publishingSedEventsStatus.failureCount}
                      </p>
                    </>
                  }
                </Alert>
              }
              {publishingSedEventsStatus && publishingSedEventsStatus.status === "FAILURE" &&
                <Alert variant="error">
                  {publishingSedEventsStatus.message ? publishingSedEventsStatus.message : "Publisering av SED hendelser feilet"}
                </Alert>
              }
            </VStack>
          </Box>
        </HStack>
      </VStack>
    </TopContainer>
  )
}

export default AdminPage
