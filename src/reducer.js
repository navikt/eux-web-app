import { combineReducers } from 'redux';

import { reducer as formReducer } from 'react-redux-form-validation';

export default combineReducers({
  form: formReducer,
});
