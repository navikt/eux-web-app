import { createBrowserHistory } from 'history';

const contextPath = '/'; // defaulkt

const routerHistory = createBrowserHistory({
  basename: contextPath,
});
export default routerHistory;
