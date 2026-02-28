import { supabase } from "@/lib/supabase/client";
import { calculateFoodSpotScore, type RatingVector } from "@/lib/rating";

export type PlaceRecord = {
  id: string;
  name: string;
  category: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  price_level: number;
  status?: string;
  created_at?: string;
  review_count?: number;
  ks_score?: number;
  sabor?: number;
  servicio?: number;
  higiene?: number;
  precio_valor?: number;
  autenticidad?: number;
  rapidez?: number;
};

export async function fetchPlaces() {
  const { data, error } = await supabase
    .from("places_with_ks")
    .select("*")
    .order("ks_score", { ascending: false, nullsFirst: false });

  if (!error && data) {
    return data as PlaceRecord[];
  }

  const fallback = await supabase.from("places").select("*").eq("status", "approved");
  if (fallback.error) {
    throw fallback.error;
  }

  return ((fallback.data ?? []) as PlaceRecord[]).map((place) => ({
    ...place,
    review_count: 0,
    ks_score: 0,
  }));
}

export async function fetchAdminPlaces() {
  const { data, error } = await supabase
    .from("places")
    .select("id,name,category,district,address,lat,lng,price_level,status,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as PlaceRecord[];
}

export async function createPlace(input: {
  name: string;
  category: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  price_level: number;
}) {
  const { error } = await supabase.from("places").insert({
    ...input,
    status: "approved",
  });

  if (error) {
    throw error;
  }
}

export async function updatePlace(
  placeId: string,
  input: {
    name: string;
    category: string;
    district: string;
    address: string;
    lat: number;
    lng: number;
    price_level: number;
    status: string;
  },
) {
  const { error } = await supabase
    .from("places")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", placeId);

  if (error) {
    throw error;
  }
}

export async function deletePlace(placeId: string) {
  const { error } = await supabase.from("places").delete().eq("id", placeId);

  if (error) {
    throw error;
  }
}

export async function createReview(placeId: string, metrics: RatingVector, comment: string) {
  const { error } = await supabase.from("reviews").insert({
    place_id: placeId,
    sabor: metrics.sabor,
    servicio: metrics.servicio,
    higiene: metrics.higiene,
    precio_valor: metrics.precioValor,
    autenticidad: metrics.autenticidad,
    rapidez: metrics.rapidez,
    comment,
  });

  if (error) {
    throw error;
  }
}

export async function createPlaceRequest(input: {
  name: string;
  category: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  price_level: number;
  notes: string;
}) {
  const { error } = await supabase.from("place_requests").insert(input);
  if (error) {
    throw error;
  }
}

export async function createMarkRequest(bio: string) {
  const { error } = await supabase.from("mark_requests").insert({ bio });
  if (error) {
    throw error;
  }
}

export async function fetchPendingRequests() {
  const [markRequests, placeRequests] = await Promise.all([
    supabase.from("mark_requests").select("id,bio,status,created_at,profiles!mark_requests_user_id_fkey(full_name,email)").eq("status", "pending"),
    supabase.from("place_requests").select("id,name,category,district,address,status,created_at,profiles!place_requests_user_id_fkey(full_name,email)").eq("status", "pending"),
  ]);

  if (markRequests.error) {
    throw markRequests.error;
  }

  if (placeRequests.error) {
    throw placeRequests.error;
  }

  return {
    markRequests: markRequests.data ?? [],
    placeRequests: placeRequests.data ?? [],
  };
}

export async function approveMarkRequest(requestId: string) {
  const { error } = await supabase.rpc("approve_mark_request", {
    p_request_id: requestId,
  });

  if (error) {
    throw error;
  }
}

export async function approvePlaceRequest(requestId: string) {
  const { error } = await supabase.rpc("approve_place_request", {
    p_request_id: requestId,
  });

  if (error) {
    throw error;
  }
}

export async function rejectMarkRequest(
  requestId: string,
  reason: string,
  notes?: string
) {
  const { error } = await supabase.rpc("reject_mark_request", {
    p_request_id: requestId,
    p_reason: reason,
    p_notes: notes || null,
  });

  if (error) {
    throw error;
  }
}

export async function rejectPlaceRequest(
  requestId: string,
  reason: string,
  notes?: string
) {
  const { error } = await supabase.rpc("reject_place_request", {
    p_request_id: requestId,
    p_reason: reason,
    p_notes: notes || null,
  });

  if (error) {
    throw error;
  }
}

export async function fetchAuditLog() {
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw error;
  }

  return data || [];
}

export function normalizePlaceForUi(place: PlaceRecord) {
  const reviewCount = place.review_count ?? 0;

  const metric: RatingVector = {
    sabor: place.sabor ?? 0,
    servicio: place.servicio ?? 0,
    higiene: place.higiene ?? 0,
    precioValor: place.precio_valor ?? 0,
    autenticidad: place.autenticidad ?? 0,
    rapidez: place.rapidez ?? 0,
  };

  const ksScore =
    typeof place.ks_score === "number"
      ? place.ks_score
      : calculateFoodSpotScore(metric, reviewCount);

  return {
    ...place,
    reviewCount,
    metric,
    ksScore,
  };
}
