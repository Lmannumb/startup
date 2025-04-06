const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

let users = [];

let apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
  //console.log(req);
  //console.log(req.body);
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.get('/token', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
  }
});

let gardens = [];

apiRouter.get('/garden', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    console.log("user " + user.email);
    const garden = gardens.find((u)=>u["token"] === user.token);
    if (garden) {
      res.send(garden);
    } else {
      gardens.push({token: user.token, balance: 0, garden: JSON.stringify([])});
      res.send([]);
    }
    //res.send(gardens);
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
  console.log("garden/get: " + JSON.stringify(gardens));
});

apiRouter.post('/garden', async (req, res) => {
  console.log("garden post");
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    let garden = gardens.find((u)=>u["token"] === user.token);
    if (garden) {
      garden = req.body;
    } else {
      gardens.push({token: user.token, balance: 0, garden: JSON.stringify([])});
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
  console.log("garden/post: " + JSON.stringify(gardens));
});

let shop = [{
  item: {
    cost: 98,
    worth: 800,
    name: "Basic Plant",
    image: "/exampleplant.png",
    timebegan: "0:00:15"
  },
  available: 1,
  buys: []
}];

apiRouter.get('/shop', async (req, res) => {
  res.send(shop);
  console.log("shop/get: " + JSON.stringify(shop));
});

apiRouter.post('/shop', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    const item = shop[req.body.index];
    const buy = item["buys"].find((u)=>u["token"] === user.token);
    if (buy) {
      buy.count = buy.count + req.body.count;
    } else {
      item["buys"].push({token: req.cookies[authCookieName], count: req.body.count});
    }
  }else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
  console.log("shop/post: " + JSON.stringify(gardens));
});

const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

apiRouter.get('/scores', verifyAuth, (_req, res) => {
  res.send(scores);
});

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});