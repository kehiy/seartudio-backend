import DB from '../databases';
const Client = DB.Client;

export const getClientInfo = async (req, res, next) => {
  res.status(200).json({ data: req.client });
};
