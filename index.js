require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5000;
const cors = require( 'cors' );

app.use( cors() );
app.use( express.json() );

app.get( '/', ( req, res ) => {
    res.send( 'Hello World From My Tourism Web Server' );
} )

app.listen( port, () => {
    console.log( `Tourism app server is listening at http://localhost:${ port }` )
} )