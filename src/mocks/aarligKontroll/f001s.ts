import { F001SearchResult } from 'declarations/types'

export default (fnr: string): Array<F001SearchResult> => [
  {
    sakId: '123',
    fagsak: {fnr, nr: '1/2025', system: 'AO11', tema: 'KON', type: 'FAGSAK'},
    sed: {
      sedId: `${fnr}-f001-2025`,
      sedTittel: 'Anmodning om opplysninger ved årlig kontroll',
      sedType: 'F001',
      status: 'sent',
      sistEndretDato: '2025-09-01',
      fagsak: {fnr, nr: '1/2025', system: 'AO11', tema: 'BAR', type: 'FAGSAK'},
      sedHandlinger: ['Read']
    }
  },
  {
    sakId: '234',
    fagsak: {fnr, nr: '2/2025', system: 'AO11', tema: 'KON', type: 'FAGSAK'},
    sed: {
      sedId: `${fnr}-f001-2025-supplement`,
      sedTittel: 'Supplerende opplysninger om familieforhold',
      sedType: 'F001',
      status: 'sent',
      sistEndretDato: '2025-06-12',
      sedHandlinger: ['Read']
    }
  },
  {
    sakId: '345',
    fagsak: {fnr, nr: '3/2024', system: 'AO11', tema: 'KON', type: 'FAGSAK'},
    sed: {
      sedId: `${fnr}-f001-2024-arbeid`,
      sedTittel: 'Opplysninger om arbeid og inntekt',
      sedType: 'F001',
      status: 'received',
      sistEndretDato: '2024-11-20',
      sedHandlinger: ['Read']
    }
  },
  {
    sakId: '456',
    fagsak: {fnr, nr: '4/2024', system: 'AO11', tema: 'KON', type: 'FAGSAK'},
    sed: {
      sedId: `${fnr}-f001-2024`,
      sedTittel: 'Bekreftelse av opplysninger for årlig kontroll',
      sedType: 'F001',
      status: 'sent',
      sistEndretDato: '2024-09-01',
      sedHandlinger: ['Read']
    }
  },
  {
    sakId: '567',
    fagsak: {fnr, nr: '5/2023', system: 'AO11', tema: 'KON', type: 'FAGSAK'},
    sed: {
      sedId: `${fnr}-f001-2023`,
      sedTittel: 'Anmodning om opplysninger om bosted',
      sedType: 'F001',
      status: 'sent',
      sistEndretDato: '2023-09-15',
      sedHandlinger: ['Read']
    }
  }
]
