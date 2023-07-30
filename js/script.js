/*----targets overview profile info---*/
const overview = document.querySelector(".overview");
const username = "JOSIK95";
/*---selects UL to display repos---*/
const reposList = document.querySelector(".repo-list");
const repoSection = document.querySelector(".repo");
const individualRepo= document.querySelector(".repo-data");


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
    div.classList.add(".user-info");
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

/*---displays specific repo info that has been clicked on---*/
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



const displayRepoInfo = function(repoInfo,languages){
    individualRepo.innerHTML = "";
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