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
        const bookingsCollection = database.collection( "bookings" );

        //GET Room API
        app.get( '/rooms', async ( req, res ) => {
            const cursor = roomsCollection.find( {} );
            const rooms = await cursor.toArray();
            res.send( rooms );
        } );

        //GET Booking API
        app.get( '/bookings', async ( req, res ) => {
            const cursor = bookingsCollection.find( {} );
            const bookings = await cursor.toArray();
            res.send( bookings );
        } );

        //POST API (Add a Room)
        app.post( '/rooms', async ( req, res ) => {
            const room = req.body;
            const result = await roomsCollection.insertOne( room );
            res.json( result );
        } );

        //POST API (Add a Booking)
        app.post( '/bookings', async ( req, res ) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne( booking );
            res.json( result );
        } );

        //UPDATE Room API
        app.put( '/rooms/:id', async ( req, res ) => {
            const roomId = req.params.id;
            const updatedRoom = req.body;
            const filter = { _id: ObjectId( roomId ) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedRoom.status
                },
            };

            const result = await roomsCollection.updateOne( filter, updateDoc, options );
            res.json( result );
        } );

        //UPDATE Booking API
        app.put( '/bookings/:id', async ( req, res ) => {
            const bookingId = req.params.id;
            const updatedBooking = req.body;
            const filter = { _id: ObjectId( bookingId ) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "approved"
                },
            };

            const result = await roomsCollection.updateOne( filter, updateDoc, options );
            res.json( result );
        } );

        //DELETE a Room API
        app.delete( '/rooms/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const result = await roomsCollection.deleteOne( query );
            res.json( result );
        } );

        //DELETE a Booking API
        app.delete( '/bookings/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const result = await bookingsCollection.deleteOne( query );
            res.json( result );
        } );
    }
    finally {
        // await client.close();
    }
}

run().catch( console.dir );

app.get( '/', ( req, res ) => {
    res.send( 'Running Tourism Local Server' );
} )

app.listen( port, () => {
    console.log( `Tourism app server is listening at http://localhost:${ port }` )
} )