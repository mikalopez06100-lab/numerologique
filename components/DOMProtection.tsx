'use client';

import { useEffect } from 'react';

/**
 * Composant qui charge la protection DOM au montage
 */
export function DOMProtection() {
  useEffect(() => {
    // Protection globale contre les erreurs removeChild
    const originalRemoveChild = Node.prototype.removeChild;
    
    Node.prototype.removeChild = function(child: Node): Node {
      try {
        // Vérifier que l'élément est bien un enfant de ce nœud
        if (this.contains && this.contains(child)) {
          return originalRemoveChild.call(this, child);
        } else {
          // Si l'élément n'est pas un enfant, retourner l'élément sans erreur
          return child;
        }
      } catch (error) {
        // Ignorer silencieusement les erreurs removeChild
        // Cela peut arriver si l'élément a déjà été supprimé ou déplacé
        return child;
      }
    };

    // Nettoyer lors du démontage (optionnel)
    return () => {
      Node.prototype.removeChild = originalRemoveChild;
    };
  }, []);

  return null;
}
