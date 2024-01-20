var githubUrl = 'https://api.github.com/';
const showUserData = async (userName) => {
    const url = `${githubUrl}users/${userName}`;
    let repoCount = 0;
    let userId = ''
    let isOk = false;
    await fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error("HTTP status " + res.status);
            }
            return res.json();
        })
        .then((data) => {
            document.querySelector('#main').classList.remove('d-none');
            userId = data.id;
            repoCount = data.public_repos;
            document.querySelector('#userImage').src = data.avatar_url ? data.avatar_url : "";
            document.querySelector('#userName').innerText = data.name ? data.name : "";
            document.querySelector('#bio').innerText = data.bio ? data.bio : "";
            document.querySelector('#location').innerText = data.location ? data.location : "";
            if (data.twitter_username) {
                let twitter = document.querySelector('#twitter');
                twitter.classList.remove('d-none');
                twitter.href = `https://twitter.com/${data.twitter_username}`
                document.querySelector('#twitterName').innerText = data.twitter_username;
            } else {
                document.querySelector('#twitter').classList.add('d-none');
            }
            document.querySelector('#github').href = data.html_url ? data.html_url : "";
            document.querySelector('#githubName').innerText = data.login ? data.login : "";;
            isOk = true;
        }).catch((err) => {
            document.querySelector('#errors').classList.remove('d-none');
            isOk = false;
        });
    return { repoCount, userId, isOk };
}
const showRepoData = async (userName, pageUrl = null, pageCount = 10, ) => {
    document.querySelectorAll('.repo').forEach(e => e.remove());
    let userRepo;
    const url = pageUrl ? pageUrl : `${githubUrl}users/${userName}/repos?per_page=${pageCount}`;
    await fetch(url)
        .then((res) => res.json())
        .then((data) => {
            userRepo = data
        });
    if(!userRepo.length){
        document.querySelector('#noRepo').classList.remove('d-none');
    }else{
        document.querySelector('#noRepo').classList.add('d-none');
    }
    if(userRepo.length > 10){
        document.querySelector('#footer').classList.remove('d-none');
    }

    let dummyRepo = document.querySelector('#dummyRepo');
    let topic = document.querySelector('.topic');
    let topics = document.querySelector('.topics');
    let perent = document.querySelector('#perent');
    userRepo.map((rep) => {
        let newDiv = dummyRepo.cloneNode(true);
        let newTopics = topics.cloneNode(true);
        newDiv.querySelector('.repoName').textContent = rep.name ? rep.name : "";
        newDiv.querySelector('.repodes').textContent = rep.description ? rep.description.length > 100 ? rep.description.substring(0, 100) + "..." : rep.description : "No description";
        newDiv.querySelector('.repolink').href = rep.html_url;
        for (let i = 0; i < rep.topics.length; i++) {
            let cloneTopic = topic.cloneNode(true);
            cloneTopic.classList.remove('d-none')
            cloneTopic.textContent = rep.topics[i];
            newTopics.appendChild(cloneTopic);
        }
        if (rep.topics.length) {
            newDiv.appendChild(newTopics);
        }
        newDiv.id = '';
        newDiv.classList.add('repo');
        perent.appendChild(newDiv);
        newDiv.classList.remove("d-none");
    });
    document.querySelector('#load').classList.add('d-none');
}
const createPagination = async (repoCount, userId, pageCount = 10) => {
    let i = 1;
    document.querySelectorAll('.pageButton').forEach(e => e.remove());
    while (i <= Math.ceil(repoCount / pageCount)) {
        let a = document.createElement('button');
        a.innerText = i;
        if (i == 1) {
            a.classList.add('selected');
        }
        a.classList.add('btn', 'border', 'border-1', 'pageButton');
        let url = `${githubUrl}user/${userId}/repos?per_page=${pageCount}&page=${i}`;
        a.onclick = async (e) => {
            document.querySelector('#load').classList.remove('d-none');
            document.querySelector('.selected').classList.remove('selected');
            e.target.classList.add('selected');
            await showRepoData(url);
        }
        document.querySelector('#buttons').appendChild(a);
        i++;
    }
}
const createPage = async (userName = "ajmircoder") => {
    document.querySelector('#main').classList.add('d-none');
    if (!userName) {
        document.querySelector('#errors').classList.remove('d-none');
        return;
    }
    document.querySelector('#load').classList.remove('d-none');
    const { repoCount, userId, isOk } = await showUserData(userName);
    if (isOk) {
        await showRepoData(userName);
        createPagination(repoCount, userId);
        const select = document.querySelector('#changeRepoCount');
        select.addEventListener('change', async (e) => {
            document.querySelector('#load').classList.remove('d-none');
            await showRepoData(userName,    null, e.target.value);
            createPagination(repoCount, userId, e.target.value);
        });
    }
}
createPage();

document.querySelector('#userInput').addEventListener('change', (e)=>{
    createPage(e.target.value);
})