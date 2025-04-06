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

const defaultbalance = 300;
let gardens = [];

apiRouter.get('/garden', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    //console.log("user " + user.email);
    const g = gardens.find((u)=>u["token"] === user.token);
    if (g) {
      console.log("garden/get inner: " + JSON.stringify(g));
      res.send(Object.fromEntries(
        Object.entries(g).filter(([key]) => key !== 'token')
      ));
    } else {
      gardens.push({token: user.token, balance: 300, garden: JSON.stringify([])});
      res.send({ balance: 300, garden: []});
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
      for (const i of Object.keys(req.body)) {
        console.log(i);
        gardens[gardens.indexOf(garden)][i] = req.body[i];
      }
    } else {
      gardens.push({token: user.token, balance: 300, garden: JSON.stringify([])});
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
  console.log("garden/post: " + JSON.stringify(gardens));
});

let shop = [{
  item: {
    worth: 800,
    name: "Basic Plant",
    //image: "/exampleplant.png",
    image: "idk",
    timebegan: "0:00:15"
  },
  cost: 98,
  available: 1,
  buys: []
}];

apiRouter.get('/shop', async (req, res) => {
  let t = "";
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    t = req.cookies[authCookieName];
  }
  let sendshop = [];
  //console.log(JSON.stringify(shop));
  for (const i of shop) {
    /*let sendbuys = [];
    for (const j in i.buys) {
      sendbuyss.push({
        userName: 
      });
    }*/
   //console.log(i);
   //console.log(JSON.stringify(i));
    const buy = i["buys"].find((u)=>u["token"] === t);
    let num = 0;
    if (buy) {
      num = buy.count;
    } else {
      i["buys"].push({token: req.cookies[authCookieName], count: 0});
    }
    sendshop.push({
      cost: i.cost,
      item: i.item,
      available: i.available,
      buys: num,
    });
  }
  res.send(sendshop);
  //console.log("shop/get: " + JSON.stringify(shop));
});

apiRouter.post('/shop', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    const item = shop[req.body.index];
    const buy = item["buys"].find((u)=>u["token"] === user.token);
    if (buy) {
      buy.count = buy.count + req.body.count;
      res.send({ msg: `Changed shop buys at ${req.body.index} to ${buy.count}` });
    } else {
      item["buys"].push({token: req.cookies[authCookieName], count: req.body.count});
      res.send({ msg: `Created a shop buy at ${req.body.index} with ${req.body.count}` });
    }
  }else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
  console.log("shop/post: " + JSON.stringify(shop));
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