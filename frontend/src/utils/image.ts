const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

  // Si c'est un chemin local (/uploads/...), construire l'URL complète
  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }

  // Sinon, retourner le chemin tel quel (pour compatibilité)
  return imagePath;
}
