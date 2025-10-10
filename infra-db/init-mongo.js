db.createUser(
  {
    user: "admin",
    pwd: "tgof5569A",
    roles: [ { role: "readWrite", db: "mydatabase" } ]
  }
);

db = db.getSiblingDB('mydatabase');

db.createCollection('mycollection');
db.mycollection.insertMany([
  { name: 'Item 1', value: 10 },
  { name: 'Item 2', value: 20 }
]);