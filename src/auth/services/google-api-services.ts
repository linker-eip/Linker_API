import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

interface Person {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
}

interface TokenInfo {
  sub: string;
  name: string;
  email: string;
}

@Injectable()
class GoogleApiService {
  async getPersonFromAccessToken(accessToken: string): Promise<Person> {
    const url = new URL('https://oauth2.googleapis.com/tokeninfo');
    url.searchParams.set('id_token', accessToken);

    try {
      const response = await axios.get<TokenInfo>(url.href);

      return {
        id: response.data.sub,
        given_name: response.data.name.split(' ')[0],
        family_name: response.data.name.split(' ')[1],
        email: response.data.email,
      };
    } catch {
      throw new BadRequestException(
        'Unable to retrieve information from Google',
      );
    }
  }
}

export { GoogleApiService };
