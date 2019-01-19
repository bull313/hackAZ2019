/*
	Given a list of objects, return a dictionary containing each unique value
	of a given property paired with the number of occurences of that value (its frequency)
*/
function getFrequencyData(objectList, property) {
	let table = {}; /* Table of address->frequency data to return */

	/*
		For each frame, increment the frequency
		or create a new object if it doesn't exist
	*/
	for (let i = 0; i < objectList.length; ++i) {
		let nextObj = objectList[i][property];

		if (nextObj == undefined) {

			/* Object property doesn't exist. Cannot generate a table in this case */
			return null;

		}

		if (table[nextObj]) {
			table[nextObj]++;
		}
		else {
			table[nextObj] = 1;
		}
	}

	/* Return result */
	return table;
}
