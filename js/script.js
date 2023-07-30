/*----targets overview profile info---*/
const overview = document.querySelector(".overview");
const username = "JOSIK95";
/*---selects UL to display repos---*/
const reposList = document.querySelector(".repo-list");
const repoSection = document.querySelector(".repos");
const individualRepo = document.querySelector(".repo-data");
const backToGalleryButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");


/*---retrieves user info---*/
const getData = async function(){
    const res = await fetch(
        `https://api.github.com/users/${username}`
    );
    const data = await res.json();
    console.log(data);
    displayFetchedInfo(data)
};
getData()


/*---displays fetched info---*/
const displayFetchedInfo = function (data){
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = ` <figure>
    <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div> `;
  overview.append(div);
  getRepos();
};


/*---retrives repos---*/
const getRepos = async function(){
    const repoInfo = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
    );
    const repoData = await repoInfo.json();
displayRepos(repoData);
};


/*---displays list of repos---*/
const displayRepos = function(repos){
    filterInput.classList.remove("hide");
    for (const repo of repos){
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        reposList.append(repoItem);
    }
};


reposList.addEventListener("click", function(e){
    if(e.target.matches("h3")){
        const repoName = e.target.innerText;
        specificRepoInfo(repoName);
    }
});


/*---fetches language info for repo---*/
const specificRepoInfo = async function (repoName){
    const fetchInfo = await fetch (
        `https://api.github.com/repos/${username}/${repoName}`
    )
    const repoInfo = await fetchInfo.json();
    console.log(repoInfo)

    const fetchLanguages = await fetch(repoInfo.languages_url);
    const langaugeData = await fetchLanguages.json();

    const languages = [];
    for (const language in langaugeData ){
        languages.push(language);
    }
displayRepoInfo(repoInfo,languages);
};


/*---displays and creates div for repo--*/
const displayRepoInfo = function(repoInfo,languages){
    individualRepo.innerHTML = "";
    backToGalleryButton.classList.remove("hide");
    individualRepo.classList.remove("hide");
    reposList.classList.add("hide");
    const div = document.createElement("div");
    div.innerHTML=`
<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`
    ;
    individualRepo.append(div);
   
};


/*---hides div for repo and goes back to repo list---*/
backToGalleryButton.addEventListener("click", function(){
    backToGalleryButton.classList.add("hide");
    individualRepo.classList.add("hide");
    reposList.classList.remove("hide");
});


filterInput.addEventListener("input", function (e){
    const searchText = e.target.value;
    console.log(searchText);

    const repos = document.querySelectorAll(".repo");
    const searchLowerText = searchText.toLowerCase();
    for (const repo of repos){
     const lowerText = repo.innerText.toLowerCase();
       if(lowerText.includes(searchLowerText)){
        repo.classList.remove("hide");
       } else {
        repo.classList.add("hide");
       };
    }   
});
