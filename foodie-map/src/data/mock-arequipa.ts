import type { RatingVector } from "@/lib/rating";

export type VenueCategory =
  | "Restaurante"
  | "Café"
  | "Puesto callejero"
  | "Mercado";

export type FoodSpot = {
  id: string;
  name: string;
  category: VenueCategory;
  district: string;
  address: string;
  lat: number;
  lng: number;
  priceLevel: 1 | 2 | 3 | 4;
  reviewCount: number;
  rating: RatingVector;
};

export const AREQUIPA_CENTER: [number, number] = [-71.5375, -16.409];

export const initialRatingDraft: RatingVector = {
  sabor: 4.2,
  servicio: 4,
  higiene: 4,
  precioValor: 4.1,
  autenticidad: 4.3,
  rapidez: 3.8,
};

export const mockFoodSpots: FoodSpot[] = [
  {
    id: "s1",
    name: "La Nueva Palomino",
    category: "Restaurante",
    district: "Yanahuara",
    address: "Leoncio Prado 122, Yanahuara",
    lat: -16.3908,
    lng: -71.5487,
    priceLevel: 3,
    reviewCount: 128,
    rating: {
      sabor: 4.8,
      servicio: 4.4,
      higiene: 4.6,
      precioValor: 4.1,
      autenticidad: 4.7,
      rapidez: 4.2,
    },
  },
  {
    id: "s2",
    name: "Kafi Wasi",
    category: "Café",
    district: "Cercado",
    address: "Santa Catalina 210, Cercado",
    lat: -16.3982,
    lng: -71.5365,
    priceLevel: 2,
    reviewCount: 84,
    rating: {
      sabor: 4.4,
      servicio: 4.5,
      higiene: 4.6,
      precioValor: 4.3,
      autenticidad: 4,
      rapidez: 4.4,
    },
  },
  {
    id: "s3",
    name: "Adobo de Don Cucho",
    category: "Puesto callejero",
    district: "José Luis Bustamante",
    address: "Av. Dolores, frente al parque",
    lat: -16.4256,
    lng: -71.5304,
    priceLevel: 1,
    reviewCount: 57,
    rating: {
      sabor: 4.7,
      servicio: 3.8,
      higiene: 3.9,
      precioValor: 4.8,
      autenticidad: 4.9,
      rapidez: 4.3,
    },
  },
  {
    id: "s4",
    name: "Mercado San Camilo - Juguería Lupita",
    category: "Mercado",
    district: "Cercado",
    address: "Mercado San Camilo, puesto 18",
    lat: -16.4046,
    lng: -71.5428,
    priceLevel: 1,
    reviewCount: 102,
    rating: {
      sabor: 4.5,
      servicio: 4.1,
      higiene: 4,
      precioValor: 4.9,
      autenticidad: 4.8,
      rapidez: 4.6,
    },
  },
  {
    id: "s5",
    name: "Zig Zag Rooftop",
    category: "Restaurante",
    district: "Cercado",
    address: "Zela 210, Cercado",
    lat: -16.3987,
    lng: -71.5351,
    priceLevel: 4,
    reviewCount: 69,
    rating: {
      sabor: 4.6,
      servicio: 4.7,
      higiene: 4.8,
      precioValor: 3.9,
      autenticidad: 4.2,
      rapidez: 4,
    },
  },
  {
    id: "s6",
    name: "Café del Claustro",
    category: "Café",
    district: "Cercado",
    address: "Santa Catalina 301",
    lat: -16.3989,
    lng: -71.5369,
    priceLevel: 3,
    reviewCount: 46,
    rating: {
      sabor: 4.3,
      servicio: 4.4,
      higiene: 4.7,
      precioValor: 4,
      autenticidad: 3.9,
      rapidez: 4.1,
    },
  },
  {
    id: "s7",
    name: "Anticuchos de la Plaza",
    category: "Puesto callejero",
    district: "Cercado",
    address: "Calle Mercaderes, esquina plaza",
    lat: -16.3984,
    lng: -71.536,
    priceLevel: 1,
    reviewCount: 39,
    rating: {
      sabor: 4.6,
      servicio: 3.9,
      higiene: 3.7,
      precioValor: 4.7,
      autenticidad: 4.8,
      rapidez: 4.5,
    },
  },
  {
    id: "s8",
    name: "Mercado de Yanahuara - Caldos Doña Rosa",
    category: "Mercado",
    district: "Yanahuara",
    address: "Mercado Yanahuara, pasillo B",
    lat: -16.3901,
    lng: -71.5469,
    priceLevel: 1,
    reviewCount: 51,
    rating: {
      sabor: 4.4,
      servicio: 4,
      higiene: 4.1,
      precioValor: 4.8,
      autenticidad: 4.7,
      rapidez: 4.2,
    },
  },
];