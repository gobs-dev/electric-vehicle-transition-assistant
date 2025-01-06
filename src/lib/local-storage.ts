const EV_CARS_KEY = "ev-cars";
const AVAILABLE_EV_LIST_KEY = "available-ev-list";

const getStorage = (key: string) => {
  const data = window.localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const getStorageCars = () => getStorage(EV_CARS_KEY);

const getAvailableEvList = () => getStorage(AVAILABLE_EV_LIST_KEY);

const setStorageCars = (name: string, car: object) => {
  const cars = getStorageCars() || {};
  cars[name] = car;
  window.localStorage.setItem(EV_CARS_KEY, JSON.stringify(cars));
};

const setStorageAvailableEvList = (evList: string[]) =>
  window.localStorage.setItem(AVAILABLE_EV_LIST_KEY, JSON.stringify(evList));

export {
  getStorageCars,
  getAvailableEvList,
  setStorageCars,
  setStorageAvailableEvList,
};
