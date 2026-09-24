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

									{/* V0: only added when there are errors to show */}
									{errors && errors.length > 0 &&
										<div className="alert alert-danger">
											<p>Unable to save your review. Please correct these errors and resubmit.</p>
											<ul>
											{errors.map((msg,i) =>
												<li key={i}>{msg}</li>)}
											</ul>
										</div>}

									{/* V1: always added so that the client can show/hide errors */}
									{/* <div id="error-banner" className="alert alert-danger">
										<p>Unable to save your review. Please correct these errors and resubmit.</p>
										<ul id="error-list">
											<li id="error-author">Name cannot be blank</li>
											<li id="error-content">Review cannot be blank</li>
										</ul>
									</div> */}


									{/* defaultValue rather than value here to set the initial content of the textbox 
										? operator is a null check, same as values && values.author */}
									<input
										className="form-control mb-1"
										placeholder="Name"
										name="author"
										defaultValue={values?.author}
									/>
								</div>
								<div className="form-group">
									<textarea
										className="form-control mb-1"
										placeholder="Review"
										name="content"
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

					{reviews.map((review) => (
						<Review key={review.id} review={review} />
					))}
				</div>
			</div>
		</Layout>
	);
}
