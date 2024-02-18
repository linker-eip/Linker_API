import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    // Récupérer le corps de la requête
    const body = req.body;

    // Imprimer le corps de la requête
    console.log('Request Body:', body);

    next();
  }
}