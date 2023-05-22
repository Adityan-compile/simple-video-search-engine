let currentPage;
let query;

function updateCurrentPage(pageNo){
    document.getElementById("currentPage").innerText = pageNo;
}

window.onload = ()=>{
      currentPage = parseInt(new URLSearchParams(window.location.hash).get('gsc.page')) || 1;
      updateCurrentPage(currentPage);
      updateExtBtn();

      query = new URLSearchParams(window.location.search).get('q');

      document.querySelector('.gsc-control-cse').style = "display:none;";
      document.getElementById("search-box").value = query; 

}

function updateHash(){
    let params = Object.fromEntries(new URLSearchParams(window.location.hash));
        params['gsc.page'] = currentPage;
        window.location.hash = `#gsc.tab=${params['#gsc.tab']}&gsc.q=${params['gsc.q']}&gsc.page=${params['gsc.page']}`;
}

function prevPage(){
    if(currentPage > 1){
        currentPage -= 1;
        updateCurrentPage(currentPage);
        updateHash();

    }

    return;

}

function nextPage(){
    if(currentPage < 10){
      currentPage += 1;
    }else{
      currentPage = 1;
    }
    updateCurrentPage(currentPage)
    updateHash();
}

function updateExtBtn(){
    document.getElementById("ext-query").innerHTML = new URLSearchParams(window.location.search).get('q');
}

window.addEventListener('hashchange', e=>{
    updateExtBtn();
});

const myInitCallback = function () {
  if (document.readyState == "complete") {
    
    google.search.cse.element.render({
      div: "search-anchor",
      tag: "searchresults-only",
    });
  } else {
    
    google.setOnLoadCallback(function () {
    
      google.search.cse.element.render({
        div: "search-anchor",
        tag: "searchresults-only",
      });
    }, true);
  }
};

const myWebSearchStartingCallback = (gname, query) =>
  "site:youtube.com " + query;

const myResultsReadyCallback = function (name, q, promos, results, resultsDiv) {
  let processedResults = [];
  console.log(results);
  // Clean up Results
  results.forEach((el) => {
    if (
      "videoobject" in el.richSnippet &&
      el.richSnippet.videoobject.genre === "Music"
    ) {
      processedResults.push({
        owner: (el.richSnippet.person && el.richSnippet.person.name) || "",
        embed: el.richSnippet.videoobject.embedurl,
        views: parseInt(el.richSnippet.videoobject.interactioncount),
        title: el.titleNoFormatting.slice(0,20)+'...',
        thumbnail: el.richSnippet.videoobject.thumbnailurl,
        duration: el.richSnippet.videoobject.duration,
      });
    }
  });

  // Sort Results in the descending order of interactions(Views)
  processedResults.sort((a, b) => {
    return b.views - a.views;
  });

  // Process the number of Views into Compact Style Numbering & Convert Duration Format from iso 8601 to M:S Format 
  processedResults = processedResults.map((el) => {
    return {
      ...el,
      views: Intl.NumberFormat("en", {
        notation: "compact",
      }).format(el.views),
      duration: el.duration.replace(/PT(\d+)M(\d+)S/, "$1:$2"),
    };
  });

  let resultContainer = document.getElementById("results");

  processedResults.forEach(result=>{
    let resultTemplate = `<div class="flex justify-start result">
    <div class="thumb-container">
    <img class="thumbnail" src="${result.thumbnail}">
    <div class="duration">${result.duration}</div>
    </div>
    <div class="flex col w-100 align-start m-10">
        <div>
            <h4 style="margin-bottom:0;">${result.title}</h3>
            <h6 style="margin-top:0;">${result.owner}</h5>
        </div>
        <div class="flex row space-between w-100">
            <div class="flex row">
                <img src="youtube.svg" height="18px" width="18px">
                <p>&nbsp; Youtube.com</p>
            </div>
            <p>${result.views} Views</p>
        </div>
    </div>
  </div>`;

  // Ensure that the results only contains 10 at a time
  if(resultContainer.childElementCount>=10){
    resultContainer.removeChild(resultContainer.childNodes[0]);
  }
    resultContainer.innerHTML += resultTemplate;

  })
  return true;
};


window.__gcse = {
  parsetags: "explicit", // Defaults to 'onload'
  initializationCallback: myInitCallback,
  searchCallbacks: {
    web: {
      starting: myWebSearchStartingCallback,
      ready: myResultsReadyCallback,
    },
  },
};


function openInGoogle(){
  window.open("https://www.google.com/search?q="+query, '_blank');
}