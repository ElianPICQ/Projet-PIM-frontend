import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProduitsComponent } from './pages/produits/produits.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { HistoriqueComponent } from './pages/historique/historique.component';
import { ProfilComponent } from './pages/profil/profil.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'produits',
        component: ProduitsComponent,
    },
    {
        path: 'stocks',
        component: StocksComponent,
    },
    {
        path: 'historique',
        component: HistoriqueComponent,
    },
    {
        path: 'profil',
        component: ProfilComponent,
    },
];
