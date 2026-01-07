// Prefer the configured API URL, but fall back to the default backend port.
const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Normalise to avoid trailing slashes so we can safely append resource paths.
const NORMALIZED_API_URL = RAW_API_URL.replace(/\/+$/, '');

// Static assets (like uploads) are served from the backend root, not /api.
const ASSET_BASE_URL =
  NORMALIZED_API_URL.replace(/\/api$/, '') || NORMALIZED_API_URL;

/**
 * Construit l'URL complète pour une image de produit
 * @param imagePath - Le chemin de l'image depuis la base de données
 * @returns L'URL complète de l'image
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return 'https://via.placeholder.com/400?text=No+Image';
  }

  // Si l'image est déjà une URL complète (http/https), la retourner telle quelle
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Unifier les chemins locaux quel que soit le format retourné par l'API
  const normalizedPath = imagePath.startsWith('uploads/')
    ? `/${imagePath}`
    : imagePath;

  // Si c'est un chemin local (/uploads/...), construire l'URL complète
  if (normalizedPath.startsWith('/uploads/')) {
    return `${ASSET_BASE_URL}${normalizedPath}`;
  }

  // Sinon, retourner le chemin tel quel (pour compatibilité)
  return normalizedPath;
}
