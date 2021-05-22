type RouteID = 'home'
  | 'manualParking'
  | 'automaticParking';

type Route = {
  path: string,
};

type Routes = Record<RouteID, Route>;

export const routes: Routes = {
  home: {
    path: '/',
  },
  manualParking: {
    path: '/manual-parking',
  },
  automaticParking: {
    path: '/automatic-parking',
  },
};
