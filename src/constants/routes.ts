type RouteID = 'main'
  | 'manualParking'
  | 'automaticParking';

type Route = {
  path: string,
};

type Routes = Record<RouteID, Route>;

export const routes: Routes = {
  main: {
    path: '/',
  },
  manualParking: {
    path: '/manual-parking',
  },
  automaticParking: {
    path: '/automatic-parking',
  },
};
