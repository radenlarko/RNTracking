import React, {createContext, useEffect, useReducer, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

enum ActionKind {
  RETRIEVE_DATA = 'RETRIEVE_DATA',
  SET_INTERVAL_ID = 'SET_INTERVAL_ID',
}

enum StorageKind {
  intervalId = 'intervalId',
}

type ACTIONTYPE =
  | {
      type: ActionKind.RETRIEVE_DATA;
      isLoading?: boolean;
      intervalId: number | null;
    }
  | {
      type: ActionKind.SET_INTERVAL_ID;
      isLoading?: boolean;
      intervalId: number | null;
    };

interface State {
  isLoading: boolean;
  intervalId: number | null;
  setIntervalId: (id: number | null) => Promise<void>;
}

interface Props {
  children: React.ReactNode;
}

const initialState: State = {
  isLoading: true,
  intervalId: null,
  setIntervalId: async () => {},
};

export const MainContext = createContext<State>(initialState);

const dataReducer = (prevState: State, action: ACTIONTYPE) => {
  switch (action.type) {
    case ActionKind.RETRIEVE_DATA:
      return {
        ...prevState,
        intervalId: action.intervalId,
        isLoading: false,
      };
    case ActionKind.SET_INTERVAL_ID:
      return {
        ...prevState,
        intervalId: action.intervalId,
        isLoading: false,
      };
    default:
      return {
        ...prevState,
        isLoading: false,
      };
  }
};

const ContextProvider = ({children}: Props): JSX.Element => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const intervalIdStorage = await AsyncStorage.getItem(
          StorageKind.intervalId,
        );

        const intervalId =
          intervalIdStorage === 'null'
            ? null
            : intervalIdStorage === null
            ? null
            : Number(intervalIdStorage);

        console.log(`intervalId: ${intervalId}`);

        return dispatch({
          type: ActionKind.RETRIEVE_DATA,
          intervalId,
        });
      } catch (err: unknown) {
        console.log('error retrieve: ', err);
        return dispatch({
          type: ActionKind.RETRIEVE_DATA,
          intervalId: null,
        });
      }
    };

    setTimeout(() => {
      retrieveData();
    }, 1000);
  }, []);

  const setIntervalId = useCallback(async (id: number | null) => {
    try {
      await AsyncStorage.setItem(StorageKind.intervalId, String(id));
      return dispatch({type: ActionKind.SET_INTERVAL_ID, intervalId: id});
    } catch (error) {
      console.log('error clear cart: ', error);
      return dispatch({type: ActionKind.SET_INTERVAL_ID, intervalId: 0});
    }
  }, []);

  return (
    <MainContext.Provider
      value={{
        ...state,
        setIntervalId,
      }}>
      {children}
    </MainContext.Provider>
  );
};

export default ContextProvider;
