import { useMemo, useState, type FormEvent, type ReactElement } from "react";
import {
  Link,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "@/auth/mock-auth";
import { SocialScore } from "@/features/social/social-score";
import { calculateFoodSpotScore, type RatingVector } from "@/lib/rating";

const navLinks = [
  { to: "/", label: "Landing" },
  { to: "/algoritmo", label: "Algoritmo" },
  { to: "/metodologia", label: "Metodología" },
  { to: "/faq", label: "FAQ" },
  { to: "/sobre", label: "Sobre" },
];

function SiteLayout() {
  const { auth, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <Link to="/" className="font-semibold tracking-wide text-primary">
            FoodieMap Arequipa
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/entrar-score" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
              Entrar al Score
            </Link>
            {auth.isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground"
              >
                Salir
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="mt-10 border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground md:px-6">
          <p>Mock platform · OAuth y roles reales se integrarán con Supabase en la siguiente fase.</p>
          <p>Actualmente usamos datos simulados de restaurantes, cafés, mercados y puestos callejeros en Arequipa.</p>
        </div>
      </footer>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

function LandingPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Red social de reseñas gastronómicas</p>
        <h1 className="mt-2 text-[clamp(1.5rem,3.6vw,2.8rem)] font-bold leading-tight">
          Califica y descubre comida real de Arequipa con score transparente
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Usuarios publican reseñas, Marks validan calidad con criterios claros y el algoritmo pondera sabor,
          higiene, servicio, precio-valor, autenticidad y rapidez para generar un score justo.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/registro" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Crear cuenta
          </Link>
          <Link to="/quiero-ser-mark" className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">
            Quiero ser MARK
          </Link>
          <Link to="/app/usuarios" className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">
            Ver Score
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Usuarios">
          <p>Descubren lugares, comparan score y siguen reseñas confiables.</p>
        </SectionCard>
        <SectionCard title="Marks">
          <p>Califican con criterios técnicos y ayudan a elevar la calidad del ecosistema.</p>
        </SectionCard>
        <SectionCard title="Score">
          <p>Modelo de puntuación con ajuste por volumen de reseñas y consistencia.</p>
        </SectionCard>
      </div>
    </main>
  );
}

function AlgoritmoPage() {
  const [rating, setRating] = useState<RatingVector>({
    sabor: 4.5,
    servicio: 4,
    higiene: 4.2,
    precioValor: 4.1,
    autenticidad: 4.4,
    rapidez: 3.8,
  });
  const [reviews, setReviews] = useState(60);

  const score = useMemo(() => calculateFoodSpotScore(rating, reviews), [rating, reviews]);

  const fields: { key: keyof RatingVector; label: string }[] = [
    { key: "sabor", label: "Sabor" },
    { key: "servicio", label: "Servicio" },
    { key: "higiene", label: "Higiene" },
    { key: "precioValor", label: "Precio / Valor" },
    { key: "autenticidad", label: "Autenticidad" },
    { key: "rapidez", label: "Rapidez" },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
      <SectionCard title="Cómo funciona el algoritmo">
        <p>1) Calcula una calidad base con pesos por métrica.</p>
        <p>2) Ajusta por confianza según número de reseñas.</p>
        <p>3) Ajusta por consistencia para evitar picos inestables.</p>
        <p className="text-primary">Resultado final en escala 0-100 para ranking público.</p>
      </SectionCard>

      <SectionCard title="Simulador interactivo">
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>{field.label}</span>
                <span className="text-primary">{rating[field.key].toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={0.1}
                value={rating[field.key]}
                onChange={(event) =>
                  setRating((prev) => ({ ...prev, [field.key]: Number(event.target.value) }))
                }
                className="w-full accent-primary"
              />
            </div>
          ))}

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Reseñas</span>
              <span className="text-primary">{reviews}</span>
            </div>
            <input
              type="range"
              min={1}
              max={500}
              step={1}
              value={reviews}
              onChange={(event) => setReviews(Number(event.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-3 text-sm">
            Score estimado: <span className="font-semibold text-primary">{score.toFixed(1)} / 100</span>
          </div>
        </div>
      </SectionCard>
    </main>
  );
}

function MetodologiaPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
      <SectionCard title="Metodología de evaluación">
        <p>Los Marks usan escalas de 1 a 5 por métrica.</p>
        <p>La plataforma combina calidad sensorial, operación y experiencia del usuario final.</p>
        <p>La metodología busca equilibrio entre justicia para locales nuevos y estabilidad para locales consolidados.</p>
      </SectionCard>
    </main>
  );
}

function FaqPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
      <SectionCard title="Preguntas frecuentes">
        <p><strong>¿Necesito cuenta para ver score?</strong> Sí, en esta versión se solicita sesión para entrar al panel.</p>
        <p><strong>¿Cómo soy MARK?</strong> Envías solicitud y recibes estado pendiente/aprobado.</p>
        <p><strong>¿Los datos son reales?</strong> No, en esta fase son mock hasta conectar Supabase.</p>
      </SectionCard>
    </main>
  );
}

function SobrePage() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
      <SectionCard title="Sobre el proyecto">
        <p>FoodieMap prioriza transparencia en calificaciones gastronómicas de Arequipa.</p>
        <p>En la siguiente fase se habilitará OAuth con Supabase, roles persistentes y trazabilidad real de reseñas.</p>
      </SectionCard>
    </main>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("demo@foodie.pe");
  const [name, setName] = useState("Demo User");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    login(email, name);
    const redirect = (location.state as { from?: string } | null)?.from ?? "/entrar-score";
    navigate(redirect);
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-8 md:px-6">
      <SectionCard title="Login (mock)">
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nombre"
          />
          <input
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Correo"
            type="email"
          />
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Ingresar
          </button>
        </form>
      </SectionCard>
    </main>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("nuevo@foodie.pe");
  const [name, setName] = useState("Nuevo Usuario");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    register(name, email);
    navigate("/entrar-score");
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-8 md:px-6">
      <SectionCard title="Registro (mock)">
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nombre"
          />
          <input
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Correo"
            type="email"
          />
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Crear cuenta
          </button>
        </form>
      </SectionCard>
    </main>
  );
}

function MarkRequestPage() {
  const { auth, requestMark, approveMarkMock } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState("Experiencia evaluando cocina tradicional arequipeña.");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    requestMark();
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-8 md:px-6">
      <SectionCard title="Quiero ser MARK">
        {!auth.isAuthenticated ? (
          <div className="space-y-3">
            <p>Para solicitar rol MARK primero necesitas iniciar sesión.</p>
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => navigate("/login")}
            >
              Ir a login
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <textarea
              className="h-28 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Enviar solicitud
            </button>

            <p className="text-xs">
              Estado actual: <span className="font-semibold text-primary">{auth.markRequest}</span>
            </p>

            {auth.markRequest === "pending" ? (
              <button
                type="button"
                onClick={approveMarkMock}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                [Mock] Aprobar solicitud MARK
              </button>
            ) : null}
          </form>
        )}
      </SectionCard>
    </main>
  );
}

function EnterScorePage() {
  const { auth } = useAuth();

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-8 md:px-6">
      <SectionCard title="Entrar al Score">
        {!auth.isAuthenticated ? (
          <div className="flex flex-wrap gap-2">
            <p className="w-full">No hay sesión activa. Inicia sesión para acceder al panel.</p>
            <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" to="/login">
              Login
            </Link>
            <Link className="rounded-md border border-border px-4 py-2 text-sm font-semibold" to="/registro">
              Registro
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p>
              Sesión activa como <span className="font-semibold">{auth.name || auth.email}</span>, rol actual:
              {" "}<span className="font-semibold text-primary">{auth.role}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" to="/app/usuarios">
                Entrar como Usuario
              </Link>
              <Link className="rounded-md border border-border px-4 py-2 text-sm font-semibold" to="/app/mark">
                Entrar como MARK
              </Link>
              <Link className="rounded-md border border-border px-4 py-2 text-sm font-semibold" to="/quiero-ser-mark">
                Solicitar MARK
              </Link>
            </div>
          </div>
        )}
      </SectionCard>
    </main>
  );
}

function RequireAuth({ children }: { children: ReactElement }) {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function RequireMark({ children }: { children: ReactElement }) {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: "/app/mark" }} />;
  }

  if (auth.role !== "mark") {
    return <Navigate to="/quiero-ser-mark" replace />;
  }

  return children;
}

function AppHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">FoodieMap App</p>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function UserAppPage() {
  return (
    <main>
      <AppHeader
        title="Vista Usuarios"
        description="Panel público autenticado para explorar score, ranking y mapa de Arequipa."
      />
      <SocialScore view="usuarios" />
    </main>
  );
}

function MarkAppPage() {
  return (
    <main>
      <AppHeader
        title="Vista MARK"
        description="Panel de calificación con publicación de reseñas y actualización del ranking."
      />
      <SocialScore view="mark" />
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 text-center md:px-6">
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">Revisa la URL o vuelve al inicio.</p>
      <Link to="/" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Ir a landing
      </Link>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/algoritmo" element={<AlgoritmoPage />} />
        <Route path="/metodologia" element={<MetodologiaPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/quiero-ser-mark" element={<MarkRequestPage />} />
        <Route path="/entrar-score" element={<EnterScorePage />} />
        <Route
          path="/app/usuarios"
          element={
            <RequireAuth>
              <UserAppPage />
            </RequireAuth>
          }
        />
        <Route
          path="/app/mark"
          element={
            <RequireMark>
              <MarkAppPage />
            </RequireMark>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
