const { MongoClient } = require('mongodb');

  const mongoURI = 'mongodb+srv://melbinbennyoffl:melbin@cluster0.xsit3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const state = {}

const dbName = process.env.DATABASE_NAME || 'sungglebugs'
const client = new MongoClient(mongoURI)
module.exports.connect = async function (done) {
  // Use connect method to connect to the server
  await client.connect((err,data)=>{
      
      if(err) return done(err)
      state.db=client.db(dbName)
     

  })
  state.db=client.db(dbName)
  done()

}

module.exports.get= function (){
  return state.db
}