import { expect } from 'chai';
import log from 'picolog';
import forAsync from './for-async';

describe('forAsync', () => {
	it('can be used to iterate over an array', (done) => {
		const arr = ['one', 'two', 'three'];
		const expectedResult = arr.join('');
		let result = '';
		forAsync(arr, (item, idx) => {
			result += item;
		})
		.then(function() {
			expect(result).to.equal(expectedResult);
			done();
		});
	});

	it('can execute async work on each item', (done) => {
		const arr = ['one', 'two', 'three'];
		const expectedResult = arr.join('');
		let result = '';
		forAsync(arr, (item, idx) => {
			return new Promise(resolve => setTimeout(() => {
				result += item;
				resolve();
			}, 1))
		})
		.then(function() {
			expect(result).to.equal(expectedResult);
			done();
		});
	});

	it('passes `item` and `idx` to the callback on each iteration', (done) => {
		const arr = ['one', 'two', 'three'];
		const expectedResult = arr.join('');
		const expectedIndexes = "012";
		let result = '';
		let resultIndexes = '';
		forAsync(arr, (item, idx) => {
			return new Promise(resolve => setTimeout(() => {
				result += item;
				resultIndexes += idx;
				resolve();
			}, 1))
		})
		.then(function() {
			expect(result).to.equal(expectedResult);
			expect(resultIndexes).to.equal(expectedIndexes);
			done();
		});
	});

	it('can be aborted by throwing from sync code', (done) => {
		const arr = ['one', 'two', 'three'];
		forAsync(arr, (item, idx) => {
			throw new Error('aborted');
		})
		.then(function() {
			done(new Error('Failed to abort as expected'));
		})
		.catch(function(error) {
			expect(error.message).to.equal('aborted');
			done();
		});
	});

	it('can be aborted by rejecting the promise from async code', (done) => {
		const arr = ['one', 'two', 'three'];
		forAsync(arr, (item, idx) => {
			return new Promise((resolve, reject) => setTimeout(() => {
				reject(new Error('aborted'));
			}, 1))
		})
		.then(function() {
			done(new Error('Failed to abort as expected'));
		})
		.catch(function(error) {
			expect(error.message).to.equal('aborted');
			done();
		});
	});
});

