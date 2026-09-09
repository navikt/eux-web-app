import { Sed } from 'declarations/types'

export default (fnr: string): Array<Sed> => [
  {
    sedId: `${fnr}-f001-2025`,
    sedTittel: 'Anmodning om opplysninger ved årlig kontroll',
    sedType: 'F001',
    status: 'sent',
    sistEndretDato: '2025-09-01',
    sedHandlinger: ['Read']
  },
  {
    sedId: `${fnr}-f001-2025-supplement`,
    sedTittel: 'Supplerende opplysninger om familieforhold',
    sedType: 'F001',
    status: 'sent',
    sistEndretDato: '2025-06-12',
    sedHandlinger: ['Read']
  },
  {
    sedId: `${fnr}-f001-2024-arbeid`,
    sedTittel: 'Opplysninger om arbeid og inntekt',
    sedType: 'F001',
    status: 'received',
    sistEndretDato: '2024-11-20',
    sedHandlinger: ['Read']
  },
  {
    sedId: `${fnr}-f001-2024`,
    sedTittel: 'Bekreftelse av opplysninger for årlig kontroll',
    sedType: 'F001',
    status: 'sent',
    sistEndretDato: '2024-09-01',
    sedHandlinger: ['Read']
  },
  {
    sedId: `${fnr}-f001-2023`,
    sedTittel: 'Anmodning om opplysninger om bosted',
    sedType: 'F001',
    status: 'sent',
    sistEndretDato: '2023-09-15',
    sedHandlinger: ['Read']
  }
]
