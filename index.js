const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const indexRoutes = require('./routes/indexRoutes');

const app = express();
app.use(
	cors({
		origin: '*',
		methods: '*',
		credentials: true,
		allowedHeaders: [
			'Content-Type',
			'Authorization',
			'Access-Control-Allow-Credentials',
		],
	})
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
	res.json({ msg: 'Server is running!' });
});

app.use('/api', indexRoutes);

app.get('/healthz', (req, res) => {
	res.status(200).json({ msg: 'Server is up and Running!' });
});

try {
	app.listen(8080, () => {
		console.log('Server Running on 8080');
	});
} catch (error) {
	console.log('Failed to start the server due to ', error);
}
