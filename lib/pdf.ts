// Génération de PDF pour les analyses numérologiques

import { AnalyseNumerologique } from '@/types/numerologie';

/**
 * Génère un PDF à partir d'une analyse numérologique
 */
export async function generatePDF(analyse: AnalyseNumerologique): Promise<Buffer> {
  // Utilisation de jsPDF pour générer le PDF
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const analyseData = analyse.analyse;
  const hasNewStructure = analyseData.introduction || analyseData.cheminDeVieDetail;

  // Configuration
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Fonction helper pour ajouter du texte avec gestion de la pagination
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    
    if (yPosition + lines.length * (fontSize * 0.4) > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 5;
  };

  // En-tête
  doc.setFillColor(147, 51, 234); // Purple
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  addText('🔮 ANALYSE NUMÉROLOGIQUE', 20, true);
  yPosition += 10;

  // Informations personnelles
  doc.setTextColor(0, 0, 0);
  addText(`${analyse.donnees.prenom} ${analyse.donnees.nom}`, 16, true);
  addText(`Date de naissance: ${analyse.donnees.dateNaissance}`, 12);
  yPosition += 10;

  // Nombres principaux
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');
  yPosition += 10;
  addText(`Chemin de Vie: ${analyseData.cheminDeVie}`, 14, true);
  addText(`Expression: ${analyseData.nombreExpression} | Intime: ${analyseData.nombreIntime}`, 12);
  yPosition += 15;

  if (hasNewStructure) {
    // Introduction
    if (analyseData.introduction) {
      addText('INTRODUCTION', 14, true);
      addText(analyseData.introduction, 11);
      yPosition += 5;
    }

    // Chemin de Vie
    if (analyseData.cheminDeVieDetail) {
      addText('CHEMIN DE VIE', 14, true);
      if (analyseData.cheminDeVieDetail.explicationCalcul) {
        addText(analyseData.cheminDeVieDetail.explicationCalcul, 11);
      }
      if (analyseData.cheminDeVieDetail.signification) {
        const sig = analyseData.cheminDeVieDetail.signification;
        if (sig.tendancesPersonnalite) addText(`Tendances: ${sig.tendancesPersonnalite}`, 11);
        if (sig.forcesNaturelles) addText(`Forces: ${sig.forcesNaturelles}`, 11);
        if (sig.defisRecurrents) addText(`Défis: ${sig.defisRecurrents}`, 11);
        if (sig.environnementFavorable) addText(`Environnement: ${sig.environnementFavorable}`, 11);
      }
      yPosition += 5;
    }

    // Nombre d'Expression
    if (analyseData.nombreExpressionDetail) {
      addText('NOMBRE D\'EXPRESSION', 14, true);
      if (analyseData.nombreExpressionDetail.explicationCalcul) {
        addText(analyseData.nombreExpressionDetail.explicationCalcul, 11);
      }
      if (analyseData.nombreExpressionDetail.interpretation) {
        const inter = analyseData.nombreExpressionDetail.interpretation;
        if (inter.maniereAgir) addText(`Manière d'agir: ${inter.maniereAgir}`, 11);
        if (inter.talentsDominants) addText(`Talents: ${inter.talentsDominants}`, 11);
        if (inter.postureRelationnelle) addText(`Posture: ${inter.postureRelationnelle}`, 11);
      }
      yPosition += 5;
    }

    // Nombre Intime
    if (analyseData.nombreIntimeDetail) {
      addText('NOMBRE INTIME', 14, true);
      if (analyseData.nombreIntimeDetail.explicationCalcul) {
        addText(analyseData.nombreIntimeDetail.explicationCalcul, 11);
      }
      if (analyseData.nombreIntimeDetail.interpretation?.motivationsProfondes) {
        addText(analyseData.nombreIntimeDetail.interpretation.motivationsProfondes, 11);
      }
      yPosition += 5;
    }

    // Cohérence Globale
    if (analyseData.coherenceGlobale) {
      addText('COHÉRENCE GLOBALE', 14, true);
      if (analyseData.coherenceGlobale.analyse) addText(analyseData.coherenceGlobale.analyse, 11);
      if (analyseData.coherenceGlobale.axesDeveloppement) addText(`Axes: ${analyseData.coherenceGlobale.axesDeveloppement}`, 11);
      if (analyseData.coherenceGlobale.leviersEvolution) addText(`Leviers: ${analyseData.coherenceGlobale.leviersEvolution}`, 11);
      yPosition += 5;
    }

    // Conclusion
    if (analyseData.conclusion) {
      addText('CONCLUSION', 14, true);
      if (analyseData.conclusion.synthese) addText(analyseData.conclusion.synthese, 11);
      if (analyseData.conclusion.conseilsOrientations) addText(`Conseils: ${analyseData.conclusion.conseilsOrientations}`, 11);
      if (analyseData.conclusion.perspectiveAvenir) addText(analyseData.conclusion.perspectiveAvenir, 11);
    }
  } else {
    // Structure basique (fallback)
    if (analyseData.description) {
      addText('DESCRIPTION', 14, true);
      addText(analyseData.description, 11);
    }
  }

  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} sur ${pageCount} - Généré le ${new Date().toLocaleDateString('fr-FR')}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return Buffer.from(doc.output('arraybuffer'));
}
