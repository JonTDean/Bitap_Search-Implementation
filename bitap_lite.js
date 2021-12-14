//Bitap_Search-Implementation

// This is a very simple implementation of the bitap algorithm.
const bitapSearchLite = (str: string, ptrn: string) => {
    // Define the max upper limit for pattern masking.
    const PATTERN_MASK_LIMIT = 256;
    // Define the upper limit for the maximum allowable integer
    // for the pattern length implementation.
    const MAX_PATTERN_LENGTH = 63;
    
    // The state records the value of the masked character
    // and provides a go to for the comparison check 
    // later on.
    let state = 0;
    
    // Initialize a Bit array. 
    // Stores the values to be checked against the pattern
    let patternMask = new Array(PATTERN_MASK_LIMIT);
    
    // Due to pattern length, we can't go past a certain point
    // which is 32, or the value of a char. After 33 the pattern
    // doubles in time complexity.
    let ptrnLen = ptrn.length;

    if(ptrnLen == 0 || ptrnLen > MAX_PATTERN_LENGTH) return -1;
    
    // Bit Masking/Multiplex
    // Initialize mask table for each letter in the pattern
    for (let i = 0; i < ptrnLen; i++) {
        // Meat and bones of the Bit Mask Muxing,
        // The pattern itself is referenced by each
        // character residing in the string. The pattern
        // at location index of variable <i> is furthermore
        // converted to its ASCII character reference equivalent.
        //
        // The mask itself is essentially acting as an
        // ASCII lookup table (as a collection <Array UINT64>) for the characters and
        // their respective reference value.
        // 
        // This is actually fucking genius whoever created this.
        // 
        // In terms of ptrn[i] being 'w'(ASCII Equivalent: 119)
        // // 1. The value of mask at index 119 
        // // 2. Equals assign symbol
        // // 3. The value of mask at index 119
        // // 4. Bitwise OR
        // // // * Breakdown of what Bitwise OR <|> is :
        // // // // Does a read comparison of both operands and
        // // // // checks them at the bit level, comparing which
        // // // // of the bits at their respective checked locations
        // // // // have a 0 or a 1. The result is then combined,
        // // // // forming a new bit sequence of all of the 1's in 
        // // // // their respective location.
        // // // // // Example f(1 | 2 === 3 ) =>
        // // // // // // 1 = 0001
        // // // // // // 2 = 0010
        // // // // // // // BITWISE OR JOIN OCCURS HERE
        // // // // // // 3 = 0011
        // // 5. Shifts the 1 bit over to the left by 1 place
        // // // Examples for 3 iterations:
        // // // Iteration 1 Value of i starts at 0
        // // // // Bit: 0001
        // // // // Char: 1
        // // // Iteration 2 Value of i incremented to 1
        // // // // Bit: 0010
        // // // // Char: 2
        // // // Iteration 3 Value of i incremented to 2
        // // // // Bit: 0100
        // // // // Char: 4
        // Labels for reference above.
        //                 1.           2.             3.				  4.    5.
        patternMask[ptrn.charCodeAt(i)] = patternMask[ptrn.charCodeAt(i)] | (1 << i);  
    }

    // Iterate through the string and check
    // the bits against the pattern. If 
    // the bit is null then the pattern is not found.
    // State Comparison + Bit Mask Mux 
    for (let i = 0; i < str.length; i++) {
    		// Update state by shifting it and masking with the record from table
        state = (state<<1) + 1;

        // The & operator checks at the bit level
        // placements which share similar 1 values
        // // Example f(1 & 3 === 1 ) =>
        // // // 1 = 0001
        // // // 3 = 0011
        // // // // BITWISE AND JOIN
        // // // 1 = 0001
        //
        // Explanation of the logic below
        // state = state & mask[text[i]];
        // // 1. Value of state
        // // 2. Equals Assign Operator
        // // 3. Value of state
        // // 4. Bitwise AND Operator
        // // 5. The value of mask at index str[i] 
        // // // *Quick note on this <str[i]> is 
        // // // actually reprensed as the ASCII code
        // // // in this scenario and acting as the 
        // // // value of the lookup table.
        // 1. 2. 3.   4.      5.
        state = state & patternMask[str.charCodeAt(i)];
      
        if((state & (1 << (ptrnLen - 1))) != 0) {
            console.log('Pattern Found!');
            return i - ptrnLen + 1;
        }
    }

    console.log('failed to find pattern');
    return -1;
}
