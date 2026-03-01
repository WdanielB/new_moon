"use client";

import { useEffect, useState } from "react";
import { RequireRole } from "@/components/route-guards";
import {
  approveMarkRequest,
  approvePlaceRequest,
  createPlace,
  deletePlace,
  fetchAdminPlaces,
  fetchPendingRequests,
  rejectMarkRequest,
  rejectPlaceRequest,
  fetchAuditLog,
  updatePlace,
  type PlaceRecord,
} from "@/lib/ks-api";

type PendingData = Awaited<ReturnType<typeof fetchPendingRequests>>;

type RejectionModal = null | {
  type: "mark" | "place";
  id: string;
  name: string;
};

export default function SuperUserPage() {
  const [data, setData] = useState<PendingData>({ markRequests: [], placeRequests: [] });
  const [places, setPlaces] = useState<PlaceRecord[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [rejectionModal, setRejectionModal] = useState<RejectionModal>(null);
  const [rejectionForm, setRejectionForm] = useState({ reason: "", notes: "" });
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [placeForm, setPlaceForm] = useState({
    name: "",
    category: "Restaurante",
    district: "Cercado",
    address: "",
    lat: -16.4,
    lng: -71.53,
    price_level: 2,
    status: "approved",
  });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const [next, placesRows, logs] = await Promise.all([
        fetchPendingRequests(),
        fetchAdminPlaces(),
        fetchAuditLog(),
      ]);
      setData(next);
      setPlaces(placesRows);
      setAuditLog(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar solicitudes");
    }
  };

  const resetPlaceForm = () => {
    setEditingPlaceId(null);
    setPlaceForm({
      name: "",
      category: "Restaurante",
      district: "Cercado",
      address: "",
      lat: -16.4,
      lng: -71.53,
      price_level: 2,
      status: "approved",
    });
  };

  const submitPlace = async () => {
    try {
      setError(null);

      if (editingPlaceId) {
        await updatePlace(editingPlaceId, {
          name: placeForm.name,
          category: placeForm.category,
          district: placeForm.district,
          address: placeForm.address,
          lat: Number(placeForm.lat),
          lng: Number(placeForm.lng),
          price_level: Number(placeForm.price_level),
          status: placeForm.status,
        });
      } else {
        await createPlace({
          name: placeForm.name,
          category: placeForm.category,
          district: placeForm.district,
          address: placeForm.address,
          lat: Number(placeForm.lat),
          lng: Number(placeForm.lng),
          price_level: Number(placeForm.price_level),
        });
      }

      resetPlaceForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar place");
    }
  };

  const beginEditPlace = (place: PlaceRecord) => {
    setEditingPlaceId(place.id);
    setPlaceForm({
      name: place.name,
      category: place.category,
      district: place.district,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      price_level: place.price_level,
      status: "status" in place && typeof place.status === "string" ? place.status : "approved",
    });
  };

  const removePlace = async (placeId: string) => {
    try {
      setError(null);
      await deletePlace(placeId);
      if (editingPlaceId === placeId) {
        resetPlaceForm();
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar place");
    }
  };

  const handleRejectRequest = async () => {
    try {
      setError(null);
      if (!rejectionForm.reason) {
        setError("La razón es requerida");
        return;
      }

      if (rejectionModal?.type === "mark") {
        await rejectMarkRequest(rejectionModal.id, rejectionForm.reason, rejectionForm.notes);
      } else if (rejectionModal?.type === "place") {
        await rejectPlaceRequest(rejectionModal.id, rejectionForm.reason, rejectionForm.notes);
      }

      setRejectionModal(null);
      setRejectionForm({ reason: "", notes: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo rechazar solicitud");
    }
  };

  const openRejectionModal = (type: "mark" | "place", id: string, name: string) => {
    setRejectionModal({ type, id, name });
    setRejectionForm({ reason: "", notes: "" });
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <RequireRole role="super_user">
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 md:px-6">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Panel super_user</h1>
              <p className="text-sm text-muted-foreground">Aprueba MARKS y nuevos KS Points.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAuditLog(!showAuditLog)}
              className="rounded-md border border-border px-3 py-1.5 text-xs"
            >
              {showAuditLog ? "Ocultar" : "Ver"} Audit Log
            </button>
          </div>
        </section>

        {showAuditLog && (
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-lg font-semibold">Audit Log</h2>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {auditLog.map((entry: any) => (
                <div key={entry.id} className="rounded-md border border-border bg-background/40 p-2 text-xs">
                  <p className="font-medium">{entry.action}</p>
                  <p className="text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString()} · {entry.resource_type}
                  </p>
                  {entry.details && <p className="mt-1 text-muted-foreground">{JSON.stringify(entry.details)}</p>}
                </div>
              ))}
              {auditLog.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin eventos registrados.</p>
              ) : null}
            </div>
          </section>
        )}

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">CRUD de KS Points</h2>
            {editingPlaceId ? (
              <button
                type="button"
                onClick={resetPlaceForm}
                className="rounded-md border border-border px-3 py-1.5 text-xs"
              >
                Cancelar edición
              </button>
            ) : null}
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <input
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Nombre"
              value={placeForm.name}
              onChange={(event) => setPlaceForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={placeForm.category}
              onChange={(event) => setPlaceForm((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option>Restaurante</option>
              <option>Café</option>
              <option>Puesto callejero</option>
              <option>Mercado</option>
            </select>
            <input
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Distrito"
              value={placeForm.district}
              onChange={(event) => setPlaceForm((prev) => ({ ...prev, district: event.target.value }))}
            />
            <input
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Dirección"
              value={placeForm.address}
              onChange={(event) => setPlaceForm((prev) => ({ ...prev, address: event.target.value }))}
            />
            <input
              type="number"
              step="0.0001"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Lat"
              value={placeForm.lat}
              onChange={(event) => setPlaceForm((prev) => ({ ...prev, lat: Number(event.target.value) }))}
            />
            <input
              type="number"
              step="0.0001"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Lng"
              value={placeForm.lng}
              onChange={(event) => setPlaceForm((prev) => ({ ...prev, lng: Number(event.target.value) }))}
            />
            <input
              type="number"
              min={1}
              max={4}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Nivel precio"
              value={placeForm.price_level}
              onChange={(event) => setPlaceForm((prev) => ({ ...prev, price_level: Number(event.target.value) }))}
            />
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={placeForm.status}
              onChange={(event) => setPlaceForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="approved">approved</option>
              <option value="hidden">hidden</option>
            </select>
          </div>

          <button
            type="button"
            onClick={async () => {
              await submitPlace();
            }}
            className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            {editingPlaceId ? "Guardar cambios" : "Crear place"}
          </button>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-lg font-semibold">KS Points actuales</h2>
          <div className="space-y-2">
            {places.map((place) => (
              <div key={place.id} className="rounded-md border border-border bg-background/40 p-3 text-sm">
                <p className="font-medium">
                  {place.name} · {place.category}
                </p>
                <p className="text-muted-foreground">
                  {place.district} · {place.address}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => beginEditPlace(place)}
                    className="rounded-md border border-border px-3 py-1.5 text-xs"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await removePlace(place.id);
                    }}
                    className="rounded-md border border-destructive/50 px-3 py-1.5 text-xs text-destructive"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {places.length === 0 ? <p className="text-sm text-muted-foreground">No hay places.</p> : null}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-lg font-semibold">Solicitudes MARK</h2>
          <div className="space-y-2">
            {data.markRequests.map((request: any) => (
              <div key={request.id} className="rounded-md border border-border bg-background/40 p-3 text-sm">
                <p className="font-medium">{request.profiles?.full_name ?? request.profiles?.email ?? "Usuario"}</p>
                <p className="text-muted-foreground">{request.bio}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    onClick={async () => {
                      await approveMarkRequest(request.id);
                      await load();
                    }}
                  >
                    Aprobar MARK
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-destructive/50 px-3 py-1.5 text-xs text-destructive"
                    onClick={() => openRejectionModal("mark", request.id, request.profiles?.email ?? "Usuario")}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
            {data.markRequests.length === 0 ? <p className="text-sm text-muted-foreground">Sin solicitudes pendientes.</p> : null}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-lg font-semibold">Solicitudes de KS Points</h2>
          <div className="space-y-2">
            {data.placeRequests.map((request: any) => (
              <div key={request.id} className="rounded-md border border-border bg-background/40 p-3 text-sm">
                <p className="font-medium">{request.name} · {request.category}</p>
                <p className="text-muted-foreground">{request.district} · {request.address}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    onClick={async () => {
                      await approvePlaceRequest(request.id);
                      await load();
                    }}
                  >
                    Aprobar point
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-destructive/50 px-3 py-1.5 text-xs text-destructive"
                    onClick={() => openRejectionModal("place", request.id, request.name)}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
            {data.placeRequests.length === 0 ? <p className="text-sm text-muted-foreground">Sin solicitudes pendientes.</p> : null}
          </div>
        </section>

        {error ? <p className="text-xs text-destructive">{error}</p> : null}

        {rejectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">Rechazar solicitud</h3>
              <p className="mt-1 text-sm text-muted-foreground">{rejectionModal.name}</p>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-medium">Razón (requerida)</label>
                  <input
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="Ej: Ubicación incorrecta, ya existe duplicado, información incompleta"
                    value={rejectionForm.reason}
                    onChange={(e) => setRejectionForm((prev) => ({ ...prev, reason: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">Notas adicionales (opcional)</label>
                  <textarea
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="Detalles adicionales para el usuario..."
                    rows={3}
                    value={rejectionForm.notes}
                    onChange={(e) => setRejectionForm((prev) => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejectionModal(null)}
                  className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleRejectRequest}
                  className="flex-1 rounded-md bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </RequireRole>
  );
}
