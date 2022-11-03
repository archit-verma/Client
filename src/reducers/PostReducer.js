const INITIAL_STATE = {
	posts: [],
	questions: [],
	editPost: false,
	loaded: 0
};

export default (state = INITIAL_STATE, action) => {
	let postId;
	switch(action.type){
		case 'all_posts':
			return {...state, posts: action.payload};
		case 'all_questions':
			return {...state, questions: action.payload};
		case 'group_posts':
			return {...state, posts: action.payload};
		case 'event_posts':
			return {...state, posts: action.payload};
		case 'user_posts':
			return {...state, posts: action.payload};
		case 'edit_post':
			return {...state, editPost: action.payload};
		case 'update_post':
			let post = action.payload.post;
			postId = action.payload.postId;
			if (post.isQuestion) {
				let sortedQuestions = state.questions.filter(p => p.postId !== postId);
				sortedQuestions.push(post);
				sortedQuestions.sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
				return {...state, questions: sortedQuestions, editPost: false};
			}
			else{
				let sortedPosts = state.posts.filter(p => p.postId !== postId);
				sortedPosts.push(post);
				sortedPosts.sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
				return {...state, posts: sortedPosts, editPost: false};
			}
		case 'delete_post':
			let typeQuestion = action.payload.typeQuestion;
			postId = action.payload.postId;
			if (typeQuestion) {
				let questions = state.questions.filter(p => p.postId !== postId)
				return {...state, questions: questions};
			}
			else{
				let posts = state.posts.filter(p => p.postId !== postId)
				return {...state, posts: posts};
			}
		case 'post_upload_progress':
			return {...state, loaded: action.payload};
		default:
			return state;
	}
}