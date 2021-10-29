require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5000;
const cors = require( 'cors' );
const ObjectId = require( 'mongodb' ).ObjectId;

//middleware
app.use( cors() );
app.use( express.json() );

const { MongoClient } = require( 'mongodb' );

const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.iezc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true } );

const run = async () => {
    try {
        await client.connect();
        console.log( 'database connected' );

        const database = client.db( "bayViewHotel" );
        const roomsCollection = database.collection( "rooms" );

        //GET API
        app.get( '/rooms', async ( req, res ) => {
            const cursor = roomsCollection.find( {} );
            const rooms = await cursor.toArray();
            res.send( rooms );
        } );
    }
    finally {
        // await client.close();
    }
}

run().catch( console.dir );

app.get( '/', ( req, res ) => {
    res.send( 'Running Toursim Local Server' );
} )

app.listen( port, () => {
    console.log( `Tourism app server is listening at http://localhost:${ port }` )
} )