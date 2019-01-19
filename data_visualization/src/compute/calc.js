/*
	Given a list of objects, return a dictionary containing each unique value
	of a given property paired with the number of occurences of that value (its frequency)
*/
function getFrequencyData(data, property) {
    let table = {}; /* Table of address->frequency data to return */

    /*
    	For each frame, increment the frequency
    	or create a new object if it doesn't exist
    */
    for (let i = 0; i < data.length; ++i) {
        let nextObj = data[i][property];

        if (nextObj == undefined) {

            /* Object property doesn't exist. Cannot generate a table in this case */
            return null;

        }

        if (table[nextObj]) {
            table[nextObj]++;
        } else {
            table[nextObj] = 1;
        }
    }

    /* Return result */
    return table;
}

/*
	Return a sorted version of a data set based off of a comparison function.
	Sorting is done with MergeSort algorithm
*/
function sortDataByProp(data, comp) {
    let merge = (left, right, comp) => {
        let result = [],
            lLen = left.length,
            rLen = right.length,
            l = 0,
            r = 0;
        while (l < lLen && r < rLen) {
            if (comp(left[l], right[r]) < 0) {
                result.push(left[l++]);
            } else {
                result.push(right[r++]);
            }
        }
        return result.concat(left.slice(l)).concat(right.slice(r));
    }

    let len = data.length;
    if (len < 2)
        return data;
    let mid = Math.floor(len / 2),
        left = data.slice(0, mid),
        right = data.slice(mid);

    return merge(sortDataByProp(left, comp), sortDataByProp(right, comp), comp);
}
