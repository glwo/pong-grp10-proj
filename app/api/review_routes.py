from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Review
from sqlalchemy import or_
from ..models import db, Review, Review_Image, Business
from ..forms import ReviewForm

review_routes = Blueprint('review', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@review_routes.route('')
def all_reviews():
    reviews = Review.query.all()
    # all_reviews = []
    # for review in reviews:
    #     all_reviews.append(review.to_dict())
    # return {"Reviews": all_reviews}
    return {"Reviews": [review.to_dict() for review in reviews]}


@review_routes.route('/current')
@login_required
def user_reviews():

    # Shows reviews of the current user

    user = current_user.to_dict()
    return {"userReviews": [review for review in user["reviews"]]}


@review_routes.route('/business/<int:id>/reviews', methods=["POST"])
@login_required
def create_review(id):
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_review = Review(
            business_id = form.data['business_id'],
            user_id = current_user.id,
            firstName = current_user.first_name,
            lastInitial = current_user.last_name[0],
            content = form.data['review'],
            rating = form.data['stars'],
        )
        db.session.add(new_review)
        db.session.commit()


        newImage = Review_Image(
            url = form.data['url'],
            review_id = new_review.id
        )
        db.session.add(newImage)
        db.session.commit()

        return new_review.to_dict(), 201
    if form.errors:
        return {
            "errors": validation_errors_to_error_messages(form.errors)
        }, 400


@review_routes.route('/<int:id>', methods=["PUT"])
@login_required
def edit_review(id):

    # Edit the review

    review = Review.query.get(id)
    reviewImage = Review_Image.query.get(review.images[0].id)

    if not review:
        print("Review not -----------------1-----found")
        return { "errors": "Review not found"}, 404
    if current_user.id != review.user_id:
        print("Review not ------------2----------found")
        return { "errors": "Forbidden"}, 403
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        print("Review not --------------3--------found")
        review.business_id = form.data['business_id'],
        review.user_id = current_user.id,
        review.firstName = current_user.first_name,
        review.lastInitial = current_user.last_name[0],
        review.content = form.data['review'],
        review.rating = form.data['stars'],
        reviewImage.url = form.data['url']
        # db.session.add(review)
        print("Review not ---------------55555555-------found", review )
        db.session.commit()
        print("Review not --------------7777777777775-------found", review )
        return review.to_dict(), 201
    if form.errors:
        print("Review not ---------------4-------found")
        return {
            "errors": validation_errors_to_error_messages(form.errors)
        }, 400


@review_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_review(id):

    # Deletes the review

    review = Review.query.get(id)
    if not review:
        return { "errors": "Review not found"}, 404
    if current_user.id != review.user.id:
        return { "errors": "Forbidden"}, 403
    db.session.delete(review)
    db.session.commit()
    return { "message": "Successfully deleted review"}, 200
