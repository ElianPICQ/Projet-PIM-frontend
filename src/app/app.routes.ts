import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProduitsComponent } from './pages/produits/produits.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { HistoriqueComponent } from './pages/historique/historique.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { protectedRouteGuard } from './protected-route.guard';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [protectedRouteGuard],
    },
    {
        path: 'produits',
        component: ProduitsComponent,
        canActivate: [protectedRouteGuard],
    },
    {
        path: 'stocks',
        component: StocksComponent,
        canActivate: [protectedRouteGuard],
    },
    {
        path: 'historique',
        component: HistoriqueComponent,
        canActivate: [protectedRouteGuard],
    },
    {
        path: 'profil',
        component: ProfilComponent,
        canActivate: [protectedRouteGuard],
    },
];
