document.addEventListener("DOMContentLoaded", function() {
    (async function() {
      // Get the viewsIssue from the hidden HTML element
      const viewsIssueElement = document.getElementById("views-issue");
  
      if (!viewsIssueElement) {
        console.error("views-issue element not found!");
        return;
      }
  
      const viewsIssue = parseInt(viewsIssueElement.textContent);
  
      async function fetchViewCount() {
        try {
          console.log("Fetching view count...");
          let response = await fetch(`https://backend-server-rosy-theta.vercel.app/api/get-view-count`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ issue: viewsIssue })
          });
          let data = await response.json();
          let count = data.count || 0;
          console.log("Fetched view count:", count);
          document.getElementById("view-count").textContent = count;
        } catch (error) {
          console.error("Error fetching view count:", error);
        }
      }
  
      async function updateViewCount() {
        try {
          console.log("Updating view count...");
          let response = await fetch(`https://backend-server-rosy-theta.vercel.app/api/update-view-count`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ issue: viewsIssue })
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          console.log("View count updated successfully");
          setTimeout(fetchViewCount, 3000);
        } catch (error) {
          console.error("Error updating view count:", error);
        }
      }
  
      fetchViewCount();
      updateViewCount();
    })();
  });