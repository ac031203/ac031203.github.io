(async function() {
    let GITHUB_USERNAME = "ac031203";
    let REPO_NAME = "ac031203.github.io";
    let ISSUE_NUMBER_LIKES = 2;
    let GH_TOKEN = "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";  // 🔴 Replace with a valid GitHub token

    async function fetchLikeCount() {
        try {
            let response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues/${ISSUE_NUMBER_LIKES}`, {
                headers: { "Authorization": `token ${GH_TOKEN}` }
            });
            let data = await response.json();
            let count = data.body && data.body.match(/\d+/) ? parseInt(data.body.match(/\d+/)[0]) : 0;
            document.getElementById("like-count").textContent = count;
        } catch (error) {
            console.error("Error fetching like count:", error);
        }
    }

    async function updateLikeCount() {
        try {
            let response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/dispatches`, {
                method: "POST",
                headers: {
                    "Accept": "application/vnd.github.everest-preview+json",
                    "Authorization": `token ${GH_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    event_type: "update-likes",
                    client_payload: { issue: ISSUE_NUMBER_LIKES }
                })
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            setTimeout(fetchLikeCount, 3000);
        } catch (error) {
            console.error("Error updating like count:", error);
        }
    }

    document.getElementById("like-container").addEventListener("click", updateLikeCount);
    fetchLikeCount();
})();
