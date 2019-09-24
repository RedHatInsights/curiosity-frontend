import _get from 'lodash/get';
import _join from 'lodash/join';
import _map from 'lodash/map';

const FULFILLED_ACTION = (base = '') => `${base}_FULFILLED`;

const PENDING_ACTION = (base = '') => `${base}_PENDING`;

const REJECTED_ACTION = (base = '') => `${base}_REJECTED`;

const getMessageFromResults = (results, filterField = null) => {
  const status = _get(results, 'response.status', results.status);
  const statusResponse = _get(results, 'response.statusText', results.statusText);
  const messageResponse = _get(results, 'response.data', results.message);
  const detailResponse = _get(results, 'response.data', results.detail);

  let serverStatus = '';

  if (!messageResponse && !detailResponse) {
    if (status < 400) {
      return statusResponse;
    }

    if (status >= 500 || status === undefined) {
      return `${status || ''} Server is currently unable to handle this request.`;
    }
  }

  if (status >= 500 || status === undefined) {
    serverStatus = status ? `${status} ` : '';
  }

  if (typeof messageResponse === 'string') {
    return `${serverStatus}${messageResponse}`;
  }

  if (typeof detailResponse === 'string') {
    return `${serverStatus}${detailResponse}`;
  }

  const getMessages = (messageObject, filterKey) => {
    const obj = filterKey ? messageObject[filterKey] : messageObject;

    return _map(
      obj,
      next => {
        if (Array.isArray(next)) {
          return getMessages(next);
        }

        return next;
      },
      null
    );
  };

  return `${serverStatus}${_join(getMessages(messageResponse || detailResponse, filterField), '\n')}`;
};

const getStatusFromResults = results => {
  let status = _get(results, 'response.status', results.status);

  if (status === undefined) {
    status = 0;
  }

  return status;
};

const setStateProp = (prop, data, options) => {
  const { state = {}, initialState = {}, reset = true } = options;
  let obj = { ...state };

  if (process.env.REACT_APP_ENV === 'development' && prop && !state[prop]) {
    console.error(`Error: Property ${prop} does not exist within the passed state.`, state);
  }

  if (process.env.REACT_APP_ENV === 'development' && reset && prop && !initialState[prop]) {
    console.warn(`Warning: Property ${prop} does not exist within the passed initialState.`, initialState);
  }

  if (reset && prop) {
    obj[prop] = {
      ...state[prop],
      ...initialState[prop],
      ...data
    };
  } else if (reset && !prop) {
    obj = {
      ...state,
      ...initialState,
      ...data
    };
  } else if (prop) {
    obj[prop] = {
      ...state[prop],
      ...data
    };
  } else {
    obj = {
      ...state,
      ...data
    };
  }

  return obj;
};

const generatedPromiseActionReducer = (types = [], state = {}, action = {}) => {
  const { type } = action;
  const expandedTypes = [];

  types.forEach(
    val =>
      (Array.isArray(val.type) && val.type.forEach(subVal => expandedTypes.push({ ref: val.ref, type: subVal }))) ||
      expandedTypes.push(val)
  );

  const [whichType] = expandedTypes.filter(val =>
    new RegExp(
      `^(${REJECTED_ACTION(val.type || val)}|${PENDING_ACTION(val.type || val)}|${FULFILLED_ACTION(val.type || val)})$`
    ).test(type)
  );

  if (!whichType) {
    return state;
  }

  const baseState = {
    error: false,
    errorMessage: '',
    fulfilled: false,
    metaData: action.meta && action.meta.data,
    metaId: action.meta && action.meta.id,
    metaQuery: action.meta && action.meta.query,
    pending: false,
    update: false
  };

  const setId = data =>
    (action.meta && action.meta.id && { [action.meta.id]: { ...baseState, ...data } }) || { ...baseState, ...data };

  switch (type) {
    case REJECTED_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        setId({
          error: true,
          errorMessage: getMessageFromResults(action.payload),
          errorStatus: getStatusFromResults(action.payload)
        }),
        {
          state
        }
      );
    case PENDING_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        setId({
          pending: true
        }),
        {
          state
        }
      );

    case FULFILLED_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        setId({
          date: action.payload.headers && action.payload.headers.date,
          data: (action.payload && action.payload.data) || {},
          fulfilled: true
        }),
        {
          state
        }
      );

    default:
      return state;
  }
};

const reduxHelpers = {
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
  generatedPromiseActionReducer,
  getMessageFromResults,
  getStatusFromResults,
  setStateProp
};

export { reduxHelpers as default, reduxHelpers };
