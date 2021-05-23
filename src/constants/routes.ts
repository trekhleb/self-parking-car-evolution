type RouteID = 'home';

type Route = {
  path: string,
};

type Routes = Record<RouteID, Route>;

export const routes: Routes = {
  home: {
    path: '/',
  },
};
