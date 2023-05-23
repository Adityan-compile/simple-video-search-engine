let currentPage;
let query = null;

function updateCurrentPage(pageNo){
    document.getElementById("currentPage").innerText = pageNo;
}

window.onload = ()=>{
      currentPage = parseInt(new URLSearchParams(window.location.hash).get('gsc.page')) || 1;
      updateCurrentPage(currentPage);
      updateExtBtn();

      query = new URLSearchParams(window.location.search).get('q');

      document.querySelector('.gsc-control-cse').style = "display:none;";
      document.getElementById("search-box").value = query && ""; 

      let nav = document.getElementsByClassName("nav-section");
      

      if(query === null){
        nav[0].style.display = 'none';
        nav[1].style.display = 'none';
      }else{
        nav[0].style.display = 'flex';
        nav[1].style.display = 'flex';
      }

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
    document.getElementById("ext-query").innerHTML = `&nbsp;${new URLSearchParams(window.location.search).get('q')}&nbsp;`;
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

  // Clean up Results
  results.forEach((el) => {
    if (
      el.visibleUrl === "www.youtube.com" &&
      "videoobject" in el.richSnippet &&
      el.richSnippet.videoobject.genre === "Music"
    ) {
      processedResults.push({
        owner: (el.richSnippet.person && el.richSnippet.person.name) || "",
        embed: el.richSnippet.videoobject.embedurl,
        views: parseInt(el.richSnippet.videoobject.interactioncount),
        title: el.titleNoFormatting,
        thumbnail: el.richSnippet.videoobject.thumbnailurl,
        duration: el.richSnippet.videoobject.duration,
        url: el.richSnippet.videoobject.url
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

  processedResults.forEach((result,idx)=>{

    let resultTemplate = `<div id="result-${idx}" class="flex justify-start result br-10" onclick="openPreview('result-${idx}')" data-target='${JSON.stringify(result)}'>
    <div class="thumb-container">
    <object class="thumbnail br-10" data="${result.thumbnail}">
      <img class="thumbnail br-10" src="alt-thumb.png">
    </object>
    <div class="duration">${result.duration}</div>
    </div>
    <div class="flex col w-100 align-start space-between m-10">
        <div>
            <h4 style="margin-bottom:0;">${result.title.slice(0,20)+'...'}</h3>
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

function openPreview(result){
    const resultObj = JSON.parse(document.getElementById(result).getAttribute('data-target'));
    
    document.getElementById('player').src = resultObj.embed;
    document.getElementById('title').innerText = resultObj.title;
    document.getElementById('owner').innerText = ' ' + resultObj.owner;
    document.getElementById('views').innerHTML = resultObj.views + "views";
    document.getElementById('visit').onclick = () => window.open(resultObj.url, '_blank');

    document.getElementById('preview-overlay').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
}

function closePreview(){
  document.getElementById('preview-overlay').style.display = 'none';
  document.getElementById('main-content').style.display = 'flex';
}