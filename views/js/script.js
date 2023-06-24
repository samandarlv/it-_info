async function getAuthors() {
    const loginUrl = "/login";
  
    let accessToken = localStorage.getItem("accessToken");
    console.log("accessToken:", accessToken);
    const accessTokenExpTime = getTokenExpiration(accessToken);
    console.log("accessTokenExpTime:", accessTokenExpTime);
    if (accessTokenExpTime) {
      const currentTime = new Date();
      if (currentTime < accessTokenExpTime) {
        console.log("Access token is still valid.");
      } else {
        console.log("Access token has expired.");
        const refreshToken = getTokenFromCookie("refreshToken");
        console.log("refreshToken:", refreshToken);
        const refreshTokenExpTime = getTokenExpiration(refreshToken);
        console.log("refreshTokenExpTime: ", refreshTokenExpTime);
        if (refreshTokenExpTime) {
          const currentTime = new Date();
          if (currentTime < refreshTokenExpTime) {
            console.log("Refresh token is still valid.");
            accessToken = await refreshTokenFunc(refreshToken);
            console.log("NewAccessToken:", accessToken);
          } else {
            console.log("Refresh token has expired.");
            return window.location.replace(loginUrl);
          }
        } else {
          console.log("Invalid access token format.");
        }
      }
    } else {
      console.log("Invalid access token format.");
    }
  
    fetch("http://localhost:3000/api/author", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
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
      .then((author) => {
        console.log(author.data);
        displayAuthors(author.data);
      })
      .catch((error) => {
        console.error("Error:", error);
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


function getTokenExpiration(token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    if (decodedToken && decodedToken.exp) {
      return new Date(decodedToken.exp * 1000); // Convert expiration time from seconds to milliseconds
    }
    return null;
  }
  
  function getTokenFromCookie(cookieName) {
    const cookies = document.cookie.split(";");
    console.log(cookies, cookieName);
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${cookieName}=`)) {
        return cookie.substring(cookieName.length + 1);
      }
    }
    return null;
  }
  
  async function refreshTokenFunc() {
    return fetch("http://localhost:3000/api/author/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          console.log("Refreshed successful");
          return response.json();
        } else {
          console.error("Refreshing failed");
        }
      })
      .then((tokens) => {
        console.log(tokens.accessToken);
        localStorage.setItem("accessToken", tokens.accessToken);
        return tokens.accessToken;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
