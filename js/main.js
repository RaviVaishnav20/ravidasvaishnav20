document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display experience data
    fetch('data/experience.json')
        .then(response => response.json())
        .then(data => {
            const experienceList = document.getElementById('experience-list');
            data.forEach(job => {
                const jobElement = document.createElement('div');
                jobElement.classList.add('experience-item');
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

                // Add click event for collapsing
                jobElement.querySelector('h3').addEventListener('click', () => {
                    jobElement.classList.toggle('collapsed');
                });
            });
        });

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
});