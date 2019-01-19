/*
	Calculate the frequency of each unique MAC address for a given
	address type (i.e. source, destination) given a list of ethernet
	frame objects
*/
function getFrequencyData(ethFrameList, addressType) {
	let table = {}; /* Table of address->frequency data to return */

	/*
		For each frame, increment the frequency
		or create a new object if it doesn't exist
	*/
	for (let i = 0; i < ethFrameList.length; ++i) {
		let nextAddress = ethFrameList[i][addressType];
		if (table[nextAddress]) {
			table[nextAddress]++;
		}
		else {
			table[nextAddress] = 1;
		}
	}

	/* Return result */
	return table;
}
