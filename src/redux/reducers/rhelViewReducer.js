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

const rhelViewReducer = (state = initialState) => state;

rhelViewReducer.initialState = initialState;

export { rhelViewReducer as default, initialState, rhelViewReducer };
