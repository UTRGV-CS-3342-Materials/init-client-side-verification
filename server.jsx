import express from 'express';
import { renderToString } from 'react-dom/server';
import Database from 'better-sqlite3';

import { Items } from './app/Items.jsx';
import { ItemView } from './app/ItemView.jsx';

const PORT = 8080;

const FAKE_LATENCY_MS = 3000;

// filepath relative to project root where we run the node server
const db = new Database('shopping.sqlite');

const app = express();
app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));
// app.use((req, res, next) => setTimeout(next, FAKE_LATENCY_MS));

// manually using react to generate HTML
function send(res, element) {
	res.send('<!DOCTYPE html>' + renderToString(element));
}

// only rules: author not blank, content not blank
function validateReview(values) {
	const errors = {};
	// trim removes whitespace, blank string evaluates to false
	if (!values.author.trim()) errors.author = true;
	if (!values.content.trim()) errors.content = true;
	return errors;
}

app.get('/items', (req, res) => {
	const items = db.prepare('SELECT * FROM item').all();
	send(res, <Items items={items} />);
});

app.get('/item_view/:item_id', (req, res) => {
	const itemId = parseInt(req.params.item_id);
	const item = db.prepare('SELECT * FROM item WHERE id = ?').get(itemId);

	// our Items page should never create a link w/ a bad id
	// HOWEVER, someone might have a stale page (e.g. item was removed)
	//  or someone might be attacking the site by trying different ids
	if (!item) return res.status(404).send('No such item.');

	const reviews = db.prepare('SELECT * FROM review WHERE item_id = ?').all(itemId);
	send(res, <ItemView item={item} reviews={reviews} />);
});

app.post('/item_view/:item_id', (req, res) => {
	const itemId = parseInt(req.params.item_id);
	const item = db.prepare('SELECT * FROM item WHERE id = ?').get(itemId);
	if (!item) return res.status(404).send('No such item.');

	// store values for convenience, convert from null/undefined to blank string
	// so the rest of the code doesn't have to do null/undefined checks
	// (the ?? operator is like || but checks for null/undefined)
	const values = { 
		author: req.body.author ?? '',
		content: req.body.content ?? ''
	};
	const errors = validateReview(values);

	if (Object.keys(errors).length > 0) {
		// rerender the page to show errors, persist values
		const reviews = db.prepare('SELECT * FROM review WHERE item_id = ?').all(itemId);
		send(res, <ItemView item={item} reviews={reviews} values={values} errors={errors} />);
		return;
	}

	// no errors, insert and redirect
	db.prepare(
		'INSERT INTO review (item_id, author, content) VALUES (?, ?, ?)',
	).run(itemId, values.author.trim(), values.content.trim());

	// redirecting gets a clean page w/ the updated content and the correct GET url
	// this matters if the user reloads or bookmarks the page
	res.redirect(`/item_view/${itemId}`);
});

// API route for client-side add
app.get('/api/item_view/:item_id/reviews', (req, res) => {
	const itemId = parseInt(req.params.item_id);
	const item = db.prepare('SELECT * FROM item WHERE id = ?').get(itemId);
	if (!item) return res.status(404).json({ error: 'No such item.' });

	const values = {
		author: req.body.author ?? '',
		content: req.body.content ?? ''
	};

	res.json({ author, content });


	
	// const errors = validateReview(values);

	// if (Object.keys(errors).length > 0) {
	// 	return res.status(422).json({ errors });
	// }

	// const author = values.author.trim();
	// const content = values.content.trim();
	// const { lastInsertRowid } = db.prepare(
	// 	'INSERT INTO review (item_id, author, content) VALUES (?, ?, ?)',
	// ).run(itemId, author, content);

	// res.status(201).json({ review: { id: lastInsertRowid, item_id: itemId, author, content } });
});


app.listen(PORT, () => console.log(`http://localhost:${PORT}/items`));
