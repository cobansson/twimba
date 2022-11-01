import { tweetsData } from "/data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
console.log(uuidv4()); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const tweetInput = document.getElementById("tweet-input");
const feed = document.getElementById("feed");

document.addEventListener("click", function(e) {
    if(e.target.dataset.comment) {
        handleReplyButton(e.target.dataset.comment);
    } else if (e.target.dataset.retweet) {
        handleRetweetButton(e.target.dataset.retweet);
    } else if (e.target.dataset.like) {
        handleLikeButton(e.target.dataset.like);
    } else if (e.target.id === "tweet-btn") {
        handleTweetBtnClick();
    }
})

function handleLikeButton(tweetId) {
    const matchingTweet = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId;
    })[0];
    if (matchingTweet.isLiked) {
        matchingTweet.likes--;
    } else {
        matchingTweet.likes++;
    }
    matchingTweet.isLiked = !matchingTweet.isLiked;
    render();
}

function handleRetweetButton(tweetId) {
    const matchingTweet = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId;
    })[0];
    if(matchingTweet.isRetweeted) {
        matchingTweet.retweets--;
    } else {
        matchingTweet.retweets++;
    }
    matchingTweet.isRetweeted = !matchingTweet.isRetweeted;
    render();
}

function handleReplyButton(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@EnginCobanoglu`,
            profilePic: `images/engin.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    }
    tweetInput.value = "";
    render();
}

function getTweets() {
    let tweetsHtml = ``;
    let retweetClass = "";
    let likeClass = "";

    tweetsData.forEach(function(tweet) {

        if (tweet.isLiked) {
            likeClass = "liked"
        } else {
            likeClass = ""
        }
        tweet.isLiked === !tweet.isLiked;

        if (tweet.isRetweeted) {
            retweetClass = "retweeted"
        } else {
            retweetClass = "";
        }
        tweet.isRetweeted === !tweet.isRetweeted;

        let repliesHtml = ``;

        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function(reply) {
                repliesHtml +=
                `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>
                `
            })
        }

        tweetsHtml += 
        `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                        <i class="fa-solid fa-comment" data-comment="${tweet.uuid}"></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetClass}" data-retweet="${tweet.uuid}"></i>
                            ${tweet.retweets}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeClass}" data-like="${tweet.uuid}"></i>
                            ${tweet.likes}
                        </span>
                    </div>
                </div>      
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>   
        </div>
        `
    })
    return tweetsHtml;
}

function render() {
    feed.innerHTML = getTweets();
}

render();