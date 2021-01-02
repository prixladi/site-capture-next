const HomeRoute = '/';
const AuthRoute = '/auth';
const SitesRoute = '/sites';
const SiteRoute = (id: string) => `sites/${id}`;
const TemplatesRoute = '/templates';
const TemplateRoute = (id: string) => `templates/${id}`;
const LogoutRoute = '/logout';

const GithubRoute = 'https://github.com/prixladi/site-capture-next';

export { HomeRoute, AuthRoute, SitesRoute, SiteRoute, TemplatesRoute, TemplateRoute, LogoutRoute };
export { GithubRoute };
