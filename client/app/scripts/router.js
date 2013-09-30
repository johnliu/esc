var r = function(route, name, options) {
  options = options || {};

  return {
    route: route,
    name: name,
    path: options.path || route,
    icon: options.icon || null,
    routes: options.routes || null,
    expandable: Ember.isNone(options.expand) ? true : options.expand,
    hidden: options.hidden || false
  };
};

App.routes = [
  // Redirects
  r('redirect', '', { hidden: true }),
  r('redirect.dance', '', { path: '/dinnerdance', hidden: true }),

  r('index', 'Announcements', { icon: 'icon-bullhorn', path: '/' }),
  r('about', 'About', { icon: 'icon-info-sign' }),
  r('events', 'Events', { icon: 'icon-calendar', routes: [
    r('socials', 'Friday Night Socials'),
    r('smoker', 'Book Smoker', { hidden: true }),
    r('dance', 'Dinner Dance', { path: 'dinnerdance', expand: false, routes: [
      r('register', 'Registration'),
      r('sponsors', 'Sponsors')
    ]}),
    r('nocturne', 'Nocturne', { hidden: true }),
    r('foosball', 'Foosball Ladder', { hidden: true }),
    r('smash', 'Smash Ladder', { hidden: true })
  ]}),
  r('sports', 'Intramural Sports', { icon: 'icon-trophy', hidden: true }),
  r('merchandise', 'Merchandise', { icon: 'icon-tag', hidden: true }),
  r('suggestions', 'Suggestions', { icon: 'icon-pencil', hidden: true }),
  r('found', 'Lost and Found', { icon: 'icon-archive', hidden: true }),
  r('courses', 'Anti-Calendar', { icon: 'icon-book', hidden: true }),

  r('none', '404', { path: '*path', hidden: true })
];

App.Router.map(function() {
  // Recursively build routes.
  var buildRoutes = function(self, list, parentRoute, parentPath) {
    parentRoute = Ember.isNone(parentRoute) ? '' : parentRoute + '.';
    parentPath = Ember.isNone(parentPath) ? '' : parentPath + '/';

    list.forEach(function(route) {
      var path = route.path;
      var longPath = parentPath + path;
      var longRoute = parentRoute + route.route;

      // If there are subroutes recurse and build each subroute.
      if (!Ember.isNone(route.routes) && route.routes.length > 0) {
        this.resource(longRoute, { path: path }, function() {
          buildRoutes(this, route.routes, longRoute, longRoute);
        });

      } else {
        this.route(route.route, { path: path });
      }

      // Modify the current route to include the parent name.
      route.route = longRoute;
      route.path = longPath;
    }, self);
  };
  buildRoutes(this, App.routes);
});

App.Router.reopen({
  location: 'auto'
});
