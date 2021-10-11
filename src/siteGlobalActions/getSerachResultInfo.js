function getSearchResultInfo(searchResult) {
    const numOfResults = searchResult.length;
    if(numOfResults === 0) {
        return "No results found";
    } else {
        return `Found ${numOfResults} results`;
    }
}

module.exports = getSearchResultInfo;