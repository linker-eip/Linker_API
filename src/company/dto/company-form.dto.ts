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
    description: 'Description générale du besoin ou du projet',
    example: 'Amélioration de la présence en ligne de l\'entreprise',
  })
  projectDescription: string;

  @ApiProperty({
    description: 'Budget approximatif pour le projet en euros',
    example: 5000,
  })
  budget: number;

  @ApiProperty({
    description: 'Durée souhaitée pour le projet en semaines (si connu)',
    example: 8,
    required: false,
  })
  projectDurationWeeks?: number;

  @ApiProperty({
    description: 'Compétences ou types de services qui pourraient être nécessaires (ex: développement, design, marketing)',
    example: ['Développement Web', 'Design Graphique'],
    required: false,
  })
  requiredSkills?: string[];

  @ApiProperty({
    description: 'Contraintes ou exigences particulières (si connues)',
    example: 'Utilisation de certains outils ou plateformes spécifiques',
    required: false,
  })
  technicalRequirements?: string;

  @ApiProperty({
    description: 'Public cible ou utilisateurs finaux visés par le projet (si connu)',
    example: 'Jeunes adultes entre 18 et 25 ans',
    required: false,
  })
  targetAudience?: string;

  @ApiProperty({
    description: 'Le contenu nécessaire est-il déjà disponible ou doit-il être créé ? (si connu)',
    example: 'Le contenu est partiellement disponible.',
    required: false,
  })
  contentAvailability?: string;

  @ApiProperty({
    description: 'Une stratégie SEO ou de marketing est-elle envisagée ?',
    example: false,
    required: false,
  })
  requiresMarketingOrSEO?: boolean;

  @ApiProperty({
    description: 'Le projet inclut-il une gestion des réseaux sociaux ou une stratégie d\'influence ?',
    example: false,
    required: false,
  })
  hasSocialMediaStrategy?: boolean;
}
