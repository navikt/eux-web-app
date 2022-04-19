import * as types from 'constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { AnyAction } from 'redux'

export interface StatisticsState {
  menuTime: {[k in string]: any}
  pageTime: {[k in string]: any}
}

export const initialUiState: StatisticsState = {
  menuTime: { TwoLevelForm: {}, formalmanager: {} },
  pageTime: { total: {}, selection: {}, editor: {} }
}

const statisticReducer = (state: StatisticsState = initialUiState, action: AnyAction): StatisticsState => {
  switch (action.type) {
    case types.STATISTICS_MENU_START: {
      const domain = (action as ActionWithPayload).payload.domain
      const initialMenu = (action as ActionWithPayload).payload.initialMenu
      if (!initialMenu) {
        return state
      }
      const _initialMenu = initialMenu?.replace(/\[\d+\]/g, '')
      return {
        ...state,
        menuTime: {
          ...state.menuTime,
          [domain]: {
            ...state.menuTime[domain],
            [_initialMenu]: {
              date: new Date(),
              status: 'start',
              total: {
                minutes: 0,
                seconds: 0
              }
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
            total: {
              minutes: 0,
              seconds: 0
            }
          }
        }
      }

    case types.STATISTICS_MENU_FINISH: {
      const domain = (action as ActionWithPayload).payload.domain
      const finalObject: any = {}
      Object.keys(state.menuTime[domain]).forEach(menuKey => {
        finalObject[menuKey] = {
          minutes: state.menuTime[domain][menuKey].total.minutes,
          seconds: state.menuTime[domain][menuKey].total.seconds
        }
      })

      Object.keys(finalObject).forEach(key => {
        standardLogger('svarsed.editor.' + domain + '.' + key + '.time', finalObject[key])
      })
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
        const totalSeconds = newPageTime[previousPage].total.seconds + diffSeconds
        const diffMinutes = Math.ceil(totalSeconds / 60)
        newPageTime[previousPage] = {
          date: undefined,
          status: 'stop',
          total: {
            minutes: diffMinutes,
            seconds: diffSeconds
          }
        }
      }
      if (!_.isNil(nextPage)) {
        newPageTime[nextPage] = {
          date: new Date(),
          status: 'start',
          total: newPageTime[nextPage]?.total ?? {
            minutes: 0,
            seconds: 0
          }
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

      // convert barn[0], barn[1] to barn
      const _previousMenu = previousMenu?.replace(/\[\d+\]/g, '')

      if (!_.isNil(_previousMenu) && newStatistics[_previousMenu] && newStatistics[_previousMenu].status === 'start') {
        const diff = new Date().getTime() - newStatistics[_previousMenu].date.getTime()
        const diffSeconds = Math.ceil(diff / 1000)
        const totalSeconds = newStatistics[_previousMenu].total.seconds + diffSeconds
        const diffMinutes = Math.ceil(totalSeconds / 60)

        newStatistics[_previousMenu] = {
          date: undefined,
          status: 'stop',
          total: {
            minutes: diffMinutes,
            seconds: diffSeconds
          }
        }
      }
      // convert barn[0], barn[1] to barn
      if (!_.isNil(nextMenu)) {
        const _nextMenu = nextMenu?.replace(/\[\d+\]/g, '')
        newStatistics[_nextMenu] = {
          date: new Date(),
          status: 'start',
          total: newStatistics[_nextMenu]?.total ?? {
            minutes: 0,
            seconds: 0
          }
        }
      } else {
        // menu is offloading - stop all pages
        Object.keys(newStatistics).forEach(key => {
          const _key = key?.replace(/\[\d+\]/g, '')
          if (newStatistics[_key].status === 'start') {
            const diff = new Date().getTime() - newStatistics[_key].date.getTime()
            const diffSeconds = Math.ceil(diff / 1000)
            const totalSeconds = newStatistics[_key].total.seconds + diffSeconds
            const diffMinutes = Math.ceil(totalSeconds / 60)
            newStatistics[_key] = {
              date: undefined,
              status: 'stop',
              total: {
                minutes: diffMinutes,
                seconds: diffSeconds
              }
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
