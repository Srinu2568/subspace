const axios = require('axios');
const _ = require('lodash');

let blogData = [];

const getBlogStats = async () => {
	try {
		const response = await axios.get(
			'https://intent-kit-16.hasura.app/api/rest/blogs',
			{
				headers: {
					'x-hasura-admin-secret':
						'32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
				},
			}
		);
		blogData = response.data.blogs;

		const totalBlogs = blogData.length;
		const longestTitleBlog = _.maxBy(blogData, (blog) => blog.title.length);
		const privacyBlogs = _.filter(blogData, (blog) =>
			_.includes(_.toLower(blog.title), 'privacy')
		);
		const uniqueTitles = _.uniqBy(blogData, 'title');

		return {
			totalBlogs,
			longestTitle: longestTitleBlog.title,
			privacyBlogs: privacyBlogs.length,
			uniqueTitles,
		};
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: 'An error occurred while fetching and analyzing blog data.',
		});
	}
};

const searchBlogs = (query) => {
	try {
		query = query.toLowerCase();

		const searchResults = _.filter(blogData, (blog) =>
			_.includes(_.toLower(blog.title), query)
		);

		return searchResults;
	} catch (error) {
		throw new Error('An error occurred during the search.');
	}
};

const memoizedGetBlogStats = _.memoize(getBlogStats, () => {}, 60000);
const memoizedSearchBlogs = _.memoize(searchBlogs, (query) => query, 60000);

exports.blogStats = async (req, res) => {
	try {
		blogDataItems = await memoizedGetBlogStats();

		res.json(blogDataItems);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: 'An error occurred while fetching and analyzing blog data.',
		});
	}
};

exports.blogSearch = async (req, res) => {
	const { query } = req.query;
	try {
		const results = await memoizedSearchBlogs(query);
		res.json(results);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};
