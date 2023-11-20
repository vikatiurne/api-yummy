export default function allowCrossDomain(req, res, next) {
  res.header(`Access-Control-Allow-Origin`, `https://api-yummy.onrender.com`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
}
