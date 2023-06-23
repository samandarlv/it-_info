async function getAuthors() {
    localStorage.setItem(
        "accessToken",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTI4YWZhYTNjYThkY2FlNzYzZWM2OCIsImlzX2V4cGVydCI6ZmFsc2UsImF1dGhvclJvbGVzIjpbIlJFQUQiLCJXUklURSJdLCJpYXQiOjE2ODc1NDA0OTAsImV4cCI6MTY5MDEzMjQ5MH0.m5adlG6zDTjN9yQUO-11LN7HASoiox_zYmGHPRnlVzs"
    );
    const accessToken = localStorage.getItem("accessToken");

    fetch("http://localhost:3000/api/author", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "aplication/json",
        },
        mode: "cors",
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Request failed with status: " + response.status);
            }
        })
        .then((authors) => {
            console.log(authors.data);
            displayAuthors(authors.data);
        })
        .catch((error) => {
            console.error("Error", error);
        });
}

function displayAuthors(authors) {
    const listenContainer = document.getElementById("author-list");

    (listenContainer.innerHTML = ""),
        authors.forEach((author) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${author.author_first_name} ${author.author_last_name} \
            - ${author.author_email}`;
            listenContainer.appendChild(listItem);
        });
}

async function getDictionary() {
    localStorage.setItem(
        "accessToken",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTI4YWZhYTNjYThkY2FlNzYzZWM2OCIsImlzX2V4cGVydCI6ZmFsc2UsImF1dGhvclJvbGVzIjpbIlJFQUQiLCJXUklURSJdLCJpYXQiOjE2ODc1NDA0OTAsImV4cCI6MTY5MDEzMjQ5MH0.m5adlG6zDTjN9yQUO-11LN7HASoiox_zYmGHPRnlVzs"
    );
    const accessToken = localStorage.getItem("accessToken");

    fetch("http://localhost:3000/api/term", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "aplication/json",
        },
        mode: "cors",
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Request failed with status: " + response.status);
            }
        })
        .then((terms) => {
            // console.log(terms.data);
            displayDictionary(terms.data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function displayDictionary(terms) {
    const listenContainer = document.getElementById("dictionary-list");

    (listenContainer.innerHTML = ""),
        terms.forEach((term) => {
            // console.log(term);
            const listItem = document.createElement("li");
            listItem.textContent = `${term.term} \- ${term.letter}`;
            listenContainer.appendChild(listItem);
        });
}

async function getTopic() {
    localStorage.setItem(
        "accessToken",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTI4YWZhYTNjYThkY2FlNzYzZWM2OCIsImlzX2V4cGVydCI6ZmFsc2UsImF1dGhvclJvbGVzIjpbIlJFQUQiLCJXUklURSJdLCJpYXQiOjE2ODc1NDA0OTAsImV4cCI6MTY5MDEzMjQ5MH0.m5adlG6zDTjN9yQUO-11LN7HASoiox_zYmGHPRnlVzs"
    );
    const accessToken = localStorage.getItem("accessToken");

    fetch("http://localhost:3000/api/topic", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "aplication/json",
        },
        mode: "cors",
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Request failed with status: " + response.status);
            }
        })
        .then((topics) => {
            // console.log(topics.data);
            displayTopic(topics.data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function displayTopic(topics) {
    const listenContainer = document.getElementById("topic-list");

    (listenContainer.innerHTML = ""),
        topics.forEach((topic) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${topic.topice_title} \- ${topic.topic_text}`;
            listenContainer.appendChild(listItem);
        });
}
