const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const app = express();

const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('users');
const gardenCollection = db.collection('gardens');
const shopCollection = db.collection('shop');
const tradeCollection = db.collection('trades');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

const authCookieName = 'token';

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

//let users = [];

let apiRouter = express.Router();
app.use(`/api`, apiRouter);

let timer = 0;
const interval = setInterval(()=> {
  timer = timer + 1;
}, 1000);

apiRouter.get('/time', async (req, res) => {
  res.send({"time": timer});
});

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
      userCollection.updateOne({email: user.email}, {$set: {token: user.token}});
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
    console.log("deleting");
    delete user.token;
    userCollection.updateOne({email: user.email}, {$set: {token: undefined}});
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

const defaultbalance = 4;
let gardens = [];

apiRouter.get('/garden', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    
    const g = (await gardenCollection.find().toArray()).find((u)=>u["email"] === user.email);
    if (g) {
      console.log("garden/get inner: " + JSON.stringify(g));
      res.send(Object.fromEntries(
        Object.entries(g).filter(([key]) => key !== 'email')
      ));
    } else {
      //gardens.push({email: user.email, balance: defaultbalance, garden: []});
      gardenCollection.insertOne({email: user.email, balance: defaultbalance, garden: []});
      res.send({ balance: defaultbalance, garden: []});
    }
    //res.send(gardens);
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
  //console.log("garden/get: " + JSON.stringify(gardens));
});

apiRouter.post('/garden', async (req, res) => {
  //console.log("garden post");
  let gardens = await gardenCollection.find().toArray();
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    let garden = gardens.find((u)=>u["email"] === user.email);
    if (garden) {
      for (const i of Object.keys(Object.fromEntries(
        Object.entries(req.body).filter(([key]) => key !== '_id')
      ))) {
        //console.log(i);
        //gardens[gardens.indexOf(garden)][i] = req.body[i];
        let item = {};
        item[i] = req.body[i];
        gardenCollection.updateOne({email: user.email}, {$set : item});
      }
    } else {
      gardenCollection.insertOne({email: user.email, balance: defaultbalance, garden: []});
      //gardens.push({token: user.token, balance: defaultbalance, garden: []});
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
  //console.log("garden/post: " + JSON.stringify(gardens));
});

/*shopCollection.insertMany([{
  item: {
    worth: 8,
    name: "Basic Plant",
    image: "/exampleplant.png",
    timebegan: 15
  },
  cost: 2,
  available: 3,
  buys: []
},{
  item: {
    worth: 100,
    name: "Basic Plant",
    image: "/exampleplant.png",
    timebegan: 200
  },
  cost: 20,
  available: 1,
  buys: []
},
]);*/

apiRouter.get('/shop', async (req, res) => {
  let t = "";
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    console.log("found user! " + req.cookies[authCookieName]);
    t = user.email;
  }
  let sendshop = [];
  for (const i of await shopCollection.find().toArray()) {
    const buy = i["buys"].find((u)=>u["email"] === t);
    let num = 0;
    if (buy) {
      num = buy.count;
    } else {
      console.log("pushing buy " + t)
      i["buys"].push({email: t, count: 0});
      shopCollection.updateOne({_id: i._id}, {$set: {buys: i["buys"]}})
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
  //console.log("not yet " + req.cookies[authCookieName]);
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    //console.log("user!" + req.cookies[authCookieName]);
    const shop = await shopCollection.find().toArray();
    const item = shop[req.body.index];
    const buy = item["buys"].find((u)=>u["email"] === user.email);
    if (buy) {
      buy.count = buy.count + req.body.count;
      shopCollection.updateOne({_id: item._id}, {$set: {buys: item["buys"]}});
      res.send({ msg: `Changed shop buys at ${req.body.index} to ${buy.count}`});
    } else {
      item["buys"].push({email: user.email, count: req.body.count});
      shopCollection.updateOne({_id: item._id}, {$set: {buys: item["buys"]}});
      res.send({ msg: `Created a shop buy at ${req.body.index} with ${req.body.count}` });
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

//trades = [];

apiRouter.post('/chat', async (req, res) => {
  res.cookie('chat', req.body.postid, {
    secure: true,
    httpOnly: false,
    sameSite: 'strict',
  });
  res.send({"msg" : `cookie is ${req.body.postid}`});
});

apiRouter.delete('/chat', async (req, res) => {
  res.clearCookie('chat');
  res.status(204).end();
});

apiRouter.get('/trade', async (req, res) => {
  let trades = await tradeCollection.find().toArray();
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    const trade = trades.find((u)=>u["email"] === user.email);
    if (trade) {
      const messages = trade["messages"].find((u)=>u["recipient"] === req.cookies['chat']);
      if (messages) {
        if (Object.keys(messages).indexOf("array") !== -1) {
          res.send(messages.array ? messages.array : []);
        } 
        /*else {
          messages["array"] = [];
          res.send(messages["array"]);
        }*/
      } else {
        //console.log("array not found");
        trade["messages"].push({recipient: req.cookies['chat'], array: []});
        tradeCollection.updateOne({email: user.email}, {$set: {
          messages: trade["messages"]
        }});
        res.send([]);
      }
    } else {
      //console.log("trade not found");
      tradeCollection.insertOne({email: user.email, messages: [{recipient: req.cookies['chat'], array: []}]});
      res.send([]);
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
  console.log("trade/get: " + JSON.stringify(trades));
});

apiRouter.post('/trade', async (req, res) => {
  //console.log("trade body " + JSON.stringify(req.body));
  let trades = await tradeCollection.find().toArray();
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    const trade = trades.find((u)=>u["email"] === user.email);
    if (trade) {
      const messages = trade["messages"].find((u)=>u["recipient"] === req.cookies['chat']);
      if (messages) {
        messages["array"] = req.body["messages"];
        tradeCollection.updateOne({email: user.email}, {$set: {messages: trade["messages"]}});
        res.send(messages.array);
      } else {
        //console.log("post: array not found");
        trade["messages"].push({recipient: req.cookies['chat'], array: []});
        trade["messages"]["array"] = req.body["messages"];
        tradeCollection.updateOne({email: user.email}, {$set: {messages: trade["messages"]}});
        res.send(trade["messages"]);
      }
    } else {
      //console.log("post: trade not found");
      const obj = {email: user.email, messages: [{recipient: req.cookies['chat'], array: req.body["messages"]}]};
      tradeCollection.insertOne(obj);
      res.send(obj);
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
  console.log("trade/post: " + JSON.stringify(trades));
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
  await userCollection.insertOne(user);

  return user;
}

async function findUser(field, value) {
  let item = {};
  item[field] = value;
  console.log("finduser " + JSON.stringify(item));
  let a = await userCollection.findOne(item);
  if(a) {
    console.log("true!");
  }
  return a;
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

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});