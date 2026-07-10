import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/lib/theme-provider';
import { Layout } from '@/components/layout';

import Dashboard from '@/pages/dashboard';
import Transactions from '@/pages/transactions';
import Budgets from '@/pages/budgets';
import Reports from '@/pages/reports';
import Profile from '@/pages/profile';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/budgets" component={Budgets} />
        <Route path="/reports" component={Reports} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="pocketpilot-theme">
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
