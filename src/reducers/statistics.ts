import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Action } from 'redux'

export interface StatisticsState {
  menuTime: {[k in string]: any}
  pageTime: {[k in string]: any}
}

export const initialUiState: StatisticsState = {
  menuTime: { personmanager: {}, formalmanager: {} },
  pageTime: { total: {}, selection: {}, editor: {} }
}

const statisticReducer = (state: StatisticsState = initialUiState, action: Action | ActionWithPayload = { type: '' }): StatisticsState => {
  switch (action.type) {
    case types.STATISTICS_MENU_START: {
      const domain = (action as ActionWithPayload).payload.domain
      const initialMenu = (action as ActionWithPayload).payload.initialMenu
      if (!initialMenu) {
        return state
      }
      return {
        ...state,
        menuTime: {
          ...state.menuTime,
          [domain]: {
            ...state.menuTime[domain],
            [initialMenu]: {
              date: new Date(),
              status: 'start',
              total: 0
            }
          }
        }
      }
    }

    case types.STATISTICS_PAGE_START:
      return {
        ...state,
        pageTime: {
          ...state.pageTime,
          [(action as ActionWithPayload).payload.page]: {
            date: new Date(),
            status: 'start',
            total: 0
          }
        }
      }

    case types.STATISTICS_MENU_FINISH: {
      const domain = (action as ActionWithPayload).payload.domain
      const finalObject: any = {}
      Object.keys(state.menuTime[domain]).forEach(menuKey => {
        finalObject[menuKey] = state.menuTime[domain][menuKey].total
      })

      standardLogger('svarsed.editor.' + domain + '.time', finalObject)
      return {
        ...state,
        menuTime: {
          ...state.menuTime,
          [domain]: {}
        }
      }
    }

    case types.STATISTICS_PAGE_FINISH: {
      const page = (action as ActionWithPayload).payload.page
      standardLogger('svarsed.' + page + '.time', state.pageTime[page].total)
      return {
        ...state,
        pageTime: {
          ...state.pageTime,
          [page]: {}
        }
      }
    }

    case types.STATISTICS_PAGE_LOG: {
      const previousPage = (action as ActionWithPayload).payload.previousPage
      const nextPage = (action as ActionWithPayload).payload.nextPage

      const newPageTime = _.cloneDeep(state.pageTime)

      if (newPageTime[previousPage] && newPageTime[previousPage].status === 'start') {
        const diff = new Date().getTime() - newPageTime[previousPage].date.getTime()
        const diffSeconds = Math.ceil(diff / 1000)
        newPageTime[previousPage] = {
          date: undefined,
          status: 'stop',
          total: newPageTime[previousPage].total += diffSeconds
        }
      }
      if (!_.isNil(nextPage)) {
        newPageTime[nextPage] = {
          date: new Date(),
          status: 'start',
          total: newPageTime[nextPage]?.total ?? 0
        }
      }

      return {
        ...state,
        pageTime: newPageTime
      }
    }

    case types.STATISTICS_MENU_LOG: {
      const domain = (action as ActionWithPayload).payload.domain
      const previousMenu = (action as ActionWithPayload).payload.previousMenu
      const nextMenu = (action as ActionWithPayload).payload.nextMenu

      const newStatistics = _.cloneDeep(state.menuTime[domain])

      if (!_.isNil(previousMenu) && newStatistics[previousMenu] && newStatistics[previousMenu].status === 'start') {
        const diff = new Date().getTime() - newStatistics[previousMenu].date.getTime()
        const diffSeconds = Math.ceil(diff / 1000)
        newStatistics[previousMenu] = {
          date: undefined,
          status: 'stop',
          total: newStatistics[previousMenu].total += diffSeconds
        }
      }
      if (!_.isNil(nextMenu)) {
        newStatistics[nextMenu] = {
          date: new Date(),
          status: 'start',
          total: newStatistics[nextMenu]?.total ?? 0
        }
      } else {
        // menu is offloading - stop all pages
        Object.keys(newStatistics).forEach(key => {
          if (newStatistics[key].status === 'start') {
            const diff = new Date().getTime() - newStatistics[key].date.getTime()
            const diffSeconds = Math.ceil(diff / 1000)
            newStatistics[key] = {
              date: undefined,
              status: 'stop',
              total: newStatistics[key].total += diffSeconds
            }
          }
        })
      }

      return {
        ...state,
        menuTime: {
          ...state.menuTime,
          [domain]: newStatistics
        }
      }
    }

    default:
      return state
  }
}

export default statisticReducer
