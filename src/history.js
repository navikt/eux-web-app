import { createBrowserHistory } from 'history';

const contextPath = '/'; // default

const routerHistory = createBrowserHistory({
  basename: contextPath,
});
export default routerHistory;
