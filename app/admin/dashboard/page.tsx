'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StarsBackground } from '@/components/StarsBackground';
import { Button } from '@/components/ui/Button';

interface Stats {
  totalUsers: number;
  totalAnalyses: number;
  analysesWithPDF: number;
  analysesWithEmail: number;
  conversionRate: string;
  topUsers: Array<{
    email: string;
    analysesCount: number;
    createdAt: string;
  }>;
}

interface User {
  id: string;
  email: string;
  createdAt: string;
  analysesCount: number;
  hasAnalysis: boolean;
  lastAnalysis: any;
  pdfGenerated: boolean;
  emailSent: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Vérifier l'authentification
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setAuthenticated(true);
          loadData();
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les stats
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Charger les utilisateurs
      const usersRes = await fetch(`/api/admin/users?page=${currentPage}&limit=50`);
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsers(usersData.users);
        setTotalPages(usersData.pagination.totalPages);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [currentPage, authenticated]);

  const handleExport = async (filter: string = 'all') => {
    let url: string | null = null;
    let linkElement: HTMLAnchorElement | null = null;
    
    try {
      const response = await fetch(`/api/admin/export-emails?filter=${filter}`);
      const blob = await response.blob();
      url = window.URL.createObjectURL(blob);
      linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.download = `emails-${filter}-${new Date().toISOString().split('T')[0]}.csv`;
      linkElement.style.display = 'none';
      
      // Ajouter au body
      document.body.appendChild(linkElement);
      
      // Déclencher le téléchargement
      linkElement.click();
      
      // Nettoyer de manière sécurisée après un court délai
      // L'important est de révoquer l'URL pour libérer la mémoire
      // On ne supprime PAS l'élément du DOM pour éviter les erreurs removeChild
      // Le navigateur gère automatiquement les éléments temporaires
      setTimeout(() => {
        // Révoquer l'URL (essentiel pour libérer la mémoire)
        if (url) {
          try {
            window.URL.revokeObjectURL(url);
          } catch (e) {
            // Ignorer les erreurs de révocation
          }
        }
        
        // Ne pas supprimer l'élément - le navigateur le gère automatiquement
        // Cela évite complètement les erreurs removeChild
        // L'élément sera nettoyé par le garbage collector si nécessaire
      }, 200);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export');
      
      // Nettoyer en cas d'erreur
      if (url) {
        try {
          window.URL.revokeObjectURL(url);
        } catch (e) {
          // Ignorer
        }
      }
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (authenticated === null || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <StarsBackground />
      </div>

      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">📊 Back Office</h1>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => router.push('/')}>
                Retour au site
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h3 className="text-gray-400 text-sm mb-2">Utilisateurs</h3>
                <div className="text-3xl font-bold text-purple-400">{stats.totalUsers}</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h3 className="text-gray-400 text-sm mb-2">Analyses</h3>
                <div className="text-3xl font-bold text-purple-400">{stats.totalAnalyses}</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h3 className="text-gray-400 text-sm mb-2">PDF Générés</h3>
                <div className="text-3xl font-bold text-green-400">{stats.analysesWithPDF}</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h3 className="text-gray-400 text-sm mb-2">Taux de conversion</h3>
                <div className="text-3xl font-bold text-blue-400">{stats.conversionRate}%</div>
              </div>
            </div>
          )}

          {/* Actions d'export */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/10 shadow-2xl shadow-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">Export des emails</h2>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => handleExport('all')} variant="secondary">
                📧 Exporter tous les emails
              </Button>
              <Button onClick={() => handleExport('with_analysis')} variant="secondary">
                ✅ Exporter emails avec analyse
              </Button>
              <Button onClick={() => handleExport('without_analysis')} variant="secondary">
                ⏳ Exporter emails sans analyse
              </Button>
            </div>
          </div>

          {/* Liste des utilisateurs */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl shadow-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">Liste des utilisateurs</h2>
            
            {users.length === 0 ? (
              <p className="text-gray-400">Aucun utilisateur pour le moment</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="p-3 text-gray-300">Email</th>
                        <th className="p-3 text-gray-300">Date d'inscription</th>
                        <th className="p-3 text-gray-300">Analyses</th>
                        <th className="p-3 text-gray-300">PDF</th>
                        <th className="p-3 text-gray-300">Email envoyé</th>
                        <th className="p-3 text-gray-300">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-3 text-white">{user.email}</td>
                          <td className="p-3 text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="p-3 text-gray-400">{user.analysesCount}</td>
                          <td className="p-3">
                            {user.pdfGenerated ? (
                              <span className="text-green-400">✓</span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            {user.emailSent ? (
                              <span className="text-green-400">✓</span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            {user.hasAnalysis ? (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                                Avec analyse
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                                En attente
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Précédent
                    </Button>
                    <span className="text-gray-300 px-4 py-2">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant →
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
