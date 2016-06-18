export default function forAsync(arr, work) {
	function loop(arr, i) {
		return new Promise((resolve, reject) => {
			if (i >= arr.length) {resolve()}
			else try {
				Promise.resolve(work(arr[i], i))
				.then(() => resolve(loop(arr, i+1)))
				.catch(reject);
			} catch(error) {reject(error)}
		})
	}
	return loop(arr, 0);
}
