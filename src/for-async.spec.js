import { expect } from 'chai';
import log from 'picolog';
import forAsync from './for-async';

describe('forAsync', done => {
	it('can be used to iterate over an array', () => {
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

	it('can execute async work on each item', () => {
		const arr = ['one', 'two', 'three'];
		const expectedResult = arr.join('');
		let result = '';
		forAsync(arr, (item, idx) => {
			return new Promise(resolve => setTimeout(() => {
				result += item;
				resolve();
			}, 50))
		})
		.then(function() {
			expect(result).to.equal(expectedResult);
			done();
		});
	});

	it('passes `item` and `idx` to the callback on each iteration', () => {
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
			}, 50))
		})
		.then(function() {
			expect(result).to.equal(expectedResult);
			expect(resultIndexes).to.equal(expectedIndexes);
			done();
		});
	});

	it('can be aborted by throwing from sync code', () => {
		const arr = ['one', 'two', 'three'];
		forAsync(arr, (item, idx) => {
			throw new Error('aborted');
		})
		.then(function() {
			expect(false).to.equal(true);
			done();
		})
		.catch(function(error) {
			expect(error.message).to.equal('aborted');
			done();
		});
	});

	it('can be aborted by rejecting the promise from async code', () => {
		const arr = ['one', 'two', 'three'];
		forAsync(arr, (item, idx) => {
			return new Promise((resolve, reject) => setTimeout(() => {
				reject('aborted');
			}, 50))
		})
		.then(function() {
			expect(false).to.equal(true);
			done();
		})
		.catch(function(error) {
			expect(error.message).to.equal('aborted');
			done();
		});
	});
});

