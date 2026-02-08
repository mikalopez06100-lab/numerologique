'use client';

import { useState } from 'react';

export default function TestLogsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testOpenAICall = async () => {
    setLoading(true);
    setLogs([]);
    addLog('🧪 Démarrage du test...');

    try {
      addLog('📡 Appel à /api/test-openai-call...');
      const response = await fetch('/api/test-openai-call');
      const data = await response.json();

      if (data.success) {
        addLog('✅ Succès !');
        addLog(`📏 Longueur de la réponse: ${data.resultLength} caractères`);
        addLog(`📄 Aperçu: ${data.resultPreview}`);
      } else {
        addLog(`❌ Erreur: ${data.error}`);
        if (data.stack) {
          addLog(`🔍 Stack: ${data.stack.substring(0, 200)}...`);
        }
      }
    } catch (error) {
      addLog(`❌ Exception: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const testAnalyse = async () => {
    setLoading(true);
    setLogs([]);
    addLog('🧪 Test avec le formulaire...');

    try {
      const testData = {
        prenom: 'Jean',
        nom: 'Dupont',
        dateNaissance: '15/03/1990',
      };

      addLog('📡 Envoi des données au serveur...');
      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      addLog(`📊 Status HTTP: ${response.status}`);
      const result = await response.json();

      if (result.success) {
        addLog('✅ Analyse réussie !');
        addLog(`📄 ID: ${result.data.id}`);
        addLog(`🔢 Chemin de vie: ${result.data.analyse.cheminDeVie}`);
        addLog(`🔢 Expression: ${result.data.analyse.nombreExpression}`);
        addLog(`🔢 Intime: ${result.data.analyse.nombreIntime}`);
        if (result.data.analyse.introduction) {
          addLog('✅ Structure OpenAI détectée !');
        } else {
          addLog('⚠️ Structure basique (fallback)');
        }
      } else {
        addLog(`❌ Erreur: ${result.error}`);
      }
    } catch (error) {
      addLog(`❌ Exception: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Page de Test - Logs</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={testOpenAICall}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Test Appel OpenAI Direct
          </button>
          <button
            onClick={testAnalyse}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Test Analyse Complète
          </button>
          <button
            onClick={() => setLogs([])}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            Effacer
          </button>
        </div>

        <div className="bg-black rounded-lg p-4 font-mono text-sm">
          <div className="text-green-400 mb-2">Logs en temps réel:</div>
          {logs.length === 0 ? (
            <div className="text-gray-500">Aucun log pour le moment. Cliquez sur un bouton de test.</div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-gray-300">
                  {log}
                </div>
              ))}
            </div>
          )}
          {loading && (
            <div className="text-yellow-400 mt-2">⏳ En cours...</div>
          )}
        </div>
      </div>
    </div>
  );
}
