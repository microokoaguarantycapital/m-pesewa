/**
 * M-PESEWA STATE MANAGEMENT CORE
 * Lightweight Redux-like store implementation for PWA
 */

// Create a simple store
export function createStore(reducer, initialState, enhancer) {
  let state = initialState;
  let listeners = [];
  
  const getState = () => state;
  
  const dispatch = (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    
    state = reducer(state, action);
    listeners.forEach(listener => listener());
    return action;
  };
  
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };
  
  const replaceReducer = (nextReducer) => {
    reducer = nextReducer;
    dispatch({ type: '@@INIT' });
  };
  
  // Initialize store
  dispatch({ type: '@@INIT' });
  
  if (enhancer) {
    return enhancer(createStore)(reducer, initialState);
  }
  
  return { getState, dispatch, subscribe, replaceReducer };
}

// Combine reducers
export function combineReducers(reducers) {
  return (state = {}, action) => {
    const nextState = {};
    let hasChanged = false;
    
    Object.keys(reducers).forEach(key => {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    });
    
    return hasChanged ? nextState : state;
  };
}

// Create slice helper
export function createSlice({ name, initialState, reducers, selectors = {} }) {
  const actionCreators = {};
  const actionTypes = {};
  
  // Create action creators
  Object.keys(reducers).forEach(reducerName => {
    const actionType = `${name}/${reducerName}`;
    actionTypes[reducerName] = actionType;
    
    actionCreators[reducerName] = (payload) => ({
      type: actionType,
      payload
    });
  });
  
  // Create reducer
  const reducer = (state = initialState, action) => {
    const reducerName = action.type.replace(`${name}/`, '');
    if (reducers[reducerName]) {
      return reducers[reducerName](state, action);
    }
    return state;
  };
  
  // Add selectors to action creators for convenience
  Object.keys(selectors).forEach(selectorName => {
    actionCreators[selectorName] = selectors[selectorName];
  });
  
  return {
    name,
    reducer,
    actions: actionCreators,
    actionTypes,
    selectors
  };
}

// Apply middleware
export function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState) => {
    const store = createStore(reducer, initialState);
    let dispatch = () => {
      throw new Error('Dispatching while constructing middleware');
    };
    
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    };
    
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = chain.reduce((a, b) => (...args) => a(b(...args)))(store.dispatch);
    
    return {
      ...store,
      dispatch
    };
  };
}

// Thunk middleware for async actions
export const thunkMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  return next(action);
};

// Persist middleware for localStorage
export const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Persist specific slices
  const state = store.getState();
  
  if (state.navigation) {
    localStorage.setItem('mpesewa_navigation_state', JSON.stringify(state.navigation));
  }
  
  if (state.notification) {
    localStorage.setItem('mpesewa_notification_state', JSON.stringify(state.notification));
  }
  
  if (state.audit) {
    localStorage.setItem('mpesewa_audit_state', JSON.stringify(state.audit));
  }
  
  return result;
};

// Logger middleware for development
export const loggerMiddleware = (store) => (next) => (action) => {
  console.groupCollapsed(`Dispatching: ${action.type}`);
  console.log('Previous State:', store.getState());
  console.log('Action:', action);
  const result = next(action);
  console.log('Next State:', store.getState());
  console.groupEnd();
  return result;
};

// Initialize store with all slices
export function initializeMpesewaStore() {
  // Import slices (they would be imported in the main store file)
  const slices = {
    navigation: require('./slices/navigation.slice.js').default,
    notification: require('./slices/notification.slice.js').default,
    audit: require('./slices/audit.slice.js').default
  };
  
  // Combine reducers
  const rootReducer = combineReducers(slices);
  
  // Create initial state
  const initialState = {
    navigation: require('./slices/navigation.slice.js').initializeNavigation(),
    notification: require('./slices/notification.slice.js').initializeNotificationSystem(),
    audit: require('./slices/audit.slice.js').initializeAuditSystem()
  };
  
  // Apply middleware
  const middleware = applyMiddleware(
    thunkMiddleware,
    require('./slices/navigation.slice.js').hierarchyValidationMiddleware,
    require('./slices/notification.slice.js').notificationMiddleware,
    require('./slices/audit.slice.js').auditMiddleware,
    persistMiddleware,
    process.env.NODE_ENV === 'development' ? loggerMiddleware : null
  ).filter(Boolean);
  
  // Create store
  const store = createStore(rootReducer, initialState, middleware);
  
  return store;
}

// Export store utilities
export default {
  createStore,
  combineReducers,
  createSlice,
  applyMiddleware,
  thunkMiddleware,
  persistMiddleware,
  loggerMiddleware,
  initializeMpesewaStore
};