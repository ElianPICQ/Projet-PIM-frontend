import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProduitsComponent } from './pages/produits/produits.component';

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
];
