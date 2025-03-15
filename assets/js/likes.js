document.addEventListener("DOMContentLoaded", function() {
    (async function() {
      const likeContainer = document.getElementById("like-container");
      const likeIcon = document.getElementById("like-icon");
  
      // Get the likesIssue from the hidden HTML element
      const likesIssueElement = document.getElementById("likes-issue");
  
      if (!likesIssueElement) {
        console.error("likes-issue element not found!");
        return;
      }
  
      const likesIssue = parseInt(likesIssueElement.textContent);
  
      async function fetchLikeCount() {
        try {
          let response = await fetch(`https://backend-server-rosy-theta.vercel.app/api/get-like-count`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ issue: likesIssue })
          });
          let data = await response.json();
          let count = data.count || 0;
          document.getElementById("like-count").textContent = count;
        } catch (error) {
          console.error("Error fetching like count:", error);
        }
      }
  
      async function updateLikeCount() {
        try {
          // Check if the user has already liked the post
          if (localStorage.getItem("liked") === "true") {
            console.log("You have already liked this post.");
            return;
          }
  
          let response = await fetch(`https://backend-server-rosy-theta.vercel.app/api/update-like-count`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ issue: likesIssue })
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
          // Mark the post as liked
          localStorage.setItem("liked", "true");
  
          // Change the like button color to red
          likeIcon.style.color = "red";
  
          console.log("Like count updated successfully");
          setTimeout(fetchLikeCount, 3000);
        } catch (error) {
          console.error("Error updating like count:", error);
        }
      }
  
      // Ensure the like-container element exists
      if (likeContainer) {
        likeContainer.addEventListener("click", updateLikeCount);
        console.log("Like container found and event listener added.");
      } else {
        console.error("Like container not found!");
      }
  
      // Check if the user has already liked the post
      if (localStorage.getItem("liked") === "true") {
        likeIcon.style.color = "red";
      }
  
      fetchLikeCount();
    })();
  });