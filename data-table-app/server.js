// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('localdb.json');
const middlewares = jsonServer.defaults();

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('Access-Control-Allow-Headers', '*');

  const q = req.query.q?.toLowerCase();

  if (q) {
    req.query.q = undefined; // remove q so json-server doesn’t handle it
    const db = router.db.getState();
    const filtered = db.users.filter(user =>
      Object.values(user).some(
        val => typeof val === 'string' && val.toLowerCase().includes(q)
      )
    );
    return res.jsonp(filtered);
  }
  
  next();
});

server.use(middlewares);
server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
