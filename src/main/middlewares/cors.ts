import { Response, Request, NextFunction } from 'express';

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('acess-control-allow-origin', '*');
  res.set('acess-control-allow-method', '*');
  res.set('acess-control-allow-headers', '*');
  next();
};
