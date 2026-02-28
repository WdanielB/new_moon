export type RatingVector = {
  sabor: number;
  servicio: number;
  higiene: number;
  precioValor: number;
  autenticidad: number;
  rapidez: number;
};

export function calculateFoodSpotScore(
  rating: RatingVector,
  reviewCount: number,
): number {
  const weights = {
    sabor: 0.34,
    servicio: 0.17,
    higiene: 0.19,
    precioValor: 0.14,
    autenticidad: 0.1,
    rapidez: 0.06,
  };

  const weightedAverage =
    rating.sabor * weights.sabor +
    rating.servicio * weights.servicio +
    rating.higiene * weights.higiene +
    rating.precioValor * weights.precioValor +
    rating.autenticidad * weights.autenticidad +
    rating.rapidez * weights.rapidez;

  const qualityScore = weightedAverage * 20;
  const confidenceFactor = Math.min(1, Math.log10(reviewCount + 1) / 2);
  const metrics = Object.values(rating);
  const mean = metrics.reduce((acc, value) => acc + value, 0) / metrics.length;
  const variance =
    metrics.reduce((acc, value) => acc + (value - mean) ** 2, 0) /
    metrics.length;
  const stdDev = Math.sqrt(variance);
  const consistencyFactor = Math.max(0, 1 - stdDev / 2);

  const finalScore =
    qualityScore * (0.68 + confidenceFactor * 0.22 + consistencyFactor * 0.1);

  return Math.max(0, Math.min(100, Number(finalScore.toFixed(1))));
}

export function mergeRating(
  current: RatingVector,
  incoming: RatingVector,
  currentCount: number,
): RatingVector {
  const nextCount = currentCount + 1;

  return {
    sabor: (current.sabor * currentCount + incoming.sabor) / nextCount,
    servicio: (current.servicio * currentCount + incoming.servicio) / nextCount,
    higiene: (current.higiene * currentCount + incoming.higiene) / nextCount,
    precioValor:
      (current.precioValor * currentCount + incoming.precioValor) / nextCount,
    autenticidad:
      (current.autenticidad * currentCount + incoming.autenticidad) / nextCount,
    rapidez: (current.rapidez * currentCount + incoming.rapidez) / nextCount,
  };
}