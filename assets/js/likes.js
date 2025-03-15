const ISSUE_NUMBER_LIKES = 2;

async function fetchLikeCount() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues/${ISSUE_NUMBER_LIKES}`);
        const data = await response.json();
        const count = data.body.match(/\d+/) ? parseInt(data.body.match(/\d+/)[0]) : 0;
        document.getElementById("like-count").textContent = count;
    } catch (error) {
        console.error("Error fetching like count:", error);
    }
}

async function updateLikeCount() {
    try {
        await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/dispatches`, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github.everest-preview+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                event_type: "update-likes",
                client_payload: { issue: ISSUE_NUMBER_LIKES }
            })
        });
        setTimeout(fetchLikeCount, 3000);  // Fetch new count after 3 seconds
    } catch (error) {
        console.error("Error updating like count:", error);
    }
}

document.getElementById("like-container").addEventListener("click", updateLikeCount);
fetchLikeCount();
