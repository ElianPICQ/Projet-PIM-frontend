interface VenteParJour {
    value: number;
    date: string;
}

export interface DashboardData {
    total_products: number;
    out_of_stock: number;
    low_stock: number;
    total_ventes: number;
    nb_achats: number;
    nb_ventes: number;
    nb_invendus: number;
    ventes_par_jour: VenteParJour[];
}