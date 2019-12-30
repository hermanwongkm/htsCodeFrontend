//  This is a redundant now.
// This is meant for testing only.
let str1 = "Leather bag";
let str2 = '3210.00.00';
let str3 = '302.84';


const reSearch = (input) => {
    let regexp1 = /^(\d{4}|\d{3})(\.\d{2}(\.\d{2}(\.\d{2})?)?)?$/g  // This is to match the hts / codes
    let result1 = input.match(regexp1);
    console.log(result1.toString().toLowerCase());
};

reSearch(str2);