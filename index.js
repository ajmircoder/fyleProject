var githubUrl = 'https://api.github.com/';
var userName = 'ad';
const showUserData = async () => {
    const url = `${githubUrl}users/${userName}`;
    let repoCount = 0;
    let userId = ''
    await fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if(data.message == "Not Found"){
                document.querySelector('#errors').classList.remove('d-none');
                return
            }
            document.querySelector('#main').classList.remove('d-none');
            userId = data.id;
            repoCount = data.public_repos;
            document.querySelector('#userImage').src = data.avatar_url ? data.avatar_url : "";
            document.querySelector('#userName').innerText = data.name ? data.name : "";
            document.querySelector('#bio').innerText = data.bio ? data.bio : "";
            document.querySelector('#location').innerText = data.location ? data.location : "";
            if(data.twitter_username){
                document.querySelector('#twitter').href = `https://twitter.com/${data.twitter_username}`
                document.querySelector('#twitterName').innerText = data.twitter_username;
            }else{
                document.querySelector('#twitter').remove();
            }
            document.querySelector('#github').href = data.html_url ? data.html_url : "";
            document.querySelector('#githubName').innerText = data.login ? data.login : "";;

        }).catch((err)=>{
            document.querySelector('#errors').classList.remove('d-none');
        })
    return { repoCount, userId };
}
const showRepoData = async (pageUrl = null, pageCount = 10) => {
    
    document.querySelectorAll('.repo').forEach(e => e.remove());
    let userRepo;
    const url = pageUrl ? pageUrl : `${githubUrl}users/${userName}/repos?per_page=${pageCount}`;
    await fetch(url)
        .then((res) => res.json())
        .then((data) => {
            userRepo = data
        });
    let dummyRepo = document.querySelector('#dummyRepo');
    let topic = document.querySelector('.topic');
    let topics = document.querySelector('.topics');
    let perent = document.querySelector('#perent');
    userRepo.map((rep) => {
        let newDiv = dummyRepo.cloneNode(true);
        let newTopics = topics.cloneNode(true);
        newDiv.querySelector('.repoName').textContent = rep.name ? rep.name : "";
        newDiv.querySelector('.repodes').textContent = rep.description ? rep.description.length > 100 ? rep.description.substring(0, 100) + "..." : rep.description : "No description";
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
const createPage = async () => {
    document.querySelector('#load').classList.remove('d-none');
    const { repoCount, userId } = await showUserData();
    await showRepoData();
    createPagination(repoCount, userId);
    const select = document.querySelector('#changeRepoCount');
    select.addEventListener('change', async(e) => {
        document.querySelector('#load').classList.remove('d-none');
        await showRepoData(null, e.target.value);
        createPagination(repoCount, userId, e.target.value);
    });
}
createPage();