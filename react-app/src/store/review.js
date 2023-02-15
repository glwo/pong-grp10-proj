
const CREATE = 'reviews/CREATE'
const ALL = 'reviews/ALL'
const USER = 'reviews/USER'
const UPDATE = 'reviews/UPDATE'
const DELETE = 'reviews/DELETE'

const createReview = (review) => {
    return {
        type: CREATE,
        review
    }
}

const loadAllReviews = (reviews) => {
    return {
        type: ALL,
        reviews
    }
}

const loadUserReviews = (reviews) => {
    return {
        type: USER,
        reviews
    }
}

const updateReview = (review) => {
    return {
        type: UPDATE,
        review
    }
}

const deleteReview = (reviewId) => {
    return {
        type: DELETE,
        reviewId
    }
}

export const reviewCreate = (business_id, review) => async dispatch => {
    // console.log('buiness_id', business_id)
    const res = await fetch(`/api/review/business/${business_id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    })

    if (res.ok) {
        const newReview = await res.json()
        // if (review.image) {
        //     const payload = {
        //         "review_id": newReview.id,
        //         "url": review.image
            // }

            // const imageRes = await fetch(`/api/business/${businessId}/reviews/${newReview.id}/images`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // })

            // if (imageRes.ok) {
            //     const image = await imageRes.json()
            //     newReview.image = [image]
            //     dispatch(createReview(newReview))
            //     return newReview
            // }

        dispatch(createReview(newReview))
        return newReview
    }
}



export const userReviews = () => async dispatch => {
    const response = await fetch(`/api/reviews/current`)

    if(response.ok){
        const reviews = await response.json()
        dispatch(loadUserReviews(reviews))
        return reviews
    }
}

export const allReviews = () => async dispatch => {
    const response = await fetch(`/api/review`)




    if(response.ok){
        const reviews = await response.json()
        console.log('reviews', reviews)
        dispatch(loadAllReviews(reviews.Reviews))
    }
}

export const reviewUpdate = (reviewId, review) => async dispatch => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(review)
      })

    if(response.ok){
        const review = await response.json()
        dispatch(updateReview(review))
        return review
    }
}

export const removeReview = (reviewId) => async dispatch => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"}
      })

    if(response.ok) {
        const review = await response.json()
        dispatch(deleteReview(reviewId))
        return review
    }
}


const initialState = {
    allReviews: {},
    user: {}
}

export default function reducer (state = initialState, action) {
    let newState;
    switch (action.type) {
        case CREATE:
            newState = {...state, allReviews: {...state.allReviews}, user: {...state.user}}
            newState.user[action.review.id] = action.review
            newState.allReviews[action.review.id] = action.review
            return newState
        case ALL:
            newState = {...state, allReviews: {}, user: {...state.user}}
            action.reviews.forEach(review => {
                newState.allReviews[review.id] = review
            });
            return newState
        case USER:
            newState = {...state, user: {...state.user}}
            action.reviews.userReviews.forEach(review => {
                newState.user[review.id] = review
            });
            return newState
        case UPDATE:
            return {...state, allReviews: {...state.allReviews, [action.review.id]: action.review}}
        case DELETE:
            newState = {allReviews: {...state.allReviews}, user: {...state.user}}
            if (newState.user[action.reviewId]) delete newState.user[action.reviewId]
            if (newState.allReviews[action.reviewId]) delete newState.allReviews[action.reviewId]
            return newState
        default:
            return state
    }
}
