import routes from './configs/routesConfig';
import store from './store';
import AppContext from './AppContext';
import { Provider } from 'react-redux';

const withAppProviders = (Component) => (props) => {
  const WrapperComponent = () => (
    <AppContext.Provider
      value={{
        routes,
      }}
    >
        <Provider store={store}>
            <Component {...props} />
        </Provider>
    </AppContext.Provider>
  );

  return WrapperComponent;
};

export default withAppProviders;
