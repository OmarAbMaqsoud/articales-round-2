
(function () {
  const longLorem1 = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae nisl ut urna posuere pulvinar. Integer vitae neque id magna tincidunt vulputate. Praesent in mi purus. Maecenas ut orci quis sapien facilisis hendrerit. Proin viverra elit vitae mi dapibus, sit amet gravida magna efficitur. Nam posuere, nisl sit amet volutpat dapibus, elit elit congue nibh, id luctus sem nunc a augue. Donec egestas lorem et turpis tempor, id pulvinar mi faucibus. Sed vitae ex sed mi ultrices placerat. In hac habitasse platea dictumst. Vestibulum nec quam ac nibh tristique consectetur. Phasellus consequat, lacus vel egestas convallis, libero tortor faucibus augue, id vulputate mi lectus ac tortor. Aliquam erat volutpat. Aliquam vel mi mi. Suspendisse potenti. Vestibulum ut turpis eu justo vehicula faucibus.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In et urna ut purus tincidunt cursus. Vestibulum commodo sapien ut justo rhoncus, id vestibulum arcu tincidunt. Integer sit amet turpis id sapien luctus pharetra. Mauris sed magna augue. Duis sit amet augue vitae neque ultricies ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur consequat tincidunt neque, id aliquam nibh dictum a. Integer aliquet, sapien vitae lacinia sodales, mi eros tincidunt orci, quis feugiat ipsum ipsum non neque. Suspendisse nec mi vitae erat posuere interdum. Donec ullamcorper vulputate lorem, quis convallis orci mattis vitae. Nunc faucibus, sem vitae mattis hendrerit, elit orci volutpat nisl, at pharetra magna magna vel ligula.Etiam sed mi id nunc fringilla gravida. Donec vitae lectus non nibh cursus malesuada. Sed ut tempus lorem. Sed finibus turpis ut nibh volutpat, sed iaculis sapien cursus. Donec vitae nibh quis tellus posuere porta id vel nibh. Vestibulum aliquet, nulla vitae volutpat cursus, lectus lectus posuere velit, id dictum risus urna non augue. Integer sed sapien ac sem gravida cursus. Phasellus eu arcu vel tortor dapibus hendrerit. Donec non neque at libero dictum lacinia. Suspendisse potenti. Nullam porta ipsum euismod, posuere felis non, porttitor dolor. Praesent pharetra magna nulla, ac euismod sem fermentum in.`;

  const longLorem2 = longLorem1.replace(/Lorem ipsum/g, "Sed ut perspiciatis");
  const longLorem3 = longLorem1.replace(/Lorem ipsum/g, "At vero eos et accusamus");
  const longLorem4 = longLorem1.replace(/Lorem ipsum/g, "But I must explain to you");

  const initialArticles = [
    { id: 1, title: "first one", author: "omar 1", content: longLorem1 },
    { id: 2, title: "secound one ", author: "omar 1", content: longLorem2 },
    { id: 3, title: "third one ", author: "omar 1", content: longLorem3 },
    { id: 4, title: "fourth one ", author: "omar 1", content: longLorem4 },
  ];

  const LS_ARTICLES = "blogspace_articles";
  const LS_NEXT_ID = "blogspace_nextId";

  const articlesContainer = document.getElementById("articles");
  const saveBtn = document.getElementById("saveArticle");
  const articleModalEl = document.getElementById("articleModal");
  const articleModal = articleModalEl ? new bootstrap.Modal(articleModalEl) : null;

  function getArticles() {
    return JSON.parse(localStorage.getItem(LS_ARTICLES) || "[]");
  }
  function saveArticles(arr) {
    localStorage.setItem(LS_ARTICLES, JSON.stringify(arr));
  }
  function getNextId() {
    return parseInt(localStorage.getItem(LS_NEXT_ID) || "5", 10);
  }
  function setNextId(n) {
    localStorage.setItem(LS_NEXT_ID, String(n));
  }

  if (!localStorage.getItem(LS_ARTICLES)) {
    saveArticles(initialArticles);
    setNextId(5);
  }

  function renderIndex() {
    if (!articlesContainer) return;
    const articles = getArticles();
    articlesContainer.innerHTML = "";

    if (!articles.length) {
      articlesContainer.innerHTML = `<div class="col-12"><div class="alert alert-info">No articles yet. Create the first one!</div></div>`;
      return;
    }

    articles.forEach(a => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";
      col.innerHTML = `
        <div class="card article-card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${escapeHtml(a.title)}</h5>
            <p class="text-muted mb-1">By ${escapeHtml(a.author || "Unknown")}</p>
            <div class="article-content mb-3">
              <p class="card-text mb-0">${escapeHtml(a.content.substring(0, 160))}...</p>
            </div>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <a href="article.html?id=${a.id}" class="btn btn-link p-0">Read more</a>
              <div>
                <button class="btn btn-sm btn-outline-primary me-2 editBtn" data-id="${a.id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger deleteBtn" data-id="${a.id}">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;
      articlesContainer.appendChild(col);
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.onclick = (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        deleteArticle(id);
      };
    });
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.onclick = (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        openEditModal(id);
      };
    });
  }

  function deleteArticle(id) {
    if (!confirm("Are you sure you abouut tms7 this article?")) return;
    let articles = getArticles();
    articles = articles.filter(a => a.id !== id);
    saveArticles(articles);
    renderIndex();
  }

  function openEditModal(id) {
    const articles = getArticles();
    const a = articles.find(x => x.id === id);
    if (!a) return alert("Article not found");
    document.getElementById("articleId").value = a.id;
    document.getElementById("title").value = a.title;
    document.getElementById("author").value = a.author;
    document.getElementById("content").value = a.content;
    document.getElementById("modalTitle").textContent = "Edit Article";
    if (articleModal) articleModal.show();
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const idField = document.getElementById("articleId");
      const title = document.getElementById("title").value.trim();
      const author = document.getElementById("author") ? document.getElementById("author").value.trim() : "";
      const content = document.getElementById("content").value.trim();

      if (!title || !content) {
        alert("Please fill title and content.");
        return;
      }

      let articles = getArticles();
      if (idField && idField.value) {
        const idNum = parseInt(idField.value, 10);
        articles = articles.map(a => a.id === idNum ? { id: idNum, title, author, content } : a);
      } else {
        const newId = getNextId();
        articles.push({ id: newId, title, author, content });
        setNextId(newId + 1);
      }
      saveArticles(articles);
      if (articleModal) articleModal.hide();

      setTimeout(() => {
        document.getElementById("articleForm").reset();
        if (document.getElementById("articleId")) document.getElementById("articleId").value = "";
        document.getElementById("modalTitle").textContent = "Create New Article";
      }, 200);

      renderIndex();
    });
  }

  function runArticlePage() {
    const titleEl = document.getElementById("articleTitle");
    if (!titleEl) return;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id") || "", 10);
    const articles = getArticles();
    const a = articles.find(x => x.id === id);

    if (!a) {
      document.getElementById("articleWrapper").innerHTML = `<div class="alert alert-danger">Article not found.</div>`;
      return;
    }

    document.getElementById("articleTitle").textContent = a.title;
    const authorEl = document.getElementById("articleAuthor");
    if (authorEl) authorEl.textContent = a.author || "Unknown";
    document.getElementById("articleContent").textContent = a.content;

    const editBtn = document.getElementById("editOnIndex");
    if (editBtn) {
      editBtn.onclick = () => {
        localStorage.setItem("blogspace_editId", String(a.id));
        window.location.href = "index.html";
      };
    }

    const delBtn = document.getElementById("deleteOnIndex");
    if (delBtn) {
      delBtn.onclick = () => {
        if (!confirm("Delete this article?")) return;
        let articles = getArticles().filter(x => x.id !== a.id);
        saveArticles(articles);
        window.location.href = "index.html";
      };
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderIndex();
    runArticlePage();

    const editId = localStorage.getItem("blogspace_editId");
    if (editId && articleModal) {
      localStorage.removeItem("blogspace_editId");
      openEditModal(parseInt(editId, 10));
    }

    if (articleModalEl) {
      articleModalEl.addEventListener("hidden.bs.modal", () => {
        const form = document.getElementById("articleForm");
        if (form) form.reset();
        const idField = document.getElementById("articleId");
        if (idField) idField.value = "";
        document.getElementById("modalTitle").textContent = "Create New Article";
      });
    }
  });
})();
