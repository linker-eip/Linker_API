import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CompanyFormDto } from '../company/dto/company-form.dto';
import { SkillList } from '../student/skills/consts/skills-list';

@Injectable()
export class AiService {
    constructor() {}

    public async askAI(companyForm: CompanyFormDto): Promise<string> {
        const allSkills = Object.values(SkillList.skills)
            .flat()
            .join(', ');

            let requiredSkills = companyForm.requiredSkills ? companyForm.requiredSkills.join(', ') : 'Aucune compétence spécifique mentionnée';

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `
                            Vous êtes un consultant en projets digitaux. Votre rôle est de donner des conseils pratiques et adaptés aux projets des entreprises, en prenant en compte les compétences disponibles chez les étudiants. Vous devez aider à déterminer le nombre d'étudiants nécessaires, vérifier si le budget est approprié, fournir des recommandations sur la gestion du projet et le calendrier, en vous basant sur les compétences disponibles dans la liste suivante : ${allSkills}.
                            `
                        },
                        {
                            role: 'user',
                            content: `
                            Une entreprise nommée ${companyForm.companyName}, opérant dans le secteur ${companyForm.industry}, souhaite réaliser un projet dont la description est : "${companyForm.projectDescription}". L'entreprise a un budget de ${companyForm.budget} euros et souhaite que le projet soit terminé en ${companyForm.projectDurationWeeks ?? 'non précisé'} semaines. Les compétences requises pour le projet sont les suivantes : ${requiredSkills}. Les contraintes techniques du projet sont : ${companyForm.technicalRequirements ?? 'aucune spécifiée'}. Le public cible est : ${companyForm.targetAudience ?? 'non précisé'}. Le contenu nécessaire est ${companyForm.contentAvailability ?? 'non précisé'}. Le projet ${companyForm.requiresMarketingOrSEO ? 'nécessite' : 'ne nécessite pas'} une stratégie de marketing ou SEO et ${companyForm.hasSocialMediaStrategy ? 'inclut' : 'n\'inclut pas'} une gestion des réseaux sociaux ou une stratégie d'influence.
    
                            Pouvez-vous donner des recommandations sur :
                            - Le nombre d'étudiants nécessaires pour le projet
                            - La pertinence du budget par rapport aux besoins du projet
                            - La gestion du projet et l'organisation des tâches
                            - Le calendrier suggéré pour la réalisation du projet
                            `
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