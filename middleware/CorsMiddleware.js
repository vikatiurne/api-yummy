export default function allowCrossDomain(req, res, next) {
  res.header(`Access-Control-Allow-Origin`, `https://boisterous-wisp-fccde4.netlify.app`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Origin, Content-Type`);
  next();
}
