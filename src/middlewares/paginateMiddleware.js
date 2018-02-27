export default function paginateMiddleware(req, res, next) {
  let page = parseInt(req.query.page, 10);
  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }
  let limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit)) {
    limit = 10;
  } else if (limit > 50) {
    limit = 50;
  } else if (limit < 1) {
    limit = 1;
  }
  req.query.page = page;
  req.query.limit = limit;
  next();
}
