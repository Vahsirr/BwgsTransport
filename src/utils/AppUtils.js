import _ from "./AppLodash";


class EventEmitter {
  constructor() {
    this.events = {};
  }

  _getEventListByName(eventName) {
    if (typeof this.events[eventName] === 'undefined') {
      this.events[eventName] = new Set();
    }
    return this.events[eventName];
  }

  on(eventName, fn) {
    const eventList = this._getEventListByName(eventName);
    eventList.add(fn);

    return () => {
      this.removeListener(eventName, fn);
    };
  }

  once(eventName, fn) {
    const self = this;

    const onceFn = (...args) => {
      self.removeListener(eventName, onceFn);
      fn.apply(self, args);
    };
    this.on(eventName, onceFn);
  }

  emit(eventName, ...args) {
    this._getEventListByName(eventName).forEach(
      function (fn) {
        fn.apply(this, args);
      }.bind(this)
    );
  }

  removeListener(eventName, fn) {
    this._getEventListByName(eventName).delete(fn);
  }
}

class AppUtils{

    static setRoutes(config, defaultAuth) {
        let routes = [...config.routes];
    
        routes = routes.map((route) => {
          let auth = config.auth || config.auth === null ? config.auth : defaultAuth || null;
          auth = route.auth || route.auth === null ? route.auth : auth;
          const settings = _.merge({}, config.settings, route.settings);
    
          return {
            ...route,
            settings,
            auth,
          };
        });
    
        return [...routes];
      }

    static generateRoutesFromConfigs(configs, defaultAuth) {
        let allRoutes = [];
        configs.forEach((config) => {
          allRoutes = [...allRoutes, ...this.setRoutes(config, defaultAuth)];
        });
        return allRoutes;
      }

    static EventEmitter = EventEmitter

    static hasPermission(authArr, userRole) {
      if (authArr === null || authArr === undefined) {
        return true;
      }
      if (authArr.length === 0) {
        return !userRole || userRole.length === 0;
      }

      if (userRole && Array.isArray(userRole)) {
        return authArr.some((r) => userRole.indexOf(r) >= 0);
      }
      return authArr.includes(userRole);
    }
}

export default AppUtils