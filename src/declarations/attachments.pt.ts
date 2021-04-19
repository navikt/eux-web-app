import { JoarkBrowserType } from 'applications/Vedlegg/JoarkBrowser/JoarkBrowser'
import PT from 'prop-types'

export const JoarkFileVariantPropType = PT.shape({
  variantformat: PT.string.isRequired,
  filnavn: PT.string.isRequired
})

export const JoarkDocPropType = PT.shape({
  dokumentInfoId: PT.string.isRequired,
  tittel: PT.string.isRequired,
  dokumentvarianter: PT.arrayOf(JoarkFileVariantPropType).isRequired
})

export const JoarkPosterPropType = PT.shape({
  journalpostId: PT.string.isRequired,
  tittel: PT.string.isRequired,
  tema: PT.string.isRequired,
  datoOpprettet: PT.instanceOf(Date).isRequired,
  tilleggsopplysninger: PT.arrayOf(PT.string),
  dokumenter: PT.arrayOf(JoarkDocPropType).isRequired
})

export const JoarkFilePropType = PT.shape({
  journalpostId: PT.string.isRequired,
  dokumentInfoId: PT.string.isRequired,
  variant: JoarkFileVariantPropType.isRequired,
  title: PT.string.isRequired,
  tema: PT.string.isRequired,
  date: PT.instanceOf(Date).isRequired
})

export const JoarkFilesPropType = PT.arrayOf(JoarkFilePropType.isRequired)

const ContentPropType = PT.shape({
  base64: PT.string.isRequired
})

export const JoarkBrowserItemWithContentPropType = PT.shape({
  dokumentInfoId: PT.string.isRequired,
  journalpostId: PT.string.isRequired,
  variant: JoarkFileVariantPropType.isRequired,
  title: PT.string.isRequired,
  tema: PT.string.isRequired,
  date: PT.instanceOf(Date).isRequired,

  content: ContentPropType.isRequired,
  name: PT.string.isRequired,
  size: PT.number.isRequired,
  mimetype: PT.string.isRequired
})

export const JoarkBrowserItemFileType = PT.shape({
  key: PT.string.isRequired,
  hasSubrows: PT.bool.isRequired,
  type: PT.oneOf<JoarkBrowserType>(['joark']).isRequired,
  journalpostId: PT.string.isRequired,
  dokumentInfoId: PT.string.isRequired,
  variant: JoarkFileVariantPropType.isRequired,
  title: PT.string.isRequired,
  tema: PT.string.isRequired,
  date: PT.instanceOf(Date).isRequired
})

export const JoarkBrowserItemsFileType = PT.arrayOf(JoarkBrowserItemFileType.isRequired)

export const SEDAttachmentPayloadPropType = PT.shape({
  aktoerId: PT.string.isRequired,
  rinaId: PT.string.isRequired,
  rinaDokumentId: PT.string.isRequired
})
