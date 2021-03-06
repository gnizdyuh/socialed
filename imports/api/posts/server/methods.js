import { Meteor } from 'meteor/meteor';
import faker from 'faker';
import PostsCollection from '../collection';

Meteor.methods({
	'posts.insert': function({ body, imagesLinks }) {
		if (!this.userId) {
			throw new Meteor.Error('Not authorized');
		}

		if (typeof body !== 'string' || body.length <= 5) {
			throw new Meteor.Error('Post should be longer than 5 characters');
		}

		const _id = PostsCollection.insert({
			body,
			imagesLinks,
			userId: this.userId,
			createdAt: new Date()
		});

		return _id;
	},
	'post.delete': function(id) {
		if (!this.userId) {
			throw new Meteor.Error('Not authorized');
		}

		const _id = PostsCollection.remove(id);

		return _id;
	},

	'posts.count'({ selectedUsers }) {
		if (!this.userId) {
			throw new Meteor.Error('Not authorized');
		}

		return PostsCollection.find({
			...(selectedUsers.length ? { userId: { $in: selectedUsers } } : {})
		}).count();
	},

	'posts.clear'() {
		if (!this.userId) {
			throw new Meteor.Error('Not authorized');
		}

		if (!Meteor.users.findOne(this.userId).isAdmin) {
			throw new Meteor.Error('Access Denied!');
		}
		PostsCollection.remove({});
	},

	'posts.populate'(number = 10) {
		if (!this.userId) {
			throw new Meteor.Error('Not authorized');
		}

		const userIds = Meteor.users.find().map((u) => u._id);
		for (let i = 0; i < number; i++) {
			PostsCollection.insert({
				body: faker.lorem.sentence(),
				userId: faker.random.arrayElement(userIds),
				createdAt: faker.date.recent()
			});
		}
	}
});
