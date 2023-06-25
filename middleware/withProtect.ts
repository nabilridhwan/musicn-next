// middleware.ts
import APITokenHandler from '@/util/APITokenHandler';
import {NextApiRequest, NextApiResponse} from 'next';

export default function withProtect(
  handler: IHandler,
  rejectWhen: APITokenHandler.REJECT_WHEN = 'none',
) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    console.log(
      `=====CHECKING FOR TOKEN IN ${req.url}, (REJECT TYPE = ${rejectWhen})=====`,
    );

    // TODO: Cleanup code
    if (rejectWhen === 'none') {
      if (!APITokenHandler.hasAPIToken(req)) {
        return APITokenHandler.reject(rejectWhen, req, res);
      }
    } else if (rejectWhen === 'has') {
      if (APITokenHandler.hasAPIToken(req)) {
        return APITokenHandler.reject(rejectWhen, req, res);
      }
    }

    return handler(req, res);
  };
}
