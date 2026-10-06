// DEMO: example dishes of each menu (Inicio, «Ver platos»). They are NOT the definitive menus.
// Names and descriptions live in i18n (`dish.<id>.name` / `dish.<id>.desc`); allergens use the
// ids of the booking catalog (labels in i18n: `allergen.<id>`).
// Provisional photo: the same image for every dish until the real photos arrive.
import servilletaLazo from '../assets/images/servilleta-lazo.webp';

export const dishImage = servilletaLazo;

export type Dish = { id: string; allergens: string[] };

/** Dishes of each menu, keyed by the menu id of booking-catalog.ts. */
export const dishesByMenu: Record<string, Dish[]> = {
  coctel: [
    { id: 'tartaletas', allergens: ['gluten', 'lacteos'] },
    { id: 'croquetas', allergens: ['gluten', 'lacteos', 'huevo'] },
    { id: 'gazpacho', allergens: [] },
    { id: 'brochetas', allergens: [] },
  ],
  banquete: [
    { id: 'ensalada', allergens: ['pescado'] },
    { id: 'arroz', allergens: [] },
    { id: 'bacalao', allergens: ['pescado'] },
    { id: 'brownie', allergens: ['huevo', 'gluten', 'lacteos'] },
  ],
  mixto: [
    { id: 'bocados', allergens: ['gluten', 'lacteos'] },
    { id: 'crema', allergens: ['lacteos'] },
    { id: 'cordero', allergens: [] },
    { id: 'mesadulce', allergens: ['gluten', 'huevo', 'lacteos'] },
  ],
};
