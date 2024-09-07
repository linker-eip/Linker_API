import { ApiProperty } from '@nestjs/swagger';

export class CompanyFormDto {

  @ApiProperty({
    description: 'Nom de l\'entreprise',
    example: 'Acme Corp',
  })
  companyName: string;

  @ApiProperty({
    description: 'Secteur d\'activité de l\'entreprise',
    example: 'E-commerce, SaaS, Marketing Digital, etc.',
  })
  industry: string;

  @ApiProperty({
    description: 'Objectif principal du projet digital (site web, application, stratégie marketing, etc.)',
    example: 'Lancement d\'une campagne de marketing digital',
  })
  projectObjective: string;

  @ApiProperty({
    description: 'Description détaillée du projet',
    example: 'Créer et gérer une campagne de publicité en ligne, améliorer la présence sur les réseaux sociaux, etc.',
  })
  projectDescription: string;

  @ApiProperty({
    description: 'Budget estimé pour le projet en euros',
    example: 5000,
  })
  budget: number;

  @ApiProperty({
    description: 'Durée souhaitée pour la réalisation du projet en semaines',
    example: 8,
  })
  projectDurationWeeks: number;

  @ApiProperty({
    description: 'Types de compétences ou métiers nécessaires pour le projet (ex: développeurs, designers, marketeurs)',
    example: ['Designer', 'Community Manager', 'Expert SEO'],
  })
  requiredSkills: string[];

  @ApiProperty({
    description: 'Contraintes ou exigences techniques spécifiques (ex: CMS, outils marketing, etc.)',
    example: 'Utilisation de WordPress, gestion de campagne Google Ads, etc.',
  })
  technicalRequirements: string;

  @ApiProperty({
    description: 'Public cible ou utilisateurs finaux visés par le projet',
    example: 'Jeunes adultes entre 18 et 25 ans, entreprises B2B, etc.',
  })
  targetAudience: string;

  @ApiProperty({
    description: 'Le contenu nécessaire est-il déjà disponible ou doit-il être créé ?',
    example: 'Le contenu texte et les images doivent être créés.',
  })
  contentAvailability: string;

  @ApiProperty({
    description: 'Une stratégie SEO ou de marketing est-elle nécessaire ?',
    example: true,
  })
  requiresMarketingOrSEO: boolean;

  @ApiProperty({
    description: 'Le projet inclut-il une gestion des réseaux sociaux ou une stratégie d\'influence ?',
    example: true,
  })
  hasSocialMediaStrategy: boolean;
}
