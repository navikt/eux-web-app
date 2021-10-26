import * as statisticsActions from 'actions/statistics'
import * as types from 'constants/actionTypes'

describe('actions/ui', () => {

  it('startMenuStatistic()', () => {
    const domain = 'domain'
    const initialMenu = 'menu'
    const generatedResult = statisticsActions.startMenuStatistic(domain, initialMenu)
    expect(generatedResult).toMatchObject({
      type: types.STATISTICS_MENU_START,
      payload: {domain, initialMenu}
    })
  })

  it('finishMenuStatistic()', () => {
    const domain = 'domain'
    const generatedResult = statisticsActions.finishMenuStatistic(domain)
    expect(generatedResult).toMatchObject({
      type: types.STATISTICS_MENU_FINISH,
      payload: {domain}
    })
  })

  it('logMenuStatistic()', () => {
    const domain = 'domain'
    const previousMenu = 'previousMenu'
    const nextMenu = 'nextMenu'
    const generatedResult = statisticsActions.logMenuStatistic(domain, previousMenu, nextMenu)
    expect(generatedResult).toMatchObject({
      type: types.STATISTICS_MENU_LOG,
      payload: {domain, previousMenu, nextMenu}
    })
  })

  it('startPageStatistic()', () => {
    const page = 'page'
    const generatedResult = statisticsActions.startPageStatistic(page)
    expect(generatedResult).toMatchObject({
      type: types.STATISTICS_PAGE_START,
      payload: {page}
    })
  })

  it('logPageStatistics()', () => {
    const previousPage = 'previousPage'
    const nextPage = 'nextPage'
    const generatedResult = statisticsActions.logPageStatistics(previousPage, nextPage)
    expect(generatedResult).toMatchObject({
      type: types.STATISTICS_PAGE_LOG,
      payload: { previousPage, nextPage }
    })
  })

  it('finishPageStatistic()', () => {
    const page = 'page'
    const generatedResult = statisticsActions.finishPageStatistic(page)
    expect(generatedResult).toMatchObject({
      type: types.STATISTICS_PAGE_FINISH,
      payload: {page}
    })
  })
})
