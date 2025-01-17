import { JoarkBrowserMode, JoarkBrowserType } from 'applications/Vedlegg/JoarkBrowser'
import { Context, Item } from '@navikt/tabell'

export interface JoarkFileVariant {
  variantformat: string
  filnavn: string | null
}

export interface JoarkDoc {
  dokumentInfoId: string
  tittel?: string | null | undefined
  dokumentvarianter: Array<JoarkFileVariant>
  dokumentstatus: string | null
  datoFerdigstilt: string | null
}

export interface JoarkPoster {
  journalpostId: string
  journalstatus: string
  journalposttype: string
  tittel: string
  tema: string
  datoOpprettet: string
  tilleggsopplysninger?: Array<any> | null
  dokumenter: Array<JoarkDoc>
  sak: JoarkSak | null
  relevanteDatoer: Array<JoarkRelevantDato>
}

export interface JoarkSak {
  arkivsaksnummer: string | undefined
}

export interface JoarkRelevantDato {
  dato: string
  datotype: string
}

export type JoarkType = 'joark'

export interface JoarkFile {
  type: JoarkType

  journalpostId: string
  dokumentInfoId: string
  variant: JoarkFileVariant | undefined

  title: string | null | undefined
  tema: string
  date: Date
}

interface Content {
  base64: string
}

export interface JoarkPreview {
  fileName: string | undefined
  contentType: string
  filInnhold: string
}

export interface JoarkBrowserItem extends Item {
  hasSubrows: boolean
  type: JoarkBrowserType

  journalpostId: string
  dokumentInfoId: string | undefined
  variant: JoarkFileVariant | undefined

  title: string
  tema: string | undefined
  date: Date
  status: string | undefined
  saksid: string | undefined
  regSentDate: Date | undefined | null
  sensitivt?: boolean
}

export type JoarkBrowserItems = Array<JoarkBrowserItem>

export interface JoarkBrowserItemWithContent extends JoarkBrowserItem {
  content: Content
  name: string
  size: number
  mimetype: string
}

export interface JoarkBrowserContext extends Context {
  existingItems: JoarkBrowserItems
  gettingJoarkFile: boolean
  clickedPreviewItem: JoarkBrowserItem | undefined,
  mode: JoarkBrowserMode
}

export interface JoarkList {
  data: {
    dokumentoversiktBruker: {
      journalposter: Array<JoarkPoster>
    }
  }
}

export interface SEDAttachmentPayload {
  fnr?: string
  rinaId?: string
  rinaDokumentId?: string
}

export interface SEDAttachmentPayloadWithFile extends SEDAttachmentPayload {
  journalpostId: string
  dokumentInfoId: string
  variantformat: string
  filnavn: string
  sensitivt?: boolean
}

export interface SavingAttachmentsJob {
  total: JoarkBrowserItems
  saved: JoarkBrowserItems
  saving: JoarkBrowserItem | undefined
  remaining: JoarkBrowserItems
}
