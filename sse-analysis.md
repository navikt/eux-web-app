# SSE (Server-Sent Events) Analysis for EUX

> Full technical analysis of replacing polling with SSE in `eux-web-app` / `eux-neessi`
>
> Date: 2026-03-31

---

## Executive Summary

SSE is a **strong fit** for replacing the polling patterns in `eux-web-app`. The architecture is
server→client unidirectional (perfect for SSE), the Kafka event backbone already exists in the
EUX ecosystem, and NAIS fully supports SSE with proper configuration. The main challenges are
the BFF proxy layer (`server.mjs`), OBO token management for long-lived connections, and the
need for a new SSE endpoint in `eux-neessi`.

**Recommendation: YES — adopt SSE for SED status updates. Keep polling for session monitoring.**

---

## Table of Contents

1. [Current Polling Analysis](#1-current-polling-analysis-eux-web-app)
2. [NAIS Platform Analysis](#2-nais-platform-analysis-for-sse)
3. [eux-neessi Backend Fit](#3-eux-neessi-backend-fit-analysis)
4. [Kafka → SSE Event Pipeline](#4-kafka--sse-event-pipeline-analysis)
5. [User Experience (2026)](#5-user-experience-analysis-2026)
6. [SSE as Modern Tech (2026)](#6-sse-as-modern-tech-2026)
7. [Technical Implementation Plan](#7-technical-implementation-plan)
8. [Risk Analysis](#8-risk-analysis)
9. [Comparison Summary](#9-comparison-summary)
10. [Additional Considerations](#10-additional-considerations-for-eux)
11. [Conclusion](#11-conclusion)

---

## 1. Current Polling Analysis (eux-web-app)

### 1.1 Active Polling Patterns

The codebase contains **2 active polling implementations** and several one-time `setTimeout` calls
for UI transitions. There are no custom polling hooks (`useInterval`, `usePolling`), and no
server-side polling logic.

#### Session Monitor (KEEP AS POLLING)

| Attribute | Value |
|-----------|-------|
| **File** | `src/components/SessionMonitor/SessionMonitor.tsx` |
| **Interval** | 60,000ms (60 seconds), configurable via `checkInterval` prop |
| **Endpoints** | `GET /utgaardato`, `POST /reautentisering` |
| **Purpose** | Checks Wonderwall token/session expiry, auto-renews tokens |
| **Tech** | Uses `worker-timers` library (runs in Web Worker, doesn't block main thread) |
| **SSE fit** | ❌ Poor — auth infrastructure, not business data. Wonderwall doesn't expose SSE |

**How it works:**

```typescript
const SessionMonitor = ({ checkInterval = 1000 * 60, ... }) => {
  useEffect(() => {
    let intervalId: number = -1
    if (expirationTime !== undefined) {
      intervalId = setInterval(checkTimeout, checkInterval)
    }
    return () => {
      if (intervalId !== -1) clearInterval(intervalId)
    }
  }, [expirationTime, sessionEndsAt])
}
```

**Timing thresholds:**

| Threshold | Duration | Action |
|-----------|----------|--------|
| Warning | < 5 minutes | Show modal, highlight button |
| Auto-renew | < 30 minutes | Attempt token refresh |
| Force reload | < 1 second | Force page reload |

#### SED Journalføring Status (REPLACE WITH SSE ✅)

| Attribute | Value |
|-----------|-------|
| **File** | `src/applications/Journalfoering/SedUnderJournalfoeringEllerUkjentStatus/SedUnderJournalfoeringEllerUkjentStatus.tsx` |
| **Interval** | 1s ticks, actual API calls at 5s, 10s, and 59s (3 polls total) |
| **Endpoint** | `GET /v5/rinasaker/{saksnummer}/oversikt` (via `querySaks()`) |
| **Purpose** | Waits for SED journalføring status to change after an operation |
| **Auto-stops** | After 60 ticks (60 seconds max) |
| **SSE fit** | ✅ Excellent — this is exactly "wait for backend event, then update UI" |

**Current implementation:**

```typescript
useEffect(() => {
  let interval: string | number | NodeJS.Timeout | undefined
  let runs = 0
  interval = setInterval(() => {
    runs += 1
    if (runs === 60) {
      clearInterval(interval)
      return
    } else if (sak.sedUnderJournalfoeringEllerUkjentStatus &&
               (runs === 5 || runs === 10 || runs === 59)) {
      dispatch(querySaks(sak?.sakId, 'timer', runs >= 2, signal))
    }
  }, 1000);
  return () => { clearInterval(interval); controller?.abort(); }
}, [])
```

**Redux action types for polling:**

```typescript
SVARSED_SAKS_TIMER_REFRESH_REQUEST   // Polling started
SVARSED_SAKS_TIMER_REFRESH_SUCCESS   // Poll succeeded
SVARSED_SAKS_TIMER_REFRESH_FAILURE   // Poll failed
```

#### Unused SED Status (DEAD CODE)

| Attribute | Value |
|-----------|-------|
| **File** | `src/actions/svarsed.ts` — `getSedStatus()` |
| **Endpoint** | `GET /api/rina/sak/{rinaSakId}/sed/{sedId}/status` |
| **Status** | Defined but never called from any component. Only referenced in tests. |

### 1.2 The `querySaks` Action (Polling Core)

The `querySaks()` function in `src/actions/svarsed.ts` is the core of the polling system.
It supports three modes:

```typescript
export const querySaks = (
  saksnummerOrFnr: string,
  actiontype: 'new' | 'refresh' | 'timer' = 'new',
  mock2: boolean = false,
  signal?: AbortSignal,
  searchedFromFrontpage: boolean = false
): ActionWithPayload<Sed>
```

| Mode | Action Types | Used By |
|------|-------------|---------|
| `'new'` | `SVARSED_SAKS_REQUEST/SUCCESS/FAILURE` | Forside, SvarSed pages (initial load) |
| `'refresh'` | `SVARSED_SAKS_REFRESH_REQUEST/SUCCESS/FAILURE` | SEDView, SEDEdit (manual refresh) |
| `'timer'` | `SVARSED_SAKS_TIMER_REFRESH_REQUEST/SUCCESS/FAILURE` | SedUnderJournalfoeringEllerUkjentStatus (polling) |

### 1.3 Problems with Current Polling

| Problem | Impact |
|---------|--------|
| Hard 60s timeout | Misses slow status changes — if journalføring takes longer, user gets no feedback |
| Irregular intervals (5s, 10s, 59s) | Inconsistent UX, hard to reason about. Why not 5s, 15s, 30s? |
| No exponential backoff | All-or-nothing — polls 3 times then stops permanently |
| Wasted HTTP requests | Most polls return unchanged data — 2 of 3 requests are typically useless |
| No real-time feedback | User waits up to 59s for status update that may have happened in 2s |
| BFF overhead | Each poll triggers a fresh OBO token exchange (no token caching in server.mjs!) |
| No multi-user awareness | If another saksbehandler updates the same SED, the first user won't know |

### 1.4 Non-Polling Timers (Not Relevant to SSE)

The codebase also has one-time `setTimeout` calls that are NOT polling:

| File | Delay | Purpose |
|------|-------|---------|
| `pages/PDU1/PDU1.tsx` | 200ms | Navigation transition cleanup |
| `pages/SvarSed/SEDEdit.tsx` | 200ms | Post-send cleanup |
| `pages/SvarSed/SvarSed.tsx` | 200ms | Back-navigation cleanup |
| `applications/SvarSed/MainForm.tsx` | variable | Async DOM scroll/focus on validation errors |
| `applications/OpprettSak/FamilieRelasjoner/FamilieRelasjoner.tsx` | 500ms | Modal re-open animation |

These are fine as-is — no SSE needed.

---

## 2. NAIS Platform Analysis for SSE

### 2.1 Infrastructure Support

NAIS uses NGINX ingress controllers that **fully support SSE** with proper annotations.

**Required NAIS annotations for SSE:**

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"    # 1 hour
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"    # 1 hour
    nginx.ingress.kubernetes.io/proxy-buffering: "off"         # Critical for SSE!
```

**Why each annotation matters:**

| Annotation | Default | Required for SSE | Why |
|------------|---------|------------------|-----|
| `proxy-read-timeout` | 60s | 3600s (1 hour) | SSE connections live for minutes/hours |
| `proxy-send-timeout` | 60s | 3600s (1 hour) | Server sends events over long periods |
| `proxy-buffering` | `on` | `off` | **Critical** — NGINX buffers responses by default, which breaks SSE streaming |

**Additional response header (belt-and-suspenders):**

```
X-Accel-Buffering: no
```

This header tells NGINX to disable buffering for this specific response, even if the global
config has buffering enabled. Should be set by the backend or BFF.

### 2.2 Current NAIS Config State

#### eux-web-app (frontend BFF)

```yaml
# nais/nais.yaml (current)
spec:
  replicas:
    min: 1
    max: 1
    cpuThresholdPercentage: 50
  liveness:
    path: /internal/isAlive
    initialDelay: 45
  readiness:
    path: /internal/isReady
    initialDelay: 45
```

**Observations:**
- ❌ No ingress annotations → defaults to 60s timeout (breaks SSE)
- ⚠️ Replicas: 1 min, 1 max → all SSE connections on single pod (acceptable for EUX scale)
- ✅ Wonderwall sidecar with `autoLoginIgnorePaths: /api/**, /v2/**...` → SSE endpoint can
  live under `/api/events/**` and bypass Wonderwall auto-login

**Required changes:**
```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-buffering: "off"
```

#### eux-neessi (backend)

```yaml
# .nais/nais.yaml (current)
spec:
  liveness:
    path: /actuator/health
    initialDelay: 60
    timeout: 90
  readiness:
    path: /actuator/health
    initialDelay: 60
    timeout: 90
  replicas:
    min: {{ replicas.min }}
    max: {{ replicas.max }}
    cpuThresholdPercentage: 80
```

**Observations:**
- ✅ Health checks work independently of SSE connections
- ✅ Replicas configurable per environment
- ❌ No ingress annotations → would need same SSE annotations
- ⚠️ But eux-neessi is internal-only (no public ingress) — BFF talks to it pod-to-pod,
  so NGINX ingress timeouts only matter on eux-web-app's ingress

### 2.3 Wonderwall & Authentication

The frontend uses **Wonderwall** (Azure AD sidecar) for authentication. SSE connections need
special handling:

**Challenge:** The native browser `EventSource` API does NOT support custom HTTP headers.
You cannot set `Authorization: Bearer <token>` on an EventSource request.

**Three options:**

| Option | Approach | Recommendation |
|--------|----------|----------------|
| 1. `@microsoft/fetch-event-source` | Uses `fetch()` API with full header support | ✅ **Recommended** |
| 2. Cookie-based auth | Wonderwall sets session cookies automatically | ⚠️ Works but depends on cookie path matching |
| 3. Token as query param | `?token=eyJ...` | ❌ Security risk — tokens in server logs and browser history |

**Why Option 1 wins:** Since the BFF (`server.mjs`) does OBO token exchange by reading the
`Authorization` header, and `@microsoft/fetch-event-source` supports custom headers with
auto-reconnection, it fits perfectly.

**Token lifetime concern:** OBO tokens live ~1 hour. For long-lived SSE connections:
- Limit SSE connection lifetime to ~55 minutes
- Backend sends a `reconnect` event before token expires
- Client reconnects with a fresh token (SessionMonitor already handles token renewal)

---

## 3. eux-neessi Backend Fit Analysis

### 3.1 Current Architecture

```
┌──────────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────┐
│ eux-web-app  │     │ server.mjs  │     │ eux-neessi   │     │ RINA     │
│ (React)      │────▶│ (BFF)       │────▶│ (Spring Boot)│────▶│ (CPI)    │
└──────────────┘     └─────────────┘     └──────┬───────┘     └──────────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          ▼                     ▼                     ▼
                   ┌──────────────┐  ┌──────────────────┐  ┌────────────────┐
                   │ eux-rina-api │  │ eux-fagmodul-     │  │ eux-nav-       │
                   │              │  │ journalfoering    │  │ rinasak        │
                   └──────────────┘  └──────────────────┘  └────────────────┘
```

**eux-neessi tech stack:**
- Java 25 / Spring Boot (inherits from `eux-parent-pom` 2.0.7)
- `spring-boot-starter-web` (Spring MVC, blocking — NOT WebFlux)
- Lombok, Caffeine caching, Resilience4j
- No Kafka consumers currently (publishes SED events via eux-rina-api proxy)
- No WebFlux/reactive dependencies
- Connects to 10+ downstream services (PDL, SAF, Dokarkiv, RINA, etc.)

### 3.2 SSE Implementation Options

#### Option A: Spring MVC SseEmitter (Recommended ✅)

```java
@RestController
@RequiredArgsConstructor
public class SakEventController {

    private final SakEventService sakEventService;

    @GetMapping(value = "/api/events/sak/{sakId}",
                produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamSakEvents(@PathVariable String sakId) {
        SseEmitter emitter = new SseEmitter(3600_000L); // 1 hour timeout
        sakEventService.subscribe(sakId, emitter);
        emitter.onCompletion(() -> sakEventService.unsubscribe(sakId, emitter));
        emitter.onTimeout(() -> sakEventService.unsubscribe(sakId, emitter));
        emitter.onError(e -> sakEventService.unsubscribe(sakId, emitter));
        return emitter;
    }
}
```

| Pro | Con |
|-----|-----|
| ✅ Works with existing Spring MVC stack | ⚠️ Holds a thread per connection |
| ✅ No new dependencies needed | |
| ✅ Simple, well-documented API | |
| ✅ Proven pattern in Spring Boot | |

**Thread usage:** With ~tens of concurrent users, each potentially having 1-2 SSE connections,
we're looking at 20-40 threads max. Spring Boot's default Tomcat thread pool is 200. This is
perfectly acceptable for EUX's scale.

#### Option B: Spring WebFlux Flux\<ServerSentEvent\>

```java
@GetMapping(value = "/api/events/sak/{sakId}",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<ServerSentEvent<SakEvent>> streamSakEvents(@PathVariable String sakId) {
    return sakEventService.getEventStream(sakId);
}
```

| Pro | Con |
|-----|-----|
| ✅ Non-blocking, scales to thousands of connections | ❌ Requires adding WebFlux + Reactor dependencies |
| ✅ More elegant reactive API | ❌ Significant architectural shift |
| | ❌ Overkill for EUX's user scale |
| | ❌ Mixing WebFlux and MVC can cause subtle issues |

**Recommendation: Option A (SseEmitter)** — simplest path, fits existing stack, more than
sufficient for EUX's scale. Don't add WebFlux complexity for a problem that doesn't need it.

### 3.3 SseEmitter Registry Pattern

```java
@Service
public class SseEmitterRegistry {

    private final ConcurrentHashMap<String, Set<SseEmitter>> subscriptions =
        new ConcurrentHashMap<>();

    public void subscribe(String sakId, SseEmitter emitter) {
        subscriptions.computeIfAbsent(sakId, k ->
            ConcurrentHashMap.newKeySet()).add(emitter);
    }

    public void unsubscribe(String sakId, SseEmitter emitter) {
        Set<SseEmitter> emitters = subscriptions.get(sakId);
        if (emitters != null) {
            emitters.remove(emitter);
            if (emitters.isEmpty()) subscriptions.remove(sakId);
        }
    }

    public void sendToSubscribers(String sakId, Object event) {
        Set<SseEmitter> emitters = subscriptions.get(sakId);
        if (emitters == null) return;

        List<SseEmitter> deadEmitters = new ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                    .name("sak-update")
                    .data(event, MediaType.APPLICATION_JSON));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        }
        deadEmitters.forEach(e -> unsubscribe(sakId, e));
    }
}
```

---

## 4. Kafka → SSE Event Pipeline Analysis

### 4.1 Existing Kafka Infrastructure

The EUX ecosystem already has active Kafka topics and consumers:

**Topics:**
- `eessibasis.sedmottatt-v1` — SED received events (inbound from foreign institutions)
- `eessibasis.sedsendt-v1` — SED sent events (outbound to foreign institutions)

**Published by:** `eux-rina-api` (processes RINA notifications → publishes to Kafka)

**Consumed by:** `eux-fagmodul-journalfoering` — this is the service that **performs the
journalføring** that the frontend is polling for!

```java
// SedMottattKafkaConsumer.java in eux-fagmodul-journalfoering
@KafkaListener(
    clientIdPrefix = "sedMottatt",
    topics = "${eessi.topic.sedMottatt}",
    containerFactory = "sedMottattListenerContainerFactory"
)
public void sedMottatt(ConsumerRecord<String, SedHendelse> consumerRecord) {
    MdcLogger.initialize(consumerRecord);
    SedHendelse sedHendelse = consumerRecord.value();
    try {
        sedHendelse.validateAndUpdateNavBruker();
        inngaaendeSedFacade.journalfoerInngaaendeSed(sedHendelse);
    } catch (Exception e) {
        slackService.post("Behandling av inngående SED mislyktes.", sedHendelse);
        throw e;
    }
    meterRegistry.counter(METRICS_COUNTER_SEDMOTTATT).increment();
}

// SedSendtKafkaConsumer.java in eux-fagmodul-journalfoering
@KafkaListener(
    clientIdPrefix = "sedSendt",
    topics = "${eessi.topic.sedSendt}",
    containerFactory = "sedSendtListenerContainerFactory"
)
public void sedSendt(ConsumerRecord<String, SedHendelse> consumerRecord) {
    MdcLogger.initialize(consumerRecord);
    SedHendelse sedHendelse = consumerRecord.value();
    try {
        sedHendelse.validateAndUpdateNavBruker();
        utgaaendeSedFacade.journalfoerUtgaaendeSed(sedHendelse);
    } catch (Exception e) {
        slackService.post("Behandling av utgående SED mislyktes.", sedHendelse);
        throw e;
    }
    meterRegistry.counter(METRICS_COUNTER_SEDSENDT).increment();
}
```

**The `SedHendelse` payload:**

```java
public class SedHendelse {
    private long id;
    private String sedId;
    private String sektorKode;
    private String bucType;
    private String rinaSakId;        // ← Key for SSE routing
    private String avsenderId;
    private String avsenderNavn;
    private String avsenderLand;
    private String mottakerId;
    private String mottakerNavn;
    private String mottakerLand;
    private String rinaDokumentId;
    private String rinaDokumentVersjon;
    private String sedType;
    private String navBruker;
}
```

### 4.2 Why This is Significant

The journalføring process that the frontend polls for is **already triggered by Kafka events**.
The flow today:

```
RINA → eux-rina-api → Kafka (sedmottatt/sedsendt)
                              ↓
                    eux-fagmodul-journalfoering → Dokarkiv (journalpost created)
                              ↓
                    (status updated in DB somewhere)
                              ↓
                    frontend polls → eventually sees updated status
```

With SSE, we can close the loop:

```
RINA → eux-rina-api → Kafka (sedmottatt/sedsendt)
                              ↓                    ↓
                    eux-fagmodul-journalfoering    eux-neessi (new consumer group)
                              ↓                    ↓
                    Dokarkiv                     SseEmitter registry
                                                   ↓
                                         SSE stream → BFF → Browser (instant!)
```

### 4.3 Two Approaches for Kafka → SSE

#### Approach A: eux-neessi Consumes Existing Topics Directly

eux-neessi adds `@KafkaListener` on the same `sedmottatt-v1` and `sedsendt-v1` topics,
using a **different consumer group** (so it doesn't steal messages from eux-fagmodul-journalfoering).

```java
@KafkaListener(
    topics = "${eessi.topic.sedMottatt}",
    groupId = "eux-neessi-sse",  // separate from eux-fagmodul-journalfoering
    containerFactory = "sedMottattListenerContainerFactory"
)
public void onSedMottatt(ConsumerRecord<String, SedHendelse> record) {
    SedHendelse hendelse = record.value();
    sseEmitterRegistry.sendToSubscribers(hendelse.getRinaSakId(),
        new SakEvent("sed-mottatt", hendelse.getSedType(), hendelse.getRinaSakId()));
}
```

| Pro | Con |
|-----|-----|
| ✅ No changes to eux-fagmodul-journalfoering | ⚠️ eux-neessi gets raw SED events, not journalføring status |
| ✅ Instant — event arrives same time as to journalføring | ⚠️ Doesn't know if journalføring succeeded or failed |
| ✅ Simple setup | ⚠️ May need to combine with a REST call to get actual status |

#### Approach B: eux-fagmodul-journalfoering Publishes Completion Events (Recommended ✅)

eux-fagmodul-journalfoering publishes a **new** topic (e.g., `eessibasis.journalfoering-status-v1`)
when journalføring completes or fails. eux-neessi consumes this purpose-built topic.

```java
// In eux-fagmodul-journalfoering, after journalføring completes:
kafkaTemplate.send("eessibasis.journalfoering-status-v1",
    new JournalfoeringSedStatus(rinaSakId, sedId, "COMPLETED", journalpostId));

// Or on failure:
kafkaTemplate.send("eessibasis.journalfoering-status-v1",
    new JournalfoeringSedStatus(rinaSakId, sedId, "FAILED", errorMessage));
```

| Pro | Con |
|-----|-----|
| ✅ Purpose-built events — exactly what the frontend needs | ⚠️ Requires changes to eux-fagmodul-journalfoering |
| ✅ Contains completion status (success/failure) | ⚠️ New Kafka topic to manage |
| ✅ eux-neessi doesn't need to interpret raw SED events | |
| ✅ Can include journalpost ID for immediate linking | |

**Recommendation:** Start with **Approach A** for quick wins (SED lifecycle events push
to browser immediately). Then add **Approach B** for journalføring-specific status once
the SSE pipeline is proven.

### 4.4 Is Kafka → SSE a Good Idea?

**YES.** Here's why:

| Pro | Detail |
|-----|--------|
| Natural event source | Kafka topics already carry SED lifecycle events — no new event generation needed |
| Decoupled | eux-neessi doesn't need to poll RINA or other services for status |
| Scalable | Kafka handles backpressure and replay — if eux-neessi restarts, it catches up |
| Reliable | Events are persisted in Kafka with configurable retention — no lost updates |
| Existing infrastructure | Kafka is standard on NAIS, Aiven-managed, no new infra to provision |
| Proven pattern | eux-fagmodul-journalfoering already uses `@KafkaListener` — same pattern |

| Caveat | Mitigation |
|--------|------------|
| Not all status changes publish to Kafka today | Incrementally expand event publishing in eux-rina-api |
| Kafka consumer adds complexity to eux-neessi | Use Spring Kafka `@KafkaListener` — proven in eux-fagmodul-journalfoering |
| Need to filter events per user/sak | Filter by `rinaSakId` in KafkaListener, dispatch to matching SseEmitter |
| Journalføring completion not explicitly on Kafka | Start with Approach A (raw events), evolve to Approach B (status events) |
| Consumer group management | Dedicated consumer group `eux-neessi-sse`, separate from journalfoering |
| Multiple replicas | Each pod gets a subset of partitions — need to route SSE connections to correct pod, or use broadcast approach |

### 4.5 Event Filtering Strategy

Not every Kafka event should reach every browser tab. The filtering chain:

```
Kafka event (all SEDs across all saker)
    ↓ filter by rinaSakId
SseEmitter registry (only emitters watching this sakId)
    ↓ send to matching emitters
Browser (only tabs with this sak open)
```

```java
@KafkaListener(topics = "eessibasis.sedmottatt-v1", groupId = "eux-neessi-sse")
public void onSedMottatt(SedHendelse event) {
    // Only push to clients watching this specific rinaSakId
    sseEmitterRegistry.sendToSubscribers(
        event.getRinaSakId(),
        SakEvent.of("sed-mottatt", event)
    );
}
```

---

## 5. User Experience Analysis (2026)

### 5.1 Current UX Problems

1. **Blind waiting** — Saksbehandler submits a journalføring, then sees a spinner for up to
   59 seconds with no feedback about what's happening behind the scenes

2. **Stale data** — If polling stops after 60 seconds, the user sees outdated status.
   They have to manually refresh to check if anything changed

3. **Manual F5 habit** — Caseworkers learn to refresh the page to check status, which is
   a poor user experience and indicates the UI isn't providing timely information

4. **No multi-user awareness** — If another saksbehandler updates the same SED, the first
   user doesn't see the change until they manually refresh. This can lead to conflicts
   and confusion

5. **Silent failures** — If journalføring fails after the 60s polling window, the user
   never gets notified unless they come back and check

### 5.2 SSE-Powered UX Improvements

| Feature | Before (Polling) | After (SSE) |
|---------|-------------------|-------------|
| **Status update latency** | 5-59 seconds | < 1 second |
| **Journalføring feedback** | Spinner → hope it works → maybe refresh | Real-time progress: "Mottatt" → "Journalført" → "Ferdig" |
| **Multi-user awareness** | None | Toast: "SED oppdatert av en annen saksbehandler" |
| **SED received notification** | Only visible on page refresh | Instant in-app notification |
| **Data freshness** | Stale after 60s | Always current while tab is open |
| **Failure notification** | Silent (user must check manually) | Immediate error alert |
| **Server load** | 3+ HTTP requests per journalføring wait | 1 persistent connection, 0 wasted requests |

### 5.3 Concrete UX Scenarios

**Scenario 1: Saksbehandler sends a SED**
- *Today:* Click "Send" → spinner → polls at 5s, 10s, 59s → eventually sees "Sendt"
- *With SSE:* Click "Send" → spinner → SSE event arrives in ~1s → status updates instantly

**Scenario 2: Inbound SED from another country**
- *Today:* Saksbehandler has no idea until they search or refresh the case list
- *With SSE:* While viewing a case, a toast appears: "Ny SED mottatt: H001 fra Sverige"

**Scenario 3: Journalføring takes 90 seconds**
- *Today:* Polling stops at 60s. User sees stale status. Manual refresh needed.
- *With SSE:* SSE connection stays open. Event arrives at 90s. Status updates automatically.

---

## 6. SSE as Modern Tech (2026)

### 6.1 Industry Adoption

SSE is the **recommended standard** for server-to-client real-time updates in 2026:

| Who | How they use SSE |
|-----|-----------------|
| **OpenAI / ChatGPT** | Token-by-token streaming of AI responses |
| **GitHub** | Real-time CI/CD status updates, Copilot streaming |
| **Vercel** | Build log streaming, deployment status |
| **Stripe** | Payment status webhooks → dashboard updates |
| **Most AI platforms** | LLM response streaming (the "typing" effect) |

### 6.2 Technology Comparison (2026 Benchmarks)

| Dimension | Polling | SSE | WebSocket |
|-----------|---------|-----|-----------|
| **Latency** | 500ms–60s | 50–100ms | < 50ms |
| **Throughput** | Medium | High (one-way) | High (bidirectional) |
| **Server connections/core** | N/A (request-response) | 50k+ | 10k |
| **Bandwidth efficiency** | Low (HTTP headers per request) | High (single connection) | Highest |
| **Browser connection limit** | N/A | HTTP/1.1: 6/domain; HTTP/2: 100+ | Unlimited |
| **Auto-reconnection** | Must implement | Built-in (EventSource API) | Must implement |
| **Infrastructure complexity** | Low | Low-Medium | High |
| **Reverse proxy support** | Universal | Needs buffering disabled | Needs WS upgrade support |
| **Auth integration** | Simple (per-request) | Medium (long-lived) | Complex |
| **Direction** | Client → Server | Server → Client | Bidirectional |

### 6.3 Why SSE Over WebSocket for EUX

EUX's real-time needs are **unidirectional** (server → client):

- "A SED was received" → push to browser ✅
- "Journalføring completed" → push to browser ✅
- "SED status changed" → push to browser ✅

There is NO need for:
- Real-time chat between users ❌
- Collaborative document editing ❌
- Live multiplayer interaction ❌

**WebSocket would be overengineered** for EUX. It adds:
- WebSocket upgrade handling in NGINX
- Sticky sessions or session affinity
- Custom reconnection logic
- More complex auth (no HTTP headers after upgrade)
- No proven WebSocket usage at NAV/NAIS

SSE gives EUX everything it needs with half the complexity.

### 6.4 HTTP/2 Makes SSE Even Better

NAIS applications serve over HTTP/2. This eliminates SSE's historical weakness:

- **HTTP/1.1:** Max 6 connections per domain → SSE uses 1 of 6 → limits other requests
- **HTTP/2:** Multiplexed streams → SSE and regular API requests share one TCP connection →
  no connection limit impact

This means an EUX page can have an SSE connection open AND make regular API calls without
any penalty.

---

## 7. Technical Implementation Plan

### 7.1 BFF (server.mjs) Changes

The BFF is the **biggest technical challenge**. It currently has:

1. **60-second global timeout** (`app.use(timeout('60s'))`) — must be bypassed for SSE
2. **No streaming support** — `http-proxy-middleware` needs configuration
3. **OBO token per request** — SSE is one long request; token may expire

**Proposed changes:**

```javascript
import { createProxyMiddleware } from 'http-proxy-middleware';

// SSE-specific route — BEFORE the global timeout middleware,
// or exempted from it
app.use('/api/events',
  // Skip the 60s timeout for SSE connections
  apiAuth(process.env.VITE_NEESSI_BACKEND_TOKEN_SCOPE),
  createProxyMiddleware({
    target: process.env.VITE_NEESSI_BACKEND_URL,
    changeOrigin: true,
    xfwd: true,
    // Critical SSE proxy settings:
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('Authorization', res.locals.on_behalf_of_authorization);
      proxyReq.removeHeader('cookie');
    },
    onProxyRes: (proxyRes, req, res) => {
      // Ensure no buffering at any layer
      proxyRes.headers['X-Accel-Buffering'] = 'no';
      proxyRes.headers['Cache-Control'] = 'no-cache';
      proxyRes.headers['Connection'] = 'keep-alive';
    }
  })
);
```

**Token refresh strategy:**

The OBO token has a ~1 hour lifetime. For SSE:
1. eux-neessi sends a heartbeat every 30s (keeps connection alive)
2. After ~55 minutes, eux-neessi sends a special `reconnect` event
3. Client closes connection and reconnects with a fresh token
4. This aligns with the existing SessionMonitor token refresh cycle

### 7.2 eux-neessi Changes

1. **Add `spring-kafka` dependency** (if not already via parent-pom)
2. **Kafka consumer** — `@KafkaListener` for `sedmottatt-v1` and `sedsendt-v1`
   with consumer group `eux-neessi-sse`
3. **SseEmitter registry** — Thread-safe `ConcurrentHashMap<sakId, Set<SseEmitter>>`
4. **SSE endpoint** — `GET /api/events/sak/{sakId}` returning `SseEmitter`
5. **Heartbeat scheduler** — `@Scheduled` task sending `:ping` every 30s
6. **NAIS config** — Add Kafka consumer config, update `accessPolicy` if needed
7. **Metrics** — Prometheus counter for active SSE connections, events sent

### 7.3 eux-web-app Changes

1. **Install `@microsoft/fetch-event-source`** — SSE client with header support
2. **Custom hook `useSakEvents`** — Manages SSE connection lifecycle

```typescript
import { fetchEventSource } from '@microsoft/fetch-event-source';

export const useSakEvents = (sakId: string | undefined) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!sakId) return;

    const controller = new AbortController();

    fetchEventSource(`/api/events/sak/${sakId}`, {
      signal: controller.signal,

      onopen(response) {
        if (response.ok) {
          console.log('SSE connected for sak:', sakId);
        }
      },

      onmessage(event) {
        if (event.event === 'sak-update') {
          const data = JSON.parse(event.data);
          dispatch(handleSakEvent(data));
        }
        // Ignore heartbeat/ping events
      },

      onclose() {
        // Server closed connection — auto-reconnect
        console.log('SSE connection closed, will reconnect');
      },

      onerror(err) {
        // Exponential backoff is built-in
        console.error('SSE error:', err);
      },
    });

    return () => controller.abort();
  }, [sakId, dispatch]);
};
```

3. **Replace polling** — Remove `setInterval` in `SedUnderJournalfoeringEllerUkjentStatus`,
   use `useSakEvents` instead
4. **New Redux actions** for SSE events:

```typescript
export const SVARSED_SSE_SAK_UPDATE = 'SVARSED/SSE/SAK_UPDATE';
export const SVARSED_SSE_CONNECTED = 'SVARSED/SSE/CONNECTED';
export const SVARSED_SSE_DISCONNECTED = 'SVARSED/SSE/DISCONNECTED';
```

5. **Fallback** — Keep polling as fallback if SSE connection fails (graceful degradation)

### 7.4 Incremental Rollout Strategy

| Phase | Scope | Risk |
|-------|-------|------|
| **Phase 1: Prototype** | SSE through server.mjs → static "hello" events from eux-neessi | Low — validates BFF streaming works |
| **Phase 2: Kafka consumer** | eux-neessi consumes sedmottatt/sedsendt → pushes via SSE | Medium — new Kafka consumer group |
| **Phase 3: Frontend hook** | `useSakEvents` hook, used alongside existing polling | Low — additive, doesn't replace anything yet |
| **Phase 4: Replace polling** | Remove `SedUnderJournalfoeringEllerUkjentStatus` polling, use SSE | Medium — behavioral change |
| **Phase 5: Expand** | SSE for forside/dashboard live updates, multi-user awareness | Low-Medium — more SSE event types |
| **Phase 6: Completion events** | eux-fagmodul-journalfoering publishes journalføring status to new topic | Medium — cross-service change |

---

## 8. Risk Analysis

### 8.1 Risks & Mitigations

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| BFF proxy doesn't stream SSE correctly | **High** | Medium | Prototype early (Phase 1). `http-proxy-middleware` supports SSE with config. Test with `curl` before building frontend. |
| OBO token expires during SSE connection | **High** | High (certain) | 55-min max connection lifetime. Server sends `reconnect` event. Client auto-reconnects with fresh token. |
| Wonderwall interferes with SSE endpoint | **Medium** | Low | SSE endpoint under `/api/**` (already excluded from `autoLoginIgnorePaths`). Cookie auth flows through. |
| Kafka events missing for some status changes | **Medium** | Medium | Start with what's available (sedmottatt/sedsendt). Incrementally add missing event publishers. |
| SseEmitter connection leak (emitters not cleaned up) | **Medium** | Medium | `onCompletion` + `onTimeout` + `onError` cleanup. Periodic sweep of dead emitters. |
| Multiple replicas: SSE connection on pod A, Kafka event on pod B | **Medium** | Low (currently 1 replica) | For single replica: non-issue. For multi-replica: broadcast events via Redis pub/sub or all pods consume all partitions. |
| Thread exhaustion from too many SseEmitters | **Low** | Low | EUX has ~tens of concurrent users. 50 SseEmitters uses 50 of 200 Tomcat threads. Monitor via metrics. |
| Client reconnection storms after deployment | **Low** | Medium | Stagger reconnections with jitter. `@microsoft/fetch-event-source` has built-in exponential backoff. |

### 8.2 What NOT to Use SSE For

| Use Case | Keep Using | Why |
|----------|-----------|-----|
| Session monitoring | Polling (60s) | Wonderwall auth infrastructure, not business data |
| File uploads/downloads | Standard HTTP | Binary data, request-response pattern |
| Form submissions | Standard POST | Client → server, not server → client |
| Initial data loading | Standard GET | One-time fetch, not ongoing stream |
| PDF preview | Standard GET | Binary response, not event stream |

**SSE is specifically for:** "Something happened on the server — notify the client."

---

## 9. Comparison Summary

| Dimension | Polling (Current) | SSE (Proposed) | WebSocket (Alternative) |
|-----------|-------------------|----------------|-------------------------|
| **Latency** | 5–59 seconds | < 1 second | < 50ms |
| **Server load** | High (repeated requests) | Low (one connection) | Low (one connection) |
| **Bandwidth** | High (HTTP headers per poll) | Low (event stream) | Lowest |
| **Implementation complexity** | Low | Medium | High |
| **NAIS support** | Native | Supported (annotations needed) | Not proven at NAV |
| **BFF impact** | None | Moderate (proxy config + timeout) | Major (WS upgrade + separate proxy) |
| **Browser support** | Universal | Universal (2026) | Universal |
| **Auth integration** | Simple (per-request token) | Medium (long-lived, reconnect) | Complex (no HTTP headers after upgrade) |
| **Auto-reconnection** | N/A (new request each time) | Built-in (EventSource API) | Must implement manually |
| **Bidirectional** | No | No | Yes |
| **HTTP/2 multiplexing** | N/A | Yes (shares connection) | No (separate TCP) |
| **Needed for EUX?** | Baseline | ✅ Right fit | ❌ Overkill |

---

## 10. Additional Considerations for EUX

### 10.1 Observability

SSE connections should be observable:

```java
// Prometheus metrics in eux-neessi
@Component
public class SseMetrics {
    private final AtomicInteger activeConnections = new AtomicInteger(0);
    private final Counter eventsSent;

    // Gauge: eux_neessi_sse_connections_active
    // Counter: eux_neessi_sse_events_sent_total
    // Counter: eux_neessi_sse_connection_errors_total
}
```

Dashboard in Grafana:
- Active SSE connections (should correlate with active users)
- Events sent per second
- Connection duration histogram
- Reconnection rate (high rate = something wrong)

### 10.2 Graceful Degradation

The frontend should work with OR without SSE:

```typescript
const useSakEvents = (sakId: string | undefined) => {
  const [connected, setConnected] = useState(false);

  // SSE connection logic...

  // If SSE fails to connect after 3 retries, fall back to polling
  if (!connected && retryCount >= 3) {
    return useFallbackPolling(sakId);
  }
};
```

### 10.3 Testing Strategy

| Layer | Test Approach |
|-------|--------------|
| **eux-neessi SSE endpoint** | Integration test with `WebTestClient` subscribing to SSE |
| **eux-neessi Kafka → SSE** | Integration test: publish to embedded Kafka, verify SSE event |
| **server.mjs proxy** | Manual test with `curl` against dev environment |
| **Frontend hook** | Jest test with mocked `fetchEventSource` |
| **E2E** | Playwright test: trigger action → verify UI updates without refresh |

### 10.4 Local Development

For local development (`npm run dev`), the SSE endpoint needs to be available:

```typescript
// vite.config.ts — add proxy for SSE endpoint
server: {
  proxy: {
    '/api/events': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      // Don't buffer SSE responses
      configure: (proxy) => {
        proxy.on('proxyRes', (proxyRes) => {
          proxyRes.headers['Cache-Control'] = 'no-cache';
        });
      },
    },
  },
}
```

Or use a mock SSE server for frontend-only development.

### 10.5 Connection Lifecycle

```
Browser                     BFF (server.mjs)              eux-neessi
   │                             │                             │
   │── GET /api/events/sak/123 ──▶                             │
   │                             │── GET /api/events/sak/123 ──▶
   │                             │                             │── subscribe(123, emitter)
   │◀── 200 OK (text/event-stream) ◀── 200 OK ────────────────│
   │                             │                             │
   │                             │              [Kafka event for sak 123]
   │                             │                             │── sendToSubscribers(123)
   │◀── data: {"type":"sed-mottatt"} ◀─────────────────────────│
   │                             │                             │
   │              [30s heartbeat]│                             │
   │◀── :ping ──────────────────── ◀── :ping ─────────────────│
   │                             │                             │
   │              [~55 min]      │                             │
   │◀── event: reconnect ───────── ◀── event: reconnect ──────│
   │                             │                             │── unsubscribe(123, emitter)
   │── (close connection) ───────▶                             │
   │                             │                             │
   │── GET /api/events/sak/123 ──▶ (new OBO token)            │
   │                             │── GET /api/events/sak/123 ──▶
   │◀── 200 OK (text/event-stream) ◀──────────────────────────│
   │                             │                             │
   ...continues...
```

---

## 11. Conclusion

### Verdict: SSE is the right technology for EUX in 2026

**Why:**

1. ✅ **Solves real UX problems** — delayed status updates, wasted polling, blind waiting
2. ✅ **Fits the architecture** — unidirectional server→client, no bidirectional needed
3. ✅ **Kafka backbone exists** — `sedmottatt-v1` and `sedsendt-v1` topics already carry the events
4. ✅ **Proven pattern** — `eux-fagmodul-journalfoering` already uses `@KafkaListener` on these topics
5. ✅ **NAIS supports it** — just needs ingress annotations
6. ✅ **Spring MVC SseEmitter** — works with existing eux-neessi stack, no WebFlux needed
7. ✅ **2026 industry standard** — used by ChatGPT, GitHub, Vercel, etc.
8. ✅ **HTTP/2** — eliminates historical SSE connection limit concerns

**What to keep as polling:**
- ❌ Session monitoring (Wonderwall auth, not business data)

**Priority order:**
1. Prototype SSE through server.mjs proxy (validate BFF streaming)
2. Add `SseEmitter` endpoint in eux-neessi
3. Add Kafka consumer in eux-neessi for SED events
4. Build `useSakEvents` hook in eux-web-app
5. Replace journalføring polling with SSE
6. Expand to other status-dependent views (forside dashboard, multi-user awareness)
7. Add journalføring completion events from eux-fagmodul-journalfoering (Approach B)

**Estimated effort:** Medium — the hardest part is getting SSE streaming through the BFF
proxy (`server.mjs`) with correct timeout/buffering configuration. The backend
(`SseEmitter` + `@KafkaListener`) and frontend (`useSakEvents` hook) parts are
straightforward given the existing patterns.
