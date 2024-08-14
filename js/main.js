document.addEventListener('DOMContentLoaded', function() {
    const githubUsername = 'RaviVaishnav20';
    let currentPage = 1;
    const reposPerPage = 4;
    let allRepos = [];

    // Fetch and display experience data
    fetch('data/experience.json')
        .then(response => response.json())
        .then(data => {
            const experienceList = document.getElementById('experience-list');
            data.forEach(job => {
                const jobElement = document.createElement('div');
                jobElement.classList.add('experience-item', 'collapsed', 'clickable');
                jobElement.innerHTML = `
                    <h3>${job.title}</h3>
                    <div class="details">
                        <p>${job.company} | ${job.location}</p>
                        <p>${job.startDate} - ${job.endDate}</p>
                        <ul>
                            ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    </div>
                `;
                experienceList.appendChild(jobElement);

                // Add click event for toggling collapse
                jobElement.querySelector('h3').addEventListener('click', () => {
                    jobElement.classList.toggle('collapsed');
                });
            });
        })
        .catch(error => console.error('Error fetching experience data:', error));

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', body.classList.contains('dark-mode'));
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('dark-mode');
    if (savedTheme === 'true') {
        body.classList.add('dark-mode');
    }

    // Animate sections on scroll
    const sections = document.querySelectorAll('main section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__fadeIn');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Fetch pinned repos from GitHub
    function fetchPinnedRepos() {
        return fetch(`https://gh-pinned-repos.egoist.dev/?username=${githubUsername}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    return data.map(repo => ({
                        name: repo.repo,
                        description: repo.description,
                        stars: repo.stars,
                        link: repo.link,
                        isPinned: true,
                        created_at: new Date(repo.created_at).getTime()
                    }));
                } else {
                    return [];
                }
            });
    }

    // Fetch all repos from GitHub
    function fetchAllRepos() {
        return fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=created&direction=desc`)
            .then(response => response.json())
            .then(data => {
                return data.map(repo => ({
                    name: repo.name,
                    description: repo.description,
                    stargazers_count: repo.stargazers_count,
                    html_url: repo.html_url,
                    isPinned: false,
                    created_at: new Date(repo.created_at).getTime()
                }));
            });
    }

    // Sort and display repos
    function sortRepos(repos) {
        return repos.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return b.created_at - a.created_at;
        });
    }

    function displayRepos() {
        const reposContainer = document.getElementById('github-repos');
        reposContainer.innerHTML = '';

        const startIndex = (currentPage - 1) * reposPerPage;
        const endIndex = startIndex + reposPerPage;
        const reposToDisplay = allRepos.slice(startIndex, endIndex);

        reposToDisplay.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.classList.add('repo-card', 'clickable');
            repoElement.innerHTML = `
                <h3>${repo.isPinned ? '📌 ' : ''}${repo.name}</h3>
                <p>${repo.description || 'No description available'}</p>
                <p>Stars: ${repo.stargazers_count || repo.stars}</p>
            `;
            repoElement.addEventListener('click', () => window.open(repo.html_url || repo.link, '_blank'));
            reposContainer.appendChild(repoElement);
        });

        updateNavigationButtons();
    }

    // Navigation buttons for repos
    function updateNavigationButtons() {
        document.getElementById('prev-repos').disabled = currentPage === 1;
        document.getElementById('next-repos').disabled = (currentPage * reposPerPage) >= allRepos.length;
    }

    document.getElementById('prev-repos').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayRepos();
        }
    });

    document.getElementById('next-repos').addEventListener('click', () => {
        if ((currentPage * reposPerPage) < allRepos.length) {
            currentPage++;
            displayRepos();
        }
    });

    // Fetch and display repos
    Promise.all([fetchPinnedRepos(), fetchAllRepos()])
        .then(results => {
            allRepos = sortRepos([...results[0], ...results[1]]);
            displayRepos();
        })
        .catch(error => console.error('Error fetching GitHub repos:', error));

    // Fetch and display YouTube videos
    fetch('data/youtube.json')
        .then(response => response.json())
        .then(data => {
            const videosContainer = document.getElementById('youtube-videos');
            data.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.classList.add('video-card', 'clickable');
                videoElement.innerHTML = `
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <h3>${video.title}</h3>
                `;
                videoElement.addEventListener('click', () => window.open(video.url, '_blank'));
                videosContainer.appendChild(videoElement);
            });
        })
        .catch(error => console.error('Error fetching YouTube videos:', error));

    // Fetch and display Medium posts
    fetch('data/medium.json')
        .then(response => response.json())
        .then(data => {
            const postsContainer = document.getElementById('medium-posts');
            data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post-card', 'clickable');
                postElement.innerHTML = `
                    <img src="${post.thumbnail}" alt="${post.title}">
                    <h3>${post.title}</h3>
                    <p>${post.date}</p>
                `;
                postElement.addEventListener('click', () => window.open(post.url, '_blank'));
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error fetching Medium posts:', error));

    // Fetch and display certifications
    fetch('data/certifications.json')
        .then(response => response.json())
        .then(data => {
            const certificationsContainer = document.getElementById('certifications-list');
            data.forEach(cert => {
                const certElement = document.createElement('div');
                certElement.classList.add('certification-card', 'clickable');
                certElement.innerHTML = `
                    <h3>${cert.name}</h3>
                    <p>Issuer: ${cert.issuer}</p>
                    <p>Date: ${cert.date}</p>
                `;
                if (cert.url) {
                    certElement.addEventListener('click', () => window.open(cert.url, '_blank'));
                }
                certificationsContainer.appendChild(certElement);
            });
        })
        .catch(error => console.error('Error fetching certifications:', error));
});