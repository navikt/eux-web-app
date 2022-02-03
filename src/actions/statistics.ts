import * as types from 'constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'

export const startMenuStatistic = (domain: string, initialMenu: string | undefined): ActionWithPayload<any> => ({
  type: types.STATISTICS_MENU_START,
  payload: { domain, initialMenu }
})

export const finishMenuStatistic = (domain: string): ActionWithPayload<any> => ({
  type: types.STATISTICS_MENU_FINISH,
  payload: { domain }
})

export const logMenuStatistic = (domain: string, previousMenu: string | undefined, nextMenu: string | undefined): ActionWithPayload<any> => ({
  type: types.STATISTICS_MENU_LOG,
  payload: { domain, previousMenu, nextMenu }
})

export const startPageStatistic = (page: string): ActionWithPayload<any> => ({
  type: types.STATISTICS_PAGE_START,
  payload: { page }
})

export const logPageStatistics = (previousPage: string | undefined, nextPage: string | undefined): ActionWithPayload<any> => ({
  type: types.STATISTICS_PAGE_LOG,
  payload: { previousPage, nextPage }
})

export const finishPageStatistic = (page: string): ActionWithPayload<any> => ({
  type: types.STATISTICS_PAGE_FINISH,
  payload: { page }
})
