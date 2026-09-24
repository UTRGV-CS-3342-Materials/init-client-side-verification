import { Layout } from './Layout.jsx';

function Review({ review }) {
	return (
		<div className="card w-100 mt-3">
			<div className="card-header">
				<em>{review.author}</em>
			</div>
			<div className="card-body">
				<p>{review.content}</p>
			</div>
		</div>
	);
}

export function ItemView({ item, reviews, values, errors }) {
	console.log(errors);
	return (
		<Layout title="Incredibly Simple Shopping">
			<div className="pb-2 mt-4 mb-2 border-bottom">
				<h1>{item.name}</h1>
				<p>
					(<a href="/items">back</a>)
				</p>
			</div>

			<div className="row">
				<div className="col-4">
					<img className="img-fluid" src={item.image_url} />
				</div>
				<div className="col-4">
					<div>{item.description}</div>
					<div>
						<em>${item.cost}</em>
					</div>
				</div>
			</div>

			<div className="row my-4">
				<div className="col-8">
					<h3>Reviews</h3>

					<div className="card w-100 mt-3">
						<div className="card-body">
							<form method="POST">
								<div className="form-group">
									<label>Add your review!</label>

									{/* always rendered so the ids exist for client-side blur checks; hidden via inline style when there's nothing to show */}
									<div id="error-banner" className="alert alert-danger" style={{ display: errors && Object.keys(errors).length > 0 ? 'block' : 'none' }}>
										<p>Unable to save your review. Please correct these errors and resubmit.</p>
										<ul id="error-list">
											<li id="error-author" style={{ display: errors?.author ? 'list-item' : 'none' }}>Name cannot be blank</li>
											<li id="error-content" style={{ display: errors?.content ? 'list-item' : 'none' }}>Review cannot be blank</li>
										</ul>
									</div>

									{/* defaultValue rather than value here to set the initial content of the textbox 
										? operator is a null check, same as values && values.author */}
									<input
										className="form-control mb-1"
										placeholder="Name"
										name="author"
										id="author"
										defaultValue={values?.author}
									/>
								</div>
								<div className="form-group">
									<textarea
										className="form-control mb-1"
										placeholder="Review"
										name="content"
										id="content"
										defaultValue={values?.content}
									/>
								</div>
								<div className="form-group">
									<button type="submit" className="btn btn-primary">
										Submit
									</button>
								</div>
							</form>
						</div>
					</div>

					{/* this page is rendered with renderToString and never hydrated, so React's onBlur prop
						never reaches the browser (React drops it, and a literal onblur="" attribute gets
						stripped from the SSR output too); wiring listeners by id from plain JS is what
						actually runs client-side */}
					<script
						dangerouslySetInnerHTML={{
							__html: `
								var errorBanner = document.getElementById('error-banner');

								function show(errorId) {
									errorBanner.style.display = 'block';
									document.getElementById(errorId).style.display = 'list-item';
								}

								function hide(errorId) {
									document.getElementById(errorId).style.display = 'none';
									errorBanner.style.display = 'none';
								}

								function checkBlank(textbox, errorId) {
									if (textbox.value.trim() === '' ) {
										show(errorId);
									} else {
										hide(errorId);
									}
								}

								document.getElementById('author').addEventListener('blur', function () {
									checkBlank(this, 'error-author');
								});

								document.getElementById('content').addEventListener('blur', function () {
									checkBlank(this, 'error-content');
								});

								// function hasError() {
								// 	return document.getElementById('error-author').style.display === 'list-item' ||
								// 		document.getElementById('error-content').style.display === 'list-item';
								// }


								// intercept submit and post as JSON so the review can be added
								// to the page without a full reload
								// document.getElementById('review-form').addEventListener('submit', async function (event) {


									// event.preventDefault();

									// var authorBox = document.getElementById('author');
									// var contentBox = document.getElementById('content');

									// const response = await fetch('/api/item_view/${item.id}/reviews', {
									// 	method: 'POST',
									// 	headers: { 'Content-Type': 'application/json' },
									// 	body: JSON.stringify({ author: authorBox.value, content: contentBox.value }),
									// })
	
									// const body = await response.json();

									// if (!response.ok) {
									// 	if (body?.errors.author) show('error-author'); else hide('error-author');
									// 	if (body?.errors.content) show('error-content'); else hide('error-content');
									// 	return;
									// }
	
									// hide('error-author');
									// hide('error-content');

									// const card = document.createElement('div');
									// card.className = 'card w-100 mt-3';
									// card.innerHTML =
									// 	'<div class="card-header"><em>Someone</em></div>' +
									// 	'<div class="card-body"><p>Something something</p></div>';
									// document.getElementById('reviews-list').prepend(card);

									// authorBox.value = '';
									// contentBox.value = '';
								// });
							`,
						}}
					/>

					{reviews.map((review) => (
						<Review key={review.id} review={review} />
					))}
				</div>
			</div>
		</Layout>
	);
}
