const initialState = {
  view: {
    data: [],
    error: false,
    errorStatus: null,
    errorMessage: null,
    pending: false,
    fulfilled: false
  }
};

const viewReducer = (state = initialState) => state;

viewReducer.initialState = initialState;

export { viewReducer as default, initialState, viewReducer };
