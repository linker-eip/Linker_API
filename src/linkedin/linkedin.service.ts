import { HttpCode, HttpException, Injectable, Req } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
const LinkedinClient = require('linkedin-client');



@Injectable()
export class LinkedinService {
    constructor() { }

    private readonly linkedInRegex: RegExp = /^https:\/\/www\.linkedin\.com\/in\/.*/;

    validateLinkedInUrl(url: string): boolean {
        return this.linkedInRegex.test(url);
    }

    async findProfile(@Req() req, url: string): Promise<any> {

        if (req.user.userType != "USER_STUDENT") {
            throw new HttpException("Compte étudiant invalide", HttpStatusCode.Forbidden)
        }

        if (!this.validateLinkedInUrl(url)) {
            throw new HttpException("Invalid LinkedIn URL", HttpStatusCode.BadRequest)
        }

        const client = new LinkedinClient(process.env.LINKEDIN_KEY);
        try {
            const data = await client.fetch(url);
            console.log(data);
        } catch (err) {
            throw new HttpException("Impossible de récupérer le profil", HttpStatusCode.Conflict)
        }
    }
}
