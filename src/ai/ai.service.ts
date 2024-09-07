import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CompanyFormDto } from '../company/dto/company-form.dto';
import { SkillList } from '../student/skills/consts/skills-list';

@Injectable()
export class AiService {
    constructor() {}

    public async askAI(companyForm: CompanyFormDto): Promise<string> {
        // Transforme les compétences en une chaîne de caractères
        const allSkills = Object.values(SkillList.skills)
            .flat()
            .join(', ');

        let skills;
        if (companyForm.requiredSkills) {
            skills = companyForm.requiredSkills.join(', ');
        }

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `Vous êtes un expert consultant dans le domaine des projets digitaux. Vous aidez les entreprises à définir leurs besoins de projet, à déterminer le budget adéquat, à allouer les ressources nécessaires (designers, développeurs, marketeurs, etc.), et à donner des conseils sur les délais, les exigences techniques et les stratégies (SEO, réseaux sociaux, marketing). Vous fournissez des recommandations détaillées et pratiques. Ne pas oublier que ceux qui vont faire le projet sont des étudiants. Il faut donc que les recommandations soient adaptées à leur niveau de compétence. Voici la liste des compétences disponibles sur la plateforme : ${allSkills}.`
                    },
                    {
                        role: 'user',
                        content: `Une entreprise nommée ${companyForm.companyName}, opérant dans le secteur ${companyForm.industry}, a un projet avec l'objectif suivant : "${companyForm.projectObjective}". Le projet est décrit comme suit : "${companyForm.projectDescription}". L'entreprise dispose d'un budget de ${companyForm.budget} euros et souhaite que le projet soit réalisé en ${companyForm.projectDurationWeeks} semaines. Les compétences nécessaires pour ce projet sont les suivantes : ${skills}. Les contraintes techniques du projet sont : ${companyForm.technicalRequirements}. Le public cible de ce projet est : ${companyForm.targetAudience}. L'entreprise ${companyForm.contentAvailability === 'ready' ? 'dispose déjà du contenu nécessaire' : 'doit encore créer le contenu nécessaire'}. Elle ${companyForm.requiresMarketingOrSEO ? 'nécessite' : 'ne nécessite pas'} une stratégie de marketing ou de SEO. De plus, le projet ${companyForm.hasSocialMediaStrategy ? 'inclut' : 'n\'inclut pas'} une gestion des réseaux sociaux ou une stratégie d\'influence. Sur la base de ces informations, pouvez-vous fournir un plan détaillé concernant les ressources nécessaires (nombre de personnes par compétence), le calendrier estimé, ainsi que d'autres considérations importantes (par exemple, les meilleures pratiques, outils, plateformes) ?`
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        return response.data.choices[0].message.content;
    }
}
